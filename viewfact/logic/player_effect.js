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
			var actor = e.player;
			var startX = player.startX ;
			var startY = player.startY ;
			var x = player.mousex ;
			var y = player.mousey ;
			if(player.mouseleft){
				// 计算鼠标水平拖拽的旋转角度
				if( x > startX ) {
					// 左转
					iCamera.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[0, -0.01, 0]]);
				}else{
					// 右转
					iCamera.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[0, 0.01, 0]]);
				}
			}
			if(player.mouseright){
				/*	鼠标坐标变化以及摄像机rotation的变化	*/
				var g2d = C3D.g2d;
				var screen_width = g2d.width;
				//计算camera的偏转
				var rotationy = ((x - startX)/screen_width)*Math.PI;
				var rotationY = actor.startRotationY - rotationy;
				if(rotationY <= -Math.PI){
					rotationY = 2*Math.PI + rotationY;
				}
				if(rotationY <= Math.PI){
					rotationY = -2*Math.PI + rotationY;
				}
				//	获得player当前的位置
				var current_pos = actor.pcarray['pcmesh'].GetProperty('position');
				//	摄像机发生旋转
				iCamera.pcarray['pcmesh'].PerformAction(
					'MoveMesh',
						[
							'position',[current_pos.x, current_pos.y,current_pos.z],
						],
						[
							'rotation',[0, 0-rotationY, 0]
						]
				);
				//计算camera的pitch值 
				var screen_height = g2d.height;
				var cameraPitch = player.startPitch + ((startY-y)/screen_height)*0.5;
				iCamera.pcarray['pcdefaultcamera'].SetProperty('pitch',cameraPitch);
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
		
		
		/*	通过鼠标滑动获取鼠标坐标信息	*/
		Event.Subscribe(function(e){
			var actor = e.player;
			//在鼠标移动的过程中时刻获取当前的屏幕的像素坐标，x和y
			player.mousex = e.x;
			player.mousey = e.y;
		},"crystalspace.input.mouse.0.move");
 
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
		
		/*	L键按下 事件触发 ---控制灯光移动		*/
		Event.Subscribe(function(e){
			//设置为第三人称视角
			iCamera.pcarray['pcdefaultcamera'].SetCamera('thirdperson');
			//订阅frame事件
			player.id = C3D.engine.SubscribeFrame(function(){
				//获取iCamera对象
				var iPcCamera = iCamera.pcarray['pcdefaultcamera'].QueryInterface('iPcCamera');
				var cameraobj = iPcCamera.GetCamera();
				//获得camera的transform变换关系
				var camTransform = cameraobj.GetTransform();
				//为light设置变换关系 与摄像机同步
				light.movable.SetTransform(camTransform);
				//将light的node的父设置为0
				light.node.parent = 0;
				//更新当前的light
				light.movable.Update();
			});
		}, "change.light.position");
		
		/*	L键抬起 事件触发		*/
		Event.Subscribe(function(e){
			//取消frame事件的订阅 
			var id = C3D.engine.UnsubscribeFrame(player.id);
		},"change.light.position.stop");
				
		/*	鼠标右键旋转	*/
		Event.Subscribe(function(e){
			var actor = e.player;
			//设置鼠标右键为按下状态
			actor.mouseright = true;
			//获取player的当前位置坐标
			var position = actor.pcarray['pcmesh'].GetProperty('position');
			var rotation = actor.pcarray['pcmesh'].GetProperty('rotation');
			iCamera.pcarray['pcmesh'].PerformAction(
				'MoveMesh'
					[
						'position',[position.x, position.y, position.z],
						'rotation',[rotation.x, rotation.y, rotation.z]
					]
			);
			iCamera.pcarray['pcdefaultcamera'].PerformAction('SetFollowEntity',['entity','camera']);
		},"player.effect.mouserightrotation");
		
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