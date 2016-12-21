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

	/*	获取程序开始运行时的系统时间	*/
	var startTime = new Date().getTime();

	// 加载必备的js lib.
	require("console.js");
	require("s3dcore.js");
	require("meshgen.js"); //引入 meshgen文件
	
	function getMeshobj(node_world){
		var sector_world = node_world.GetChild("sector");
		if(!sector_world)
		{
			System.exitcode = 14;
			System.exitmsg = "no sectors in world!!";
			return false;
		}
		
		//console.debug("Getting <meshobj> node array : " + node);
		
		var meshobjSet = sector_world.GetChildren("meshobj");
		if(!meshobjSet)
		{//没有任何meshObjs需要显示，报错退出！
			System.exitcode = 15;
			System.exitmsg = "no meshobjs in world!!";
			return false;
		}
		
		console.debug("Finding the mesh which camera sets to.");
		
		return meshobjSet;
	}
	
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
	
	/**
	 * @brief 添加一个mesh到场景中。camera entity会绑定在这个mesh上。
	 */
	function addCameraMesh(world_node)
	{
		var sector = world_node.GetChild("sector");
		
		var library = world_node.CreateChild( xmlDocument.NODE_ELEMENT, sector);
		library.value = "library";
		var libraryText = library.CreateChild( xmlDocument.NODE_TEXT);
		libraryText.value = "/tools/mesh_camera/mesh_camera.xml";
		
		///@fixme 这里没有判断scene中已经存在`mesh___camera`同名的mesh了
		///所以是一个安全隐患。
		var meshobj = sector.CreateChild(xmlDocument.NODE_ELEMENT);
		meshobj.value = "meshobj";
		meshobj.SetAttribute("name", "mesh___camera");
		var plugin = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		plugin.value = "plugin";
		var tplg = plugin.CreateChild(xmlDocument.NODE_TEXT);
		tplg.value = "crystalspace.mesh.loader.genmesh";
		var paramsw = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		paramsw.value = "params";
		var factory = paramsw.CreateChild(xmlDocument.NODE_ELEMENT);
		factory.value = "factory";
		var tfan = factory.CreateChild(xmlDocument.NODE_TEXT);
		tfan.value = "genCubeCamera";
		var movew = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		movew.value = "move";
		var movecv = movew.CreateChild(xmlDocument.NODE_ELEMENT);
		movecv.value = "v";
		movecv.SetAttribute("x",0);
		movecv.SetAttribute("y",0);
		movecv.SetAttribute("z",0);
		
		return world_node;
	}
	/**
	 * @brief 添加一个woman mesh到场景中  扈亚楠
	 */
	function addWomanMesh(world_node)
	{
			//通过xml解析world.xml文件中的woman的初始坐标赋值给mesh_woman @huyanan 2012-07-03
		var x = 0;
		var y = 10;
		var z = 0;
		var worldMeshobj = getMeshobj(world_node);
		
		while(worldMeshobj.HasNext()){
			var node = worldMeshobj.Next();
		
			if(node.GetAttributeValue("name") == "woman"){
				var v = node.GetChild("move").GetChild("v");
				x = v.GetAttributeValue("x");
				y = v.GetAttributeValue("y");
				z = v.GetAttributeValue("z");	
			}
		}
		//@huyanan 2012-07-03 
		var sector = world_node.GetChild("sector");
		
		var library = world_node.CreateChild( xmlDocument.NODE_ELEMENT, sector);
		library.value = "library";
		var libraryText = library.CreateChild( xmlDocument.NODE_TEXT);
		libraryText.value = "/tools/mesh_woman/world_woman.xml";
		
		///@fixme 这里没有判断scene中已经存在`mesh___woman`同名的mesh了
		///所以是一个安全隐患。
		var meshobj = sector.CreateChild(xmlDocument.NODE_ELEMENT);
		meshobj.value = "meshobj";
		meshobj.SetAttribute("name", "mesh___woman");
		var priority = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		priority.value = "priority";
		var portal = priority.CreateChild(xmlDocument.NODE_TEXT);
		portal.value = "portal";
		var plugin = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		plugin.value = "plugin";
		var tplg = plugin.CreateChild(xmlDocument.NODE_TEXT);
		tplg.value = "crystalspace.mesh.loader.sprite.cal3d";
		var paramsw = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		paramsw.value = "params";
		var factory = paramsw.CreateChild(xmlDocument.NODE_ELEMENT);
		factory.value = "factory";
		var tfan = factory.CreateChild(xmlDocument.NODE_TEXT);
		tfan.value = "woman";
		var movew = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		movew.value = "move";
		var movecv = movew.CreateChild(xmlDocument.NODE_ELEMENT);
		movecv.value = "v";
//坐标改成world文件中woman的初始坐标，初始坐标一定要设定好，否则人物会出现在奇怪的地方
		movecv.SetAttribute("x", x);
		movecv.SetAttribute("y", y);
		movecv.SetAttribute("z", z);

		return world_node;
	}
	
	function addCubeMesh(world_node)
	{
		//通过xml解析world.xml文件中的cube的初始坐标赋值给mesh_cube @zhangzelong 2012/07/26
		var x = 1;
		var y = 1;
		var z = 1;
		var worldMeshobj = getMeshobj(world_node);
		
		while(worldMeshobj.HasNext()){
			var node = worldMeshobj.Next();
		
			if(node.GetAttributeValue("name") == "cube"){
				var v = node.GetChild("move").GetChild("v");
				x = v.GetAttributeValue("x");
				y = v.GetAttributeValue("y");
				z = v.GetAttributeValue("z");	
			}
		}
		//读取world.xml文件
		var sector = world_node.GetChild("sector");
		
		var library = world_node.CreateChild( xmlDocument.NODE_ELEMENT, sector);
		library.value = "library";
		var libraryText = library.CreateChild( xmlDocument.NODE_TEXT);
		libraryText.value = "/tools/mesh_cube/cube.xml";
		
		//@fixme 这里没有判断scene中已经存在`cube#01`同名的mesh了
		//所以是一个安全隐患。
		var meshobj = sector.CreateChild(xmlDocument.NODE_ELEMENT);
		meshobj.value = "meshobj";
		meshobj.SetAttribute("name", "cube#01");
		var priority = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		priority.value = "priority";
		var portal = priority.CreateChild(xmlDocument.NODE_TEXT);
		portal.value = "portal";
		var plugin = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		plugin.value = "plugin";
		var tplg = plugin.CreateChild(xmlDocument.NODE_TEXT);
		tplg.value = "crystalspace.mesh.loader.sprite.cal3d";
		var paramsw = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		paramsw.value = "params";
		var factory = paramsw.CreateChild(xmlDocument.NODE_ELEMENT);
		factory.value = "factory";
		var tfan = factory.CreateChild(xmlDocument.NODE_TEXT);
		tfan.value = "cube";
		var movew = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		movew.value = "move";
		var movecv = movew.CreateChild(xmlDocument.NODE_ELEMENT);
		movecv.value = "v";
		movecv.SetAttribute("x", x);
		movecv.SetAttribute("y", y);
		movecv.SetAttribute("z", z);

		return world_node;
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
		
		console.debug("Finding the mesh which camera sets to.");
		
		var has_mesh_camera = false;
		//声明woman的存在变量  扈亚楠
		var has_mesh_woman = false;
		var has_mesh_cube = false;
		while(!has_mesh_woman && !has_mesh_camera && meshobjSet.HasNext())//这里添加了!has_mesh_woman扈亚楠
		{
			var node = meshobjSet.Next();
			
			//FIXME: 不能用mesh_camera作为名称，采用一个超过12个字符的名称作为名称，以规避美术重复命名！
			// fixed : mesh_camera 修改为  mesh___camera
			if(node.GetAttributeValue("name") == "mesh___camera")
			{
				has_mesh_camera = true;
				return false;
			}
			//判断woman是否存在  扈亚楠
			if(node.GetAttributeValue("name") == "mesh___woman")
			{
				has_mesh_woman = true;
				return false;
			}			
			
			if(node.GetAttributeValue("name") == "cube#01")
			{
				has_mesh_cube = true;
				return false;
			}
		}
		
		if(!SceneTree.isCameraExist() && !has_mesh_camera && !has_mesh_woman && !has_mesh_cube)
		{
			// 在已经加载的scene中没有找到camera，而且
			// 在当前正打算加载的场景中没有包含一个名为mesh_camera的meshobj.从/tools/template/加载之，
			// 并加入到sector_world标签中。还需要把工厂加入到world里。
			
			console.debug("There is no mesh_camera meshobj in world.xml,");
			console.debug("Use /tools/template instead.");
			
			// addMeshFact2SceneTree([0,0,0], "/tools/mesh_camera/mesh_camera.xml", "genCube__camera", "mesh___camera");
			
			node_world = addCameraMesh(node_world);
			//调用addWomanMesh方法添加woman的library和sector到world.sector.xml中  扈亚楠
			node_world = addWomanMesh(node_world);
			node_world = addCubeMesh(node_world);
		}
	}
	
	//
	// main()
	//
	
	// 全局变量，方便调试。
	var CONSOLE = Registry.Get("iConsole");
	// 这里自定义一个控制台输出函数，方便使用
	// 使用时直接调用 iprint('输出结果'); 即可
	var iprint = function(msg){
		CONSOLE.WriteLine(msg+"\n");
	}

	// 加载 GUI 插件
	Plugin.Load("spp.script.gui.cegui");
	
	// 打开应用程序窗口
	Event.Send("application.open", true);

	// 加载系统中的 js 库
	require("objlayout.js");	// 这里是加载 Entity 支持库
	require("ui.js");	// 这里加载 GUI 支持库
	require("loader.js");	// 加载场景使用的库。
	require("cursesui.js");	// 在CUI上画图用的。
	
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
	
	// 是否多线程加载
	var isThreadedLoader = false;
	if(CmdLine.GetOption("thread"))
	{
		isThreadedLoader = true;
	}
	if(isThreadedLoader)
	{
		// 多线程加载开始
		Loader.Load({
			stages : [
				{
					name : "shader",
					weighing : 2, // 加载时间权重
					filename : "/art/shaderlib.xml"
				},
				// {
					// name : "sound",
					// weighing : 10,
					// filename : "/art/soundlib.xml"
				// },
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
	}
	// 没有多线程加载
	else
	{
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
			
			// 在加载world之前，添加导游woman，camera等mesh
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
		
		console.debug("Loading logic codes.");
		
		// 加载逻辑相关的文件
		iload('/tools/logic/logic_index.js');	
		
		console.debug("Loading UI codes.");
		
		// 加载UI相关的文件
		iload('/tools/ui/ui.scheme.js');
		//iload('/tools/ui/zhucaidan.layout.js');
		iload('/tools/ui/zhucaidan.layout.js');
		// 创建GUI所需要的scheme和字体，通常文件名为 ui.scheme.js ，其中的对象名为 UIDATA;
		GUI.CreateObjectScheme(UIDATA,"/tools/ui/data"); 
		GUI.CreateObjectLayout(ZHUCAIDAN_LAYOUT,"/tools/ui/data");
		// GUI.CreateObjectLayout(SHOWHEIGHT_LAYOUT,"/tools/ui/data");
		iload('/tools/ui/ui_function.js');
		if(!FUNCTION_DATA){
			alert("ui_function.js is not found ！");
			return ;
		}
		
		console.debug("Creating entities.");
		
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
		player.pcarray['pclinearmovement'].SetProperty('gravity', [0]);//人物初始重力修改
		iCamera.pcarray['pclinearmovement'].SetProperty('gravity', [0]);//镜头初始重力修改  为了防止镜头掉落，重力归零
		
		// 获得 3D 支持，渲染场景。
		engine = Registry.Get('iEngine');
		g3d = Registry.Get('iGraphics3D');
		var count = Event.InstallHelper('3d','frame');
		
		/**
		 * @brief 添加碰撞逻辑，但是不管用  扈亚楠
		 */
		 var sec = engine.sectors.Get(0);
		if(sec)
		{
			var max = sec.meshes.count;
			for(var i = 0; i < max;i++)
			{
				var meshwrapper = sec.meshes.Get(i);
				if(meshwrapper)
				{
					//alert('begin mesh ',meshwrapper.object.name);
					var ok = C3D.colsys.InitializeCollision(meshwrapper);
					//alert('end ',ok);
				}
			}
		}
		
		//获取sectorlist
		var sectorList = engine.sectors;
		//获取sector
		var sector = sectorList.Get(0);
		//设置环境光的强度
		sector.ambient = ([0.5,0.5,0.5]);
		// 获得lightlist
		var lightlist = sector.lights ;
		//设置灯光的颜色值
		var col = new Math3.Color(0.8, 0.8, 0.8);
		//创建一个灯光
		player.light = C3D.engine.CreateLight("Lamp",  [125.66888427734375,0,-343.1724548339844], 150, col , 3);
		// 添加 light 到 lightlist
		lightlist.Add(player.light);
		
		//	岳朝凤修改 加载场景时间的统计 2012-6-7
		//获取场景加载结束时的系统时间
		var finishTime = (new Date().getTime() - startTime)/1000;//毫秒转换成秒
		var bootTime = Math.round(finishTime);//取整
		iprint('\n' + "本次加载场景所需时间： " + bootTime + " 秒" + '\n');
		
		// @par3 : 模型在多少米内显示。
		MeshGen.SetMeshGenerate(player.pcarray['pcactormove'],player.pcarray['pcmesh'],20);
		
		iprint('漫游方式查看 ：');
		iprint('W S A D : 前 后 左转 右转');
		iprint('Q E T G: 左 右 上 下');
		iprint('R F : 向上看 向下看');
		iprint('1 2 3 4 5 : 改变速度');
		iprint('Z : 打印坐标');
		iprint('Tab : 切换视角');
		iprint('N : 切换重力模式并回到原点,有角色代表有重力,无角色则无动力');
		iprint('M : 打开/退出沙盘模式');
		iprint('K : 打开/关闭视角控制UI面板' + '\n');
		iprint('X : 切换查看方式，在漫游方式和鼠标拖拽控制方式之间切换' + '\n');
		iprint('单体查看方式---鼠标控制 ：');
		iprint('鼠标左键 ： 按住不放，滑动鼠标进行自由视角控制');
		iprint('滚轮向前 ： 拉近摄像机距离');
		iprint('滚轮向后 ： 拉远摄像机距离');
		iprint('盒子的缩放：(初始高度为2m在窗口的右上角有具体的数字显示)');
		iprint(', : 盒子Height缩小(每次缩小0.01m)');
		iprint('. : 盒子Height增大(每次增大0.01m)');
		iprint('H : 盒子Width缩小(每次缩小0.01m)');
		iprint('J : 盒子Width增大(每次增大0.01m)');
		iprint('/ : 改变重力')
	}
}catch(e){
	alert('error:',e);
}
