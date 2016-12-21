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
		

		// 换装备、衣服
		var changeMeshRole = {
			"woman":{
				// 角色所有可以更换的mesh，按部位分类;
				// 每个部位的第一件装备为默认穿着装备;
				"allChangeMesh" : {	
					'toufa' : ['toufa1','toufa2'],
					'yifu' : ['yifu4','yifu2']
				},			
				// 角色上次穿的mesh，按部位分
				"currentMesh" : {
					'toufa' : 'toufa1',
					'yifu' : 'yifu4'
				}
			},
			
			"man":{
				"allChangeMesh" : {	
					'maozi' : ['maozi'],
					'toufa' : ['toufa1','toufa2'],
					'yifu' : ['yifu1','yifu2'],
					'kuzi' : ['kuzi1','kuzi2']
				},			
				// 角色上次穿的mesh，按部位分
				"currentMesh" : {
					'maozi' : 'maozi',
					'toufa' : 'toufa1',
					'yifu' : 'yifu1',
					'kuzi' : 'kuzi1'
				}
			}
		};

		
		// 初始化角色的 mesh
		Event.Subscribe(function(e){
			try{
				var roleName = e.role;
				
				var iEngine = Registry.Get('iEngine');                
				var iMeshWrapper = iEngine.FindMeshObject(roleName,0);
				var iMeshObject = iMeshWrapper.meshObject;
				var iSpriteCal3DState = iMeshObject.QueryInterface('iSpriteCal3DState');
				
				// 先将重复的装备detach，留下默认装备
				var allMesh = changeMeshRole[roleName]["allChangeMesh"];
				for(var mesh in allMesh){
					var partMesh = allMesh[mesh];
					var isFirst = true;
					for(var oneMesh in partMesh){
						if(isFirst){
							isFirst = false;
							continue;
						}
						iSpriteCal3DState.DetachMesh(partMesh[oneMesh]);
					}
				}
			}catch(e){
				alert('ERROR: init.role.mesh error!  '+e);
			}
		
		},"init.role.mesh");
		
		// 角色换装
		Event.Subscribe(function(e){
			var role = e.role;		// 该参数决定了执行换装的  角色
			var change = e.changeMesh; //  参数格式：  changeMesh: {'toufa':'toufa1'}
			
			var iEngine = Registry.Get('iEngine');                
			var iMeshWrapper = iEngine.FindMeshObject(role, 0);
			var iMeshObject = iMeshWrapper.meshObject;
			var iSpriteCal3DState = iMeshObject.QueryInterface('iSpriteCal3DState');
			
			var curMesh = changeMeshRole[role]["currentMesh"];
			
			// 遍历穿过来的更换装备列表，逐件更换
			for(var mesh in change){
				// 如果要更换的装备就是现在身上穿着的装备则跳过
				if(change[mesh] != curMesh[mesh]){
					// 先穿上要更换的新装备
					iSpriteCal3DState.AttachMesh(change[mesh]);
					// 卸下身上原来的旧装备
					iSpriteCal3DState.DetachMesh(curMesh[mesh]);
					// 将新装备记录到装备列表
					curMesh[mesh] = change[mesh];
				}
			}
			
			
		},"role.change.mesh");

		
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
		
		
		/*  走跑切换 */
		var run_or_walk = true;
		Event.Subscribe(function(e){
			if(run_or_walk){
				run_or_walk = false;
				// 改变角色的当前动作为 跑
				player.currentAnim = "run";
				// 改变跑的速度和转向速度
				var speed = player.walkSpeed;
				player.pcarray['pcactormove'].PerformAction(
					'SetSpeed', 
						['movement', speed['movement'] ], 
						['running', speed['running']   ], 
						['rotation', speed['rotation'] ], 
						['jumping', speed['jumping']   ]
				);
				// 如果角色当前正处于移动状态，那么直接改变动作和速度为 跑
				if(!checkAminState()){
					player.pcarray['pcactormove'].PerformAction('Forward',['start',true]);
					changeAnimation(player, 0, 1);
				}
			}else{
				// 这里是切换为走，过程跟 切换跑 一样
				run_or_walk = true;
				player.currentAnim = "walk";
				var speed = player.walkSpeed;
				player.pcarray['pcactormove'].PerformAction(
					'SetSpeed', 
						['movement', speed['movement'] ], 
						['running', speed['running']   ], 
						['rotation', speed['rotation'] ], 
						['jumping', speed['jumping']   ]
				);
				if(!checkAminState()){
					player.pcarray['pcactormove'].PerformAction('Forward',['start',true]);
					changeAnimation(player, 0, 1);
				}
			}
			
		}, "effect.go.run.change");
		
		/*  take pictures */
       	var i = 0;
		Event.Subscribe(function(e){
			var img = Registry.Get('iImage'); //实例一个图片对象
			img = C3D.g2d.ScreenShot(); //把屏幕放进图像
			i++;
			img.SetName("abc"+i);	 //设置文件名
			imageio = Registry.Get('iImageIO');
			vfs = Registry.Get('iVFS');
			dataBuffer = Registry.Get('iDataBuffer');
			dataBuffer = imageio.Save(img,"image/png", "progressive");
			var t = vfs.WriteFile(img.GetName()+".png", dataBuffer);
			//alert("The picture you are  saving is successful!");
		}, "effect.take.photos");

		var first_change_man = true;
		/* 选择男女角色 */
		Event.Subscribe(function(e){
			var actor = e.self;
			var sex = e.sex;
			if(sex == 'nan'){
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', false]);
				player.pcarray['pcmesh'].PerformAction('SetMesh',['name','man']);
				player.pcarray['pcmesh'].PerformAction('MoveMesh',['position',['0','0','0']]);
				player.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', 'stand'],['cycle',true],['reset', true]);
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', true]);
				if(first_change_man){
					first_change_man = false;
					player.pcarray['pcmesh'].PerformAction('RotateMesh',['rotation', [0, 0.3, 0]]);				
				}
				
			}else if(sex == 'mesh_camera'){
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', false]);
				player.pcarray['pcmesh'].PerformAction('SetMesh',['name','mesh_camera']);
				player.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', 'stand'],['cycle',true],['reset', true]);
				player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', true]);
			}
		}, "ui.click.change.sex");

		/* 订阅进度条加载完成的事件，在这里处理角色mesh初始化操作 */
		Event.Subscribe(function(e){
			//初始化女角色的默认Mesh
			Event.Send({
				name: "init.role.mesh",
				role: "woman"
			});
			//初始化男角色的默认Mesh
			Event.Send({
				name: "init.role.mesh",
				role: "man"
			});
		},"loading.finished");
		
		/* 改变女角色服装 */
		Event.Subscribe(function(e){
			Event.Send({
				name: "role.change.mesh",
				role: "woman",
				changeMesh : {"yifu" : e.image}
			});
			
		}, "ui.click.woman.clothes");
		
		/* 改变女角色头发 */
		Event.Subscribe(function(e){
			var actor = e.self;
			Event.Send({
				name: "role.change.mesh",
				role: "woman",
				changeMesh : {"toufa" : e.image}
			});
			
		}, "ui.click.woman.hair");
		
		/* 改变男角色服装 */
		Event.Subscribe(function(e){
			Event.Send({
				name: "role.change.mesh",
				role: "man",
				changeMesh : {
					"yifu" : e.image[0],
					"kuzi" : e.image[1]
				}
			});
			
		}, "ui.click.man.clothes");
		
		/* 改变男角色头发 */
		Event.Subscribe(function(e){
			var actor = e.self;
			Event.Send({
				name: "role.change.mesh",
				role: "man",
				changeMesh : {
					"toufa" : e.image[0],
					"maozi" : e.image[1]
				}
			});
			
		}, "ui.click.man.hair");
		
		/*人物 前进 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('Forward',['start',true]);
			changeAnimation(actor, 0, 1);
		}, "player.effect.forward");
		
		/*人物 停止前进 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('Forward',['start',false]);
			stopAnimation(actor, 0, 0);
		}, "player.effect.forward.stop");
		
		/*人物 后退 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('Backward',['start',true]);
			changeAnimation(actor, 1, 1);
		}, "player.effect.backward");
		
		/*人物 停止后退 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('Backward',['start',false]);
			stopAnimation(actor,1, 0);
		}, "player.effect.backward.stop");
		
		/*人物 左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',true]);
			changeAnimation(actor, 2, 1);
		}, "player.effect.rotateleft");
		
		/*人物 停止左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',false]);
			stopAnimation(actor, 2, 0);
		}, "player.effect.rotateleft.stop");
		
		/*人物 右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',true]);				
			changeAnimation(actor, 3, 1);
		}, "player.effect.rotateright");
		
		/*人物 停止右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',false]);
			stopAnimation(actor, 3, 0);
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

		/*人物 抬头 事件触发*/
		Event.Subscribe(function(e){
			var actor = iCamera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',1.0);
		}, "player.effect.rotateup");
		
		/*人物 停止抬头 事件触发*/
		Event.Subscribe(function(e){
			var actor = iCamera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',0);	
		}, "player.effect.rotateup.stop");

		/*人物 低头 事件触发*/
		Event.Subscribe(function(e){
			var actor = iCamera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',-1.0);
		}, "player.effect.rotatedown");
		
		/*人物 停止低头 事件触发*/
		Event.Subscribe(function(e){
			var actor = iCamera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',0);
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
			// if(pos1 < 0) {
				// pos1 = 0;
			// }
			actor.pcarray['pcmesh'].PerformAction('MoveMesh', ['position', [pos[0], pos1, pos[2]]]);				
		}, "player.effect.pctimer.StrafeDown");
		
		
		
		// /*	实时获取鼠标信息		*/
	
		Event.Subscribe(function(e){
			var actor = e.player;
			//在鼠标移动的过程中时刻获取当前的屏幕的像素坐标，x和y
			player.mousex = e.x;
			player.mousey = e.y;
		},"crystalspace.input.mouse.0.move");
	
		//角色选择适合人物的旋转

		/*人物 左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.self;
			actor.currentAnim='stand';
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',true]);
			changeAnimation1(actor, 3, 1);
		}, "player.effect.rotateright1");
					
		/*人物 停止左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.self;
			actor.currentAnim='stand';
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',false]);
			stopAnimation1(actor, 2, 0);
		}, "player.effect.rotateright.stop1");
					
		/*人物 右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.self;
			actor.currentAnim='stand';
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',true]);				
			changeAnimation1(actor, 3, 1);
		}, "player.effect.rotateleft1");
					
		/*人物 停止右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.self;
			actor.currentAnim='stand';
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',false]);
			stopAnimation1(actor, 3, 0);
			
		}, "player.effect.rotateleft.stop1");

		/*	Add by yuechaofeng at 2012-05-22 begin	*/
		/*	鼠标左键旋转	*/
		Event.Subscribe(function(e){
			//alert(11111);
			var actor = e.player;
			//设置鼠标左键为按下状态
			actor.mouseleft = true;
			//获取player的当前位置坐标
			var position = actor.pcarray['pcmesh'].GetProperty('position');
			iCamera.pcarray['pcmesh'].PerformAction(
				'MoveMesh'
					[
						'position',[position.x, position.y, position.z]
					]
			);
			iCamera.pcarray['pcdefaultcamera'].PerformAction('SetFollowEntity',['entity','camera']);
		},"player.effect.mouseleftrotation");
		
		/*	鼠标滚轮向前 摄像机拉近		*/
		Event.Subscribe(function(e){
			var actor = e.player;
			iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
			var range_distance = iCamera.pcarray['pcdefaultcamera'].GetProperty('distance');
			range_distance = range_distance - 5;
			iCamera.pcarray['pcdefaultcamera'].SetProperty('distance', range_distance);
		},"player.effect.change.distance.near");
		
		/*	鼠标滚轮向后 摄像机拉远		*/
		Event.Subscribe(function(e){
			var actor = e.player;
			iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
			var range_distance = iCamera.pcarray['pcdefaultcamera'].GetProperty('distance');
			range_distance = range_distance + 5;	
			iCamera.pcarray['pcdefaultcamera'].SetProperty('distance', range_distance);
		},"player.effect.change.distance.far");
		/*	Add by yuechaofeng at 2012-05-22 end	*/
		

		//记录player的定位信息［王鑫添加(2012-06-14)］
		var index = 0 ; 
		Event.Subscribe(function(e){
			var pos_st = e.pos_message ;
			pos_st = ""+index+"," ; 
			
			
			//获取当前人物的位置信息
			var position = player.pcarray['pcmesh'].position ; 
			var rotation = player.pcarray['pcmesh'].rotation ; 
			
			
			
			index++ ; 
		
		},"save_quick_position_message") ; 
		
		//王鑫新增(2012-06-14)
		Event.Subscribe(function(e){
			var bol = e.bol ;
			if(bol){
				return ; 
			}
			var x = player.mousex - player.window_init_x ; 
			var y = player.mousey - player.window_init_y ; 
			var first = x/player.window_width ; 
			var second = y/player.window_height ; 
			var third = first + player.but_width ; 
			var four = second + player.but_height ; 
			var UnifiedAreaRect = "{{"+first+",0},{"+second+",0},{"+third+",0},{"+four+",0}}" ;
			player.u_message =  UnifiedAreaRect ; 
			Event.Send({
				name : "create_new_button" ,
				btn_index : player.but_index ,
				u_message : UnifiedAreaRect 
			});
			player.but_index++ ; 
		},"player.effect.create_new_button");
		
		//获取输入信息
		Event.Subscribe(function(e){
			var xmlString = player.list_position_data ; 
			var pos = player.pcarray['pcmesh'].GetProperty('position');
			var rot = player.pcarray['pcmesh'].GetProperty('rotation');
			xmlString = player.but_index+"|"+player.chinese_name+"|"+player.english_name+
						"|"+pos.x+"|"+pos.y+"|"+pos.z+"|"+rot.y+"|"+player.u_message+"%";
			player.list_position_data += xmlString ; 
		},"player.effect.get_message") ; 
		})();
} catch(e){
	alert(e);
}
