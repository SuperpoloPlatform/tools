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

var InputEvent = function(clas, keyList, funcList)
{
	// 打开关闭事件
	this.enable = true;

	// 初始化 entity 类
	if(clas && clas.ent)
	{
		this.ent = clas.ent;
	}
	else
	{
		this.ent = Entities.CreateEntity();
	}
	
	// 初始化响应事件的按键
	if (keyList)
	{
		this.keyList = keyList;
	}
	else
	{
		this.keyList = [];
		for(var i=32; i<127; i++)
		{
			this.keyList[i-32] = String.fromCharCode(i);
		}
	}
	
	// 初始化事件触发方法
	if(funcList)
	{
		this.funcList = funcList;
	}
	else
	{
		this.funcList = keyList;
	}
	// iprint(this.keyList);
	
	// 初始化事件绑定
	this.prop_input = Entities.CreatePropertyClass(this.ent,'pccommandinput');
	var keyVal = "";
	for(var key in this.keyList)
	{
		keyVal = this.keyList[key];
		funcVal = this.funcList[key];
		this.prop_input.PerformAction('Bind',['trigger', keyVal],['command', funcVal]);
	}
	
	// 封装entity.behaviour方法，主要是将参数拆出来，方便处理。
	this.ent.behaviour = function(msgid)
	{
		do{
			if ( !clas.eventOut ){
				break;
			}
			var state = msgid.substring(msgid.length-1);
			if ( state=='_' ){
				break;
			}
			if (msgid=="pclinearmovement_stuck"){
				break;
			}
			if(msgid == "pclinearmovement_collision"){
				break;
			}
			
			state = (state==0)? false : true ;
			
			var key = msgid.substring("pcinputcommand_".length, msgid.length-1);
			clas.eventOut(key , state);

			
		}while(false);

		
	}
	
	
}

// 事件发出
// InputEvent.prototype.eventOut = function()
// {
	// return this.ent.behaviour = function(msgid, pc, p1, p2, p3, p4, p5)
	// {
		// return msgid.substring("pcinputcommand_".length);
		// if (this.enable)
		// {
			// Event.Send({
				// name : "InputEvent.message",
				// key : msgid.substring("pcinputcommand_".length)
			// })
		// }
	// };
// } 



