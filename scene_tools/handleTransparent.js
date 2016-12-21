try{
	//给String添加replaceAll方法
	String.prototype.replaceAll = function(old_str,new_str){
		return this.replace(new RegExp(old_str,"gm"),new_str);
	}
	/*
	 *	处理模型的透明问题，处理单个texture文件
	 */
	var handleOneTexture = {
		sourceFolder : "",
		filename : "",
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetFilename : function(filename){
			this.filename = filename;
		},
		Execute : function(){
			var xml = new xmlDocument();
			VFS.Mount("source",this.sourceFolder);
			var fsource = VFS.Open("source/" + this.filename,VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var textures = library.GetChild("textures");
			var textureIter = textures.GetChildren("texture");
			while(textureIter.HasNext()){
				var texture = textureIter.Next();
				var alpha = texture.CreateChild(xml.NODE_ELEMENT);
				alpha.value = "alpha";
				var binary = alpha.CreateChild(xml.NODE_ELEMENT);
				binary.value = "binary";
			}
			var fnew = VFS.Open("source/result/" + this.filename,VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("source",this.sourceFolder);
		}
	};
	/*
	 *	处理单个material文件
	 */
	var handleOneMaterial = {
		sourceFolder : "",
		filename : "",
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetFilename : function(filename){
			this.filename = filename;
		},
		Execute : function(){
			var xml = new xmlDocument();
			VFS.Mount("source",this.sourceFolder);
			var fsource = VFS.Open("source/" + this.filename,VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var materials = library.GetChild("materials");
			var materialIter = materials.GetChildren("material");
			while(materialIter.HasNext()){
				var material = materialIter.Next();
				var shader = material.CreateChild(xml.NODE_ELEMENT);
				shader.value = "shader";
				shader.SetAttribute("type","ambient");
				var shader_text = shader.CreateChild(xml.NODE_TEXT);
				shader_text.value = "ambient";
				var shader2 = material.CreateChild(xml.NODE_ELEMENT);
				shader2.value = "shader";
				shader2.SetAttribute("type","diffuse");
				var shader2_text = shader2.CreateChild(xml.NODE_TEXT);
				shader2_text.value = "lighting_default_binalpha";
			}
			var fnew = VFS.Open("source/result/" + this.filename,VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("source",this.sourceFolder);
		}
	};
	/*
	 *	遍历文件夹同时处理texture和material文件
	 */
	var handleTransparent = {
		sourceFolder : "",
		excludeFiles : [],
		SetSourceFolder : function(path){
			if(path.charAt(path.length-1) != "/" 
				&& path.charAt(path.length-1) != "\\"){
				path += "/";
			}
			var result = path.replaceAll("/","\\");
			this.sourceFolder = result;
		},
		SetExcludeFiles : function(param){		//参数通过”,“分割
			var result = param.split(",");
			this.excludeFiles = result;
		},
		//判断是否是排除的文件
		IsExcluded : function(file){
			for(var i in this.excludeFiles){
				var excludeFile = this.excludeFiles[i];
				if(excludeFile == file){
					return true;
				}
			}
			return false;
		},
		//根据文件夹中的xml文件，返回xml文件名称的数组
		GetXMLFiles : function(path,param){
			VFS.Mount("/temp",path);
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",path);
			var file_xml = new Array();
			var idx = 0;
			for(var i in files){
				var filename = files[i].replace("/temp/","");
				var pos1 = filename.lastIndexOf(".");
				var fileType = filename.substr(pos1 + 1);
				var pos2 = filename.indexOf("_");
				var prefix = filename.substring(0,pos2);
				if(fileType.toUpperCase() == "XML" 
						&& prefix == param && !this.IsExcluded(filename)){
					file_xml[idx++] = filename;
				}
			}
			return file_xml;
		},
		Execute : function(){
			var textureFiles = this.GetXMLFiles(this.sourceFolder,"textures");
			for(var i in textureFiles){
				var textureFile = textureFiles[i];
				handleOneTexture.SetSourceFolder(this.sourceFolder);
				handleOneTexture.SetFilename(textureFile);
				handleOneTexture.Execute();
			}
			var materialFiles = this.GetXMLFiles(this.sourceFolder,"materials");
			for(var j in materialFiles){
				var materialFile = materialFiles[j];
				handleOneMaterial.SetSourceFolder(this.sourceFolder);
				handleOneMaterial.SetFilename(materialFile);
				handleOneMaterial.Execute();
			}
		}
	};
}catch(e){
	alert(e);
}