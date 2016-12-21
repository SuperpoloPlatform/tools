/**************************************************************************
 *
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd. 
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/  sales@spolo.org uge-support@spolo.org
 *
**************************************************************************/

try {

	CAMERA = {
		name : "camera",
		
		property : {
			currentDistance: 30,	// 记录摄像机离角色的当前距离
			defaultDistance: 3,	// 记录摄像机离角色的最佳距离
			minDistance: 1.8,		// 摄像机离角色的最近距离
			maxDistance: 8,			// 摄像机离角色的最远距离
			wheelSpeed: 0.5,		// 摄像机的拉近/远速度
			
			defaultPitch : -0.04499990493059158,

			defaultMode:{
				'minDistance' : 1.8,		// 摄像机离角色的最近距离
				'maxDistance' : 8,		// 摄像机离角色的最远距离
				'wheelSpeed' : 0.5,			// 摄像机的拉近/远速度
				'currentDistance':3.2
			},
			
			sandMode:{
				'minDistance' : 10,		// 摄像机离角色的最近距离
				'maxDistance' : 800,		// 摄像机离角色的最远距离
				'wheelSpeed' : 5,			// 摄像机的拉近/远速度
				'currentDistance':340
			},
			
			_isWheelClose: false
		},
		
		pc : {
			// "pczonemanager" : {
				// action : [
					// {
						// name : "DisableCD",
						// param : [
						// ]
					// },
					// {
						// name : "Load",
						// param : [
							// ['path', '/art'],
							// ['file', 'level.xml']
						// ]
					// }
				// ]
			// },
			"pcdefaultcamera" : {
				action : [
					{
						name : "SetCamera",
						param : [
							['modename', 'firstperson'],
							['pitch', -0.54499990493059158]
						]
					},
					{
						name : "SetZoneManager",
						param : [
							['entity', 'camera'], //player 是 entity.name 的属性值
							['region', 'main'],
							['start', 'Camera']
						]
					}
				],
				property : [
					{
						name : "distance",
						value : 10
					}
				]
			},
			"pcmesh" : {
				action : [
					{
						name : "SetMesh",
						param : [
							['name','mesh___camera']
						]
					},
					{
						name : "SetVisible",
						param : [
							['visible',false]
						]
					},
					{
						name : "RotateMesh",
						param : [
							['rotation',[0, 0, 0]]
						]
					}
				]
			},
			"pcmover" : {},
			"pclight" : {
			},
			"pclinearmovement" : {
				action : [
					{
						name : "InitCD",
						param : [
							['offset',[0, 0, 0]],
							['body',[0, 0, 0]],
							['legs',[0, 0, 0]]
						]
					}
				],
				param:[
					{
						name: "gravity ",
						value: 19.6
					}
				]
				
			},
			"pcactormove" : {
				action : [
					{
						name : "SetSpeed",
						param : [
							['movement',10.1],
							['running',3],
							['rotation',1],
							['jumping',1]
						]
					}
				]
			},
			"pctimer" : {
				action : [
					
				]
			},
			"pccommandinput" : {
				action : [
					{
						name: "Activate",
						param:[
							['activate',false]
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','w'],
							['command','forward']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','s'],
							['command','backward']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','a'],
							['command','rotateleft']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','d'],
							['command','rotateright']
						]
					},

					{
						name : "Bind",
						param : [
							['trigger','r'],
							['command','rotateup']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','f'],
							['command','rotatedown']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','tab'],
							['command','change_view']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','q'],
							['command','strafeLeft']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','e'],
							['command','strafeRight']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','z'],
							['command','printTransform']
						]
					}
				]
			}
		},
		
		// 订阅来自entity自身发出的事件，类似于`ent.behavious();`，
		// 一般这些事件都是entity内部的property class发出的。		
		event : {
			
			/*
				开始向前
			*/
			"pccommandinput_forward1" : function(){
				Event.Send({
					name: "camera.effect.forward",
					camera: this
				});
			},
			
			/*
				停止前进
			*/
			"pccommandinput_forward0" : function(){
				Event.Send({
					name: "camera.effect.forward.stop",
					camera: this
				});
			},
			
			/*
				开始后退
			*/
			"pccommandinput_backward1" : function(){
				Event.Send({
					name: "camera.effect.backward",
					camera: this
				});
			},
			
			/*
				停止后退
			*/
			"pccommandinput_backward0" : function(){
				Event.Send({
					name: "camera.effect.backward.stop",
					camera: this
				});
			},
			
			/*
				开始左转
			*/
			"pccommandinput_rotateleft1" : function(){
				Event.Send({
					name: "camera.effect.rotateleft",
					camera: this
				});
			},
			
			/*
				停止左转
			*/
			"pccommandinput_rotateleft0" : function(){
				Event.Send({
					name: "camera.effect.rotateleft.stop",
					camera: this
				});
			},
			
			/*
				开始右转
			*/
			"pccommandinput_rotateright1" : function(){
				Event.Send({
					name: "camera.effect.rotateright",
					camera: this
				});
			},
			
			/*
				停止右转
			*/
			"pccommandinput_rotateright0" : function(){
				Event.Send({
					name: "camera.effect.rotateright.stop",
					camera: this
				});
			},
			
			/*
				开始抬头
			*/
			"pccommandinput_rotateup1" : function(){
				Event.Send({
					name: "camera.effect.rotateup",
					camera: this
				});
			},
			
			/*
				停止抬头
			*/
			"pccommandinput_rotateup0" : function(){
				Event.Send({
					name: "camera.effect.rotateup.stop",
					camera: this
				});
			},
			
			/*
				开始低头
			*/
			"pccommandinput_rotatedown1" : function(){
				Event.Send({
					name: "camera.effect.rotatedown",
					camera: this
				});
			},
			
			/*
				停止低头
			*/
			"pccommandinput_rotatedown0" : function(){
				Event.Send({
					name: "camera.effect.rotatedown.stop",
					camera: this
				});
			},
			
			/*
				左平移
			*/
			"pccommandinput_strafeLeft1" : function(){
				Event.Send({
					name: "camera.effect.StrafeLeft",
					camera: this
				});
			},
			
			/*
				左平移停止
			*/
			"pccommandinput_strafeLeft0" : function(){
				Event.Send({
					name: "camera.effect.StrafeLeft.stop",
					camera: this
				});
			},
			
			/*
				右平移
			*/
			"pccommandinput_strafeRight1" : function(){
				Event.Send({
					name: "camera.effect.StrafeRight",
					camera: this
				});
			},
			
			/*
				右平移停止
			*/
			"pccommandinput_strafeRight0" : function(){
				Event.Send({
					name: "camera.effect.StrafeRight.stop",
					camera: this
				});
			},
			
			/*
				切换摄像机模式
			*/
			"pccommandinput_change_view0" : function(){
				this.pcarray['pcactormove'].PerformAction('ToggleCameraMode', []);
				//this.pcarray['pcdefaultcamera'].GetProperty('modename');
			},
			
			/*
				打印出摄像机当前的位置、朝向
			*/
			"pccommandinput_printTransform0" : function(){
				var position = this.pcarray['pcmesh'].GetProperty("position");
				var rotation = this.pcarray['pcmesh'].GetProperty("rotation");
				var pitch = this.pcarray['pcdefaultcamera'].GetProperty('pitch');
				//CONSOLE.Write("player's position is : [" + position.x + ", " + position.y + ", " + position.z + "]\n");
				iprint("position："+ position.x + ", " + position.y + ", " + position.z);
				iprint("rotation：" + rotation.x +", "+ rotation.y +", "+ rotation.z);
				iprint("pitch："+pitch);
			},
			
			// 切换到第三人称模式
			"mode.change.thirdperson":function(){
				// alert('mode.change.thirdperson');
				// this.pcarray["pccommandinput"].PerformAction("Activate", ['activate', false]);
				// this.pcarray["pcdefaultcamera"].PerformAction("SetFollowEntity",['entity','player']);
				// this.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
			}//freelook
			
		},
		
		// 订阅全局的事件。
		subscribe : {
			// 角色选择确定后，调用摄像机的模式切换，第三人称
			"role.select.enter.click": function(){
				this.pcarray["pcdefaultcamera"].PerformAction("SetFollowEntity",['entity','player']);
				this.pcarray["pccommandinput"].PerformAction("Activate", ['activate', false]);
				this.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
				this.pcarray["pcdefaultcamera"].SetProperty("distance", 3.2);
				this.pcarray["pcdefaultcamera"].SetProperty("pitch", -0.169999957);
				
				this.pcarray["pcmesh"].PerformAction("SetVisible",['visible',true]);
				
			}
		
		}
	};

}
catch (e)
{
	alert(e);
}