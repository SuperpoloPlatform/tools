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
				'movement' : 11.1, 
				'running' : 10, 
				'rotation': 1, 
				'jumping' : 1
			},
			
			runSpeed: {
				'movement' : 13.2, 
				'running' : 10, 
				'rotation': 1, 
				'jumping' : 1
			},
			
			sandSpeed : {
				'movement' : 25, 
				'running' : 10, 
				'rotation': 0.3, 
				'jumping' : 1
			},
			
			strafeUpSpeed: 1.02,	// 向上的速度
			strafeDownSpeed: 1.02,	// 向下的速度
			
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
			map_AreaRect2_x1_1 : 0,
			map_AreaRect2_y1_1 : 0,
			map_AreaRect2_x1_2 : 0,
			map_AreaRect2_y1_2 : 0,
			map_AreaRect2_x1_3 : 0,
			map_AreaRect2_y1_3 : 0,
			map_AreaRect2_x1_4 : 0,
			map_AreaRect2_y1_4 : 0,
			map_AreaRect2_x1_5 : 0,
			map_AreaRect2_y1_5 : 0,
			map_AreaRect2_x2_1 : 0,
			map_AreaRect2_y2_1 : 0,
			map_AreaRect2_x2_2 : 0,
			map_AreaRect2_y2_2 : 0,
			map_AreaRect2_x2_3 : 0,
			map_AreaRect2_y2_3 : 0,
			map_AreaRect2_x2_4 : 0,
			map_AreaRect2_y2_4 : 0,
			map_AreaRect2_x2_5 : 0,
			map_AreaRect2_y2_5 : 0,
			map_p : 0,
			map_edit: 1,
			panorama_int : 0,
			map_role_pos : [],
			
			person: "firstperson",
			sex:"nv",
			
			sand_map_flag: false,
			/*	Add by yuechaofeng at 2012-5-22 begin	*/
			mouse_view_way : false,	//判断当前查看方式
			
			startX : 0,	//鼠标左键按下时X轴初始坐标
			startY : 0,	//鼠标左键按下时Y轴初始坐标
			isSand : false,
			currentIcon : "", //上一个刚创建的沙盘图标
			/*	Add by yuechaofeng at 2012-5-22 end		*/
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
							['movement',3],
							['running',1],
							['rotation',1],
							['jumping',1]
						]
					}
				]
			},
			"pcmover" : {},
			"pctimer" : {
				action : [
					{
						name : "WakeUp",
						param : [
							['time', 33],
							['repeat', false],
							['name', 'player_position']
						]
					},
					// {
						// name : "WakeUp",
						// param : [
							// ['time', 10],
							// ['repeat', true],
							// ['name', 'StrafeUp']
						// ]
					// },
					// {
						// name : "WakeUp",
						// param : [
							// ['time', 10],
							// ['repeat', true],
							// ['name', 'StrafeDown']
						// ]
					// },
					{	//实时发送消息给UI（显示建筑名称）
						name : "WakeUp",
						param : [
							['time', 10],
							['repeat', true],
							['name', 'mouse.coord']
						]
					}
				]
			},
			"pccommandinput" : {
				// 支持组合键
				property : [
					{
						name : "cooked",
						value : true
					}
				],
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
						name : "Bind",
						param : [
							['trigger','t'],
							['command','strafeUp']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','g'],
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
                    // {
						// name : "Bind",	//人物左转
						// param : [
							// ['trigger','n'],
							// ['command','turn_left']						]
					// },
							                    {
						name : "Bind",	//沙盘模式
						param : [
							['trigger','m'],
							['command','sand_map']						
						]
					},
					/*	漫游路线		*/
					{
						name : "Bind",//开始漫游
						param : [
							['trigger','k'],
							['command','wanderbegin']
						]
					},
					{
						name : "Bind",//暂停漫游
						param : [
							['trigger','p'],
							['command','wanderpause']
						]
					},
					{
						name : "Bind",//继续漫游
						param : [
							['trigger','j'],
							['command','wanderresume']
						]
					},
					{
						name : "Bind",//停止漫游
						param : [
							['trigger','o'],
							['command','wanderstop']
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
						name : "Bind",//切换人称
						param : [
							['trigger','tab'],
							['command','changepersonmode']
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
							['trigger','n'],
							['command','changesex']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','0'],
							['command','gotoinit']
						]
					},
					// 修改亮度，饱和度，以及gamma值。
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
					// 修改饱和度
					{
						name : "Bind",
						param : [
							['trigger','Ctrl+PadPlus'],
							['command','SaturationUp']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','Ctrl+PadMinus'],
							['command','SaturationDown']
						]
					},
					// 修改gamma值。
					{
						name : "Bind",
						param : [
							['trigger','Shift+PadPlus'],
							['command','GammaUp']
						]
					},
					{
						name : "Bind",
						param : [
							['trigger','Shift+PadMinus'],
							['command','GammaDown']
						]
					},
					
					/*	Add by yuechaofeng at 2012-5-22 begin	*/
					//鼠标左键
					{
						name : "Bind",
						param : [
							['trigger','MouseButton0'],
							['command','mouseleft']
						]
					},
					//鼠标滑动
					{
						name : "Bind",
						param : [
							['trigger','MouseAxis0'],
							['command','mousemove']
						]
					},
					//绑定快捷键 切换查看方式
					{
						name : "Bind",
						param : [
							['trigger','x'],
							['command','changeviewway']
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
					}
					/*	Add by yuechaofeng at 2012-5-22 end		*/
				]
			}
		},
		
		// 订阅来自entity自身发出的事件，类似于`ent.behavious();`，
		// 一般这些事件都是entity内部的property class发出的。		
		event : {
			/*  开始向前  */
			"pccommandinput_forward1" : function(){
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.forward",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.backward",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.rotateleft",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.rotateright",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.rotateup",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.rotatedown",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.StrafeLeft",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.StrafeRight",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.StrafeUp",
						player: this
					});
				}
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
				if(!player.mouse_view_way){
					Event.Send({
						name: "player.effect.StrafeDown",
						player: this
					});
				}
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
			
			/*	快速定位	*/
			"pccommandinput_quick.to.position1" :function(){
				if(!player.mouse_view_way){
					Event.Send({
						name : "player.effect.quick.to.position",
						player : this,
						id:POSITION[10]
					});
				}
			},
			
			/* 切换到沙盘模式 */
			"pccommandinput_sand_map1" :function(){
				if(!player.mouse_view_way){	
					if(this.sand_map_flag){	// 进入沙盘模式
						this.sand_map_flag = false;
						Event.Send({
							name : "player.effect.hoarse.backing_out",
						});
					}else{	// 离开沙盘模式
						this.sand_map_flag = true;
						Event.Send({
							name : "player.effect.hoarse",
						});
					}
				}
			},
			
			// 激活控制
			"active.control":function(){
				// alert(111);
				// this.pcarray["pccommandinput"].PerformAction("Activate", ['activate', true]);
			},
			
			/*切换摄像机模式		*/
			"pccommandinput_change_view0" : function(){
				// iprint(11111);
				// iCamera.pcarray['pcactormove'].PerformAction('ToggleCameraMode', []);
				//this.pcarray['pcdefaultcamera'].GetProperty('modename');
			},
			
			/*打印出摄像机当前的位置、朝向			*/
			"pccommandinput_printTransform0" : function(){
				if(!player.mouse_view_way){
					var position = this.pcarray['pcmesh'].GetProperty("position");
					var rotation = this.pcarray['pcmesh'].GetProperty("rotation");
					var pitch = iCamera.pcarray['pcdefaultcamera'].GetProperty('pitch');
					var distance = iCamera.pcarray['pcdefaultcamera'].GetProperty('distance');
					//CONSOLE.Write("player's position is : [" + position.x + ", " + position.y + ", " + position.z + "]\n");
					iprint("position："+ position.x + ", " + position.y + ", " + position.z);
					iprint("rotation：" + rotation.x +", "+ rotation.y +", "+ rotation.z);
					iprint("pitch："+pitch);
					iprint("distance"+distance);
				}	
			},
		
			/*  定时发送角色的位置 */
			"pctimer_player_position" : function(e){
				Event.Send({
					name : "pctimer.player.position"
				});
			},
			//动画执行完后关闭窗口
			"pctimer_ui_close_Animations" : function(e){
				Event.Send({
					name : "ui.close.Animations",
					window_name : this.window_name
				});
			},
			
			
			//选择场景时候，人物的旋转
			//
			/*  向左转 */
			"pccommandinput_turn_left1" : function(e){
				Event.Send({
					name : "player.effect.rotateleft1",
					player : this,
					position : this.pcarray['pcmesh'].position
				});
			},
			/*  停止向左转 */
			"pccommandinput_turn_left0" : function(e){
				Event.Send({
					name : "player.effect.rotateleft.stop1",
					player : this,
					position : this.pcarray['pcmesh'].position
				});
			},

				/*  向右转 */
			"pccommandinput_turn_right1" : function(e){
				Event.Send({
					name : "player.effect.rotateright1",
					player : this,
					position : this.pcarray['pcmesh'].position
				});
			},
				/*停止向右转*/
			"pccommandinput_turn_right0" : function(e){
				Event.Send({
					name : "player.effect.rotateright.stop1",
					player : this,
					position : this.pcarray['pcmesh'].position
				});
			},
			
			/*	漫游路线部分		*/
			"pccommandinput_wanderbegin1" : function(e)
			{
				Event.Send({
					name : "player.effect.wander.begin",
					player : this
				});
			},
			"pccommandinput_wanderpause1" : function(e)
			{
				Event.Send({
					name : "player.effect.wander.pause",
					player : this
				});
			},
			"pccommandinput_wanderresume1" : function(e)
			{
				Event.Send({
					name : "player.effect.wander.resume",
					player : this
				});
			},
			"pccommandinput_wanderstop1" : function(e)
			{
				Event.Send({
					name : "player.effect.wander.stop",
					player : this
				});
			},
			// 改变视角
			"pccommandinput_changepersonmode1":function(e){
				if(!player.mouse_view_way){
					if(this.person=="firstperson"){
						this.person="thirdperson";
						iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
					}else{
						this.person="firstperson";
						iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','firstperson']);
					}
				}
			},
			// 改变速度
			"pccommandinput_changespeedlevelOne1":function(e){
				if(!player.mouse_view_way){
					this.walkSpeed["movement"] = 3;
					this.walkSpeed["rotation"] = 2;
					this.strafeUpSpeed = 0.02;		// 向上的速度
					this.strafeDownSpeed = 0.02;	// 向下的速度
					Event.Send({
						name:"effect.go.run.change"
					});
				}
			},
			// 改变速度
			"pccommandinput_changespeedlevelTwo1":function(e){
				if(!player.mouse_view_way){
					this.walkSpeed["movement"] = 15;
					this.walkSpeed["rotation"] = 2;
					this.strafeUpSpeed = 0.5;	// 向上的速度
					this.strafeDownSpeed = 0.5;	// 向下的速度
					Event.Send({
						name:"effect.go.run.change"
					});
				}
			},
			// 改变速度
			"pccommandinput_changespeedlevelThree1":function(e){
				if(!player.mouse_view_way){
					this.walkSpeed["movement"] = 40;
					this.walkSpeed["rotation"] = 3;
					this.strafeUpSpeed = 2.02;	// 向上的速度
					this.strafeDownSpeed = 2.02;	// 向下的速度
					Event.Send({
						name:"effect.go.run.change"
					});
				}
			},
			// 改变速度
			"pccommandinput_changespeedlevelFour1":function(e){
				if(!player.mouse_view_way){
					this.walkSpeed["movement"] = 80;
					this.walkSpeed["rotation"] = 4;
					this.strafeUpSpeed = 3.02;	// 向上的速度
					this.strafeDownSpeed = 3.02;	// 向下的速度
					Event.Send({
						name:"effect.go.run.change"
					});
				}
			},
			// 改变速度
			"pccommandinput_changespeedlevelFive1":function(e){
				if(!player.mouse_view_way){
					this.walkSpeed["movement"] = 140;
					this.walkSpeed["rotation"] = 5;
					this.strafeUpSpeed = 5.02;	// 向上的速度
					this.strafeDownSpeed = 5.02;	// 向下的速度
					Event.Send({
						name:"effect.go.run.change"
					});
				}
			},
			
			"pccommandinput_changesex1":function(e){
				if(!player.mouse_view_way){
					// if(this.sex=="nv"){
						// this.sex = "nan";
						// iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
						// player.pcarray['pclinearmovement'].SetProperty('gravity', 0);
					// }else{
						// this.sex = "mesh_camera";
						// iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','firstperson']);
						// player.pcarray['pclinearmovement'].SetProperty('gravity', 0);
					// }
				
					// Event.Send({
						// name:"ui.click.change.sex",
						// sex:"mesh_camera"
					// });
					this.pcarray['pcmesh'].PerformAction(
						'MoveMesh', [
							'position', [
								0, 0 , 0
							]
						]
					);
				}
			},
			
			"pccommandinput_gotoinit1":function(e){
				if(!player.mouse_view_way){
					this.pcarray['pcmesh'].PerformAction(
						'MoveMesh', [
							'position', [
								0, 0 , 0
							]
						]
					);
				}
			},
			
			// 改变场景的亮度和饱和度
			"pccommandinput_LightUp1":function(e) {
				var val = 0.1; // 步进值
				var sec = SceneTree.getFirstSector();
				AssertTrue(typeof(sec.ambient) != "undefined", "cant get <ambient> in sector, or there is no <ambient> node in sector");
				sec.ambient = sec.ambient.Add([val, val, val]);
				
				var rep = Registry.Get("iReporter");
				var msg = "Ambient color : [R:" + sec.ambient.r + ",G:" + sec.ambient.g + ",B:" + sec.ambient.b + "]";
				System.Report(msg, rep.DEBUG, "spp.tools.viewscene");
			},
			"pccommandinput_LightDown1":function(e) {
				var val = -0.1; // 步进值
				var sec = SceneTree.getFirstSector();
				AssertTrue(typeof(sec.ambient) != "undefined", "cant get <ambient> in sector, or there is no <ambient> node in sector");
				sec.ambient = sec.ambient.Add([val, val, val]);
				
				var rep = Registry.Get("iReporter");
				var msg = "Ambient color : [R:" + sec.ambient.r + ",G:" + sec.ambient.g + ",B:" + sec.ambient.b + "]";
				System.Report(msg, rep.DEBUG, "spp.tools.viewscene");
			},
			"pccommandinput_SaturationUp1":function(e) {
				
			},
			"pccommandinput_SaturationDown1":function(e) {
				
			},
			
			// 改变屏幕的gamma值。
			"pccommandinput_GammaUp1":function(e) {
				C3D.g2d.gamma += 0.1;
				var rep = Registry.Get("iReporter");
				System.Report("Gamma value : " + C3D.g2d.gamma, rep.DEBUG, "spp.tools.viewscene");
			},
			"pccommandinput_GammaDown1":function(e) {
				C3D.g2d.gamma -= 0.1;
				var rep = Registry.Get("iReporter");
				System.Report("Gamma value : " + C3D.g2d.gamma, rep.DEBUG, "spp.tools.viewscene");
			},
			
			/*	//实时发送消息给UI（显示建筑名称）		*/
			"pctimer_mouse.coord" : function(){
				Event.Send({
					name : "player.effect.mouse.coord",
					player : this,
				});
			},
			
			/* Add by yuechaofeng at 2012-05-22 begin */
			/*	鼠标滑动	*/
			"pccommandinput_mousemove" : function(msgid,x,y){
				if(this.mouseleft){
					Event.Send({
						name : "camera.effect.mousemove",
						player : this
					});
				}
			},
			/*	鼠标左键按下 */
			"pccommandinput_mouseleft1" : function(){
				if(player.btn_click==false){
					if(!player.mouse_view_way){
						//CONSOLE.WriteLine("1111");
						//player.mouseleft = true;
						//记录鼠标左键按下时的鼠标坐标
						player.startX = player.mousex;
						player.startY = player.mousey;
						//获取并记录camera的rotation值
						var rotation = iCamera.pcarray['pcmesh'].GetProperty('rotation');
						player.startRotationY = rotation.y;
						// CONSOLE.WriteLine(rotation.y);
						//获取并记录camera的pitch值
						var pitch = iCamera.pcarray['pcdefaultcamera'].GetProperty('pitch');
						// CONSOLE.WriteLine(pitch);
						player.startPitch = pitch;
						Event.Send({
							name : "player.effect.mouseleftrotation",
							player : this
						});
						if(player.mouse_click_star!=0){
							var actor = player ;
							//获得当前摄像机
							var iPcCamera = iCamera.pcarray['pcdefaultcamera'].QueryInterface('iPcCamera');
							var cameraobj = iPcCamera.GetCamera();
							var g2d = C3D.g2d;
							var v3d = cameraobj.InvPerspective([actor.mousex, g2d.height - actor.mousey], 1000);
							var startBeam = cameraobj.GetTransform().GetOrigin();
							var endBeam = cameraobj.GetTransform().This2Other(v3d);
							
							// 获得第一个点击到的模型
							var targetObj = engine.FindScreenTarget([player.mousex, player.mousey], 1000, cameraobj);
							var meshObj;
							if(targetObj && targetObj.mesh){
									meshObj = targetObj.mesh;
							}
							
							// var meshObj = target.Next();
							// 如果 meshObj 为空值时, 不执行
							if(!meshObj){
								// iprint(11111);
								return;
							}
							
							//获得保存点击的位置和场景的交点的struct
							var pointintersect = meshObj.HitBeam(startBeam, endBeam, true);
							intersectpos = pointintersect.isect;
							if(player.woman_Scale==0){
								star = Entities.CreateEntity(STAR) ; 
								woman = Entities.CreateEntity(WOMAN) ;
								player.woman_Scale = 1; 	
							}
							iCamera.pcarray["pcdefaultcamera"].PerformAction("SetFollowEntity",['entity','player']);
							star.pcarray['pcmesh'].SetMesh('star');
							
							var starX = intersectpos.x  ; 
							var starY = intersectpos.y  ; 
							var starZ = intersectpos.z  ; 
							//player.isStarVisible = true ;
							// 获得角色当前位置
							var currentPos = player.pcarray["pcmesh"].GetProperty("position");
							// 目标位置减当前位置
							var st = intersectpos.Subtract(currentPos);	
							// 计算角色的目标朝向
							var vec1 = new Math3.Vector3(0,0,1);  
							var dotVec = st.Dot(vec1);
							var v1len = st.Length();
							var v2len = vec1.Length();
							var angle = Math.asin(dotVec / (v1len * v2len) );
							// 根据目标向量的符号来确定目标转向的符号
							var finalAngle = (angle+Math.PI/2) * (st.x<0?-1:1) ;
							
							var rotationY = Math.PI/2 - finalAngle ; 
							star.pcarray['pcmesh'].PerformAction('MoveMesh',["position",[starX , starY , starZ]] , ['rotation',[0,rotationY,0]]);
							player.nonce_rotation = [0,rotationY,0]; 
							//CONSOLE.WriteLine("1______"+player.nonce_rotation[1]);
							// if(player.woman_Scale==0){
								// var star_meshObj2 = engine.meshes.FindByName("woman");
								// var trans2 = star_meshObj2.movable.GetTransform();
								// var matrix2 = trans2.GetT2O();
								// matrix2.SetScale(0.2, 0.2, 0.2);
								// trans2.SetT2O(matrix2);
								// trans2.SetTransform(trans2);
								// star_meshObj2.movable.SetTransform(trans2);
								// player.woman_Scale = 1; 	
							// }
							//woman.pcarray['pcmesh'].PerformAction('MoveMesh',["position",[starX , starY , starZ]] , ['rotation',[0,rotationY,0]]);
							player.nonce_position = [starX,starY,starZ];
							
							Event.Send({
								name : "ui.send.position",
								player : this
							});
							
							//player.list_position = player.list_position +"%"+ player.nonce_position; 
							//CONSOLE.WriteLine("------------"+player.list_position+'-----'+player.nonce_position);
							player.mouse_view_way = true;
							woman.pcarray['pcmesh'].PerformAction('SetVisible',['visible', false]);
							star.pcarray['pcmesh'].PerformAction('SetVisible',['visible', true]);
						}
					}
				}
			},
			/*	鼠标左键弹起	*/
			"pccommandinput_mouseleft0" : function(){
				player.mouseleft = false;
			},
			
			/*	鼠标滚轮向前		*/
			"pccommandinput_wheelforward1" : function(){
				var con_distance = iCamera.pcarray['pcdefaultcamera'].GetProperty('distance');
				if(player.mouse_view_way){
					if(con_distance-5 >=0){
						Event.Send({
							name : "player.effect.change.distance.near",
							player : this
						});
					}
				}
			},
			
			/*	鼠标滚轮向后 	*/
			"pccommandinput_wheelbackward1" : function(){
				if(player.mouse_view_way){
					Event.Send({
						name : "player.effect.change.distance.far",
						player : this
					});
				}
			},
			
			/*	切换查看方式快捷键按下	*/
			"pccommandinput_changeviewway1" : function(){
				if(player.mouse_view_way){
					player.mouse_view_way = false;
				}else{
					player.mouse_view_way = true;
				}
			}
			/* Add by yuechaofeng at 2012-05-22 end */
		},
		
		// 订阅全局的事件
		subscribe : {
			// 角色选择确定后，调用角色的
			"role.select.enter.click": function(){
				this.pcarray["pccommandinput"].PerformAction("Activate", ['activate', true]);
				this.pcarray["pcmesh"].PerformAction("RotateMesh", ["rotation", [0, 3.1155, 0]]);
				this.pcarray['pclinearmovement'].SetProperty('gravity', [0]);
				// iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','firstperson']);
				this.pcarray['pcmesh'].PerformAction(
					'MoveMesh', [
						'position', [
							0, 0 , 0
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