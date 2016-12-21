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

Plugin.Load("spp.script.cspace.core");
Event.Send("application.open",true);

var frameCount = 0;

var velocity = [0,0,0];
var angle_velocity = [0,0,0];
var paused = false;

var handler = { OnKeyboard : function(e){
	//if(e.keyEvenatType == 1)
	{//up
		if(e.keyCodeRaw == 113) //'q'
		{
			if(e.keyEventType == 1)
				System.Quit();
		}else if(e.keyCodeRaw == 114) //'r'
		{
			if(e.keyEventType == 1)
				g3d.driver2d.fullscreen = !g3d.driver2d.fullscreen;
		}else if(e.keyCodeRaw == 101) //e
		{
			if(e.keyEventType == 0)
			{
				if(paused)
				{
					vc.Suspend();
				}else{
					vc.Resume();
				}
				paused = !paused;
			}
	
		}else if(e.keyCodeRaw == 97) //a
		{
			if(e.keyEventType == 1)
			{
			    //actor.gravity = 0;
				angle_velocity[1] = -0.5;
			//velocity[2] = -0.5;
			}else{
			    angle_velocity[1] = 0;
			//velocity[2] = 0;
			}
			//view.camera.Move([-.1,0,.1]);
		}else if(e.keyCodeRaw == 100) //d
		{
			if(e.keyEventType == 1)
			{
				//velocity[0] = 0.5;
				//alert('test');
				angle_velocity[1] = 1;
			}else{
				angle_velocity[1] = 0;
				//velocity[0] = 0;
			}
			//view.camera.Move([.1,0,0]);
		}else if(e.keyCodeRaw == 99) //c
		{
			if(e.keyEventType == 1)
			{
				angle_velocity[0] = -1;
//				velocity[1] = -0.5;
			}else{
				angle_velocity[0] = 0;
//				velocity[1] = 0;
			}
			//view.camera.Move([0,-.1,0]);
		}else if(e.keyCodeRaw == 119) //w
		{
			if(e.keyEventType == 1)
			{
				velocity[2] = 3;
			}else{
				velocity[2] = 0;
			}
			view.camera.Move([0,0,.1]);
		}else if(e.keyCodeRaw == 115) //s
		{
			if(e.keyEventType == 1)
			{
				velocity[2] = -3;
			}else{
				velocity[2] = 0;
			}
			view.camera.Move([0,0,-.1]);
		}else if(e.keyCodeRaw == 32) //空格
		{
			if(e.keyEventType == 1)
			{
			    //actor.gravity = 0;    
				velocity[1] = 3;
			}
			else{
				velocity[1] = 0;
			}
			view.camera.Move([0,-.1,0]);
		}else if(e.keyCodeRaw == 120) //X
		{
		   if(e.keyEventType == 1)
			{
			    //actor.gravity = 0;    
				velocity[1] = -3;
			}
			else{
				velocity[1] = 0;
			}
			view.camera.Move([0,.1,0]);
		}else if(e.keyCodeRaw == 112) //p
		{
			if(e.keyEventType == 1)
				alert("frameCount=",frameCount);
		}
	}
} };

var onkeyDownID = Event.Subscribe(handler,"crystalspace.input.keyboard");

var actor;
var view;
var vc;
var actor_inited = false;
var frameHandler = Event.Subscribe({
 genericName : "testFrame",
 phase : "3d",
 Frame : function(){
	frameCount++;
	if(actor_inited)
	{
		var delta = vc.elapsed / 1000.0;
		actor.Move(delta,6,velocity,angle_velocity);
	}
 }
},"crystalspace.frame");

engine = Registry.Get('iEngine');
g3d = Registry.Get('iGraphics3D');
vc = Registry.Get('iVirtualClock');
cd = Registry.Get('iCollideSystem');
view = new iView(engine,g3d);
var count = Event.InstallHelper('3d',view,'frame');
g3d.driver2d.native.SetTitle("viewmesh");

aeval(function(){
loader = Registry.Get('iLoader');
var bVar = loader.LoadMapFile('world');

if(bVar)
{
	engine.setVFSCache("/cache");
	engine.Prepare();
	if(engine.camPositions.count)
	{
		var cp = engine.camPositions.Get(0);
		cp.Load(view.camera,engine);
	}else{
		room = engine.sectors.FindByName("room");
		if(room)
		{
			view.camera.sector = room;
		}
	}
	bVar = cd.InitializeCollision(engine);
	actor = new ColliderActor(cd,engine);
	actor.InitializeColliders(view.camera,[0.3,0.8,0.2],[0.4,1,0.3],[0,1.5,0]);
	actor.gravity = 0;
	actor_inited = true;
}
}
);

}catch(e){
alert('error:',e);
}