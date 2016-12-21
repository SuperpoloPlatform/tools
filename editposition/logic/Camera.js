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

var CameraClass = function(){
	
	this.name = "camera";
	this.mode = ["firstperson","thirdpersion","freelook"];
	this.wheelSpeed = 0.1;
	
	this.ent = Entities.CreateEntity();
	this.ent.name=this.name;
	
	this.prop_cam = Entities.CreatePropertyClass(this.ent, 'pcdefaultcamera');
	this.prop_cam.SetProperty("distance",6);
	this.prop_cam.PerformAction("SetCamera",['modename','firstperson']);
	
	this.prop_pm = Entities.CreatePropertyClass(this.ent, 'pcmesh');
	this.prop_pm.PerformAction('SetMesh',['name','mesh___camera']);
	
	
	// 定义该类需要的事件和执行的动作
	this.eventConfig = {
		key : ['w', 's', 'a', 'd'],
		func : ['Forward', 'Backward', 'RotateLeft', 'RotateRight']
	}
	
	// 实例化移动控制的类
	this.mc = new MoveController(this);
	
	// 实例化事件处理的类
	this.input = new InputEvent(this, this.eventConfig.key, this.eventConfig.func);
	
	// 处理事件
	this.eventOut = function(key, state)
	{
		// TODO：
		// 需要将事件分为鼠标事件和键盘事件
		
		// 将键盘事件发给移动控制器
		this.mc.move(key, state);
		
		// 将鼠标事件发给鼠标控制器
		
	}
	
	
	
}


// CameraClass.prototype.setDistance = function(dis)
// {
	// this.prop_cam.distance = 6;
// }

// CameraClass.prototype.wheel = function(wheel)
// {
	// this.prop_cam.distance += (wheel*this.wheelSpeed);
// }

// CameraClass.prototype.setCameraMode = function(mode)
// {
	// TODO：
	// 判断参数mode是否在 this.mode 范围内
	// this.prop_cam.SetCamera(mode);
// }

// CameraClass.prototype.setEventIn = function()
// {
	// 添加事件
// }

