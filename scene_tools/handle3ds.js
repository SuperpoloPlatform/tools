try{
	
	//给String添加replaceAll方法
	String.prototype.replaceAll = function(old_str,new_str){
		return this.replace(new RegExp(old_str,"gm"),new_str);
	}
	
	//执行单个3ds2world命令
	var handleOne3ds = {
		inputPath : "",			//输入路径
		outputPath : "",		//输出路径
		ifeffect : "Y",
		usePath : "",		//这个参数会在生成world时用到，是项目的目录前缀
		sourceFile : "",		//3ds源文件名称
		SetParams : function(input,output,use,filename,ifeffect){
			this.inputPath = input;
			this.outputPath = output;
			this.usePath = use;
			this.sourceFile = filename;
			this.ifeffect = ifeffect;
		},
		GenerateWorld : function(){
			//清空数据
			clearData();
			//根据参数转换world文件
			var inputFile = this.inputPath + this.sourceFile;
			alert(" inputFile=" +inputFile + "\n outputPath=" +this.outputPath + "\n usePath=" + this.usePath);
			ToWorld(inputFile,this.outputPath,this.usePath,this.ifeffect);
		},
		GenerateCMD : function(){
			var inputFile = this.inputPath + this.sourceFile;
			return "spp.exe --debug --input=" + inputFile + " --output=" + this.outputPath + 
				" --ifeffect=" + this.ifeffect + " --usepath=" + this.usePath + " " + System.InstallPath() + "/tools/3ds2world/convert/convert.js";
		}
	};
	
	//遍历输入文件夹中的3ds文件生成world文件
	var handleAll3ds = {
		inputPathBase : "",			//输入根路径，从ui中获得
		outputPathBase : "",		//输出根路径，从ui中获得
		SetInputPathBase : function(path){
			//可以接收包含“/”和“\”的路径参数，将该参数转换为“\”格式的
			//C:/3ds ===> "C:\\3ds\\gb_xiaopin\\"
			if(path.charAt(path.length-1) != "/" 
				&& path.charAt(path.length-1) != "\\"){
				path += "/";
			}
			var result = path.replaceAll("/","\\");
			this.inputPathBase = result;
		},
		SetOutputPathBase : function(path){
			if(path.charAt(path.length-1) != "/" 
				&& path.charAt(path.length-1) != "\\"){
				path += "/";
			}
			var result = path.replaceAll("/","\\");
			this.outputPathBase = result;
		},
		GetSubFolders : function(){
			//获取输入根路径的子文件夹，返回文件夹名称数组
			VFS.Mount("/temp",this.inputPathBase);
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",this.inputPathBase);
			var folders = new Array();
			var idx = 0;
			for(var i in files){
				var filename = files[i].replace("/temp/","");
				if(filename.charAt(filename.length-1) == "/"){
					filename = filename.replace("/","");
					folders[idx++] = filename;
				}
			}
			return folders;
		},
		Get3dsFiles : function(path){
			//根据文件夹中的3ds文件，返回3ds文件名称的数组(path为输入根目录加上子目录)
			VFS.Mount("/temp",path + "\\");
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",path + "\\");
			var file_3ds = new Array();
			var idx = 0;
			for(var i in files){
				var filename = files[i].replace("/temp/","");
				var pos = filename.lastIndexOf(".");
				var fileType = filename.substr(pos+1);
				if(fileType.toUpperCase() == "3DS"){
					file_3ds[idx++] = filename;
				}
			}
			return file_3ds;
		},
		GenerateOutPath : function(folder,filename){
			//可能要根据参数和一定的规则生成输出目录，返回字符串
			//子目录根据输入子目录名称和3ds文件名称拼接而成
			folder = folder.replaceAll("_","");		//去除子文件夹中“_”以防后面干扰
			var pos = filename.lastIndexOf(".");
			var name = filename.substring(0,pos);
			var result = this.outputPathBase + folder + "_" + name + "\\";
			return result;
		},
		GenerateUsePath : function(folder,filename){
			//根据一定规则生成目录前缀
			folder = folder.replaceAll("_","");		//去除子文件夹中“_”以防后面干扰
			var pos = filename.lastIndexOf(".");
			var name = filename.substring(0,pos);
			var result = "/art/models/" + folder + "_" + name;
			return result;
		},
		GenerateIfEffect : function(path){
			//根据输入子目录中是否包含 normal 和 height 目录生成ifeffect参数；
			//Y 为包含，N为不包含；
			VFS.Mount("/temp",path);
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",path);
			var normalFlag = false;  	//是否包含normal文件夹
			var heightFlag = false;		//是否包含height文件夹
			for(var i in files){
				var filename = files[i].replace("/temp/","");
				if(filename.charAt(filename.length-1) == "/"){
					filename = filename.replace("/","");
					if(filename == "normal"){
						normalFlag = true;
					}
					if(filename == "height"){
						heightFlag = true;
					}
				}
			}
			if(normalFlag && heightFlag){
				return "Y";
			}else{
				return "N";
			}
		},
		/*
			该函数为输出接口函数
		*/
		GenerateWorlds : function(){
			//批量生成world文件
			var folders = this.GetSubFolders();
			for(var i in folders){
				var folder = folders[i];
				var subFolder = this.inputPathBase + folder +"\\";
				var ifeffect = this.GenerateIfEffect(subFolder);
				var files = this.Get3dsFiles(subFolder);
				for(var j in files){
					var filename = files[j];
					var output = this.GenerateOutPath(folder,filename);
					var usePath = this.GenerateUsePath(folder,filename);
					handleOne3ds.SetParams(subFolder,output,usePath,filename,ifeffect);
					handleOne3ds.GenerateWorld();
				}
			}
		},
		GenerateCMDs : function(){
			//生成CMD数组
			var result = new Array();
			var idx = 0;
			var folders = this.GetSubFolders();
			for(var i in folders){
				var folder = folders[i];
				var subFolder = this.inputPathBase + folder +"\\";
				var ifeffect = this.GenerateIfEffect(subFolder);
				var files = this.Get3dsFiles(subFolder);
				for(var j in files){
					var filename = files[j];
					var output = this.GenerateOutPath(folder,filename);
					var usePath = this.GenerateUsePath(folder,filename);
					handleOne3ds.SetParams(subFolder,output,usePath,filename,ifeffect);
					result[idx++] = handleOne3ds.GenerateCMD();
				}
			}
			return result;
		},
		GenerateBat : function(){
			//生成批处理
			var CMDs = this.GenerateCMDs();
			var filedata = "cd /d %~dp0 \n";
			VFS.Mount("outputpath",this.outputPathBase);
			for(var i in CMDs){
				var cmd = CMDs[i];
				filedata += cmd +" \n";
			}
			var result = VFS.WriteFile("outputpath/toworld.bat",filedata);
			VFS.Unmount("outputpath",this.outputPathBase);
			if(result == true){
				alert("生成批处理成功！\n批处理的路径：" + this.outputPathBase + "toworld.bat");
			}else{
				alert("生成批处理失败！");
			}
		}
	};
}catch(e){
	alert("error:"+e);
}