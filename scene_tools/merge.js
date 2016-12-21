try{
	//给String添加replaceAll方法
	String.prototype.replaceAll = function(old_str,new_str){
		return this.replace(new RegExp(old_str,"gm"),new_str);
	}
	/*
	 *复制节点的方法，可同时复制其子节点
	 */
	function CloneNode(thisNode,node){
		var xml = new xmlDocument();
		//复制节点名称
		if(node.value){
			thisNode.value = node.value;
		}else{
			return;
		}
		//复制属性
		var attrs = node.GetAttribute();
		while(attrs.HasNext()){
			var attr = attrs.Next();
			thisNode.SetAttribute(attr.name,attr.value);
		}
		//复制节点值
		if(node.contentsValue){
			var thisContent = thisNode.CreateChild(xml.NODE_TEXT);
			thisContent.value = node.contentsValue;
		}else{
			//递归复制子节点，如果存在content，那就不会再有子节点
			//由于content也会被GetChildren方法获取，不做判断会把content当成节点加进去
			var children = node.GetChildren();
			while(children.HasNext()){
				var child = children.Next();
				var thisChild = thisNode.CreateChild(xml.NODE_ELEMENT);
				CloneNode(thisChild,child);
			}
		}
	};
	/*
	 *	给一个目录创建子目录
	 */
	function CreateSubFolder(path,subFolder){
		VFS.Mount("temp",path);
		if(!VFS.Exists("temp/" + subFolder)){
			VFS.WriteFile("temp/" + subFolder + "/","");
		}
		VFS.Unmount("temp",path);
	};
	/*
	 *	合并贴图
	 */
	var mergeTexture = {
		sourceFolder : "",		//源world文件的路径
		targetFolder : "",		//目标文件夹，到/textures/目录下
		name : "",				//根据该参数生成数据文件夹名和文件名
		currentNodes : [], 		//用于存放文件中当前含有的texture节点的name属性值
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetTargetFolder : function(path){
			this.targetFolder = path;
		},
		SetName : function(path){
			this.name = path;
		},
		//生成dataFolder的目录名称
		GenerateDataFolder : function(){
			return this.name;
		},
		//生成目标文件的文件名称
		GenerateFilename : function(){
			return "textures_" + this.name + ".xml";
		},
		//遍历目标文件，初始化currentNodes数组，如果目标文件不存在则写入基本内容
		InitCurrentNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_init",this.targetFolder);
			if(VFS.Exists("target_init/" + this.GenerateFilename())){
				var ftarget = VFS.Open("target_init/" + this.GenerateFilename(),VFS.READ);
				xml.Parse(ftarget);
				var library = xml.root.GetChild("library");
				var textures = library.GetChild("textures");
				var textureIter = textures.GetChildren("texture");
				while(textureIter.HasNext()){
					var texture = textureIter.Next();
					var attr_name = texture.GetAttributeValue("name");
					var length = this.currentNodes.length;
					this.currentNodes[length] = attr_name;
				}
			}else{
				var filedata = '<?xml version="1.0" encoding="UTF-8" ?> \n';
				filedata += '<library> \n';
				filedata += '	<textures> \n';
				filedata += '	</textures> \n';
				filedata += '</library>';
				VFS.WriteFile("target_init/" + this.GenerateFilename(),filedata);
				//清空currentNodes数组，防止上次执行数据的干扰
				this.currentNodes = [];
			}
			VFS.Unmount("target_init",this.targetFolder);
		},
		//将资源文件拷贝到目录下
		CopyFile : function(filename){
			VFS.Mount("source_copy",this.sourceFolder);
			VFS.Mount("target_copy",this.targetFolder);
			if(!VFS.Exists("target_copy/" + this.GenerateDataFolder())){
				VFS.WriteFile("target_copy/" + this.GenerateDataFolder() + "/","");
			}
			VFS.Copy("source_copy/textures/" + filename,"target_copy/" + this.GenerateDataFolder() + "/" + filename);
			VFS.Unmount("target_copy",this.targetFolder);
			VFS.Unmount("source_copy",this.sourceFolder);
		},
		//判断是否已经存在该节点，true存在，false不存在，根据节点的name属性判断
		HasNode : function(attr_name){
			for(var i in this.currentNodes){
				var temp_name = this.currentNodes[i];
				if(temp_name == attr_name){
					return true;
				}
			}
			//不存在时，将节点的name属性值放入数组中
			var length = this.currentNodes.length;
			this.currentNodes[length] = attr_name;
			//复制资源文件
			this.CopyFile(attr_name);
			return false;
		},
		//从源文件中获得Texture节点，返回类型为nodeiterator
		GetTextureNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("source_get",this.sourceFolder);
			var fsource = VFS.Open("source_get/world.xml",VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var textures = library.GetChild("textures");
			var textureIter = textures.GetChildren("texture");
			VFS.Unmount("source_get",this.sourceFolder);
			return textureIter;
		},
		//给目标文件添加Texture节点
		AddTextureNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_add",this.targetFolder);
			var ftarget = VFS.Open("target_add/" + this.GenerateFilename(),VFS.READ);
			xml.Parse(ftarget);
			//添加节点
			var library = xml.root.GetChild("library");
			var textures = library.GetChild("textures");
			var textureIter = this.GetTextureNodes();
			while(textureIter.HasNext()){
				var texture = textureIter.Next();
				var attr_name = texture.GetAttributeValue("name");
				if(!this.HasNode(attr_name)){
					var new_texture = textures.CreateChild(xml.NODE_ELEMENT);
					CloneNode(new_texture,texture);
				}
			}
			//将操作后的信息写入文件
			var fnew = VFS.Open("target_add/" + this.GenerateFilename(),VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("target_add",this.targetFolder);
		},
		//更改贴图的资源路径
		ReplacePath : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_rep",this.targetFolder);
			ftarget = VFS.Open("target_rep/" + this.GenerateFilename(),VFS.READ);
			xml.Parse(ftarget);
			var library = xml.root.GetChild("library");
			var textures = library.GetChild("textures");
			var textureIter = textures.GetChildren("texture");
			while(textureIter.HasNext()){
				var texture = textureIter.Next();
				var file = texture.GetChild("file");
				var path = file.contentsValue;
				var pos = path.lastIndexOf("/");
				var filename = path.substr(pos+1);
				file.GetChildren().Next().value = "/art/textures/" + this.GenerateDataFolder() + "/" + filename;
			}
			//将操作后的信息写入文件
			var fnew = VFS.Open("target_rep/" + this.GenerateFilename(),VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("target_rep",this.targetFolder);
		},
		//执行贴图合并
		Execute : function(){
			this.InitCurrentNodes();
			this.AddTextureNodes();
			this.ReplacePath();
		}
	};
	/*
	 *	合并材质
	 */
	var mergeMaterial = {
		sourceFolder : "",		//源world文件的路径
		targetFolder : "",		//目标文件夹，到/textures/目录下
		name : "",				//根据该参数生成数据文件夹名和文件名
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetTargetFolder : function(path){
			this.targetFolder = path;
		},
		SetName : function(path){
			this.name = path;
		},
		//生成目标文件的文件名称
		GenerateFilename : function(){
			return "materials_" + this.name + ".xml";
		},
		//如果目标文件不存在则写入基本内容
		WriteBase : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_base",this.targetFolder);
			if(!VFS.Exists("target_base/" + this.GenerateFilename())){
				var filedata = '<?xml version="1.0" encoding="UTF-8" ?> \n';
				filedata += '<library> \n';
				filedata += '	<materials> \n';
				filedata += '	</materials> \n';
				filedata += '</library>';
				VFS.WriteFile("target_base/" + this.GenerateFilename(),filedata);
			}
			VFS.Unmount("target_base",this.targetFolder);
		},
		//从源文件中获得material节点，返回类型为nodeiterator
		GetMaterialNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("source_get",this.sourceFolder);
			var fsource = VFS.Open("source_get/world.xml",VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var materials = library.GetChild("materials");
			var materialIter = materials.GetChildren("material");
			VFS.Unmount("source_get",this.sourceFolder);
			return materialIter;
		},
		//给目标文件添加material节点
		AddMaterialNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_add",this.targetFolder);
			var ftarget = VFS.Open("target_add/" + this.GenerateFilename(),VFS.READ);
			xml.Parse(ftarget);
			//添加节点
			var library = xml.root.GetChild("library");
			var materials = library.GetChild("materials");
			var materialIter = this.GetMaterialNodes();
			while(materialIter.HasNext()){
				var material = materialIter.Next();
				var new_material = materials.CreateChild(xml.NODE_ELEMENT);
				CloneNode(new_material,material);
			}
			//将操作后的信息写入文件
			var fnew = VFS.Open("target_add/" + this.GenerateFilename(),VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("target_add",this.targetFolder);
		},
		//执行材质合并
		Execute : function(){
			this.WriteBase();
			this.AddMaterialNodes();
		}
	};
	/*
	 *	合并模型工厂
	 */
	var mergeFactory = {
		sourceFolder : "",		//源world文件的路径
		targetFolder : "",		//目标文件夹，到/factories/目录下
		name : "",				//根据该参数生成数据文件夹名和文件名
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetTargetFolder : function(path){
			this.targetFolder = path;
		},
		SetName : function(path){
			this.name = path;
		},
		//生成dataFolder的目录名称
		GenerateDataFolder : function(){
			return this.name;
		},
		//生成目标文件的文件名称
		GenerateFilename : function(){
			return "factories_" + this.name + ".xml";
		},
		//如果目标文件不存在则写入基本内容
		WriteBase : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_base",this.targetFolder);
			if(!VFS.Exists("target_base/" + this.GenerateFilename())){
				var filedata = '<?xml version="1.0" encoding="UTF-8" ?> \n';
				filedata += '<library> \n';
				filedata += '</library>';
				VFS.WriteFile("target_base/" + this.GenerateFilename(),filedata);
			}
			VFS.Unmount("target_base",this.targetFolder);
		},
		//将所有工厂模型文件拷贝到目标目录下
		CopyFile : function(){
			VFS.Mount("source_copy",this.sourceFolder);
			VFS.Mount("target_copy",this.targetFolder);
			//目录不存在则创建目录
			if(!VFS.Exists("target_copy/" + this.GenerateDataFolder())){
				VFS.WriteFile("target_copy/" + this.GenerateDataFolder() + "/","");
			}
			var files = VFS.FindFiles("source_copy/factories/");
			for(var i in files){
				var filename = files[i].replace("source_copy/factories/","");
				var pos = filename.lastIndexOf(".");
				var fileType = filename.substr(pos+1);
				if(fileType.toUpperCase() == "XML"){
					VFS.Copy("source_copy/factories/" + filename,"target_copy/" + this.GenerateDataFolder() + "/" + filename);
				}
			}
			VFS.Unmount("target_copy",this.targetFolder);
			VFS.Unmount("source_copy",this.sourceFolder);
		},
		//从源文件中获得library标签，返回nodeiterator
		GetLibraryNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("source_get",this.sourceFolder);
			var fsource = VFS.Open("source_get/world.xml",VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var libraryIter = library.GetChildren("library");
			VFS.Unmount("source_get",this.sourceFolder);
			return libraryIter;
		},
		//给目标文件添加library标签
		AddLibraryNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_add",this.targetFolder);
			var ftarget = VFS.Open("target_add/" + this.GenerateFilename(),VFS.READ);
			xml.Parse(ftarget);
			//添加节点
			var library_root = xml.root.GetChild("library");
			var libraryIter = this.GetLibraryNodes();
			while(libraryIter.HasNext()){
				var library = libraryIter.Next();
				var new_library = library_root.CreateChild(xml.NODE_ELEMENT);
				CloneNode(new_library,library);
			}
			//将操作后的信息写入文件
			var fnew = VFS.Open("target_add/" + this.GenerateFilename(),VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("target_add",this.targetFolder);
		},
		//更改贴图的资源路径
		ReplacePath : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_rep",this.targetFolder);
			ftarget = VFS.Open("target_rep/" + this.GenerateFilename(),VFS.READ);
			xml.Parse(ftarget);
			var library_root = xml.root.GetChild("library");
			var libraryIter = library_root.GetChildren("library");
			while(libraryIter.HasNext()){
				var library = libraryIter.Next();
				var path = library.contentsValue;
				var pos = path.lastIndexOf("/");
				var filename = path.substr(pos+1);
				library.GetChildren().Next().value = "/art/factories/" + this.GenerateDataFolder() + "/" + filename;
			}
			//将操作后的信息写入文件
			var fnew = VFS.Open("target_rep/" + this.GenerateFilename(),VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("target_rep",this.targetFolder);
		},
		//执行工厂模型合并
		Execute : function(){
			this.WriteBase();
			this.CopyFile();
			this.AddLibraryNodes();
			this.ReplacePath();
		}
	};
	/*
	 *	合并meshobj
	 */
	var mergeMesh = {
		sourceFolder : "",		//源world文件的路径
		targetFolder : "",		//目标总world文件路径
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetTargetFolder : function(path){
			this.targetFolder = path;
		},
		//从源world文件中获取meshobj节点，返回类型为nodeiterator
		GetMeshNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("source_get",this.sourceFolder);
			var fsource = VFS.Open("source_get/world.xml",VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var sector = library.GetChild("sector");
			var meshIter = sector.GetChildren("meshobj");
			VFS.Unmount("source_get",this.sourceFolder);
			return meshIter;
		},
		//给目标文件添加meshobj
		AddMeshNodes : function(){
			var xml = new xmlDocument();
			VFS.Mount("target_add",this.targetFolder);
			var ftarget = VFS.Open("target_add/world.xml",VFS.READ);
			xml.Parse(ftarget);
			//添加节点
			var world = xml.root.GetChild("world");
			var sector = world.GetChild("sector");
			var meshIter = this.GetMeshNodes();
			while(meshIter.HasNext()){
				var mesh = meshIter.Next();
				var new_mesh = sector.CreateChild(xml.NODE_ELEMENT);
				CloneNode(new_mesh,mesh);
			}
			//将操作后的信息写入文件
			var fnew = VFS.Open("target_add/world.xml",VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("target_add",this.targetFolder);
		},
		//执行meshobj合并
		Execute : function(){
			this.AddMeshNodes();
		}
	};
	/*
	 *	合并整个world文件
	 */
	var mergeOneWorld = {
		sourceFolder : "",		//源world文件的路径
		targetFolder : "",		//目标总world文件的路径
		data : [				//前面存放的是art目录下的含有xml文件的子目录名称，后面是xml文件名称的前缀
			["textures","textures"],
			["textures","materials"],
			["factories","factories"],
			["models","world"]
		],
		SetSourceFolder : function(path){
			this.sourceFolder = path;
		},
		SetTargetFolder : function(path){
			this.targetFolder = path;
		},
		//根据源world文件目录的名称生成name参数
		GenerateName : function(){
			var length = this.sourceFolder.length;
			var pos1 = this.sourceFolder.lastIndexOf("\\",length - 2);
			var subFolder = this.sourceFolder.substring(pos1+1,length-1);
			var pos2 = subFolder.indexOf("_");
			var name;
			if(pos2 != -1){
				name = subFolder.substring(0,pos2);
			}else{
				name = subFolder;
			}
			return name;
		},
		//根据文件夹中的xml文件，返回xml文件名称的数组
		GetXMLFiles : function(path,param){
			VFS.Mount("/temp",path + "\\");
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",path + "\\");
			var file_xml = new Array();
			var idx = 0;
			for(var i in files){
				var filename = files[i].replace("/temp/","");
				var pos1 = filename.lastIndexOf(".");
				var fileType = filename.substr(pos1 + 1);
				var pos2 = filename.indexOf("_");
				var prefix = filename.substring(0,pos2);
				if(fileType.toUpperCase() == "XML" && prefix == param){
					file_xml[idx++] = filename;
				}
			}
			return file_xml;
		},
		//给目标文件添加library节点
		AddLibPath : function(){
			var xml = new xmlDocument();
			VFS.Mount("target",this.targetFolder);
			var ftarget = VFS.Open("target/world.xml", VFS.READ);
			xml.Parse(ftarget);
			//添加library
			var world = xml.root.GetChild("world");
			//清空目标总world文件中library标签
			world.RemoveChildren(world.GetChildren("library"));
			//遍历目录添加节点
			var sector = world.GetChild("sector");
			var folders = this.data;
			for(var i in folders){
				var path = this.targetFolder + folders[i][0];
				var names = this.GetXMLFiles(path,folders[i][1]);
				for(var j in names){
					var node = world.CreateChild(xml.NODE_ELEMENT,sector);
					node.value = "library";
					var node_text = node.CreateChild(xml.NODE_TEXT);
					node_text.value = "/art/" + folders[i][0] + "/" + names[j];
				}
			}
			//写入world
			var fnew = VFS.Open("target/world.xml", VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("target",this.targetFolder);
		},
		
		Execute : function(){
			CreateSubFolder(this.targetFolder,"textures");
			CreateSubFolder(this.targetFolder,"factories");
			//1. 合并贴图
			mergeTexture.SetSourceFolder(this.sourceFolder);
			mergeTexture.SetTargetFolder(this.targetFolder + "textures\\");
			mergeTexture.SetName(this.GenerateName());
			mergeTexture.Execute();
			//2. 合并材质
			mergeMaterial.SetSourceFolder(this.sourceFolder);
			mergeMaterial.SetTargetFolder(this.targetFolder + "textures\\");
			mergeMaterial.SetName(this.GenerateName());
			mergeMaterial.Execute();
			//3. 合并模型工厂
			mergeFactory.SetSourceFolder(this.sourceFolder);
			mergeFactory.SetTargetFolder(this.targetFolder + "factories\\");
			mergeFactory.SetName(this.GenerateName());
			mergeFactory.Execute();
			//4. 合并meshobj
			mergeMesh.SetSourceFolder(this.sourceFolder);
			mergeMesh.SetTargetFolder(this.targetFolder);
			mergeMesh.Execute();
			//5. 将贴图、材质、工厂的xml文件通过library标签加入到总world文件里
			this.AddLibPath();
		}
	};
	/*
	 *	批量合并world
	 */
	var mergeAllWorlds = {
		sourceFolder : "",		//源world文件所在目录，从ui中获得
		targetFolder : "",		//存放总world的目标文件夹，到/art/目录下，从ui中获得
		SetSourceFolder : function(path){
			//从ui中获取源文件夹，做一定处理后，赋值给sourceFolder
			if(path.charAt(path.length-1) != "/" 
				&& path.charAt(path.length-1) != "\\"){
				path += "/";
			}
			var result = path.replaceAll("/","\\");
			this.sourceFolder = result;
		},
		SetTargetFolder : function(path){
			if(path.charAt(path.length-1) != "/" 
				&& path.charAt(path.length-1) != "\\"){
				path += "/";
			}
			var result = path.replaceAll("/","\\");
			this.targetFolder = result;
		},
		//遍历源文件夹，返回该文件夹中的所有子文件夹，类型为字符串数组
		GetSubFolders : function(){
			VFS.Mount("/temp",this.sourceFolder);
			var files = VFS.FindFiles("/temp/");
			VFS.Unmount("/temp",this.sourceFolder);
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
		Execute : function(){
			//将参数传给mergeOneWorld，调用其Execute方法
			var folders = this.GetSubFolders();
			mergeOneWorld.SetTargetFolder(this.targetFolder);
			for(var i in folders){
				var folder = folders[i];
				var sourcePath = this.sourceFolder + folder + "\\";
				mergeOneWorld.SetSourceFolder(sourcePath);
				mergeOneWorld.Execute();
			}
		}
	};
}catch(e){
	alert(e);
}
