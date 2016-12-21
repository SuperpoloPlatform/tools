try{
	(function(){
		//提高场景整体的明度
		Event.Subscribe(function(e){
		var actor = e.player;
		var sectorList = engine.sectors;  // 取到sectorlist 每个sector都有一个标签（index） 
		var sector = sectorList.Get(0);
		var ruesl = sector.ambient['r'];
		sector.ambient = sector.ambient.Add([0.02, 0.02, 0.02]);
		}, "cra.effect.brilliance");
		//降低场景整体的明度
		Event.Subscribe(function(e){
		var actor = e.player;
		var sectorList = engine.sectors;  // 取到sectorlist 每个sector都有一个标签（index） 
		var sector = sectorList.Get(0);
		var ruesl = sector.ambient['r'];
		sector.ambient = sector.ambient.Add([-0.02, -0.02, -0.02]);
		}, "cra.effect.darkness");
		//降低饱和度使用组合键Ctrl+-
		Event.Subscribe(function(e){
			alert("123456+ctrl   -");
			var actor = e.player;
		}, "cra.effect.combinationadd");
		//提高饱和度使用组合键Ctrl+=
		Event.Subscribe(function(e){
			alert("123456+ctrl   =");
			var actor = e.player;
		}, "cra.effect.combinationcut");
		//还原功能键
		Event.Subscribe(function(e){
			var actor = e.player
			var sectorList = engine.sectors; 
			var sector = sectorList.Get(0);
			sector.ambient = ([0.197647, 0.197647, 0.197647]);
		}, "cra.effect.revert");
		/*
		Event.Subscribe(function(e){
			// alert("123456+brilliance");
			// engine.ambient[0]=1;
			var actor = e.player;
		}, "cra.effect.revert.stop");
		Event.Subscribe(function(e){
			// alert("123456+brilliance");
			// engine.ambient[0]=1;
			var actor = e.player;
		}, "cra.effect.combinationadd.stop");
		Event.Subscribe(function(e){
			// alert("123456+brilliance");
			
			// engine.ambient[0]=1;
			var actor = e.player;
		}, "cra.effect.brilliance.stop");
		
		Event.Subscribe(function(e){
			alert("123456+darkness");
			var actor = e.player;
		}, "cra.effect.darkness.stop");
		*/
	})();

}catch(e){
	alert(e);
}