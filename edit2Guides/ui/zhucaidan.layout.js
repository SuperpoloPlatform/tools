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
			//不同导游路线的信息，并生成xml文件
			school_guides_message_export : function(){
				xmlString = "" ; 
				var route_name = player.guides_choice ; 
				switch(route_name) {
					case  	"lishiwenhua" :
						xmlString = "<LiShiWenHua_DATA>\n"
					    break ;
					case 	"xinshengruxue" :
						xmlString = "<XinShengRuXue_DATA>\n"
						break ;
					case	"special_attractions" :
						xmlString = "<TeShuJingDian_DATA>\n"
						break ;
					default :
						break ; 
				}
				if(player.guides_choice == "lishiwenhua"){//历史文化--路线1
					player.list_position_data = player.one_list_position_data ;
				}
				if(player.guides_choice == "xinshengruxue"){//新生入学--路线2
					player.list_position_data = player.two_list_position_data ;
				}
				if(player.guides_choice == "special_attractions"){//特殊景点--路线3
					player.list_position_data = player.special_list_position_data ;
				}
				var position_data_string = player.list_position_data;
				var pos_list = position_data_string.split('%'); 
				if(pos_list.length<=1){
					return ; 
				}
				for(var i = 0;i<pos_list.length-1;i++){
					xmlString += "\t<n__n"+i+">\n";
					//我是导游。。。
					xmlString += "\t\t<text>\n" ;  
					xmlString += "\t\t\t<chinese>"+"我是导游...."+"</chinese>\n";
					xmlString += "\t\t\t<english>"+"Hello , I am a Guide ....... "+"</english>\n";
					xmlString += "\t\t</text>\n" ; 
					//播放录音--引用导游点名称作为录音名称
					xmlString += "\t\t<SoundUrl>\n" ; 
					xmlString += "\t\t\t<chinese>"+ pos_list[i].split('|')[0] + ".wav"+"</chinese>\n";
					xmlString += "\t\t\t<english>"+ pos_list[i].split('|')[1] + ".wav"+"</english>\n";
					xmlString += "\t\t</SoundUrl>\n" ; 
					//中文信息 name + intro
					xmlString += "\t\t<chinese>\n" ; 
					xmlString += "\t\t\t<name>" + pos_list[i].split('|')[0] + "</name>\n" ; 
					xmlString += "\t\t\t<intro>" + "暂无" + "</intro>\n" ; 
					xmlString += "\t\t</chinese>\n" ; 
					//英文信息 name + intro
					xmlString += "\t\t<english>\n" ; 
					xmlString += "\t\t\t<name>" + pos_list[i].split('|')[1] + "</name>\n" ; 
					xmlString += "\t\t\t<intro>" + "no value" + "</intro>\n" ; 
					xmlString += "\t\t</english>\n" ; 
					//位置坐标
					xmlString += "\t\t<position>\n" ; 
					xmlString += "\t\t\t<x>"+pos_list[i].split('|')[2]+"</x>\n";
					xmlString += "\t\t\t<y>"+pos_list[i].split('|')[3]+"</y>\n";
					xmlString += "\t\t\t<z>"+pos_list[i].split('|')[4]+"</z>\n";
					xmlString += "\t\t</position>\n" ; 
					xmlString += "\t</n__n"+i+">\n";
				}
				switch(route_name) {
					case  	"lishiwenhua" : 
						xmlString += "</LiShiWenHua_DATA>"
						break ;
					case 	"xinshengruxue" :
						xmlString += "</XinShengRuXue_DATA>"
						break ;
					case	"special_attractions" :
						xmlString += "</TeShuJingDian_DATA>"
						break ;
					default :
						break ; 
				}
				//生成xml文件
				var file_to_write = VFS.Open("/tools/ui/" + player.filename + ".xml",VFS.WRITE);
				VFS.WriteFile("/tools/ui/" + player.filename + ".xml",xmlString);
				xmlString = "";
				alert("保存成功!");
				//获取编辑框
				var chinese_name_text = GUI.Editbox.Get("guides_point/chinese_name");
				var english_name_text = GUI.Editbox.Get("guides_point/english_name");
				//清空编辑框内容
				chinese_name_text.SetProperty("Text","");
				english_name_text.SetProperty("Text","");
			},
			//点击路线取消（guides/road/cancel）时，关闭编辑框
			no_save_information : function(){
				//关闭编辑框
				var win_name = FUNCTION_DATA.get_windows("guides_point/name");
				win_name.SetProperty("Visible","False");
				//失去编辑框输入焦点
				player.is_mouse_Activated = false;
			},
			//导游路线1
			road_one : function(){
				player.guides_choice = "lishiwenhua" ;
				//生成的xml文件名
				player.filename = "json_lishiwenhua";
				//获取编辑框输入焦点
				player.is_mouse_Activated = true;
				//设置路线按钮被选中
				player.road_Selected = true;
				//打开编辑框
				var win_name = FUNCTION_DATA.get_windows("guides_point/name");
				win_name.SetProperty("Visible","True");
			},
			//导游路线2
			road_two : function(){
				player.guides_choice = "xinshengruxue" ;
				//生成的xml文件名
				player.filename = "json_xinshengruxue";
				//获取编辑框输入焦点
				player.is_mouse_Activated = true;
				//设置路线按钮被选中
				player.road_Selected = true;
				//打开编辑框
				var win_name = FUNCTION_DATA.get_windows("guides_point/name");
				win_name.SetProperty("Visible","True");
			},
			//定点导游
			special_guides : function(){
				player.guides_choice = "special_attractions" ;
				//生成的xml文件名
				player.filename = "json_specialAttractions";
				//获取编辑框输入焦点
				player.is_mouse_Activated = true;
				//设置路线按钮被选中
				player.road_Selected = true;
				//打开编辑框
				var win_name = FUNCTION_DATA.get_windows("guides_point/name");
				win_name.SetProperty("Visible","True");
			},
			//获取并保存导游初始位置信息
			get_guides_init_position : function(){
				var init_pos = player.init_position_data ; 
				//获取导游初始位置的position和rotation坐标
				var pos = player.pcarray['pcmesh'].GetProperty('position');
				var rot = player.pcarray['pcmesh'].GetProperty('rotation');
				init_pos = pos.x+"|"+pos.y+"|"+pos.z+"|"+rot.x+"|"+rot.y+"|"+rot.z+"%";
				player.init_position_data = init_pos ; 
			},
			//确定导游初始位置,并生成xml文件
			guides_init_position_export : function(){
				xmlString = "<GUIDES_DATA>\n";
				var init_data_string = player.init_position_data;
				var init_list = init_data_string.split('%'); 
				if(init_list.length<=1){
					return ; 
				}
				for(var i = 0;i<init_list.length-1;i++){
					//位置坐标 position
					xmlString += "\t<initPosition>\n" ; 
					xmlString += "\t\t<x>"+init_list[i].split('|')[0]+"</x>\n";
					xmlString += "\t\t<y>"+init_list[i].split('|')[1]+"</y>\n";
					xmlString += "\t\t<z>"+init_list[i].split('|')[2]+"</z>\n";
					xmlString += "\t</initPosition>\n" ; 
					//位置坐标 rotation
					xmlString += "\t<initRotation>\n" ; 
					xmlString += "\t\t<x>"+init_list[i].split('|')[3]+"</x>\n";
					xmlString += "\t\t<y>"+init_list[i].split('|')[4]+"</y>\n";
					xmlString += "\t\t<z>"+init_list[i].split('|')[5]+"</z>\n";
					xmlString += "\t</initRotation>\n" ; 
				}
				xmlString += "</GUIDES_DATA>\n" ;
				//生成xml文件
				var file_to_write = VFS.Open("/tools/ui/json_guides_init.xml",VFS.WRITE);
				VFS.WriteFile("/tools/ui/json_guides_init.xml",xmlString);
				xmlString = "";
				alert("保存成功!");
				//清空导游点初始位置信息数组
				player.init_position_data = "";
			},
			//记录导游路线的位置信息--将导游点的信息记录到数组中
			guides_route_position_export : function(){
				if(player.road_Selected){
					//获取输入值--中英文名称
					var chinese_name_text = GUI.Editbox.Get("guides_point/chinese_name");
					var english_name_text = GUI.Editbox.Get("guides_point/english_name");
					var chinese_name_value = chinese_name_text.GetProperty("Text");
					var english_name_value = english_name_text.GetProperty("Text");		
					player.chinese_name = chinese_name_value ; 
					player.english_name = english_name_value ;
					//当中英文名称都不为空时发送消息
					if((player.chinese_name != "" && player.english_name != "")){
						Event.Send({
							name : "player.effect.get_message",
							id : player.guides_choice
						});
					}
				}
				//关闭编辑框
				var win_name = FUNCTION_DATA.get_windows("guides_point/name");
				win_name.SetProperty("Visible","False");
				//失去编辑框输入焦点
				player.is_mouse_Activated = false;
				//点击一次确定后，设置路线按钮为不被选中状态
				player.road_Selected = false;
			}
		},		
		window : {
			//获取并保存导游初始位置信息
			"guides/init/introduce" :{
				property:{
				},
				event : {
					"Clicked":"get_guides_init_position"
				},
				subscribe : {}
			},
			//导出导游初始位置的xml文件
			"guides/init/save" :{
				property:{
				},
				event : {
					"Clicked":"guides_init_position_export"
				},
				subscribe : {}
			},
			//导游路线1
			"guides/road_one/btn" :{
				property:{
				},
				event : {
					"Clicked":"road_one"
				},
				subscribe : {}
			},
			//导游路线2
			"guides/road_two/btn" :{
				property:{
				},
				event : {
					"Clicked":"road_two"
				},
				subscribe : {}
			},
			//定点导游
			"guides/special_guides" :{
				property:{
				},
				event : {
					"Clicked": "special_guides"
				},
				subscribe : {}
			},
			//导游路线上导游点确认
			"guides/road/ok" :{
				property:{
				},
				event : {
					"Clicked":"guides_route_position_export"
				},
				subscribe : {}
			},
			//导游路线--取消按钮
			"guides/road/cancel" :{
				property:{
				},
				event : {
					"Clicked":"no_save_information"
				},
				subscribe : {}
			},
			//导游路线--保存按钮
			"guides/road/save" :{
				property:{
				},
				event : {
					"Clicked":"school_guides_message_export"
				},
				subscribe : {}
			},
		}
	}
	
} catch( e )
{
	alert( e );
}