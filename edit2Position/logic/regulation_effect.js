try{
	(function(){
		//��߳������������
		Event.Subscribe(function(e){
		var actor = e.player;
		var sectorList = engine.sectors;  // ȡ��sectorlist ÿ��sector����һ����ǩ��index�� 
		var sector = sectorList.Get(0);
		var ruesl = sector.ambient['r'];
		sector.ambient = sector.ambient.Add([0.05, 0.05, 0.05]);
		}, "cra.effect.brilliance");
		//���ͳ������������
		Event.Subscribe(function(e){
		var actor = e.player;
		var sectorList = engine.sectors;  // ȡ��sectorlist ÿ��sector����һ����ǩ��index�� 
		var sector = sectorList.Get(0);
		var ruesl = sector.ambient['r'];
		sector.ambient = sector.ambient.Add([-0.05, -0.05, -0.05]);
		}, "cra.effect.darkness");
		//���ͱ��Ͷ�ʹ����ϼ�Ctrl+-
		Event.Subscribe(function(e){
			alert("123456+ctrl   -");
			var actor = e.player;
		}, "cra.effect.combinationadd");
		//��߱��Ͷ�ʹ����ϼ�Ctrl+=
		Event.Subscribe(function(e){
			alert("123456+ctrl   =");
			var actor = e.player;
		}, "cra.effect.combinationcut");
		//��ԭ���ܼ�
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