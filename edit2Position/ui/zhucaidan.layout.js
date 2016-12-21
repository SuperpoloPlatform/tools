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

			
			but_enter : function(){
				player.btn_click = true;
			},
			but_leave : function(){
				player.btn_click = false;
			},
			
			//王鑫新增(2012-06-14)
			map_click : function(){
				var pos_st = "" ; 
				//弹出快速定位窗体
				var quick_pos_win = FUNCTION_DATA.get_windows("zhucaidan/kuaisudingwei");
				quick_pos_win.SetProperty("Visible","True");
			},
			//王鑫新增(2012-06-14)
			school_quick_position_export : function(){
				xmlString = "<POSITION_DATA>\n"
					var position_data_string = player.list_position_data;
					var pos_list = position_data_string.split('%'); 
					if(pos_list.length<=1){
						return ; 
					}
					for(var i = 0;i<pos_list.length-1;i++){
						xmlString += "\t<n__n"+i+">\n";
						xmlString += "\t\t<name>\n" ;  
						xmlString += "\t\t\t<chinese_name>"+pos_list[i].split('|')[1]+"</chinese_name>\n";
						xmlString += "\t\t\t<english_name>"+pos_list[i].split('|')[2]+"</english_name>\n";
						xmlString += "\t\t</name>\n" ; 
						xmlString += "\t\t<reach_position_x>"+pos_list[i].split('|')[3]+"</reach_position_x>\n";
						xmlString += "\t\t<reach_position_y>"+pos_list[i].split('|')[4]+"</reach_position_y>\n";
						xmlString += "\t\t<reach_position_z>"+pos_list[i].split('|')[5]+"</reach_position_z>\n";
						xmlString += "\t\t<reach_rotation_y>"+pos_list[i].split('|')[6]+"</reach_rotation_y>\n";
						xmlString += "\t\t<ui_position>"+pos_list[i].split('|')[7]+"</ui_position>\n";
						xmlString += "\t</n__n"+i+">\n";
					}
					xmlString +="</POSITION_DATA>";
					//CONSOLE.WriteLine(xmlString);
					var file_to_write = VFS.Open("/tools/ui/quick_position.xml",VFS.WRITE);
					VFS.WriteFile("/tools/ui/quick_position.xml",xmlString);
					xmlString = "";
					alert("保存成功!");
			},
			"kuaisudingwei_win_close" : function(){
				var quick_pos_win = FUNCTION_DATA.get_windows("zhucaidan/kuaisudingwei");
				quick_pos_win.SetProperty("Visible","False");
			},
			"kuaisudingwei_tishi_ok" :function(){
				//获取输入值
				var chinese_name_ed = GUI.Editbox.Get("kuaisudingwei/chinses_name");
				var english_name_ed = GUI.Editbox.Get("kuaisudingwei/english_name");
				var chinese_name1 = chinese_name_ed.GetProperty("Text");
				var english_name1 = "test";		
				player.chinese_name = chinese_name1 ; 
				player.english_name = english_name1 ; 
				Event.Send({
					name : "player.effect.get_message" 
				});
				//关闭提示框
				for(var index in this.associatedWindow){
					FUNCTION_DATA.get_windows(this.associatedWindow[0]).SetProperty("Visible","False");
				}
				FUNCTION_DATA.get_windows("zhucaidan/kuaisudingwei").SetProperty("Visible","False");
			},
			"kuaisudingwei_tishi_cancel" :function(){
				//关闭提示框
				for(var index in this.associatedWindow){
					FUNCTION_DATA.get_windows(this.associatedWindow[0]).SetProperty("Visible","False");
				}
			},
			serch_ecitbox_Activated :function (){
				player.pcarray["pccommandinput"].PerformAction("Activate", ['activate', false]);//王鑫修改(2012-06-12)
			},	
			serch_ecitbox_Deactivated :function (){
				player.pcarray["pccommandinput"].PerformAction("Activate", ['activate', true]);//王鑫修改(2012-06-12)
			}
		},		
		window : {
			//快速定位编译
			"school_map/btn" :{
				property:{
				},
				event : {
					"Clicked":"map_click"
				},
				subscribe : {}
			},
			//导出xml文件
			"kuaisudingwei/save" :{
				property:{
				},
				event : {
					"Clicked":"school_quick_position_export"
				},
				subscribe : {}
			},
			
			//快速定位窗体
			"zhucaidan/kuaisudingwei" :{
				property:{
				},
				event : {
					"Clicked":"school_map_notarize_danyi"
				},
				subscribe : {
					"create_new_button" : function(e){
						if( player.mousex < 179 || player.mousex > 930 ){
							return ; 
						}
						if(player.mousey < 130 || player.mousey > 640){
							return ; 
						}
						var index = e.btn_index ; 
						var u_message = e.u_message ; 
						var button = GUI.Windows.CreateWindow("General/Button","btn"+index);
						button.SetProperty("UnifiedAreaRect", u_message );
						button.SetProperty("UnifiedMaxSize" , "{{1,0},{1,0}}") ;
						button.SetProperty("NormalTextColour","FF000000");
						button.SetProperty("PushedTextColour","FF000000");
						button.SetProperty("Visible","True");
						button.SetProperty("text_theme","定位点");
						button.parent = FUNCTION_DATA.get_windows("kuaisudingwei/map_bg");
						var win_name = FUNCTION_DATA.get_windows("kuaisudingwei/name");
						win_name.SetProperty("Visible","True");

					},
					"destroy_button" : function(e){
						var name ="btn" + e.but_index ; 
						if(GUI.Windows.IsWindowPresent(name)){
							GUI.Windows.DestroyWindow(name);
						}
					}
				
				}
			},
			
			"kuaisudingwei/close_button" :{
				property:{
					associatedWindow : function (obj,propt_name){
						obj[propt_name]=[];
					}
				},
				event : {
					"Clicked":"kuaisudingwei_win_close"
				},
				subscribe : {}
			},
			"kuaisudingwei/name":{
				property:{
					associatedWindow : function (obj,propt_name){
						obj[propt_name]=['kuaisudingwei/name','kuaisudingwei/chinses_name'
						,'kuaisudingwei/ok','kuaisudingwei/cancel'];
					}
				},
				event : {
					
				},
				subscribe : {}
			},
			// "kuaisudingwei/english_name":{
				// property:{
					// associatedWindow : function (obj,propt_name){
						// obj[propt_name]=['kuaisudingwei/name','kuaisudingwei/english_name','kuaisudingwei/chinses_name'
						// ,'kuaisudingwei/ok'];
					// }
				// },
				// event : {
					// "Activated":"serch_ecitbox_Activated",
					// "Deactivated":"serch_ecitbox_Deactivated"
				// },
				// subscribe : {}
			// },
			"kuaisudingwei/chinses_name":{
				property:{
					associatedWindow : function (obj,propt_name){
						obj[propt_name]=['kuaisudingwei/name','kuaisudingwei/chinses_name'
						,'kuaisudingwei/ok'];
					}
				},
				event : {
					"Activated":"serch_ecitbox_Activated",
					"Deactivated":"serch_ecitbox_Deactivated"
				},
				subscribe : {}
			
			},
			"kuaisudingwei/ok":{
				property:{
					associatedWindow : function (obj,propt_name){
						obj[propt_name]=['kuaisudingwei/name','kuaisudingwei/chinses_name'
						,'kuaisudingwei/ok'];
					}
				},
				event : {
					"Clicked":"kuaisudingwei_tishi_ok"
				},
				subscribe : {}
			},
			"kuaisudingwei/cancel":{
				property:{
					associatedWindow : function (obj,propt_name){
						obj[propt_name]=['kuaisudingwei/name','kuaisudingwei/chinses_name'
						,'kuaisudingwei/ok'];
					}
				},
				event : {
					"Clicked":"kuaisudingwei_tishi_cancel"
				},
				subscribe : {}
			}
		}
	}
	
} catch( e )
{
	alert( e );
}