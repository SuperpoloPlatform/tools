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

// Class SceneManage

function SceneManage(){
	this.worldFilePath =  "/art/world.xml";
	
	this.worldDom = null;
	this.worldXmlFile = null;
	this.worldNode = null;
	
	this.sector = null;
	this.meshobjSet = null;
	
	this.errorStack = new Array();
	
}

// 场景的初始化方法
SceneManage.prototype.initialize = function(){
	// 如果命令行指定了 scene 的目录
	if(CmdLine.GetOption("scene"))
	{
		this.scenefile = CmdLine.GetOption("scene");
	}
	//判断场景文件是否存在
	if(!VFS.Exists(this.worldFilePath))
	{	
		this.errorStack.push("worldFile is not found");
	}
	
	this.worldDom = new xmlDocument();
	this.worldXmlFile = VFS.Open(this.worldFilePath);
	if(!this.worldXmlFile)
	{
		this.errorStack.push("worldXmlFile error");
	}
	if(!this.worldDom.Parse(this.worldXmlFile))
	{
		this.errorStack.push("worldDom parse error");
	}

	this.worldNode= this.worldDom.root.GetChild("world");
	if(!this.worldNode)
	{
		// 没有 world 根节点
		this.errorStack.push("world node is not found");
	}
	this.sector = this.worldNode.GetChild("sector");
	if (!this.sector)
	{
		// 没有 sector
		this.errorStack.push("sector node is not found");
	}
	this.meshobjSet = this.sector.GetChildren("meshobj");
	if (!this.meshobjSet)
	{	// 没有任何meshObjs需要显示
		this.errorStack.push("meshobjSet node is not found");
	}
	
}

// 向场景中添加默认摄像机
SceneManage.prototype.setDefaultCameraMesh = function(){
	// 先判断场景中是否已经有摄像机
	var has_mesh_camera = false;
	while(!has_mesh_camera && this.meshobjSet.HasNext())
	{
		var node = this.meshobjSet.Next();
		//FIXME: 不能用mesh_camera作为名称，采用一个超过12个字符的名称作为名称，以规避美术重复命名！
		// fixed : mesh_camera 修改为  mesh___camera
		if(node.GetAttributeValue("name") == "mesh___camera")
		{
			has_mesh_camera = true;
			break;
		}
	}
	
	// 如果场景中没有设置默认摄像机，则添加
	if(!has_mesh_camera)
	{//未发现场景中包含一个名为mesh_camera的meshobj.从/tools/template/加载之，并加入到this.sector标签中。还需要把工厂加入到world里。
		// addMeshFact2SceneTree([0,0,0], "/tools/mesh_camera/mesh_camera.xml", "genCube__camera", "mesh___camera");

		library = this.worldNode.CreateChild( xmlDocument.NODE_ELEMENT, this.sector);
		library.value = "library";
		libraryText = library.CreateChild( xmlDocument.NODE_TEXT);
		libraryText.value = "/tools/mesh_camera/mesh_camera.xml";	
		
		meshobj = this.sector.CreateChild(xmlDocument.NODE_ELEMENT);
		meshobj.value = "meshobj";
		meshobj.SetAttribute("name", "mesh___camera");
		plugin = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		plugin.value = "plugin";
		tplg = plugin.CreateChild(xmlDocument.NODE_TEXT);
		tplg.value = "crystalspace.mesh.loader.genmesh";
		paramsw = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		paramsw.value = "params";
		factory = paramsw.CreateChild(xmlDocument.NODE_ELEMENT);
		factory.value = "factory";
		tfan = factory.CreateChild(xmlDocument.NODE_TEXT);
		tfan.value = "genCubeCamera";
		movew = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		movew.value = "move";
		movecv = movew.CreateChild(xmlDocument.NODE_ELEMENT);
		movecv.value = "v";
		movecv.SetAttribute("x",0);
		movecv.SetAttribute("y",1);
		movecv.SetAttribute("z",2);
	}
		
}

// 开始加载 world 
SceneManage.prototype.loadWorldNode = function(){
	// 加载场景文件。
	if( !C3D.loader.LoadMap( this.worldNode ) )
	{
		this.errorStack.push("error on loadMap!");
	}
}

// 验证 world 初始化是否成功
SceneManage.prototype.errorReport = function(){
	if(this.errorStack.length > 1){
		for(var err in this.errorStack){
			iprint(err);
		}
	}else{
		iprint("\n>> Class SceneManage is OK!");
	}
	
}

