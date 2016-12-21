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

    /************************************************************************/
    /*   LOGIN_LAYOUT start	                                                    */
    /************************************************************************/
 
    FUNCTION_LIST_LAYOUT = {
		//layout文件的名称
	    name : "functionlist.layout",
		//这里定义的方法为UI事件的处理函数
	    method : {
	        "GoGenerateBat" : function(){
				if(!load("/objlayout/generatebatlayout.js")){
					alert("Failed to load `generatebatlayout.js`");
				}
				GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(GENERATE_BAT_LAYOUT,"/ui");
	        },
			"GoMergeWorlds" : function(){
				if(!load("/objlayout/mergeworldslayout.js")){
					alert("Failed to load `mergeworldslayout.js`");
					return;
				}
				GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(MERGE_WORLDS_LAYOUT,"/ui");
			},
			"GoHandleTransparent" : function(){
				if(!load("/objlayout/transparentlayout.js")){
					alert("Failed to load `transparentlayout.js`");
					return;
				}
				GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(HANDLE_TRANSPARENT_LAYOUT,"/ui");
			},
			"GoHandleDoubleFace" : function(){
				if(!load("/objlayout/doublefacelayout.js")){
					alert("Failed to load `doublefacelayout.js`");
					return;
				}
				GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(HANDLE_DOUBLE_FACE_LAYOUT,"/ui");
			},
			"GoHandleCollision" : function(){
				if(!load("/objlayout/collisionlayout.js")){
					alert("Failed to load `collisionlayout.js`");
					return;
				}
				GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(HANDLE_COLLISION_LAYOUT,"/ui");
			}
	    },
	    window : {
	        "functionRoot" : {
	            property: {
                    "Image" : function (obj,propt_name) {
	                    obj.SetProperty(propt_name,"set:ice image:HeaderBarBackdropNormal");
                    }
                },
                event : {
                    
                },
                subscribe : {
                    
                }
	        },
	        "function/GenerateBat" : {
	            property: {
                    
                },
                event : {
                    "Clicked" : "GoGenerateBat"
                },
                subscribe : {
                    
                }
	        },
			"function/MergeWorlds" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "GoMergeWorlds"
                },
                subscribe : {
                    
                }
			},
			"function/HandleTransparent" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "GoHandleTransparent"
                },
                subscribe : {
                    
                }
			},
			"function/HandleDoubleFace" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "GoHandleDoubleFace"
                },
                subscribe : {
                    
                }
			},
			"function/HandleCollision" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "GoHandleCollision"
                },
                subscribe : {
                    
                }
			}
	    }   
	};

}
catch (e)
{
	alert(e);
}