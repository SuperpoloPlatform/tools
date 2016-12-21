try {
 
    GENERATE_BAT_LAYOUT = {
		//layout文件的名称
	    name : "generatebat.layout",
		//这里定义的方法为UI事件的处理函数
	    method : {
	        "ReturnMain" : function () {
	            GUI.Windows.DestroyWindow(GUI.System.root);
	            GUI.CreateObjectLayout(FUNCTION_LIST_LAYOUT,"/ui");
	        },
			"ExecGenerateBat" : function(){
				if(!load("handle3ds.js")){
					alert("Failed to load ‘handle3ds.js’");
					return;
				}
				var inputObj = GUI.Windows.Get("generateBat/InputPathEdit");
				var inputPath = inputObj.GetProperty("Text");
				var outputObj = GUI.Windows.Get("generateBat/OutputPathEdit");
				var outputPath = outputObj.GetProperty("Text");
				handleAll3ds.SetInputPathBase(inputPath);
				handleAll3ds.SetOutputPathBase(outputPath);
				handleAll3ds.GenerateBat();
			}
	    },
	    window : {
			"generateBat/Return" : {
	            property: {
                    
                },
                event : {
                    "Clicked" : "ReturnMain"
                },
                subscribe : {
                    
                }
	        },
			"generateBat/Execute" : {
				property: {
                    
                },
                event : {
                    "Clicked" : "ExecGenerateBat"
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