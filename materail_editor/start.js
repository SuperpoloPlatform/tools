//this is a test.

try {

Plugin.Load("spp.script.cspace.core");
Event.Send("application.open",true);

var frameCount = 0;

var velocity = [0,0,0];
var angle_velocity = [0,0,0];



var handler = { OnKeyboard : function(e){
	
	{
		if(e.keyCodeRaw == 113) //'q'
		{
		//保存文件
			var saver = Registry.Get('iSaver');
			saver.SaveMapFile('world2');
			
			if(e.keyEventType == 1)
				System.Quit();
		}else if(e.keyCodeRaw == 114) //'r'
		{
			if(e.keyEventType == 1)
				g3d.driver2d.fullscreen = !g3d.driver2d.fullscreen;
		}else if(e.keyCodeRaw == 101) //e
		{
			if(e.keyEventType == 1)
			{
				angle_velocity[0] = 1;
//				velocity[1] = 1;
			}else{
				angle_velocity[0] = 0;
//				velocity[1] = 0;
			}
		}else if(e.keyCodeRaw == 97) //a
		{
			if(e.keyEventType == 1)
			{
				angle_velocity[1] = -0.5;
//				velocity[0] = -0.5;
			}else{
				angle_velocity[1] = 0;
//				velocity[0] = 0;
			}
			view.camera.Move([-.1,0,0]);
		}else if(e.keyCodeRaw == 100) //d
		{
			if(e.keyEventType == 1)
			{
				//velocity[0] = 0.5;
				angle_velocity[1] = 0.5;
			}else{
				angle_velocity[1] = 0;
				//velocity[0] = 0;
			}
			view.camera.Move([.1,0,0]);
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
		}else if(e.keyCodeRaw == 32) //绑定空格键,镜头往上
		{
			if(e.keyEventType == 1)
			{
			    actor.gravity = 0;    
				velocity[1] = 3;
			}
			else{
				velocity[1] = 0;
			}
			view.camera.Move([0,-.1,0]);
		}else if(e.keyCodeRaw == 120) //小写X,镜头往下
		{
		   if(e.keyEventType == 1)
			{
			    actor.gravity = 0;    
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
		}else if(e.keyCodeRaw == 49) //num 1
		{//去除一个shadervar ‘tex specular’		
			removeTexFromMaterial(new variableStruct('Material #6', 'tex specular', '', ''));
		}else if(e.keyCodeRaw == 50) //num 2
		{//去除一个shadervar ‘tex height’
			removeTexFromMaterial(new variableStruct('Material #6', 'tex height', '', ''));
		}else if(e.keyCodeRaw == 51) //num 3
		{//去除一个shadervar ‘tex normal’
			removeTexFromMaterial(new variableStruct('Material #6', 'tex normal', '', ''));
		}else if(e.keyCodeRaw == 52) //num 4
		{//去除tex diffuse
			removeTexFromMaterial(new variableStruct('Material #6', 'tex diffuse', '', ''));
		}else if(e.keyCodeRaw == 54) //num 6
		{//新增tex diffuse
			addShaderVarForMaterial(new variableStruct('Material #6', 'tex diffuse', C3D.ShaderVariable.TEXTURE, 'GUN_D.JPG'));
		}else if(e.keyCodeRaw == 55) //num 7
		{//新增tex normal
			addShaderVarForMaterial(new variableStruct('Material #6', 'tex normal', C3D.ShaderVariable.TEXTURE, 'BUMPGUN_N.JPG'));
		}else if(e.keyCodeRaw == 56) //num 8
		{//新增tex height
			addShaderVarForMaterial(new variableStruct('Material #6', 'tex height', C3D.ShaderVariable.TEXTURE, 'BUMPGUN_H.JPG'));
		}else if(e.keyCodeRaw == 57) //num 9
		{//新增tex specular
			addShaderVarForMaterial(new variableStruct('Material #6', 'tex specular', C3D.ShaderVariable.TEXTURE, 'white.gif'));
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
		var delta = vc.elapsed / 10.0;
		actor.Move(delta,6,velocity,angle_velocity);
	}
 }
},"frame");

engine = Registry.Get('iEngine');
g3d = Registry.Get('iGraphics3D');
cd = Registry.Get('iCollideSystem');
view = new iView(engine,g3d);
var count = Event.InstallHelper('3d',view,'frame');


g3d.driver2d.native.SetTitle("Only a Testing");


aeval(function(){
	loader = Registry.Get('iLoader');
	var bVar = loader.LoadMapFile('world');

	if(bVar)
	{
	engine.setVFSCache("/cache");
	engine.Prepare();
	//alert('engine.camPositions.count=',engine.camPositions.count);
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
	//alert('cd.InitializeCollision(engine)=',bVar);
	actor = new ColliderActor(cd,engine);
	actor.InitializeColliders(view.camera,[0.3,0.8,0.2],[0.4,1,0.3],[0,-1.5,0]);
	actor_inited = true;
	
	//get imovable
	var meshwrapper = 
}
	}
);

//参数
function variableStruct(strmatname, strshavname, shavtype, shavvalue){
	variableStruct.prototype.mateName = strmatname;//material name
	variableStruct.prototype.shadervarName = strshavname;
	variableStruct.prototype.shadervarType = shavtype;
	variableStruct.prototype.shadervarValue = shavvalue;
};

//去除material下的shadervar
function removeTexFromMaterial(e){
	var imaterial = engine.FindMaterial(e.mateName).material;
	
	if (imaterial instanceof  Object){
		var csShaderVariable = imaterial.Get(e.shadervarName);
		if (csShaderVariable instanceof  Object)
			imaterial.Remove(csShaderVariable);
	}else {
		alert('imaterial is null!');
	}
};

//增加或者替换material下的shadervar
function addShaderVarForMaterial(e){
	var imaterial = engine.FindMaterial(e.mateName).material;
	
	if (imaterial instanceof  Object){
		var shadervar  = new C3D.ShaderVariable();
		//按照type分开处理
		if ( e.shadervarType == shadervar.TEXTURE){
			var itexturewrapper = engine.FindTexture(e.shadervarValue);			
			shadervar.name = e.shadervarName;
			shadervar.type = shadervar.TEXTURE;
			shadervar.SetValue(itexturewrapper, shadervar.type);				
		}else{
			shadervar.name = e.shadervarName;
			shadervar.type = e.shadervarType;
			shadervar.SetValue(e.shadervarValue, shadervar.type);
		}
		imaterial.Add(shadervar);
	}else {
		alert('imaterial is null!');
	}
}

}catch(e){
alert('error:',e);
}