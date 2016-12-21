/**************************************************************************
 *  This file is part of the UGE(Uniform Game Engine) of SPP.
 *  Copyright (C) by SanPolo Co.Ltd. 
 *  All rights reserved.
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/  sales@spolo.org spp-support@spolo.org
**************************************************************************/
try{
	(function(){
	
// ==========================================================================================================
// ===   当前 effect 提取出来的公共函数   ===================================================================
// ==========================================================================================================
		// 定义一个数组用来记录角色的所有动作状态 // 分别代表[前进,后退,左转,右转,左平移,右平移]
		var arr_amin_state = [0,0,0,0,0,0];   
		// 该函数用来检查角色的当前动作是否为空, 所有动作为0时返回true,否则返回false;
		function checkAminState(){
			var res = true;
			for(var st in arr_amin_state){
				if(arr_amin_state[st] == 1){
					res = false;
					break;
				}
			}
			return res;
		}

		/* 改变角色动作 */
		function changeAnimation(actor, index, value){
			// 将动作记录到数组
			arr_amin_state[index] = value;
			// 改变动作
			//CONSOLE.WriteLine("actor.currentAnim  .."+actor.currentAnim);
			actor.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', actor.currentAnim],['cycle',true],['reset', false]);
		}
		
		function stopAnimation(actor, index, value){
			// 将动作记录到数组
			arr_amin_state[index] = value;
			if(checkAminState()){ // 如果所有控制键都弹起了，执行停止动作
				actor.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', actor.stopAnim],['cycle',true],['reset', true]);
			}else{
				actor.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', actor.currentAnim],['cycle',true],['reset', false]);
			}
		}
		

//角色选择适合的动作修改

		/* 改变角色动作 */
		function changeAnimation1(actor, index, value){
			// 将动作记录到数组
			arr_amin_state[index] = value;
			// 改变动作
			
			actor.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', actor.currentAnim],['cycle',true],['reset', false]);
			

		}
		
		function stopAnimation1(actor, index, value){
			// 将动作记录到数组
			arr_amin_state[index] = value;
			
			if(checkAminState()){ // 如果所有控制键都弹起了，执行停止动作
				actor.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', actor.stopAnim],['cycle',true],['reset', true]);
			}else{
				actor.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', actor.currentAnim],['cycle',true],['reset', false]);
			}
			actor.currentAnim='walk';
			

		}


		
		
		// 角色各种移动状态的通用函数,参数:
		// par1: e.state = "walk"(走)   or     "run"(跑)    or    "viewCtrl"(视角控制)    or    "sand"(沙盘模式)
		// par2: e.isSaveState = true  or =false  是否记录当前状态,如果不记录,执行完当前状态后自动返回到前一个状态,如果记录,执行完当前状态后,保持当前状态.
		Event.Subscribe(function(e){
			// 根据 e.state 决定角色的移动速度和动作
			var speed = player.walkSpeed;
			//CONSOLE.WriteLine(e.state+"................");
			switch(e.state){
				case "walk":
					speed = player.walkSpeed;
					break;
				case "run":
					speed = player.runSpeed;
				
					break;
				case "viewCtrl":
					speed = player.viewCtrlSpeed;
					break;
				case "sand":
					speed = player.sandSpeed;
					break;
				default:
					alert('function player_forward_state_switch parameter wrong!');
					return;
			}

			
			// 如果不记录,执行完当前状态后自动返回到前一个状态,
			// 如果记录,执行完当前状态后,保持当前状态.
			if(e.isSaveState){
				player.currentMoveSpeed = speed['movement'];
				player.current_forward_state = e.state;
			}
			// 修改移动速度
			player.pcarray['pcactormove'].PerformAction(
				'SetSpeed', 
					['movement', speed['movement'] ], 
					['running', speed['running'] ], 
					['rotation', speed['rotation'] ], 
					['jumping', speed['jumping']   ]
			);
				
			// 设置当前移动的动作
			player.currentAnim = e.state;
			// 开始移动
			player.pcarray['pcactormove'].PerformAction(e.orientations,['start',true]);
			// 记录动作

			//分别改变动作
				switch(e.orientations){
				case "Forward":
					changeAnimation(player, 0, 1);
					break;
				case "Backward":
					changeAnimation(player, 1, 1);
					break;
			
				default:
					alert('e.orientations change wrong!');
					return;
			}

			
		},"player_forward_state_switch");	
		
// ==========================================================================================================		
// ======  订阅的事件  ======================================================================================
// ==========================================================================================================
		
		/* 有人 无人模型切换 */
		var isPersonMode = true;
		Event.Subscribe(function(e){
			if(isPersonMode){
				isPersonMode = false;
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', false]);				
				iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','firstperson']);
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', true]);
			}else{
				isPersonMode = true;			
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', false]);	
				iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', true]);	
			}			
		},"effect.camare.change.mode");
		
		
		
		
		
		/*人物 前进 事件触发*/
		Event.Subscribe(function(e){
			iCamera.pcarray['pctimer'].PerformAction('Clear', ['name','sendDistance']);
			// 启动pctimer实时发送camera的pitch值
			iCamera.pcarray['pctimer'].PerformAction(
				'WakeUp', 
				['time', 100], 
				['repeat', true], 
				['name', 'sendDistance']
			);
			iCamera.is_near = false ; 
		},"player.effect.forward.begin");
		
		
		/*人物 后退 事件触发*/
		Event.Subscribe(function(e){
			iCamera.pcarray['pctimer'].PerformAction('Clear', ['name','sendDistance']);
			// 启动pctimer实时发送camera的pitch值
			iCamera.pcarray['pctimer'].PerformAction(
				'WakeUp', 
				['time', 100], 
				['repeat', true], 
				['name', 'sendDistance']
			);
			iCamera.is_near = true ; 
		}, "player.effect.backward.begin");
		
		
		/*人物 左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',true]);
		}, "player.effect.rotateleft");
		
		/*人物 停止左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',false]);
			//CONSOLE.WriteLine(e.state+"................");
		}, "player.effect.rotateleft.stop");
		
		/*人物 右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',true]);				
		}, "player.effect.rotateright");
		
		/*人物 停止右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',false]);
		}, "player.effect.rotateright.stop");
		
		/*人物 左平移 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeLeft',['start',true]);
			changeAnimation(actor, 4, 1);
		}, "player.effect.StrafeLeft");
		
		/*人物 左平移停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeLeft',['start',false]);
			stopAnimation(actor, 4, 0);
		}, "player.effect.StrafeLeft.stop");
		
		/*人物 右平移 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeRight',['start',true]);
			changeAnimation(actor, 5, 1);
		}, "player.effect.StrafeRight");
		
		/*人物 右平移停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeRight',['start',false]);
			stopAnimation(actor, 5, 0);
		}, "player.effect.StrafeRight.stop");
		/* 人物上下旋转 */
		Event.Subscribe(function(e){
		
			/* var actor = e.self ; 
			actor.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[-0.001, 0, 0]]); */
		},"player.effect.pctimer.sendPitch"); 
		
		/* 鼠标的拖拽 */
		Event.Subscribe(function(e){
			var startX = player.startX ; 
			var startY = player.startY ; 
			var x = player.mousex ; 
			var y = player.mousey ; 
			
			if(player.mouseleft){
				//计算鼠标水平拖拽的旋转角度 
				if( x > startX ) {
					//左转
					player.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[0, 0.01, 0]]);
				}else{
					//右转
					player.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[0, -0.01, 0]]);
				} 
			}
			if(player.mouseright){
				//计算鼠标垂直拖拽的旋转角度 
				if( y > startY ) {
					player.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[-0.01, 0, 0]]);
				}else{
					player.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[0.01, 0, 0]]);
				}
			}	
			
		
		},"player.effect.mousemove");
		
		

		/*人物 抬头 事件触发*/
		Event.Subscribe(function(e){		
			player.pcarray['pctimer'].PerformAction('Clear', ['name','sendPitch']);
			// 启动pctimer实时发送camera的pitch值
			player.pcarray['pctimer'].PerformAction(
				'WakeUp', 
				['time', 1], 
				['repeat', true], 
				['name', 'sendPitch']
			);
		}, "player.effect.rotateup");		

		/*人物 停止抬头 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.self;
			actor.pcarray['pctimer'].PerformAction('Clear', ['name','sendPitch']); 
		}, "player.effect.rotateup.stop");

		/*人物 低头 事件触发*/
		Event.Subscribe(function(e){
		}, "player.effect.rotatedown");
		
		/*人物 停止低头 事件触发*/
		Event.Subscribe(function(e){
			var actor = iCamera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',0);
			actor.pcarray['pctimer'].PerformAction('Clear', ['name','sendPitch']); 
		}, "player.effect.rotatedown.stop");
		
		/*人物 垂直向上 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pctimer'].PerformAction(
				'WakeUp', 
				['time', 10], 
				['repeat', true], 
				['name', 'StrafeUp']
			);
		}, "player.effect.StrafeUp");
		
		/*人物 垂直向上停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pctimer'].PerformAction('Clear', ['name','StrafeUp']); 
		}, "player.effect.StrafeUp.stop");	
		
		/*人物 垂直向下 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pctimer'].PerformAction(
				'WakeUp', 
				['time', 10], 
				['repeat', true], 
				['name', 'StrafeDown']
			);
		}, "player.effect.StrafeDown");
		
		/*人物 垂直向下停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pctimer'].PerformAction('Clear', ['name','StrafeDown']); 			
		}, "player.effect.StrafeDown.stop");
		
		/* 人物 向上的时间控制 */
		Event.Subscribe(function(e){	
			var actor = e.player;
			var pos = actor.pcarray['pcmesh'].position;
			var pos1 = pos[1] + player.strafeUpSpeed;
			actor.pcarray['pcmesh'].PerformAction(
				'MoveMesh', [
					'position', [
						pos[0], pos1, pos[2]
					]
				]
			);
		}, "player.effect.pctimer.StrafeUp");
		
		/* 人物 向下的时间控制 */
		Event.Subscribe(function(e){
			var actor = e.player;			
			var pos = actor.pcarray['pcmesh'].position;
			var pos1 = pos[1] - player.strafeDownSpeed; 
			if(pos1 < 0) {
				pos1 = 0;
			}
			actor.pcarray['pcmesh'].PerformAction('MoveMesh', ['position', [pos[0], pos1, pos[2]]]);				
		}, "player.effect.pctimer.StrafeDown");
		
		
		/*	实时获取鼠标信息		*/
	/* 	Event.Subscribe(function(e){
			var actor = e.player;
			//在鼠标移动的过程中时刻获取当前的屏幕的像素坐标，x和y
			player.mousex = e.x;
			player.mousey = e.y;
		},"crystalspace.input.mouse.0.move");
 */
		//新增(人物上下旋转)
		Event.Subscribe(function(e){
			var actor = e.self;
			actor.defcam = actor.pcarray['pcdefaultcamera'].QueryInterface('iPcDefaultCamera');
			actor.defcam.onupdate = function(cam,view){//拿到摄像机的控制权，此function不停的在执行
				actor.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[-0.001, 0, 0]]);
				return false;
			};
		}, "player.effect.mesh.rotateup_begin");

		//该键抬起的时候响应该事件
		Event.Subscribe(function(e){
			var actor = e.self;
			//结束获得摄像机的控制权
			actor.defcam.onupdate = null;
		}, "player.effect.mesh.rotateup_end");
		
		//按键L执行的代码
		Event.Subscribe(function(){
				player.isLkeyDown=true;					
		}, "change.light.position");
		 
		Event.Subscribe(function(){
		   player.isLkeyDown=false;
		},"change.light.position.stop");
		
		//鼠标移动执行的代码
		Event.Subscribe(function(e){
			var actor = e.player;
			//在鼠标移动的过程中时刻获取当前的屏幕的像素坐标，x和y
			player.mousex = e.x;	
			player.mousey = e.y;	
			var g2d = C3D.g2d;
			var screen_width  = g2d.width ; 
			var screen_height = g2d.height;
			var x = screen_width ; 
			var y = screen_height ; 
			var mouse_x = player.mousex ; 
			var mouse_y = player.mousey ;
			sectorlist = engine.sectors ;
			sector = sectorlist.Get(0) ;
			lightlist = sector.lights ;
			light = lightlist.Get(0);					 
			center = light.center;
			
			var position = player.pcarray['pcmesh'].GetProperty('position');
			if(player.isLkeyDown){
				
				 center.x = (player.mousex-screen_width/2.0)/100.0;
				//center.z =  position.z + 1  ;	
     			light.center = center;	
			}
		},"crystalspace.input.mouse.0.move");
				

		//鼠标控制视角
		Event.Subscribe(function(e){
			var actor = e.self;
			var x = e.mouse_x;
			var y = e.mouse_y;
						
			actor.pcarray['pcactormove'].mousemove = true;
			actor.pcarray['pcactormove'].MouseMove(x, y);
						//CONSOLE.Write("[debug] [effect viewmove] x: " + x + "   y: " + y + ".\n");
		}, "effect.mousemove");
					
					
					
	})();

} catch(e){
	alert(e);
}