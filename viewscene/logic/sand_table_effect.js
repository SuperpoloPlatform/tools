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
	
		// 进入沙盘模式
		Event.Subscribe(function(e){
			
			// iprint('进入沙盘');
			
			// 把角色隐藏
			player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', false]);
			iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
			
			// 保存角色沙盘模式之前的位置
			player.prePosition = player.pcarray['pcmesh'].position;
			player.preRotation = player.pcarray['pcmesh'].rotation;
			
			// 修改速度为 沙盘模式 速度
			var speed = player.sandSpeed;
			player.pcarray['pcactormove'].PerformAction(
				'SetSpeed', 
					['movement', speed['movement'] ], 
					['running', speed['running']   ], 
					['rotation', speed['rotation'] ], 
					['jumping', speed['jumping']   ]
			);
			
			// 设置重力为0
			player.pcarray['pclinearmovement'].SetProperty('gravity', 0);
			
			// 将角色放到地面以下 (或者 去除角色的碰撞检测)
			// player.pcarray['pcmesh'].PerformAction(
				// 'MoveMesh',
				// [
					// 'position',
					// [ 0, 60, 0	]
				// ],
				// [
					// 'rotation',
					// [ 0, 1.587254285812378, 0 ]	
				// ]
			// );
			
			var cameraSets = iCamera.sandMode;
			iCamera.minDistance = cameraSets['minDistance'];		// 摄像机离角色的最近距离
			iCamera.maxDistance = cameraSets['maxDistance'];		// 摄像机离角色的最远距离
			iCamera.wheelSpeed = cameraSets['wheelSpeed'];	        // 摄像机的拉近/远速度
			iCamera.currentDistance = cameraSets['currentDistance'];
			
			// 改变摄像机的 distance 
			iCamera.pcarray["pcdefaultcamera"].SetProperty("distance", 340);
			
			// 改变摄像机的 俯角
			// iCamera.pcarray["pcdefaultcamera"].SetProperty("pitch", -0.8);
 
 
		},"player.effect.hoarse");
		
		
		
		// 退出沙盘模式
		Event.Subscribe(function(e){
			
			// iprint('离开沙盘');
			
			// 改变角色的动作和速度
			// Event.Send({
				// name : "effect.go.run.change",
			// });			
			
			// 设置重力
			player.pcarray['pclinearmovement'].SetProperty('gravity', 0);
			
			// 将角色放回到地面
			var pos = player.prePosition;
			var rot = player.preRotation;
			player.pcarray['pcmesh'].PerformAction(
				'MoveMesh',
				[
					'position',	
					[ pos.x, pos.y, pos.z ]
				],
				[
					'rotation',
					[ rot.x, 0-rot.y, rot.z  ]
				]					
			);
			
			var cameraSets = iCamera.defaultMode;
			iCamera.minDistance = cameraSets['minDistance'];		// 摄像机离角色的最近距离
			iCamera.maxDistance = cameraSets['maxDistance'];		// 摄像机离角色的最远距离
			iCamera.wheelSpeed = cameraSets['wheelSpeed'];	        // 摄像机的拉近/远速度
			iCamera.currentDistance = 3.2;
			
			// 改变摄像机的 distance 
			iCamera.pcarray["pcdefaultcamera"].SetProperty("distance", iCamera.defaultDistance);
			
			// 改变摄像机的 俯角
			// iCamera.pcarray["pcdefaultcamera"].SetProperty("pitch", iCamera.defaultPitch);
			
			// 显示角色
			// player.pcarray['pcmesh'].PerformAction('SetVisible',['visible', true]);
			
		},"player.effect.hoarse.backing_out");
		
	})();

} catch(e){
	alert(e);
}