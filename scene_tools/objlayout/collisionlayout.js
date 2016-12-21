try {
 
    HANDLE_COLLISION_LAYOUT = {
		//layout文件的名称
	    name : "handlecollision.layout",
		//这里定义的方法为UI事件的处理函数
	    method : {
	        "ReturnMain" : function () {
	            GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(FUNCTION_LIST_LAYOUT,"/ui");
	        },
			"ExecHandleCollision" : function(){
				if(!load("handleCollision.js")){
					alert("Failed to load ‘handleCollision.js’");
					return;
				}
				var inputObj = GUI.Windows.Get("collision/InputPathEdit");
				var inputPath = inputObj.GetProperty("Text");
				handleCollision.SetSourceFolder(inputPath);
				handleCollision.Execute();
				alert("执行完成！\n源文件已被改变，请替换其他world文件再执行此程序。");
				GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(FUNCTION_LIST_LAYOUT,"/ui");
			}
	    },
	    window : {
			"collision/Return" : {
	            property: {
                    
                },
                event : {
                    "Clicked" : "ReturnMain"
                },
                subscribe : {
                    
                }
	        },
			"collision/Execute" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "ExecHandleCollision"
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