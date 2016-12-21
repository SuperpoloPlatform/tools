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
	})();

} catch(e){
	alert(e);
}