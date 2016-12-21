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
	
	// 启动场景渲染
	engine = Registry.Get('iEngine');
	g3d = Registry.Get('iGraphics3D');
	var count = Event.InstallHelper('3d','frame');

	// 加载系统中的 js 库
	require("objlayout.js");	// 这里是加载 Entity 支持库
	//require("ui.js");	// 这里加载 GUI 支持库
	
	var loadClass = function(filePath,fileName){
		if( load(filePath+fileName) ){
			return true;
		}else{
			return false;
		}
	}
	
	var loadClassList = function(filePath, classList){
		var flag = true;
		for(var fileIndex in classList){
			if( ! loadClass(filePath,classList[fileIndex]) ){
				iprint("\n load class failed : "+filePath+classList[fileIndex] );
				flag = false;
				break;
			}
		}
		return flag;
	}

	
	Entities.LoadPropertyClassFactory('cel.pcfactory.input.standard');
	Entities.LoadPropertyClassFactory('cel.pcfactory.camera.old');
	Entities.LoadPropertyClassFactory('cel.pcfactory.object.mesh.collisiondetection');
	// Entities.LoadPropertyClassFactory('cel.pcfactory.world.zonemanager');
	Entities.LoadPropertyClassFactory('cel.pcfactory.object.mesh');
	Entities.LoadPropertyClassFactory('cel.pcfactory.move.linear');
	Entities.LoadPropertyClassFactory('cel.pcfactory.move.actor.standard'); 
	Entities.LoadPropertyClassFactory('cel.pcfactory.object.light');
	Entities.LoadPropertyClassFactory('cel.pcfactory.move.mover');
	Entities.LoadPropertyClassFactory('cel.pcfactory.object.mesh.select');
	Entities.LoadPropertyClassFactory('cel.pcfactory.logic.damage');
	
		
}catch(e){
	alert('error:',e);
}
