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

		initFlag = false;	// 记录 start 的执行是否成功
		
		do{
		
			// 首先加载公共函数库
			if (!load('/tools/logic/common.js')) {		
				alert("could not to load the file /tools/logic/common.js !!");
				break;
			}

			var classFilePath = "/tools/logic/";
			// 这里一定要注意加载的先后顺序，不可混乱。
			var classList = [
				"mount.js",		// 执行 mount 操作，这里 mount 了执行 spp 的目录；或者使用 spp --rootdir=[path] 指定一个目录
				"SceneManage.js",	// 负责管理场景的类
				"Camera.js",
				"InputEvent.js",
				"MoveController.js"
			];
			if ( ! loadClassList(classFilePath, classList)){
				alert("loadClassList error !!");
				break;
			}
			
			// 实例化场景管理类
			var sm = new SceneManage();
			sm.initialize();		// 初始化场景
			sm.setDefaultCameraMesh();	// 向场景中添加摄像机跟随的模型
															// 向场景中添加角色模型
			sm.loadWorldNode();	// 将 world 加载起来
			sm.errorReport();	// 打印场景加载过程中的错误
			
			// 实例化摄像机
			var cm = new CameraClass();
			
			// 实例化角色
			
			// 实例化沙盘
				
			
			
			// 修改窗口标题
			g3d.driver2d.native.SetTitle("SPP_SDK PositionEdit");
			
			// 初始化场景碰撞
			var sec = engine.sectors.Get(0);
			if(sec)
			{
				var max = sec.meshes.count;
				for(var i = 0; i < max;i++)
				{
					var meshwrapper = sec.meshes.Get(i);
					if(meshwrapper)
					{
						var ok = C3D.colsys.InitializeCollision(meshwrapper);
					}
				}
			}
			
			// start 所有环节都通过了
			initFlag = true;
			
		}while(false);
		
		// 判断 start 的所有环节是否通过
		if (!initFlag){
			alert("start of an unexpected exception occurred");
		}

}catch(e){
	alert('error:',e);
}
