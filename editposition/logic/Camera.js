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
	
	
	// ���������Ҫ���¼���ִ�еĶ���
	this.eventConfig = {
		key : ['w', 's', 'a', 'd'],
		func : ['Forward', 'Backward', 'RotateLeft', 'RotateRight']
	}
	
	// ʵ�����ƶ����Ƶ���
	this.mc = new MoveController(this);
	
	// ʵ�����¼��������
	this.input = new InputEvent(this, this.eventConfig.key, this.eventConfig.func);
	
	// �����¼�
	this.eventOut = function(key, state)
	{
		// TODO��
		// ��Ҫ���¼���Ϊ����¼��ͼ����¼�
		
		// �������¼������ƶ�������
		this.mc.move(key, state);
		
		// ������¼�������������
		
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
	// TODO��
	// �жϲ���mode�Ƿ��� this.mode ��Χ��
	// this.prop_cam.SetCamera(mode);
// }

// CameraClass.prototype.setEventIn = function()
// {
	// ����¼�
// }

