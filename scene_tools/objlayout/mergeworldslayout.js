try {
 
    MERGE_WORLDS_LAYOUT = {
		//layout文件的名称
	    name : "mergeworlds.layout",
		//这里定义的方法为UI事件的处理函数
	    method : {
	        "ReturnMain" : function () {
	            GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(FUNCTION_LIST_LAYOUT,"/ui");
	        },
			"ExecMergeWorlds" : function(){
				if(!load("merge.js")){
					alert("Failed to load ‘merge.js’");
					return;
				}
				var inputObj = GUI.Windows.Get("mergeWorlds/InputPathEdit");
				var inputPath = inputObj.GetProperty("Text");
				var outputObj = GUI.Windows.Get("mergeWorlds/OutputPathEdit");
				var outputPath = outputObj.GetProperty("Text");
				mergeAllWorlds.SetSourceFolder(inputPath);
				mergeAllWorlds.SetTargetFolder(outputPath);
				mergeAllWorlds.Execute();
				alert("执行完成！\n请替换源文件夹中的所有world文件，才能再次执行该程序，\n否则会重复添加meshobj等节点。");
				GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(FUNCTION_LIST_LAYOUT,"/ui");
			}
	    },
	    window : {
			"mergeWorlds/Return" : {
	            property: {
                    
                },
                event : {
                    "Clicked" : "ReturnMain"
                },
                subscribe : {
                    
                }
	        },
			"mergeWorlds/Execute" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "ExecMergeWorlds"
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