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

try {

	//为路径末尾添加一个路径分割符——如果不是以分隔符结尾。
	function  AppendSeperator(path)
	{
		if(path.length == 0)
			return ((System.osName == "win32") ? "\\" : "/");

		var lastchar = path.charAt(path.length-1);
		if(lastchar != '/' && lastchar != '\\')
		{
			return path + ((System.osName == "win32") ? "\\" : "/");
		}
		return path;
	}
	
	function GetFullPath(path)
	{
		var fullpath;
		if(System.osName == "win32")
		{
			if(path.length > 2 && path[1] == ':')
			{
				fullpath = path;
			}else{
				fullpath = System.StartupPath()　+ "\\";
				fullpath += path;
			}
		}else{
			if(path[0] == '/')
			{
				fullpath = path;
			}else{
				fullpath = System.StartupPath() + "/";
				fullpath += path;
			}
		}
		return fullpath;
	}
	


	// 全局变量，方便调试。
	var CONSOLE = Registry.Get("iConsole");
	// 这里自定义一个控制台输出函数，方便使用
	// 使用时直接调用 iprint('输出结果'); 即可
	var iprint = function(msg){
		CONSOLE.WriteLine(msg);
	}

	// 加载 GUI 插件
	Plugin.Load("spp.script.gui.cegui");
	
	// 打开应用程序窗口
	Event.Send("application.open", true);

	// 加载系统中的 js 库
	require("objlayout.js");	// 这里是加载 Entity 支持库
	//require("ui.js");	// 这里加载 GUI 支持库
	
	//Mount Root路径。
	//第一个选项是从命令行的rootdir获取。
	var rootdir = CmdLine.GetOption("rootdir");
	if(rootdir)
	{
		VFS.Mount("/",AppendSeperator(GetFullPath(rootdir)));
	}else
	{//否则以当前路径为root路径。
		VFS.Mount("/",AppendSeperator(System.StartupPath()));
	}

	// 动态创建场景文件，从命令行获取
	var scenefile = "/art/world.xml";
	if(CmdLine.GetOption("scene"))
	{
		scenefile = CmdLine.GetOption("scene");
	}
	
	var bProcSuc = false;
	do{
		//场景文件不存在。
		if(!VFS.Exists(scenefile))
			break;
			
		var xml_mainworld = new xmlDocument();
		var worldfile = VFS.Open(scenefile);
		if(!worldfile)
		{
			break;
		}
		
		if(!xml_mainworld.Parse(worldfile))
		{//分析错误
			break;
		}
		
		var node_world = xml_mainworld.root.GetChild("world");
		if(!node_world)
		{
			alert('world file no world tag');
			break;
		}
		var sector_world = node_world.GetChild("sector");
		if(!sector_world)
		{
			break;
		}
		var meshobjSet = sector_world.GetChildren("meshobj");
		if(!meshobjSet)
		{//没有任何meshObjs需要显示，报错退出！
			break;
		}
		var has_mesh_camera = false;
		while(!has_mesh_camera && meshobjSet.HasNext())
		{
			var node = meshobjSet.Next();
			//FIXME: 不能用mesh_camera作为名称，采用一个超过12个字符的名称作为名称，以规避美术重复命名！
			// fixed : mesh_camera 修改为  mesh___camera
			if(node.GetAttributeValue("name") == "mesh___camera")
			{
				has_mesh_camera = true;
				break;
			}
		}
		
		if(!has_mesh_camera)
		{//未发现场景中包含一个名为mesh_camera的meshobj.从/tools/template/加载之，并加入到sector_world标签中。还需要把工厂加入到world里。
			// addMeshFact2SceneTree([0,0,0], "/tools/mesh_camera/mesh_camera.xml", "genCube__camera", "mesh___camera");
			
			sector = node_world.GetChild("sector");
			
			library = node_world.CreateChild( xmlDocument.NODE_ELEMENT, sector);
			library.value = "library";
			libraryText = library.CreateChild( xmlDocument.NODE_TEXT);
			libraryText.value = "/tools/mesh_camera/mesh_camera.xml";			
			meshobj = sector.CreateChild(xmlDocument.NODE_ELEMENT);
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
			movecv.SetAttribute("y",0);
			movecv.SetAttribute("z",0);
		}
		
		// 加载场景文件。
		if(!C3D.loader.LoadMap(node_world))
		{
			break;
		}
		
		// 这里自定义一个文件加载函数，方便使用
		var iload = function(file){
			if(!load(file)){
				alert("could not to load the file '"+file+"'!!");
			}
		} 
		// 加载逻辑相关的文件
		iload('/tools/logic/player_effect.js');
		iload('/tools/logic/player_entity.js');
		iload('/tools/logic/camera_effect.js');
		iload('/tools/logic/camera_entity.js');
		iload('/tools/logic/regulation_effect.js');
		iload('/tools/logic/regulation_entity.js');
		iCamera = Entities.CreateEntity(CAMERA); 		
		player = Entities.CreateEntity(PLAYER);
		
		iCamera.pcarray['pcdefaultcamera'].PerformAction('SetFollowEntity',['entity','iCamera']);
		iCamera.pcarray['pcdefaultcamera'].PerformAction('SetCamera',['modename','thirdperson']);
		iCamera.pcarray['pcmesh'].PerformAction('MoveMesh',['position',['0','-0.5','-1']]);		
		iCamera.pcarray['pclight'].PerformAction('SetLight',['name','Omni01']);
		
		//新增 
		engine = Registry.Get('iEngine');
		sectorlist = engine.sectors ;
		sector = sectorlist.Get(0) ;
		lightlist = sector.lights ;
		light = lightlist.Get(0);					 
		center = light.center;
		var position = iCamera.pcarray['pcmesh'].GetProperty('position');
		center.x =  position.x ;
		center.y =  position.y ;
		center.z =  position.z ; 
		light.center = center ; 
		
		/*iCamera.pcarray['pclight'].PerformAction('MoveLight',
			[
				['pos',[position.x , position.y , position.z ]],
				['sector','Scene']
			]); */
		cra = Entities.CreateEntity(CRA);
/* 		dynamic = Entities.CreateEntity(DYNAMIC); */
     	player.pcarray['pclinearmovement'].SetProperty('gravity', [0]);
		iCamera.pcarray['pclinearmovement'].SetProperty('gravity', [0]);
		
		
		
		
		g3d = Registry.Get('iGraphics3D');	
		vc = Registry.Get('iVirtualClock');
		cd = Registry.Get('iCollideSystem');
		view = new iView(engine,g3d);
		var count = Event.InstallHelper('3d',view,'frame');
		g3d.driver2d.native.SetTitle("meshview");
		loader = Registry.Get('iLoader');
		
	
		
		

		bProcSuc = true;
		}while(false);
		
		if(!bProcSuc)
		{
			alert("proc failed");
			System.Quit();
		}
		
}catch(e){
	alert('error:',e);
}
