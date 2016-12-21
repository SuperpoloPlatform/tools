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

	// 方便调试。
	var iReporter = Registry.Get("iReporter");

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
	

	// billboard必须一个font server的支持。"crystalspace.font.server.default","iFontServer"
	var fntserver = Registry.Get("iFontServer","crystalspace.font.server.default");
	// 全局变量，方便调试。
	var CONSOLE = Registry.Get("iConsole");
	// 这里自定义一个控制台输出函数，方便使用
	// 使用时直接调用 iprint('输出结果'); 即可
	var iprint = function(msg){
		CONSOLE.WriteLine(msg+"\n");
	}
	
	Plugin.Load("spp.script.cspace.core");
	
	// 加载 GUI 插件
	Plugin.Load("spp.script.gui.cegui");
	
	// 打开应用程序窗口
	Event.Send("application.open", true);
	
	// 加载系统中的 js 库
	require("objlayout.js");	// 这里是加载 Entity 支持库
	require("ui.js");	// 这里加载 GUI 支持库
	require("loader.js");	// 加载场景使用的库
	require("cursesui.js");	// 在CUI上画图用的
	
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
	
	//判断是否为多线程加载
	var isThreadedLoader = false;
	if(CmdLine.GetOption("thread")){
		var isThreadedLoader = true;
	}
	if(isThreadedLoader){
		iprint("现在是多线程加载！！！");
		// 多线程加载开始。
		Loader.Load({
			stages : [
				{
					name : "shader",
					weighing : 2, // 加载时间权重
					filename : "/art/shaderlib.xml"
				},
				{
					name : "sound",
					weighing : 10,
					filename : "/art/soundlib.xml"
				},
				{
					name : "texture",
					weighing : 40,
					filename : "/art/materials.xml"
				},
				{
					name : "material",
					weighing : 2,
					filename : "/art/materials.xml"
				},
				{
					name : "meshfact",
					weighing : 40,
					filename : "/art/factorylib.xml"
				},
				{
					name : "meshobj",
					weighing : 2,
					filename : "/art/world.xml"
				}
			],
			onprocessWorldNode : onprocessWorldNode,
			onloadend : onloadend,
			onprogress : onprogress
		});
	}else{
		iprint("现在是单线程加载！！！");
		//单线程加载
		var bProcSuc = false;
		do{
			//场景文件不存在。
			if(!VFS.Exists(scenefile))
			{
				System.exitcode = 10;
				System.exitmsg = "world not found!!";
				break;
			}
				
			var xml_mainworld = new xmlDocument();
			var worldfile = VFS.Open(scenefile);
			if(!worldfile)
			{
				System.exitcode = 11;
				System.exitmsg = "cant open world!!";
				break;
			}
			
			if(!xml_mainworld.Parse(worldfile))
			{//分析错误
				System.exitcode = 12;
				System.exitmsg = "world parse error!!";
				break;
			}
			
			var node_world = xml_mainworld.root.GetChild("world");
			if(!node_world)
			{
				alert('world file no world tag');
				break;
			}
			
			// 在加载world之前，添加woman，camera, star等mesh
			onprocessWorldNode(node_world);
			
			// 加载场景文件。
			if(!C3D.loader.LoadMap(node_world))
			{
				System.exitcode = 16;
				System.exitmsg = "failed to load world node!!";
				break;
			}
			
			// 释放内存
			C3D.engine.Prepare();
			
			//场景加载完毕
			onloadend();
				
			bProcSuc = true;
		}while(false);
		
		if(!bProcSuc)
		{
			if(System.exitcode != 0)
				alert("Error Code ", System.exitcode, " : ", System.exitmsg);
			else
				alert("proc failed");
			System.Quit();
		}
	}
	/**
	 * @brief 通过这个回调函数来往world中添加新的元素。
	 */
	//@brief 可以往`<world>`节点中添加新的节点。
	//方便viewscene工具处理。
	function onprocessWorldNode(node_world)
	{
		var sector_world = node_world.GetChild("sector");
		
		var meshobjSet = sector_world.GetChildren("meshobj");
		if(!meshobjSet)
		{//没有任何meshObjs需要显示，报错退出！
			System.exitcode = 15;
			System.exitmsg = "no meshobjs in world!!";
			return false;
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
		{
			// 未发现场景中包含一个名为mesh_camera的meshobj.从/tools/template/加载之，
			// 并加入到sector_world标签中。还需要把工厂加入到world里。
			
			System.Report("There is no mesh_camera meshobj in world.xml,",
				iReporter.DEBUG/* 4 */, "");
			System.Report("Use /tools/template instead.",
				iReporter.DEBUG/* 4 */, "");
			
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
		
		var has_mesh_star = false;
		while(!has_mesh_star && meshobjSet.HasNext())
		{
			var node2 = meshobjSet.Next();
			if(node2.GetAttributeValue("name") == "star")
			{
				has_mesh_star = true;
				break;
			}
		}
		if(!has_mesh_star)
		{
			System.Report("There is no star meshobj in world.xml,",
				iReporter.DEBUG/* 4 */, "");
			System.Report("Use /tools/template instead.",
				iReporter.DEBUG/* 4 */, "");
			
			sector2 = node_world.GetChild("sector");
			
			library2 = node_world.CreateChild( xmlDocument.NODE_ELEMENT, sector2);
			library2.value = "library";
			libraryText2 = library2.CreateChild( xmlDocument.NODE_TEXT);
			libraryText2.value = "/tools/mesh_camera/world_star.xml";
			
			meshobj2 = sector2.CreateChild(xmlDocument.NODE_ELEMENT);
			meshobj2.value = "meshobj";
			meshobj2.SetAttribute("name", "star");
			plugin2 = meshobj2.CreateChild(xmlDocument.NODE_ELEMENT);
			plugin2.value = "plugin";
			tplg2 = plugin2.CreateChild(xmlDocument.NODE_TEXT);
			tplg2.value = "crystalspace.mesh.loader.genmesh";
			paramsw2 = meshobj2.CreateChild(xmlDocument.NODE_ELEMENT);
			paramsw2.value = "params";
			factory2 = paramsw2.CreateChild(xmlDocument.NODE_ELEMENT);
			factory2.value = "factory";
			tfan2 = factory2.CreateChild(xmlDocument.NODE_TEXT);
			tfan2.value = "star_mesh_Plane02_31";
			movew2 = meshobj2.CreateChild(xmlDocument.NODE_ELEMENT);
			movew2.value = "move";
			movecv2 = movew2.CreateChild(xmlDocument.NODE_ELEMENT);
			movecv2.value = "v";
			movecv2.SetAttribute("x",0);
			movecv2.SetAttribute("y",0);
			movecv2.SetAttribute("z",0);
		}
		
		var has_mesh_woman = false;
		while(!has_mesh_woman && meshobjSet.HasNext())
		{
			var node3 = meshobjSet.Next();
			if(node3.GetAttributeValue("name") == "woman")
			{
				has_mesh_woman = true;
				break;
			}
		}
		if(!has_mesh_woman)
		{
			System.Report("There is no woman meshobj in world.xml,",
				iReporter.DEBUG/* 4 */, "");
			System.Report("Use /tools/template instead.",
				iReporter.DEBUG/* 4 */, "");
			
			sector3 = node_world.GetChild("sector");
			
			library3 = node_world.CreateChild( xmlDocument.NODE_ELEMENT, sector3);
			library3.value = "library";
			libraryText3 = library3.CreateChild( xmlDocument.NODE_TEXT);
			libraryText3.value = "/tools/mesh_camera/world_woman.xml";
			
			meshobj3 = sector3.CreateChild(xmlDocument.NODE_ELEMENT);
			meshobj3.value = "meshobj";
			meshobj3.SetAttribute("name", "woman");
			plugin3 = meshobj3.CreateChild(xmlDocument.NODE_ELEMENT);
			plugin3.value = "plugin";
			tplg3 = plugin3.CreateChild(xmlDocument.NODE_TEXT);
			tplg3.value = "crystalspace.mesh.loader.sprite.cal3d";
			paramsw3 = meshobj3.CreateChild(xmlDocument.NODE_ELEMENT);
			paramsw3.value = "params";
			factory3 = paramsw3.CreateChild(xmlDocument.NODE_ELEMENT);
			factory3.value = "factory";
			tfan3 = factory3.CreateChild(xmlDocument.NODE_TEXT);
			tfan3.value = "woman";
			movew3 = meshobj3.CreateChild(xmlDocument.NODE_ELEMENT);
			movew3.value = "move";
			movecv3 = movew3.CreateChild(xmlDocument.NODE_ELEMENT);
			movecv3.value = "v";
			movecv3.SetAttribute("x",0);
			movecv3.SetAttribute("y",0);
			movecv3.SetAttribute("z",0);
		}
		
		var sector_world = node_world.GetChild("sector");
		if(!sector_world)
		{
			System.exitcode = 14;
			System.exitmsg = "no sectors in world!!";
			return false;
		}
		var meshobjSet = sector_world.GetChildren("meshobj");
		if(!meshobjSet)
		{//没有任何meshObjs需要显示，报错退出！
			System.exitcode = 15;
			System.exitmsg = "no meshobjs in world!!";
			return false;
		}
	}
	
	///@brief 通过这个函数可以获得进度信息
	function onprogress(pe)
	{
		//以滚动条方式显示进度。
		CursesUI.ProgressBar(pe.total, pe.loaded);
	}
	
	///@brief 场景加载结束之后调用这些处理
	function onloadend()
	{
		// 这里自定义一个文件加载函数，方便使用
		var iload = function(file){
			if(!load(file)){
				alert("could not to load the file '"+file+"'!!");
			}
		}
		
		// 加载逻辑相关的文件
		iload('/tools/logic/logic_index.js');
				
		// 加载UI相关的文件
		iload('/tools/ui/ui.scheme.js');
		
		iload('/tools/ui/ui_position.js');
		
		if(!MINI_MAP){
			alert("ui_position.js is not found ！");
			return ;
		}
		iload('/tools/ui/zhucaidan.layout.js');
		// 创建GUI所需要的scheme和字体，通常文件名为 ui.scheme.js ，其中的对象名为 UIDATA;
		//创建kuaisudingwei_bg的imageset文件
		GUI.Imagesets.CreateImageset("kuaisudingwei","/tools/ui/data/kuaisudingwei_bg.jpg");
		GUI.CreateObjectScheme(UIDATA,"/tools/ui/data"); 
		GUI.CreateObjectLayout(ZHUCAIDAN_LAYOUT,"/tools/ui/data");
		iload('/tools/ui/ui_function.js');
		
		if(!FUNCTION_DATA){
			alert("ui_function.js is not found ！");
			return ;
		}
		
		//下面这个方式，通过传入一个对象来初始化。这里我们以JSON格式来定义这个初始化对象。（比如`PLAYER`）
		//这个对象可以被保存在文件中，可以动态加载，加载进来就可以定义若干entity.
		//这里的entity你可以随意添加属性，就是普通的js对象！
		//我们的编辑器将会编辑产生一个entity def json，加载进来就是Entities.CreateEntity中的参数。
		
		iCamera = Entities.CreateEntity(CAMERA); 
		player = Entities.CreateEntity(PLAYER);	
		cra = Entities.CreateEntity(CRA);
		
		iCamera.pcarray["pcdefaultcamera"].PerformAction("SetFollowEntity",['entity','player']);
		iCamera.pcarray["pccommandinput"].PerformAction("Activate", ['activate', false]);
		iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','thirdperson']);
		iCamera.pcarray["pcdefaultcamera"].SetProperty("distance", 3.2);
		iCamera.pcarray["pcdefaultcamera"].SetProperty("pitch", -0.069999957);
		player.pcarray['pclinearmovement'].SetProperty('gravity', 19.6);
		iCamera.pcarray['pclinearmovement'].SetProperty('gravity', 19.6);
		
		player.pcarray['pcmesh'].PerformAction(
					'MoveMesh', [
						'position', [
							128.75909423828125,1,-332.356781005859
						]
					]
				);
		
		
		// 获得 3D 支持，渲染场景。
		engine = Registry.Get('iEngine');
		g3d = Registry.Get('iGraphics3D');
		var count = Event.InstallHelper('3d','frame');
			
		
		var sec = engine.sectors.Get(0);
		if(sec)
		{
			var max = sec.meshes.count;
			for(var i = 0; i < max;i++)
			{
				var meshwrapper = sec.meshes.Get(i);
				if(meshwrapper)
				{
					// alert('begin mesh ',meshwrapper.object.name);
					var ok = C3D.colsys.InitializeCollision(meshwrapper);
					// alert('end ',ok);
				}
			}
		}
		
		// alert('begin lighting....');
		// engine.ShineLight(sec);
		// alert('end');
		
		iprint('W S A D : 前 后 左转 右转');
		iprint('Q E T G: 左 右 上 下');
		iprint('R F : 向上看 向下看');
		iprint('1 2 3 4 5 : 改变速度');
		iprint('Z : 打印坐标');
		iprint('Tab : 切换视角');
		iprint('N : 切换重力模式并回到原点,有角色代表有重力,无角色则无动力');
		iprint('M : 打开/退出沙盘模式');
		iprint('X : 切换查看方式，漫游方式和鼠标拖拽自由视角控制方式' + '\n');
		iprint('鼠标拖拽自由视角 控制方式时 ： ');
		iprint('按住鼠标左键不放，滑动鼠标进行自由视角控制');
		iprint('滚轮向前 ： 拉近摄像机距离');
		iprint('滚轮向后 ： 拉远摄像机距离');
	}
}catch(e){
	alert('error:',e);
}