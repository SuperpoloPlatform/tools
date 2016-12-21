try {
 
    HANDLE_TRANSPARENT_LAYOUT = {
		//layout文件的名称
	    name : "handletransparent.layout",
		//这里定义的方法为UI事件的处理函数
	    method : {
	        "ReturnMain" : function () {
	            GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(FUNCTION_LIST_LAYOUT,"/ui");
	        },
			"ExecHandleTransparent" : function(){
				if(!load("handleTransparent.js")){
					alert("Failed to load ‘handleTransparent.js’");
					return;
				}
				var inputObj = GUI.Windows.Get("transparent/InputPathEdit");
				var inputPath = inputObj.GetProperty("Text");
				var excludeObj = GUI.Windows.Get("transparent/ExcludeFilesEdit");
				var excludeFiles = excludeObj.GetProperty("Text");
				handleTransparent.SetSourceFolder(inputPath);
				handleTransparent.SetExcludeFiles(excludeFiles);
				handleTransparent.Execute();
				alert("执行完成！\n执行结果被保存到了执行目录的result子目录里，请将结果复制出来。");
			}
	    },
	    window : {
			"transparent/Return" : {
	            property: {
                    
                },
                event : {
                    "Clicked" : "ReturnMain"
                },
                subscribe : {
                    
                }
	        },
			"transparent/Execute" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "ExecHandleTransparent"
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