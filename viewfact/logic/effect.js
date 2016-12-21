/**************************************************************************
 *  This file is part of the UGE(Uniform Game Engine) of SPP.
 *  Copyright (C) by SanPolo Co.Ltd. 
 *  All rights reserved.
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/  sales@spolo.org spp-support@spolo.org
**************************************************************************/
//此文件中定义一些控制entity的方法
try{
	(  
	  
	 function(){	
        	 
		var nowrun = false;
		var nowturn = false;	
		 //水平左移，与右移
	   var obj_state=[0,0];
			/* 改变角色动作 */
		function changeAnimation(actor, index, value){
			// 将动作记录到数组
			arr_amin_state[index] = value;
			// 改变动作
			//CONSOLE.WriteLine("actor.currentAnim  .."+actor.currentAnim);
			actor.pcarray['pcmesh'].PerformAction('SetAnimation',['animation', actor.currentAnim],['cycle',true],['reset', false]);
		}
				/* 左平移 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeLeft',['start',true]);
		}, "player.effect.StrafeLeft");
		/*左平移停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeLeft',['start',false]);
			//stopAnimation(actor, 0, 0);
		}, "player.effect.StrafeLeft.stop");
	/*右平移 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeRight',['start',true]);
			
		}, "player.effect.StrafeRight");
		
		/*人物 右平移停止 事件触发*/
		Event.Subscribe(function(e){
			var actor = e.player;
			actor.pcarray['pcactormove'].PerformAction('StrafeRight',['start',false]);
		
		}, "player.effect.StrafeRight.stop");
	
		//控制entity向左移动
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].StrafeLeft(true);	//开启entity向左移动的方法
			actor.pcarray['pcmesh'].SetAnimation('run', true, true);	//改变entity行为成为run
			actor.state = "run";	//改变entity的state属性值为run
		},"effect.strafeleft.start");//双引号中是此方法的name，调用时使用该name
		//停止entity向左移动
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].StrafeLeft(false);	//关闭entity向左移动的方法
			actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
			actor.state = "stand";	//改变entity的state属性值为stand
		},"effect.strafeleft.stop");//双引号中是此方法的name，调用时使用该name
		//控制entity向右移动
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].StrafeRight(true);	//开启entity向右移动的方法
			actor.pcarray['pcmesh'].SetAnimation('run', true, true);	//改变entity行为成为run
			actor.state = "run";	//改变entity的state属性值为run
		},"effect.straferight.start");//双引号中是此方法的name，调用时使用该name
		//关闭entity向右移动
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].StrafeRight(false);	//关闭entity向右移动的方法
			actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
			actor.state = "stand";	//改变entity的state属性值为stand
		},"effect.straferight.stop");//双引号中是此方法的name，调用时使用该name
		
		//entity死亡（即entity不能再控制）
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcmesh'].SetAnimation('die', false, false);	//改变entity行为成为die
			actor.state = "die";	//改变entity的state属性值为die
		}, "effect.death");//双引号中是此方法的name，调用时使用该name
		
		//鼠标左键控制视角旋转
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			var x = e.mouse_x;		//接收由entity传过来的值
			var y = e.mouse_y;		//接收由entity传过来的值		
		
			actor.pcarray['pcmesh'].SetAnimation('stand', true, true);
			//CONSOLE.Write("[debug] [effect viewmove] x: " + x + "   y: " + y + ".\n");	//输出
		    player.pressmouse = true;
	    	actor.pcarray['pcactormove'].mousemove = true;	//开启鼠标控制功能
			actor.pcarray['pcactormove'].MouseMove(x, y);	//传入参数控制视角移动
		}, "effect.mousemove.start");//双引号中是此方法的name，调用时使用该name
		//停止鼠标控制视角旋转	
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect mousemove] : false .\n");	//输出
			actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
			actor.pcarray['pcactormove'].mousemove = false;			//关闭鼠标控制功能
			actor.pcarray['pcactormove'].PerformAction('Clear');	//清除鼠标控制
		}, "effect.mousemove.stop");//双引号中是此方法的name，调用时使用该name
		//控制视角拉近
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect mouseforward] :"+actor.pcarray['pcdefaultcamera'].distance+".\n"); //输出
			actor.pcarray['pcdefaultcamera'].distance=actor.pcarray['pcdefaultcamera'].distance-0.2;	//每次减少0.2个单位
		},"effect.mouse.forward");//双引号中是此方法的name，调用时使用该name
		//控制视角拉远
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect mousebackward] :"+actor.pcarray['pcdefaultcamera'].distance+".\n");	//输出
			actor.pcarray['pcdefaultcamera'].distance=actor.pcarray['pcdefaultcamera'].distance+0.2;	//每次增加0.2个单位
		},"effect.mouse.backward");//双引号中是此方法的name，调用时使用该name
		//人称视角切换
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect cameraPerson] : "+actor.person+" .\n");//输出
			actor.pcarray['pcdefaultcamera'].SetCamera(actor.person);	//控制摄像机人称视角
		},"effect.camera.person");//双引号中是此方法的name，调用时使用该name
		
	
	})();

} catch(e){
	alert(e);
}