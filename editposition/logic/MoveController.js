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

var MoveController = function(clas){

	// ≥ı ºªØ entity ¿‡
	if(clas && clas.ent)
	{
		this.ent = clas.ent;
	}
	else
	{
		this.ent = Entities.CreateEntity();
	}

	this.prop_pcactor = Entities.CreatePropertyClass(clas.ent, 'pcactormove');
	this.prop_pcactor.PerformAction('SetSpeed',['movement',5],['running',3],['rotation',1],['jumping',3]);
	
	this.prop_ment = Entities.CreatePropertyClass(clas.ent,'pclinearmovement');
	this.prop_ment.PerformAction('InitCD',['offset',[0, 0.0, 0]],['body',[0, 0, 0]],['legs',[0, 0, 0]]);
	this.prop_ment.SetProperty("gravity",0);
	
}

MoveController.prototype.move = function( func, state )
{
	do{
		this.prop_pcactor.PerformAction(func, ['start', state]);
	}while(false);
}

