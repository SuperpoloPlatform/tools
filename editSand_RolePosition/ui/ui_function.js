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
try{
	/*********************************************************************
	
		functions : function(args)前面是方法名，后面是具体的方法
	
	**********************************************************************/
	FUNCTION_DATA = {
		//获取的到窗口的id
		get_windows : function (id){
			//通过传送过来的id获取窗口的控件类型
			var targetType = GUI.Windows.GetTargetType(id);
			var w;
			//根据窗口的控件类型获取相应的控件对象
			switch(targetType)
			{
				case "CEGUI/Listbox":
					w = GUI.Listbox.Get(id);
					break;
				case "CEGUI/Combobox":
					w = GUI.Combobox.Get(id);
					break;
				case "CEGUI/Checkbox":
					w = GUI.Checkbox.Get(id);
					break;
				case "ClippedContainer":
					w = GUI.ClippedContainer.Get(id);
					break;
				case "CEGUI/ComboDropList":
					w = GUI.ComboDropList.Get(id);
					break;
				case "CEGUI/DragContainer":
					w = GUI.DragContainer.Get(id);
					break;
				case "CEGUI/Editbox":
					w = GUI.Editbox.Get(id);
					break;
				case "CEGUI/FrameWindow":
					w = GUI.FrameWindow.Get(id);
					break;
				case "GridLayoutContainer":
					w = GUI.GridLayoutContainer.Get(id);
					break;
				case "CEGUI/GroupBox":
					w = GUI.GroupBox.Get(id);
					break;
				case "DefaultWindow":
					w = GUI.GUISheet.Get(id);
					break;
				case "CEGUI/HorizontalLayoutContainer":
					w = GUI.HorizontalLayoutContainer.Get(id);
					break;
				case "CEGUI/ItemEntry":
					w = GUI.ItemEntry.Get(id);
					break;
				case "CEGUI/ItemListbox":
					w = GUI.ItemListbox.Get(id);
					break;
				case "CEGUI/ListHeader":
					w = GUI.ListHeader.Get(id);
					break;
				case "CEGUI/ListHeaderSegment":
					w = GUI.ListHeaderSegment.Get(id);
					break;
				case "CEGUI/Menubar":
					w = GUI.Menubar.Get(id);
					break;
				case "CEGUI/MenuItem":
					w = GUI.MenuItem.Get(id);
					break;
				case "CEGUI/MultiColumnList":
					w = GUI.MultiColumnList.Get(id);
					break;
				case "CEGUI/MultiLineEditbox":
					w = GUI.MultiLineEditbox.Get(id);
					break;
				case "CEGUI/PopupMenu":
					w = GUI.PopupMenu.Get(id);
					break;
				case "CEGUI/ProgressBar":
					w = GUI.ProgressBar.Get(id);
					break;
				case "CEGUI/PushButton":
					w = GUI.PushButton.Get(id);
					break;
				case "CEGUI/RadioButton":
					w = GUI.RadioButton.Get(id);
					break;
				case "CEGUI/ScrollablePane":
					w = GUI.ScrollablePane.Get(id);
					break;
				case "CEGUI/Scrollbar":
					w = GUI.Scrollbar.Get(id);
					break;
				case "ScrolledContainer":
					w = GUI.ScrolledContainer.Get(id);
					break;
				case "CEGUI/Slider":
					w = GUI.Slider.Get(id);
					break;
				case "CEGUI/Spinner":
					w = GUI.Spinner.Get(id);
					break;
				case "CEGUI/TabButton":
					w = GUI.TabButton.Get(id);
					break;
				case "CEGUI/TabControl":
					w = GUI.TabControl.Get(id);
					break;
				case "CEGUI/Thumb":
					w = GUI.Thumb.Get(id);
					break;
				case "CEGUI/Titlebar":
					w = GUI.Titlebar.Get(id);
					break;
				case "CEGUI/Tooltip":
					w = GUI.Tooltip.Get(id);
					break;
				case "CEGUI/Tree":
					w = GUI.Tree.Get(id);
					break;
				case "VerticalLayoutContainer":
					w = GUI.VerticalLayoutContainer.Get(id);
					break;
				default :
					System.Report("there's no window named " + id + "", 0, "warning");
			}
			//判断控件对象是否获取成功
			//w = GUI.Windows.Get(id); 
			if (!w) {
				System.Report("Failed to get " + id + "", 0, "warning");
			}
			return w;
		},
		//显示和隐藏窗口
		set_visibles:function (associatedWindow){
			for(var index in associatedWindow)
			{
				var show_window = FUNCTION_DATA.get_windows(associatedWindow[index]);
				if(!show_window)
				{
					CONSOLE.Write("\n Failed to Get '" + show_window.name + "' \n");	    
				}
				var isVisible = show_window.GetProperty("Visible");
				if (isVisible == "True") {
					show_window.SetProperty("Visible","False");
				}
				else
				{
					show_window.SetProperty("Visible","True");
				}
			}
		},
		//显示窗口
		set_show :function (show){
			for (var index in show  )
			{
				var show_window = FUNCTION_DATA.get_windows(show[index]);
				if(!show_window)
				{
					CONSOLE.Write("\n Failed to Get '" + show_window.name + "' \n");	    
				}
				show_window.SetProperty("Visible","True");
				
			}
		},
		//隐藏窗口
		set_hide :function (hide){
			for (var index in hide  )
			{
				var hide_window = FUNCTION_DATA.get_windows(hide[index]);
				if(!hide_window)
				{
					CONSOLE.Write("\n Failed to Get '" + hide_window.name + "' \n");	    
				}
				hide_window.SetProperty("Visible","False");
				
			}
		},
		//快速定位
		set_position : function(position){
			for(var index in POSITION)
				{
					if(POSITION[index].name == position){
						Event.Send({
							name : "player.effect.quick.to.position",
							player : player,
							id : POSITION[index]
						});
					}
				}
		},
		//设置文字字体属性必须为text_theme，word中的排列顺序必须和text_window中的窗口排列顺序一致
		set_word : function(text_window, word){
			for (var index in text_window )
			{
				var twindow = FUNCTION_DATA.get_windows(text_window[index]);
				twindow.SetProperty("text_theme" , word[index]);
			}
		},
		//设置图片
		set_image : function (image_window, image){
			for (var index in image_window )
			{
				var twindow = FUNCTION_DATA.get_windows(image_window[index]);
				twindow.SetProperty("image" , image[index]);
			}
		}
	}
}catch(e){
	alert(e);
}