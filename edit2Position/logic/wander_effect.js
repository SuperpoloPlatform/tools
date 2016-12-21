/**************************************************************************
 *  This file is part of the UGE(Uniform Game Engine) of SPP.
 *  Copyright (C) by SanPolo Co.Ltd. 
 *  All rights reserved.
 *  See http://spp.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://spp.spolo.org/  sales@spolo.org spp-support@spolo.org
**************************************************************************/
try{
	(function(){
	
		/*	开始漫游		*/	
		Event.Subscribe(function(e){
		//C3D为全局变量
		var actor  = e.player;
		//隐藏该meshobj
		actor.pcarray['pcmesh'].SetVisible(false);
		//切换绑定的meshobj
		actor.pcarray['pcmesh'].Setmesh("camera");
		//切换到第一人称视角
		iCamera.pcarray['pcdefaultcamera'].SetCamera("firstperson");
		//获取iSequenceManager，用来管理sequence
		this.sepm = C3D.seqmanager;
		//获取iEngineSequenceManager
		this.enseq = C3D.ensequence;
		//获取iSequenceWrapper，名字来源于world.xml文件的sequence标签中
		this.seqwrap = enseq.FindSequenceByName('movemesh');
		//获取iSequence，sequence属性封装了Set和Get
		seq = seqwrap.sequence;
		seqm.RunSequence(2,seq);
		},"player.effect.wanderbegin");
		
		/*	暂停漫游		*/
		Event.Subscribe(function(e){
			this.seqm.Suspend()；
		},"player.effect.wanderpause");
		
		/*	继续漫游		*/
		Event.Subscribe(function(e){
			this.sepm.Resume();
		},"player.effect.wanderresume");
		
		/*	停止漫游		*/
		Event.Subscribe(function(e){
			var actor = e.player;
			//隐藏该meshobj
			actor.pcarray['pcmesh'].SetVisible(false);
			actor.pcarray['pcmesh'].PerformAction
			(
				'MoveMesh',
					[
						'position',
						[
							POSITION[0].position_x,
							POSITION[0].position_y,
							POSITION[0].position_z
						]
					],
					[
						'rotation',
						[
							0,
							0 - POSITION[0].rotation_y,
							0
						]
					]
			)
			//还原人物当时状态	切换绑定的meshobj
			actor.pcarray['pcmesh'].SetMesh("player");
			//显示该meshobj
			actor.pcarray['pcmesh'].SetVisible(true);
			//切换到第三人称视角
			iCamera.pcarray['pcdefaultcamera'].SetCamera("thirdperson");
		},"player.effect.wanderstop");
	})();
} catch(e){
	alert(e);
}