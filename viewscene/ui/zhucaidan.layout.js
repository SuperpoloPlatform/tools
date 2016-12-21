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
	ZHUCAIDAN_LAYOUT = {
		name : "zhucaidan.layout",
		method : {
			//视角控制按钮按下时
			controlDown :function (){
				switch (this.control)
				{
				case "turn_left":
					Event.Send({
						name : "player.effect.rotateleft",
						player : player
					});
					break;
				case "turn_right":
					Event.Send({
						name : "player.effect.rotateright",
						player : player
					});
					break;
				case "turn_up":
					Event.Send({
						name : "player.effect.rotateup",
						player : player
					});
					break;
				case "turn_down":
					Event.Send({
						name : "player.effect.rotatedown",
						player : player
					});
					break;
				case "move_left":
					Event.Send({
						name : "player.effect.StrafeLeft",
						player : player
					});
					break;
				case "move_right":
					Event.Send({
						name : "player.effect.StrafeRight",
						player : player
					});
					break;
				case "move_up":
					Event.Send({
						name : "player.effect.StrafeUp",
						player : player
					});
					break;
				case "move_down":
					Event.Send({
						name : "player.effect.StrafeDown",
						player : player
					});
					break;
				case "move_ahead":
					Event.Send({
						name : "player.effect.forward",
						player : player
					});
					break;
				case "move_back":
					Event.Send({
						name : "player.effect.backward",
						player : player
					});
					break;
				default:
					break;
				}
			},
			//视角控制按钮松开时
			controlUp :function () {
				switch (this.control)
				{
				case "turn_left":
					Event.Send({
						name : "player.effect.rotateleft.stop",
						player : player
					});
					break;
				case "turn_right":
					Event.Send({
						name : "player.effect.rotateright.stop",
						player : player
					});
					break;
				case "turn_up":
					Event.Send({
						name : "player.effect.rotateup.stop",
						player : player
					});
					break;
				case "turn_down":
					Event.Send({
						name : "player.effect.rotatedown.stop",
						player : player
					});
					break;
				case "move_left":
					Event.Send({
						name : "player.effect.StrafeLeft.stop",
						player : player
					});
					break;
				case "move_right":
					Event.Send({
						name : "player.effect.StrafeRight.stop",
						player : player
					});
					break;
				case "move_up":
					Event.Send({
						name : "player.effect.StrafeUp.stop",
						player : player
					});
					break;
				case "move_down":
					Event.Send({
						name : "player.effect.StrafeDown.stop",
						player : player
					});
					break;
				case "move_ahead":
					Event.Send({
						name : "player.effect.forward.stop",
						player : player
					});
					break;
				case "move_back":
					Event.Send({
						name : "player.effect.backward.stop",
						player : player
					});
					break;
				default:
					break;
				}
			},
			//视角控制UI面板的关闭
			shijiaokongzhi_close : function(){
				//在按下UI面板的关闭按钮时关闭UI面板，zhucaidan/shijiaokongzhi为zhucaidan.layout中的UI面板的name
				FUNCTION_DATA.get_windows("zhucaidan/shijiaokongzhi").SetProperty("Visible","False");
				//设置player.view_control的值为真，表明点击关闭按钮隐藏UI后按K键显示UI
				player.view_control = true;
			},
			Editbox_qingkong : function(){
				GUI.Windows.Get("meshobj_name/Editbox").SetProperty("Text","");
			},
			editbox_Activated : function(){
				player.anjian_isabled = false;
			},
			editbox_Deactivated : function(){
				player.anjian_isabled = true;
			},
			Input_Ok : function(){
				var text_info = GUI.Windows.Get("meshobj_name/Editbox").GetProperty("Text");
				try{
					var pos = C3D.engine.FindMeshObject(text_info).movable.pos;
				}catch(e){
					alert("没有找到匹配方法");
					return;
				}
				
				//alert(pos.x+","+pos.y+","+pos.z);
				Event.Send({
					name : "player.effect.quick_to_pos",
					id:pos,
					player : player
				})
			}
		},
		window : {
			//视角控制--关闭
			"shijiaokongzhi/close_button":{
				property:{},
				event : {
					"Clicked":"shijiaokongzhi_close",
				},
				subscribe : {
					//接收logic发送的消息，隐藏UI面板
					"ui.viewControl.close" : function(e){
						FUNCTION_DATA.get_windows("zhucaidan/shijiaokongzhi").SetProperty("Visible","False");
					}
				}
			},
			//视角控制--打开
			"zhucaidan/shijiaokongzhi" : {
				property:{},
				event : {},
				subscribe : {
					//接收logic发送的消息，打开UI面板
					"ui.viewControl.open" : function(e){
						FUNCTION_DATA.get_windows("zhucaidan/shijiaokongzhi").SetProperty("Visible","true");
					}
				}
			},
			//视角控制左转
			"shijiaokongzhi/btn_shijiao_left":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "turn_left";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp",
				},
				subscribe : {}
			},
			//视角控制右转
			"shijiaokongzhi/btn_shijiao_right":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "turn_right";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp",
				},
				subscribe : {}
			},
			//视角控制抬头
			"shijiaokongzhi/btn_shijiao_up":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "turn_up";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			//视角控制低头
			"shijiaokongzhi/btn_shijiao_down":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "turn_down";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			//视角控制左移
			"shijiaokongzhi/btn_shijiao_left2":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "move_left";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			//视角控制右移
			"shijiaokongzhi/btn_shijiao_right2":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "move_right";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			//视角控制上升
			"shijiaokongzhi/btn_shijiao_up2":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "move_up";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			//视角控制下降
			"shijiaokongzhi/btn_shijiao_down2":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "move_down";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			//视角控制前进
			"shijiaokongzhi/btn_shijiao_forward":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "move_ahead";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			//视角控制后退
			"shijiaokongzhi/btn_shijiao_back":{
				property : {
					control : function (obj , propt_name){
						obj[propt_name] = "move_back";
					}
				},
				event : {
					"MouseButtonDown":"controlDown",
					"MouseButtonUp":"controlUp"
				},
				subscribe : {}
			},
			"meshobj_name/Editbox":{
				property : {},
				event : {
					"MouseClick":"Editbox_qingkong",
					"Activated":"editbox_Activated",
					"Deactivated":"editbox_Deactivated"
				},
				subscribe : {}
			},
			//输入完成点击OK键
			"Editbox_input_ok/button":{
				property : {},
				event : {
					"MouseClick":"Input_Ok"
				},
				subscribe : {}
			}
		}
	}
} catch( e )
{
	alert( e );
}