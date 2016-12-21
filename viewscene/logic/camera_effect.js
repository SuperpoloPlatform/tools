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
		
		/*摄像机 前进 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('Forward',['start',true]);
		}, "camera.effect.forward");
		
		/*摄像机 停止前进 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('Forward',['start',false]);
		}, "camera.effect.forward.stop");
		
		/*摄像机 后退 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('Backward',['start',true]);			
		}, "camera.effect.backward");
		
		/*摄像机 停止后退 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('Backward',['start',false]);
		}, "camera.effect.backward.stop");
		
		/*摄像机 左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',true]);
		}, "camera.effect.rotateleft");
		
		/*摄像机 停止左转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('RotateLeft',['start',false]);
		}, "camera.effect.rotateleft.stop");
		
		/*摄像机 右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',true]);
		}, "camera.effect.rotateright");
		
		/*摄像机 停止右转 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('RotateRight',['start',false]);
		}, "camera.effect.rotateright.stop");

		/*摄像机 抬头 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',1.0);	
		}, "camera.effect.rotateup");
		
		/*摄像机 停止抬头 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',0);	
		}, "camera.effect.rotateup.stop");

		/*摄像机 低头 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',-1.0);
		}, "camera.effect.rotatedown");
		
		/*摄像机 停止低头 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcdefaultcamera'].SetProperty('pitchvelocity',0);
		}, "camera.effect.rotatedown.stop");
		
		/*摄像机 左平移 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('StrafeLeft',['start',true]);
		}, "camera.effect.StrafeLeft");
		
		/*摄像机 左平移停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('StrafeLeft',['start',false]);
		}, "camera.effect.StrafeLeft.stop");
		
		/*摄像机 右平移 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('StrafeRight',['start',true]);
		}, "camera.effect.StrafeRight");
		
		/*摄像机 右平移停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.camera;
			actor.pcarray['pcactormove'].PerformAction('StrafeRight',['start',false]);
		}, "camera.effect.StrafeRight.stop");
		
		
		/* 打开 视角控制功能  切换为第一人称 */
		Event.Subscribe(function(e){
			player.pcarray['pcmesh'].SetVisible(false);
			//iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','firstperson']);
			player.prePosition = player.pcarray['pcmesh'].position;
			player.preRotation = player.pcarray['pcmesh'].rotation;
			var speed = player.viewCtrlSpeed;
			player.pcarray['pcactormove'].PerformAction(
				'SetSpeed', 
					['movement', speed['movement'] ], 
					['running', speed['running']   ], 
					['rotation', speed['rotation'] ], 
					['jumping', speed['jumping']   ]
			);
			player.pcarray['pclinearmovement'].SetProperty('gravity', 0);
		},"logic.effect.shijiaokongzhi_in");
		
		/* 关闭 视角控制功能 */
		Event.Subscribe(function(e){
			var pos = player.prePosition;
			var rot = player.preRotation;
			var pos1 = player.pcarray['pcmesh'].GetProperty("position");
			var rot1 = player.pcarray['pcmesh'].GetProperty("rotation");
			if(pos1.y > 2){
				player.pcarray['pcmesh'].PerformAction(
					'MoveMesh', 
					[
						'position', [pos.x, pos.y ,pos.z],
					],
					[
						'rotation', [rot.x, rot.y ,rot.z],
					]
				);
			}else{
				player.pcarray['pcmesh'].PerformAction(
					'MoveMesh',
						[
							'position', [pos1.x, 0, pos1.z],
						],
						[
							'ratation', [rot1.x, rot.y, rot.z],
						]
				);
			}
			player.pcarray['pcmesh'].SetVisible(true);
			//iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
			player.pcarray['pclinearmovement'].SetProperty('gravity', [0]);
			
			// 改变角色的动作和速度
			Event.Send({
				name : "effect.go.run.change",
			});
			
		},"logic.effect.shijiaokongzhi_close");
			
		/*	Add by yuechaofeng at 2012-5-25	begin	*/
		/*	鼠标拖拽场景	*/
		Event.Subscribe(function(e){
			var actor = e.player;
			//接收鼠标左键按下时鼠标坐标值作为鼠标的起始坐标
			var startX = player.startX;
			var startY = player.startY;
			//获取鼠标的实时坐标
			var x = player.mousex;
			var y = player.mousey;
			
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
			//镜头跟随camera huyanan 2012-07-03 13:54:31
			iCamera.pcarray['pcdefaultcamera'].PerformAction('SetFollowEntity',['entity','camera']);
			//计算camera的pitch值 
			var screen_height = g2d.height;
			var cameraPitch = player.startPitch + ((startY-y)/screen_height)*0.5;
			// if(cameraPitch >= 0.5){
				// iCamera.pcarray['pcdefaultcamera'].SetProperty('pitch',0.5);
			// }else{
				iCamera.pcarray['pcdefaultcamera'].SetProperty('pitch',cameraPitch);
			// }
		},"camera.effect.mousemove");		
		/*	Add by yuechaofeng at 2012-5-25 end		*/
		
		
	})();

} catch(e){
	alert(e);
}