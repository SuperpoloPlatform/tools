//this is a test.

try {


Plugin.Load("spp.script.cspace.core");
Event.Send("application.open",true);
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
alert('engine: ', engine);
g3d = Registry.Get('iGraphics3D');
cd = Registry.Get('iCollideSystem');
view = new iView(engine,g3d);
//var count = Event.InstallHelper('3d',view,'frame');

loader = Registry.Get('iLoader');
var bVar = loader.LoadMapFile('world.xml');
alert('bval: ', bVar);
//view
var mesh = engine.FindMeshObject('Plane');
alert(mesh);
//mesh

/* test = Registry.Get('ipartical');
alert(test);
alert(test.getMessage());
test.var2 = 11;
alert(test.var2);
 */
}catch(e){
alert('error:',e);
}
