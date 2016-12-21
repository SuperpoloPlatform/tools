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

	PLAYER = {
		name : "player",
		
		property : {
			currentAnim : "walk",	// 记录当前动作
			stopAnim: "stand",		// 角色停止移动后的动作
			meshName: "mesh_obj",		// 角色当前模型
			
			viewCtrlSpeed: {
				'movement' : 8, 
				'running' : 1, 
				'rotation': 1, 
				'jumping' : 1
			},
			
			
			strafeUpSpeed: 0.3,		// 向上的速度
			strafeDownSpeed: 0.3,	// 向下的速度
			
			prePosition: [0,0,0], 	// 角色的上一个位置
			preRotation: [0,0,0],	// 角色的上一个朝向
			
			current_forward_state:"walk", // 记录角色当前的移动状态    walk   run   viewCtrl   sand
			previous_forward_state:"walk",// 保存上一个移动状态
			current_position: [0,0,0],    // 记录实时位置 需要调用时候 player.current_position.x  player.current_position.y 
            anjian_state : "shang",
			
			startX : 0  , // 鼠标左键按下的X值
			startY : 0 ,  // 鼠标左键按下的Y值 
			rotationX : 0 , // 鼠标左键按下,player在X轴移动的角度
			rotationY : 0 , // 鼠标左键按下,player在Y轴移动的角度 
			 
			//  记录角色当前的移动速度
			currentMoveSpeed: 1.1
		},
		
		pc : {
			"pcmesh" : {
				action : [
					{
						name : "SetMesh",
						param : [
							['name','mesh_obj']
						]
					},
					{
						name : "SetAnimation",
						param : [
							['animation','stand'],
							['cycle',true]
						]
					},
					{
						name : "SetVisible",
						param : [
							['visible',true]
						]
					},
					{
						name : "RotateMesh",
						param : [
							['rotation',[-0.001, 0, 0]]
						]
					}
				]
			},
			"pclight" : {
			},
			"pclinearmovement" : {
				action : [
					{
						name : "InitCD",
						param : [
							['offset',[0, 0.0, 0]],
							['body',[0.5,0.65,0.5]],
							['legs',[0.5,1.1,0.5]]
						]
					}
				]
				
			},
			"pcactormove" : {
				action : [
					{
						name : "SetSpeed",
						param : [
							['movement',1.1],
							['running',3],
							['rotation',2],
							['jumping',1]
						]
					}
				]
			},
			"pcmover" : {},
			"pctimer" : {},
			"pccommandinput" : {
				action : [
					{
						name: "Activate",
						param:[
							['activate', true]
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
							['command','strafeLeft']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','d'],
							['command','strafeRight']
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
							['trigger','t'],
							['command','strafeUp']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','y'],
							['command','strafeDown']
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
							['trigger','z'],
							['command','printTransform']
						]
					},
					//鼠标移动(左键)
					{
						name : "Bind",		//同上
						param : [
							['trigger','MouseAxis0'],	//鼠标移动
							['command','mousemove']		//事件mousemove
						]
					},
					//鼠标左键状态
					{
						name : "Bind",		//同上
						param : [
							['trigger','MouseButton0'],		//鼠标左键
							['command','mouseleft']			//事件mouseleft
						]
					},
					//鼠标右键状态
					{
						name : "Bind",		//同上
						param : [
							['trigger','MouseButton1'],		//鼠标右键
							['command','mouseright']			//mouseright
						]
					},
					{
						name : "Bind",   //鼠标滚轮向前
						param : [
							['trigger', '0Mousebutton3'],
							['command', 'wheelForward']
						]
					},
					{
						name : "Bind",   //鼠标滚轮向后
						param : [
							['trigger', '0Mousebutton4'],
							['command', 'wheelBackward']
						]
					},
					{
						name : "Bind",//角色向前
						param : [
							['trigger','up'],
							['command','forward']
						]
					},
					{
						name : "Bind",//角色向后
						param : [
							['trigger','down'],
							['command','backward']
						]
					},
					{
						name : "Bind",//角色向左
						param : [
							['trigger','left'],
							['command','rotateleft']
						]
					},
					{
						name : "Bind",//角色向右
						param : [
							['trigger','right'],
							['command','rotateright']
						]
					},
					{
					  name : "Bind",
					  param:[
						['trigger','l'],
						['command','changelight']
					  ]
					}
				]
			}
		},
		
		// 订阅来自entity自身发出的事件，类似于`ent.behavious();`，
		// 一般这些事件都是entity内部的property class发出的。		
		event : {
			
			/*  开始向前  */
			"pccommandinput_forward1" : function(){
				// 控制摄像机拉近
				Event.Send({
					name:"player.effect.forward.begin",
				});
			},
			
			/*  停止前进  */
			"pccommandinput_forward0" : function(){
				iCamera.pcarray['pctimer'].PerformAction('Clear', ['name','sendDistance']);
			},
			
			/*  开始后退  */
			"pccommandinput_backward1" : function(){
				// 控制摄像机拉远
				Event.Send({
					name:"player.effect.backward.begin",
				});
			},
			
			/*  停止后退  */
			"pccommandinput_backward0" : function(){
				iCamera.pcarray['pctimer'].PerformAction('Clear', ['name','sendDistance']);
			},
			
			/*  开始左转  */
			"pccommandinput_rotateleft1" : function(){
				Event.Send({
					name: "player.effect.rotateleft",
					player: this
				});
			},
			
			/*  停止左转  */
			"pccommandinput_rotateleft0" : function(){
				Event.Send({
					name: "player.effect.rotateleft.stop",
					player: this
				});
			},
			
			/*  开始右转  */
			"pccommandinput_rotateright1" : function(){
				Event.Send({
					name: "player.effect.rotateright",
					player: this
				});
			},
			
			/*  停止右转  */
			"pccommandinput_rotateright0" : function(){
				Event.Send({
					name: "player.effect.rotateright.stop",
					player: this
				});
			},
			
			/*  开始抬头  */
			"pccommandinput_rotateup1" : function(){
				Event.Send({
					name : "player.effect.rotateup" ,
					self : player 
				});
				
			},
			
			/*  停止抬头  */
			"pccommandinput_rotateup0" : function(){
				Event.Send({
					name : "player.effect.rotateup.stop" ,
					self : this					
				});
			},
			
			/*  开始低头  */
			"pccommandinput_rotatedown1" : function(){
				Event.Send({
					name: "player.effect.rotatedown",
					player: this
				});
			},
			
			/*  停止低头  */
			"pccommandinput_rotatedown0" : function(){
				Event.Send({
					name: "player.effect.rotatedown.stop",
					player: this
				});
			},
			
			/*  左平移  */
			"pccommandinput_strafeLeft1" : function(){
				Event.Send({
					name: "player.effect.StrafeLeft",
					player: this
				});
			},
			
			/*  左平移停止  */
			"pccommandinput_strafeLeft0" : function(){
				Event.Send({
					name: "player.effect.StrafeLeft.stop",
					player: this
				});
			},
			
			/*  右平移  */
			"pccommandinput_strafeRight1" : function(){
				Event.Send({
					name: "player.effect.StrafeRight",
					player: this
				});
			},
			
			/*  右平移停止  */
			"pccommandinput_strafeRight0" : function(){
				Event.Send({
					name: "player.effect.StrafeRight.stop",
					player: this
				});
			},
			
			/*  上平移  */
			"pccommandinput_strafeUp1" : function(){
				Event.Send({
					name: "player.effect.StrafeUp",
					player: this
				});
			},
			/*  上平移停止  */
			"pccommandinput_strafeUp0" : function(){
				Event.Send({
					name: "player.effect.StrafeUp.stop",
					player: this
				});
			},
			/*  下平移  */
			"pccommandinput_strafeDown1" : function(){
				Event.Send({
					name: "player.effect.StrafeDown",
					player: this
				});
			},
			/*  上平移停止  */
			"pccommandinput_strafeDown0" : function(){
				Event.Send({
					name: "player.effect.StrafeDown.stop",
					player: this
				});
			},
			
			/*  垂直向上  */
			"pctimer_StrafeUp" : function(){
				Event.Send({
					name: "player.effect.pctimer.StrafeUp",
					player: this
				});
			},
			/*  垂直向下  */
			"pctimer_StrafeDown" : function(){
				Event.Send({
					name: "player.effect.pctimer.StrafeDown",
					player: this
				});
			},
			
			/*	实时发送camera的pitch值		*/
			"pctimer_sendPitch" : function(){
				this.pcarray['pcmesh'].PerformAction('RotateMesh', ['rotation',[-0.001, 0, 0]]);
			},
						
			
			/*鼠标滚轮向前	*/
			"pccommandinput_wheelForward1":function(){
				var cur_distance = iCamera.pcarray['pcdefaultcamera'].GetProperty('distance');
				if(cur_distance-1 >=0){
					Event.Send({
						name:"change.camera.distance.near",
					});
				}
			},
			
			/*鼠标滚轮向后			*/
			"pccommandinput_wheelBackward1":function(){
				Event.Send({
					name:"change.camera.distance.far",
				});
			},
			
			//鼠标移动
			"pccommandinput_mousemove" : function (msgid, x, y){
				if(this.mouseleft || this.mouseright){
					Event.Send({	//同上参考
						name : "player.effect.mousemove",
						player : this
					});
				}
			},
			
			//鼠标移动(右键)
			// "pccommandinput_mousemoveright" : function (msgid, x, y){
				// if(this.mouseright){
					// Event.Send({	//同上参考
						// name : "player.effect.mousemove",
						// self : this
					// });
				// }   
			// },
			
			//鼠标左键按下
			"pccommandinput_mouseleft1" : function (){
				this.mouseleft = true;//给entity属性赋值
				this.startX = player.mousex;
			},
			
			//鼠标左键弹起
			"pccommandinput_mouseleft0" : function (){
				this.mouseleft=false;//给entity属性赋值
			},
			
			//鼠标右键按下
			"pccommandinput_mouseright1" : function (){
				// this.mouseright = true;//给entity属性赋值
				// this.startY = player.mousey;
				//记录鼠标右键按下时的鼠标坐标
				player.startX = player.mousex;
				player.startY = player.mousey;
				//获取并记录camera的rotation值
				var rotation = iCamera.pcarray['pcmesh'].GetProperty('rotation');
				player.startRotationY = rotation.y;
				//获取并记录camera的pitch值
				var pitch = iCamera.pcarray['pcdefaultcamera'].GetProperty('pitch');
				player.startPitch = pitch;
				Event.Send({
					name : "player.effect.mouserightrotation",
					player : this
				});
			},
			
			//鼠标右键弹起
			"pccommandinput_mouseright0" : function (){
				this.mouseright = false;//给entity属性赋值
			},
			
			//L键按下
			"pccommandinput_changelight1":function(){
				 Event.Send({
					  name : "change.light.position",
					  player:this
				 });
			},
			
			//L键抬起
			"pccommandinput_changelight0":function(){
				 Event.Send({
					  name : "change.light.position.stop",
					  player:this
				 });
			}
		},
		
		// 订阅全局的事件
		subscribe : {
			// 角色选择确定后，调用角色的
			"role.select.enter.click": function(e){
				this.pcarray["pccommandinput"].PerformAction("Activate", ['activate', true]);
				this.pcarray["pcmesh"].PerformAction("RotateMesh", ["rotation", [0, 3.1155, 0]]);
				this.role_ok = "ok";
			}
		}
	};

}
catch (e)
{
	alert(e);
}