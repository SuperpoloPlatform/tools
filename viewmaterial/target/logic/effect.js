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
	(function(){
			
		var nowrun = false;
		var nowturn = false;
		//控制entity向前移动
		Event.Subscribe(function(e) {
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].Forward(true);				//打开entity向前移动的方法
			actor.pcarray['pcmesh'].SetAnimation('run', true, false);		//改变entity行为成为run
			actor.state = "run";	//改变entity的state属性值为run
			nowrun = false;
			nowturn = true;
		}, "effect.forward.start");//双引号中是此方法的name，调用时使用该name
		//停止entity向前移动
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].Forward(false);			//关闭entity向前移动的方法
			actor.pcarray['pcmesh'].SetAnimation('stand', true, true);		//改变entity行为成为stand
			actor.state = "stand";	//改变entity的state属性值为stand
			nowrun = true;
			nowturn = false;
		}, "effect.forward.stop");//双引号中是此方法的name，调用时使用该name
		//控制entity向后移动
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].Backward(true);			//打开entity向后移动的方法
			actor.pcarray['pcmesh'].SetAnimation('run', true, false);	//改变entity行为成为run
			actor.state = "run";	//改变entity的state属性值为run
			nowrun = false;
			nowturn = true;
		}, "effect.backward.start");//双引号中是此方法的name，调用时使用该name
		//停止entity向后移动
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].Backward(false);		//关闭entity向后移动的方法
			actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
			actor.state = "stand";	//改变entity的state属性值为stand
			nowrun = true;
			nowturn = false;
		}, "effect.backward.stop");//双引号中是此方法的name，调用时使用该name
		//控制entity向左旋转
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].RotateLeft(true);		//打开entity向左旋转的方法
			if(nowturn){
				actor.pcarray['pcmesh'].SetAnimation('run', true, false);	//改变entity行为成为run
				actor.state = "run";	//改变entity的state属性值为run
			} else {
				actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
				actor.state = "stand";	//改变entity的state属性值为stand
			}
		}, "effect.rotateleft.start");//双引号中是此方法的name，调用时使用该name
		//停止entity向左旋转
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].RotateLeft(false);		//关闭entity向左旋转的方法
			if(nowrun){
				actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
				actor.state = "stand";	//改变entity的state属性值为stand
			} else {
				if(nowturn){
					actor.pcarray['pcmesh'].SetAnimation('run', true, false);	//改变entity行为成为run
					actor.state = "run";	//改变entity的state属性值为run
				} else {
					actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
					actor.state = "stand";	//改变entity的state属性值为stand
				}
			}
		}, "effect.rotateleft.stop");//双引号中是此方法的name，调用时使用该name
		//控制entity向右旋转
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].RotateRight(true);	//打开entity向右旋转的方法
			if(nowturn){
				actor.pcarray['pcmesh'].SetAnimation('run', true, false);	//改变entity行为成为run
				actor.state = "run";	//改变entity的state属性值为run
			} else {
				actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
				actor.state = "stand";	//改变entity的state属性值为stand
			}
		}, "effect.rotateright.start");//双引号中是此方法的name，调用时使用该name
		//停止entity向右旋转
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcactormove'].RotateRight(false);	//关闭entity向右旋转的方法
			if(nowrun){
				actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
				actor.state = "stand";	//改变entity的state属性值为stand
			} else {
				if(nowturn){
					actor.pcarray['pcmesh'].SetAnimation('run', true, false);	//改变entity行为成为run
					actor.state = "run";	//改变entity的state属性值为run
				} else {
					actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
					actor.state = "stand";	//改变entity的state属性值为stand
				}
			}
		}, "effect.rotateright.stop");//双引号中是此方法的name，调用时使用该name
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
		//跳跃
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			actor.pcarray['pcdefaultcamera'].SetProperty("distance", 8);	//重设摄像机与mesh的距离值
			actor.pcarray['pcactormove'].Jump(true);	//开启entity的跳跃方法
			actor.pcarray['pcmesh'].SetAnimation('run', true, true);	//改变entity行为成为stand
		},"effect.jump");//双引号中是此方法的name，调用时使用该name
		//跳跃结束
		Event.Subscribe(function(e){
			var actor = e.self;		//接收所受控制的entity对象
			actor.pcarray['pcdefaultcamera'].SetProperty("distance", 3);	//重设摄像机与mesh的距离值
			actor.pcarray['pcmesh'].SetAnimation('stand', true, true);	//改变entity行为成为stand
		}, "effect.jump.stop");//双引号中是此方法的name，调用时使用该name
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
		//隐身
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect visible] : true .\n");//输出
			actor.pcarray['pcmesh'].SetVisible(false);//控制角色隐藏
		},"effect.visible.start");//双引号中是此方法的name，调用时使用该name
		//隐身结束
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect visible] : false .\n");//输出
			actor.pcarray['pcmesh'].SetVisible(true);//停止角色隐藏，使其显示
		},"effect.visible.stop");//双引号中是此方法的name，调用时使用该name
		//人称视角切换
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect cameraPerson] : "+actor.person+" .\n");//输出
			actor.pcarray['pcdefaultcamera'].SetCamera(actor.person);	//控制摄像机人称视角
		},"effect.camera.person");//双引号中是此方法的name，调用时使用该name
		//加速移动
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect hurry] : true .\n");//输出
			actor.pcarray['pcactormove'].SetSpeed(10, 2, 2, 8);	//设置entity移动速度，第二个参数
			var movement = actor.pcarray['pcactormove'].QueryInterface("iPcActorMove").movementspeed;
			CONSOLE.Write("[debug] [effect hurry] : "+ movement +" .\n");//输出
			actor.pcarray['pcmesh'].SetAnimation('run', true, false);
		},"effect.hurry.start");//双引号中是此方法的name，调用时使用该name
		// 停止加速移动	
		Event.Subscribe(function(e){
			var actor=e.self;		//接收所受控制的entity对象
			CONSOLE.Write("[debug] [effect hurry] : false .\n");//输出
			actor.pcarray['pcactormove'].SetSpeed(4, 2, 2, 8);	//设置entity移动速度，第二个参数
			var movement = actor.pcarray['pcactormove'].QueryInterface("iPcActorMove").movementspeed;
			CONSOLE.Write("[debug] [effect hurry] : "+ movement +" .\n");//输出
		},"effect.hurry.stop");//双引号中是此方法的name，调用时使用该name
	})();

} catch(e){
	alert(e);
}