try{
	//给String添加replaceAll方法
	String.prototype.replaceAll = function(old_str,new_str){
		return this.replace(new RegExp(old_str,"gm"),new_str);
	}
	/*
	 *	设置物体为无碰撞
	 */
	var handleCollision = {
		sourceFolder : "",
		SetSourceFolder : function(path){
			if(path.charAt(path.length-1) != "/" 
				&& path.charAt(path.length-1) != "\\"){
				path += "/";
			}
			var result = path.replaceAll("/","\\");
			this.sourceFolder = result;
		},
		Execute : function(){
			var xml = new xmlDocument();
			VFS.Mount("source",this.sourceFolder);
			var fsource = VFS.Open("source/world.xml",VFS.READ);
			xml.Parse(fsource);
			var library = xml.root.GetChild("library");
			var sector = library.GetChild("sector");
			var meshIter = sector.GetChildren("meshobj");
			while(meshIter.HasNext()){
				var mesh = meshIter.Next();
				var obj = mesh.GetChild("trimesh")
				if(obj == null){
					var trimesh = mesh.CreateChild(xml.NODE_ELEMENT);
					trimesh.value = "trimesh";
					var id = trimesh.CreateChild(xml.NODE_ELEMENT);
					id.value = "id";
					var id_text = id.CreateChild(xml.NODE_TEXT);
					id_text.value = "colldet";
				}
			}
			var fnew = VFS.Open("source/world.xml",VFS.WRITE);
			xml.Write(fnew);
			fnew.Flush();
			VFS.Unmount("source",this.sourceFolder);
		}
	};
}catch(e){
	alert(e);
}