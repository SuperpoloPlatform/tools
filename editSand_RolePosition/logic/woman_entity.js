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

	WOMAN = {
		name : "woman",
		
		property : {
			
			meshName: "woman",		// 角色当前模型
			current_position: [0,0,0],    // 记录实时位置 需要调用时候 star.current_position.x  player.current_position.y  player.current_position.z
			personMode : "thirdperson",
		},
		
		pc : {
			"pcmesh" : {
				action : [
					{
						name : "SetMesh",
						param : [
							['name','woman']
						]
					},
					{
						name : "SetAnimation",
						param : [
							['animation','stand'],
							['cycle',true]
						]
					},
					{
						name : "SetVisible",
						param : [
							['visible',true]
						]
					},
					{
						name : "RotateMesh",
						param : [
							['rotation',[0, 0.08, 0]]
						]
					}
				]
			},
			"pclight" : {
			},
			"pclinearmovement" : {
			},
			"pcactormove" : {
			},
			"pcmover" : {},
			"pctimer" : {
				action : [
					{
						name : "WakeUp",
						param : [
							['time', 33],
							['repeat', false],
							['name', '']
						]
					}
				]
			},
			"pccommandinput" : {
				action : [
					{
						name: "Activate",
						param:[
							['activate', false]
						]
					},
					{
						name : "Bind",	//鼠标左键点击
						param : [
							['trigger','MouseButton0'],
							['command','mouseleft']
						]
					}
				]
			}
		},
		
		// 订阅来自entity自身发出的事件，类似于`ent.behavious();`，
		// 一般这些事件都是entity内部的property class发出的。		
		event : {}
	};

}
catch (e)
{
	alert(e);
}