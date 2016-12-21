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
			meshName: "woman",		// 角色当前模型
			viewCtrlSpeed: {
				'movement' : 18, 
				'running' : 10, 
				'rotation': 1, 
				'jumping' : 1
			},
			walkSpeed: {
				'movement' : 10, 
				'running' : 10, 
				'rotation': 1, 
				'jumping' : 1
			},
			runSpeed: {
				'movement' : 10, 
				'running' : 10, 
				'rotation': 1, 
				'jumping' : 1
			},
			prePosition: [0,0,0], 	// 角色的上一个位置
			preRotation: [0,0,0],	// 角色的上一个朝向
			window_name: "",          //执行动画后关闭的窗口
			list_position : [],
			nonce_position : [0,0,0],
			sand_state : true,
			sand_text_name : "",
			nonce_rotation :[0,0,0],
			mouse_click_star : 0,
			btn_click : false,
			role_data :[],
			woman_Scale : 0,
			map_pos_roes : [0,0,0],
			
			map_enter_Is : false,
			enter_int : 1,
			list_map_data :[],
			person: "firstperson",
			sex:"nv",
			sand_map_flag: false,
			startX : 0,	//鼠标左键按下时X轴初始坐标
			startY : 0,	//鼠标左键按下时Y轴初始坐标
			list_position_data : "" , //记录导游路线的位置信息
			chinese_name  : "" ,//中文名称
			english_name : "" , //英文名称
			
			init_position_data : "", //记录导游初始位置信息
			one_list_position_data : "", //记录第一条路线的位置信息
			two_list_position_data : "", //记录第一条路线的位置信息
			special_list_position_data : "", //记录第一条路线的位置信息
			is_mouse_Activated : false //判断是否获取了搜索输入框的焦点
		},
		
		pc : {
			"pcmesh" : {
				action : [
					{
						name : "SetMesh",
						param : [
							['name','mesh___camera']
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
							['movement',10],
							['running',5],
							['rotation',1],
							['jumping',1]
						]
					}
				]
			},
			"pcmover" : {},
			"pctimer" : {
			},
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
						name : "Bind",//速度等级1
						param : [
							['trigger','1'],
							['command','changespeedlevelOne']
						]
					},
					{
						name : "Bind",//速度等级2
						param : [
							['trigger','2'],
							['command','changespeedlevelTwo']
						]
					},
					{
						name : "Bind",//速度等级2
						param : [
							['trigger','3'],
							['command','changespeedlevelThree']
						]
					},
					{
						name : "Bind",//速度等级2
						param : [
							['trigger','4'],
							['command','changespeedlevelFour']
						]
					},
					{
						name : "Bind",//速度等级2
						param : [
							['trigger','5'],
							['command','changespeedlevelFive']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','0'],
							['command','gotoinit']
						]
					},
					// 修改亮度
					{
						name : "Bind",
						param : [
							['trigger','PadPlus'],
							['command','LightUp']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','PadMinus'],
							['command','LightDown']
						]
					},
					//	鼠标滚轮向前
					{
						name : "Bind",
						param : [
							['trigger','Mousebutton3'],
							['command','wheelforward']
						]
					},
					//	鼠标滚轮向后
					{
						name : "Bind",
						param : [
							['trigger','Mousebutton4'],
							['command','wheelbackward']
						]
					},
					//打印坐标
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
			/*  开始向前  */
			"pccommandinput_forward1" : function(){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				Event.Send({
					name: "player.effect.forward",
					player: this
				});
			},
			
			/*  停止前进  */
			"pccommandinput_forward0" : function(){
				Event.Send({
					name: "player.effect.forward.stop",
					player: this
				});
			},
			
			/*  开始后退  */
			"pccommandinput_backward1" : function(){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				Event.Send({
					name: "player.effect.backward",
					player: this
				});
			},
			
			/*  停止后退  */
			"pccommandinput_backward0" : function(){
				Event.Send({
					name: "player.effect.backward.stop",
					player: this
				});
			},
			
			/*  开始左转  */
			"pccommandinput_rotateleft1" : function(){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
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
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
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
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				Event.Send({
					name: "player.effect.rotateup",
					player: this
				});
			},
			
			/*  停止抬头  */
			"pccommandinput_rotateup0" : function(){
				Event.Send({
					name: "player.effect.rotateup.stop",
					player: this
				});
			},
			
			/*  开始低头  */
			"pccommandinput_rotatedown1" : function(){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
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
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
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
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
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
			
			/*打印出摄像机当前的位置、朝向			*/
			"pccommandinput_printTransform0" : function(){
				if(!player.mouse_view_way){
					var position = this.pcarray['pcmesh'].GetProperty("position");
					var rotation = this.pcarray['pcmesh'].GetProperty("rotation");
					var pitch = iCamera.pcarray['pcdefaultcamera'].GetProperty('pitch');
					var distance = iCamera.pcarray['pcdefaultcamera'].GetProperty('distance');
					iprint("position："+ position.x + ", " + position.y + ", " + position.z);
					iprint("rotation：" + rotation.x +", "+ rotation.y +", "+ rotation.z);
					iprint("pitch："+pitch);
					iprint("distance"+distance);
				}	
			},

			// 改变速度
			"pccommandinput_changespeedlevelOne1":function(e){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				this.walkSpeed["movement"] = 3;
				this.walkSpeed["rotation"] = 1;
				Event.Send({
					name:"effect.go.run.change"
				});
			},
			// 改变速度
			"pccommandinput_changespeedlevelTwo1":function(e){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				this.walkSpeed["movement"] = 6;
				this.walkSpeed["rotation"] = 1;
				Event.Send({
					name:"effect.go.run.change"
				});
			},
			// 改变速度
			"pccommandinput_changespeedlevelThree1":function(e){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				this.walkSpeed["movement"] = 9;
				this.walkSpeed["rotation"] = 1;
				Event.Send({
					name:"effect.go.run.change"
				});
			},
			// 改变速度
			"pccommandinput_changespeedlevelFour1":function(e){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				this.walkSpeed["movement"] = 12;
				this.walkSpeed["rotation"] = 1;
				Event.Send({
					name:"effect.go.run.change"
				});
			},
			// 改变速度
			"pccommandinput_changespeedlevelFive1":function(e){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				this.walkSpeed["movement"] = 15;
				this.walkSpeed["rotation"] = 1;
				Event.Send({
					name:"effect.go.run.change"
				});
			},
			
			"pccommandinput_gotoinit1":function(e){
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				this.pcarray['pcmesh'].PerformAction(
					'MoveMesh', [
						'position', [
							128.75909423828125,0,-332.3567810058594
						]
					]
				);
			},
			
			// 改变场景的亮度和饱和度
			"pccommandinput_LightUp1":function(e) {
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				var val = 0.1; // 步进值
				var sec = SceneTree.getFirstSector();
				AssertTrue(typeof(sec.ambient) != "undefined", "cant get <ambient> in sector, or there is no <ambient> node in sector");
				sec.ambient = sec.ambient.Add([val, val, val]);
				
				var rep = Registry.Get("iReporter");
				var msg = "Ambient color : [R:" + sec.ambient.r + ",G:" + sec.ambient.g + ",B:" + sec.ambient.b + "]";
				System.Report(msg, rep.DEBUG, "spp.tools.edit2Guides");
			},
			"pccommandinput_LightDown1":function(e) {
				//屏蔽搜索时,键盘操作对player的影响
				if(player.is_mouse_Activated){
					return ; 
				}
				var val = -0.1; // 步进值
				var sec = SceneTree.getFirstSector();
				AssertTrue(typeof(sec.ambient) != "undefined", "cant get <ambient> in sector, or there is no <ambient> node in sector");
				sec.ambient = sec.ambient.Add([val, val, val]);
				
				var rep = Registry.Get("iReporter");
				var msg = "Ambient color : [R:" + sec.ambient.r + ",G:" + sec.ambient.g + ",B:" + sec.ambient.b + "]";
				System.Report(msg, rep.DEBUG, "spp.tools.edit2Guides");
			},
			
			/*	鼠标滚轮向前		*/
			"pccommandinput_wheelforward1" : function(){
				var con_distance = iCamera.pcarray['pcdefaultcamera'].GetProperty('distance');
				if(con_distance-5 >=0){
					Event.Send({
						name : "player.effect.change.distance.near",
						player : this
					});
				}
			},
			
			/*	鼠标滚轮向后 	*/
			"pccommandinput_wheelbackward1" : function(){
				Event.Send({
					name : "player.effect.change.distance.far",
					player : this
				});
			}			
		},
		
		// 订阅全局的事件
		subscribe : {
			// 角色选择确定后，调用角色的
			"role.select.enter.click": function(){
				this.pcarray["pccommandinput"].PerformAction("Activate", ['activate', true]);
				this.pcarray["pcmesh"].PerformAction("RotateMesh", ["rotation", [0, 3.1155, 0]]);
				this.pcarray['pclinearmovement'].SetProperty('gravity', [0]);
				this.pcarray['pcmesh'].PerformAction(
					'MoveMesh', [
						'position', [
							128.75909423828125,0,-332.3567810058594
						]
					]
				);
			}
		}
	};

}
catch (e)
{
	alert(e);
}