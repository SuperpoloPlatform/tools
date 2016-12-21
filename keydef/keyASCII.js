//this is a keyboard tools.

try {

	var CONSOLE = Registry.Get("iConsole");
	Plugin.Load("spp.script.cspace.core");
	Event.Send("application.open",true);
	var handler = {
		OnKeyboard : function(e){
			// 将打印出所按键的ASSCII码值.
			CONSOLE.WriteLine(e.keyCodeRaw + "\n");
		}
	};

	var onkeyDownID = Event.Subscribe(handler,"crystalspace.input.keyboard");

} catch(e){
	alert('error:',e);
}
