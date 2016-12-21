try{
	//给String添加replaceAll方法
	String.prototype.replaceAll = function(old_str,new_str){
		return this.replace(new RegExp(old_str,"gm"),new_str);
	}
	/*
	 *	将模型由单面处理成为双面，处理单个文件
	 */
	var handleOneFactory = {
		sourceFolder : "",				//将文件夹和文件名分开是为了方便程序中直接使用VFS挂载
		filename : "",
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetFilename : function(filename){
			this.filename = filename;
		},/*
		GetAttributeValue : function(node,attr_name){	//重写GetAttributeValue方法，做错误处理
			var attrs = node.GetAttribute();
			while(attrs.HasNext()){
				var attr = attrs.Next();
				if(attr.name == attr_name){
					return node.GetAttributeValue(attr_name);
				}
			}
			return false;
		},*/
		Execute : function(){
			var xml = new xmlDocument();
			VFS.Mount("source",this.sourceFolder);
			var fsource = VFS.Open("source/" + this.filename,VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var meshfact = library.GetChild("meshfact");
			var params = meshfact.GetChild("params");
			var tIter = params.GetChildren("t");
			while(tIter.HasNext()){
				var t = tIter.Next();
				var new_t = params.CreateChild(xml.NODE_ELEMENT,t);
				new_t.value = "t";
				/*
				var v1 = this.GetAttributeValue(t,"v1");
				var v2 = this.GetAttributeValue(t,"v2");
				var v3 = this.GetAttributeValue(t,"v3");
				if(!(v1 && v2 && v3)){
					alert("Failure to get attribute from the file ‘" + this.filename + "’！");
					VFS.Unmount("source",this.sourceFolder);
					return;
				}*/
				var v1 = t.GetAttributeValue("v1");
				var v2 = t.GetAttributeValue("v2");
				var v3 = t.GetAttributeValue("v3");
				new_t.SetAttribute("v1",v3);
				new_t.SetAttribute("v2",v2);
				new_t.SetAttribute("v3",v1);
			}
			var fnew = VFS.Open("source/result/" + this.filename,VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("source",this.sourceFolder);
		}
	};
	/*
	 *	处理文件夹中所有的文件
	 */
	var handleAllFactories = {
		sourceBaseFolder : "",		//源文件的基路径，到factories文件夹
		SetSourceBaseFolder : function(path){
			if(path.charAt(path.length-1) != "/" 
				&& path.charAt(path.length-1) != "\\"){
				path += "/";
			}
			var result = path.replaceAll("/","\\");
			this.sourceBaseFolder = result;
		},
		//获取输入根路径的子文件夹，返回文件夹名称数组
		GetSubFolders : function(){
			VFS.Mount("/temp",this.sourceBaseFolder);
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",this.sourceBaseFolder);
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
		//根据文件夹中的xml文件，返回xml文件名称的数组
		GetXMLFiles : function(path){
			VFS.Mount("/temp",path + "\\");
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",path + "\\");
			var file_xmls = new Array();
			var idx = 0;
			for(var i in files){
				var filename = files[i].replace("/temp/","");
				var pos = filename.lastIndexOf(".");
				var fileType = filename.substr(pos+1);
				if(fileType.toUpperCase() == "XML"){
					file_xmls[idx++] = filename;
				}
			}
			return file_xmls;
		},
		Execute : function(){
			var folders = this.GetSubFolders();
			for(var i in folders){
				var folder = folders[i];
				var subFolder = this.sourceBaseFolder + folder +"\\";
				handleOneFactory.SetSourceFolder(subFolder);
				var files = this.GetXMLFiles(subFolder);
				for(var j in files){
					var filename = files[j];
					handleOneFactory.SetFilename(filename);
					handleOneFactory.Execute();
				}
			}
		}
	};
}catch(e){
	alert(e);
}