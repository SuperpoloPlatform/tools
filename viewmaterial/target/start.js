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
	require("ui.js");	// 这里加载 GUI 支持库
	
	
	// 这里自定义一个文件加载函数，方便使用
	var iload = function(file){
		if(!load(file)){
			alert("could not to load the file '"+file+"'!!");
		}
	}
	
	// 加载逻辑相关的文件
	// iload('/logic/logic_index.js');	
	if(!load("/logic/player.js"))
	{
	    alert("Failed to load `/objlayout/player.js`");
	}
	if(!load("/logic/effect.js"))
	{
	    alert("Failed to load `effect.js`");
	}
	if(!load("/logic/data.js"))
	{
	    alert("Failed to load `data.js`");
	}
	if(!load("/logic/box.js")){
	   alert("Failed to load `box.js`");
	}
	if(!load("/logic/sphere.js")){
	   alert("Failed to load `sphere.js`");
	}
	if(!load("/logic/teapot.js")){
	   alert("Failed to load `teapot.js`");
	}
	GUI.CreateObjectScheme(UIDATA,"/ui");
    GUI.CreateObjectLayout(UILAYOUT,"/ui");

	//下面这个方式，通过传入一个对象来初始化。这里我们以JSON格式来定义这个初始化对象。（比如`PLAYER`）
	//这个对象可以被保存在文件中，可以动态加载，加载进来就可以定义若干entity.
	//这里的entity你可以随意添加属性，就是普通的js对象！
	//我们的编辑器将会编辑产生一个entity def json，加载进来就是Entities.CreateEntity中的参数。
	
	 // iCamera = Entities.CreateEntity(CAMERA); 
	 // player = Entities.CreateEntity(PLAYER);	
	
	/*var */player = Entities.CreateEntity(PLAYER);
	// iCamera.pcarray["pcdefaultcamera"].PerformAction("SetFollowEntity",['entity','player']);
	// iCamera.pcarray["pccommandinput"].PerformAction("Activate", ['activate', false]);
	// iCamera.pcarray["pcdefaultcamera"].PerformAction("SetCamera",['modename','firstperson']);
	// iCamera.pcarray["pcdefaultcamera"].SetProperty("distance", 3.2);
	// iCamera.pcarray["pcdefaultcamera"].SetProperty("pitch", -0.169999957);
	  player.pcarray['pclinearmovement'].SetProperty('gravity', [0]);    //gravity取消重力可以这么操作
	  player.pcarray['pclinearmovement'].SetProperty('InitCD', [0]);    //gravity取消重力可以这么操作
	// iCamera.pcarray['pclinearmovement'].SetProperty('gravity', [0]);
	
	
	var box = Entities.CreateEntity(BOX) ; 
				var sphere = Entities.CreateEntity(SPHERE);
				var teapot = Entities.CreateEntity(TEAPOT);
		Event.Subscribe(function(e){			
				box.pcarray['pcmesh'].SetVisible(true);
				sphere.pcarray['pcmesh'].SetVisible(false);
				teapot.pcarray['pcmesh'].SetVisible(false);
		}, "pushedbox.effect.status");
	   Event.Subscribe(function(e){
				box.pcarray['pcmesh'].SetVisible(false);
				sphere.pcarray['pcmesh'].SetVisible(true);
				teapot.pcarray['pcmesh'].SetVisible(false);
		}, "pushedsphere.effect.status");
		
		Event.Subscribe(function(e){
			    box.pcarray['pcmesh'].SetVisible(false);
				sphere.pcarray['pcmesh'].SetVisible(false);
				teapot.pcarray['pcmesh'].SetVisible(true);
		}, "pushedteapot.effect.status");
		
	// for ins in engine
        
	// var itexturewrapper = engine.CreateTexture('textures1.jpg', '/art/textures/textures1.png');//Texture的名称，图片的路径，后面两参数可缺省。
	// alert(itexturewrapper);			
	
	// 获得 3D 支持，渲染场景。
	engine = Registry.Get('iEngine');
	g3d = Registry.Get('iGraphics3D');
	loader = Registry.Get('iLoader');//加载所要加载的xml文件
	var count = Event.InstallHelper('3d','frame');
	   
	   Event.Subscribe(function(){
	      obj = loader.LoadLibrary('/art/materials.xml');  //载入文件
	      materialwrapper = engine.FindMaterial('MaterialsInfo');  //获取制定的material对象这里获取的是MaterialsInfo
	      material= materialwrapper.material;  //material不加()的代码属性
	      var csShaderVarArray = material.Get(); //获得material下面的信息比如说有多张贴图
	      var shadervar = new C3D.ShaderVariable(); 
          itexturewrapper = Registry.Get('iTextureWrapper');
	      var texturemanager = g3d.texturemanager;
	      var color = ('0','0','0');
		  var itexturewrapper = engine.CreateTexture('textures1.jpg','/art/textures/textures1.jpg');  //创一张贴图，以此进行修改
		  itexturewrapper.Register(texturemanager); //通知系统我又创建了一个贴图
		  if(csShaderVarArray.length < 1){   //如果material下面没有参数，我们可以进行删除
			   alert('NULL');
	      }else{
	      for(i in csShaderVarArray){//textures diffuse
	         if(csShaderVarArray[i].type == shadervar.TEXTURE){ //如是这texture类型的话，我们进行替换
			     csShaderVarArray[i].SetValue(itexturewrapper,shadervar.TEXTURE);
			     material.Add(csShaderVarArray[i]);
		       }	     
	       }
	     }	
	  }, "change.textures.picture1");
	   Event.Subscribe(function(){
 	      obj = loader.LoadLibrary('/art/materials.xml');  //载入文件
	      materialwrapper = engine.FindMaterial('MaterialsInfo');  //获取制定的material对象这里获取的是MaterialsInfo
	      material= materialwrapper.material;  //material不加()的代码属性
	      var csShaderVarArray = material.Get(); //获得material下面的信息比如说有多张贴图
	      var shadervar = new C3D.ShaderVariable(); 
          itexturewrapper = Registry.Get('iTextureWrapper');
	      var texturemanager = g3d.texturemanager;
	      var color = ('0','0','0');
		  var itexturewrapper = engine.CreateTexture('textures2.jpg','/art/textures/textures2.jpg');  //创一张贴图，以此进行修改
		  itexturewrapper.Register(texturemanager); //通知系统我又创建了一个贴图
		  if(csShaderVarArray.length < 1){   //如果material下面没有参数，我们可以进行删除
			   alert('NULL');
	      }else{
	      for(i in csShaderVarArray){//textures diffuse
	         if(csShaderVarArray[i].type == shadervar.TEXTURE){ //如是这texture类型的话，我们进行替换
			     csShaderVarArray[i].SetValue(itexturewrapper,shadervar.TEXTURE);
			     material.Add(csShaderVarArray[i]);
		       }	     
	       }
	     }	
	   }, "change.textures.picture2");
	     Event.Subscribe(function(){
          obj = loader.LoadLibrary('/art/materials.xml');  //载入文件
	      materialwrapper = engine.FindMaterial('MaterialsInfo');  //获取制定的material对象这里获取的是MaterialsInfo
	      material= materialwrapper.material;  //material不加()的代码属性
	      var csShaderVarArray = material.Get(); //获得material下面的信息比如说有多张贴图
	      var shadervar = new C3D.ShaderVariable(); 
          itexturewrapper = Registry.Get('iTextureWrapper');
	      var texturemanager = g3d.texturemanager;
	      var color = ('0','0','0');
		  var itexturewrapper = engine.CreateTexture('textures3.jpg','/art/textures/textures3.jpg');  //创一张贴图，以此进行修改
		  itexturewrapper.Register(texturemanager); //通知系统我又创建了一个贴图
		  if(csShaderVarArray.length < 1){   //如果material下面没有参数，我们可以进行删除
			   alert('NULL');
	      }else{
	      for(i in csShaderVarArray){//textures diffuse
	         if(csShaderVarArray[i].type == shadervar.TEXTURE){ //如是这texture类型的话，我们进行替换
			     csShaderVarArray[i].SetValue(itexturewrapper,shadervar.TEXTURE);
			     material.Add(csShaderVarArray[i]);
		       }	     
	       }
	     }	
	   }, "change.textures.picture3");
	     Event.Subscribe(function(){
         obj = loader.LoadLibrary('/art/materials.xml');  //载入文件
	      materialwrapper = engine.FindMaterial('MaterialsInfo');  //获取制定的material对象这里获取的是MaterialsInfo
	      material= materialwrapper.material;  //material不加()的代码属性
	      var csShaderVarArray = material.Get(); //获得material下面的信息比如说有多张贴图
	      var shadervar = new C3D.ShaderVariable(); 
          itexturewrapper = Registry.Get('iTextureWrapper');
	      var texturemanager = g3d.texturemanager;
	      var color = ('0','0','0');
		  var itexturewrapper = engine.CreateTexture('textures4.jpg','/art/textures/textures4.jpg');  //创一张贴图，以此进行修改
		  itexturewrapper.Register(texturemanager); //通知系统我又创建了一个贴图
		  if(csShaderVarArray.length < 1){   //如果material下面没有参数，我们可以进行删除
			   alert('NULL');
	      }else{
	      for(i in csShaderVarArray){//textures diffuse
	         if(csShaderVarArray[i].type == shadervar.TEXTURE){ //如是这texture类型的话，我们进行替换
			     csShaderVarArray[i].SetValue(itexturewrapper,shadervar.TEXTURE);
			     material.Add(csShaderVarArray[i]);
		       }	     
	       }
	     }	
	   }, "change.textures.picture4");
	     Event.Subscribe(function(){
         obj = loader.LoadLibrary('/art/materials.xml');  //载入文件
	      materialwrapper = engine.FindMaterial('MaterialsInfo');  //获取制定的material对象这里获取的是MaterialsInfo
	      material= materialwrapper.material;  //material不加()的代码属性
	      var csShaderVarArray = material.Get(); //获得material下面的信息比如说有多张贴图
	      var shadervar = new C3D.ShaderVariable(); 
          itexturewrapper = Registry.Get('iTextureWrapper');
	      var texturemanager = g3d.texturemanager;
	      var color = ('0','0','0');
		  var itexturewrapper = engine.CreateTexture('textures5.jpg','/art/textures/textures5.jpg');  //创一张贴图，以此进行修改
		  itexturewrapper.Register(texturemanager); //通知系统我又创建了一个贴图
		  if(csShaderVarArray.length < 1){   //如果material下面没有参数，我们可以进行删除
			   alert('NULL');
	      }else{
	      for(i in csShaderVarArray){//textures diffuse
	         if(csShaderVarArray[i].type == shadervar.TEXTURE){ //如是这texture类型的话，我们进行替换
			     csShaderVarArray[i].SetValue(itexturewrapper,shadervar.TEXTURE);
			     material.Add(csShaderVarArray[i]);
		       }	     
	       }
	     }	
	   }, "change.textures.picture5");
	     Event.Subscribe(function(){
        obj = loader.LoadLibrary('/art/materials.xml');  //载入文件
	      materialwrapper = engine.FindMaterial('MaterialsInfo');  //获取制定的material对象这里获取的是MaterialsInfo
	      material= materialwrapper.material;  //material不加()的代码属性
	      var csShaderVarArray = material.Get(); //获得material下面的信息比如说有多张贴图
	      var shadervar = new C3D.ShaderVariable(); 
          itexturewrapper = Registry.Get('iTextureWrapper');
	      var texturemanager = g3d.texturemanager;
	      var color = ('0','0','0');
		  var itexturewrapper = engine.CreateTexture('textures6.jpg','/art/textures/textures6.jpg');  //创一张贴图，以此进行修改
		  itexturewrapper.Register(texturemanager); //通知系统我又创建了一个贴图
		  if(csShaderVarArray.length < 1){   //如果material下面没有参数，我们可以进行删除
			   alert('NULL');
	      }else{
	      for(i in csShaderVarArray){//textures diffuse
	         if(csShaderVarArray[i].type == shadervar.TEXTURE){ //如是这texture类型的话，我们进行替换
			     csShaderVarArray[i].SetValue(itexturewrapper,shadervar.TEXTURE);
			     material.Add(csShaderVarArray[i]);
		       }	     
	       }
	     }	
	   }, "change.textures.picture6");
	

}catch(e){
	alert('error:',e);
}
