/**************************************************************************
 *
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd. 
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/   sales@spolo.org uge-support@spolo.org
 *
**************************************************************************/

try {

	PLAYER = {
	    		// 为这个entity添加属性。
		property : {
			type : "player",
			life : 100, // 当前生命值
			mouseleft:false,//鼠标左键状态，true为按下，false为弹起
			person:"thirdperson",//人称视角状态，firstperson为第一人称视角，thirdperson为第三人称视角，目前这两种
			state : "stand", // 状态分为stand,attack,run，其他的状态想到再补充。
	
			},
	
		name : "player",//定义entity的name
		pc : {
			//地图管理器
			/*"pczonemanager" : {
				 action : [
				    {
						name : "DisableCD",
						param : [
						]
					},
					{
						name : "Load",	//加载文件，一般为xml文件
						param : [
							['path', '.'],	//路径
							['file', 'art/level.xml']	//文件名称
						]
					}
				]
			}, */
			//带有camera
			"pcdefaultcamera" : {
				action : [
					{
						name : "SetCamera",	//设置摄像机视角
						param : [
							['modename', 'thirdperson']	//第三人称视角thirdperson,第一人称视角firstperson
						]
					},
					{
						name : "SetZoneManager",	//设置摄像机绑定
						param : [
							['entity', 'player'], 	//同name一致，将摄像机绑定到模型上,entity name是player所以这里也就是写成了player  
							['region', 'main'],		//
							['start', 'Camera']		//
						]
					}
				],
				property : [
					{
						name : "distance",		//设置摄像机离模型的远近
						value : 10	//目前大于0的情况下是正确的；等于0时摄像机会跑到人前面去，前后变反，左右无作用；小于0时，所有功能全变反。
					}
				]
			},
			"pcmover" : {},
			//绑定模型
			"pcmesh" : {
				action : [
					{
						name : "SetMesh",	//绑定此entity的mesh
						param : [
							['name','mesh___camera']	//被绑定的模型名称。值：从world.xml中读取							
						]
					},
					{
						name : "SetAnimation",	//模型动作
						param : [
							['animation','stand'],	//设置模型行为
							['cycle',true]	//是否重复
							['reset',true]	//是否重置
							
						]
					},
					{
					   name :"SetVisible",
					   param :[
					     ['visible',false]  //模型的显示与隐藏，我现在用的是box  show and disappear
					 
					 ]
					}
				]
			},
			//线性运动
			"pclinearmovement" : {
				action : [
					{
						name : "InitCD",	//初始设置  //这是对实体的操作，查看是否执行其操作
						param : [
							['offset',[0, 0.0, 0]],
							['body',[0,0,0]],
							['legs',[0,0,0]]
						]
					}
				]
			},
			//范围
			"pctrigger" : {   //
				action : [
					{
						name : "SetupTriggerSphere",	//方圆感应
						param : [
							['sector', 'Scene'],	//地区设置为整个场景
							['position', [3, 0.2, -6]],	//中心位置
							['radius', 50]	//范围设置
						]
					}
				],
				property : [
					{
						name : "enable",	//是否可用
						value : true
					}
				]
			},
			//角色移动
			"pcactormove" : {
				action : [
					{
						name : "SetSpeed",	//初速度
						param : [
							['movement',4],	//移动速度
							['running',2],//奔跑速度
							['rotation',2],//旋转速度
							['jumping',8]//跳跃高度
						]
					}
				],
				property : [
					{
						name : "mousemove",	//鼠标移动
						value : false
					}
				]
			},
			//mesh选中
			"pcmeshselect" : {
				action : [
					{
						name : "SetCamera",		//摄像机绑定实体
						param : [
							['entity', 'player']	//设置被绑定的entity名称
						]
					},
					{
						name : "SetMouseButtons",	//设置鼠标按键
						param : [
							['buttons','r']		//设置鼠标键值
						]
					}
				],
				property : [
					{
						name : "global",	//选中时是否选中整体
						value : true
					},
					{
						name : "follow",	//是否跟随
						value : true
					}
				]
			},
			// 计时器
			"pctimer" : {
				action : [
					{
						name : "WakeUp",		//触发事件
						param : [
							['time', 1000],		//设置计时时间 是否执行重复
							['repeat', false],	//是否重复
							['name', 'position']	//所触发的方法
						]
					}
				]
			},
			//键盘输入
			"pccommandinput" : {
				action : [					
					//退出程序
					{
						name : "Bind",		//同上
						param : [
							['trigger','ESC'],			// 退出键
							['command','quit']			//事件quit
						]
					},
					//控制视角旋转
					{
						name : "Bind",		//同上
						param : [
								['trigger','MouseAxis0'],	//鼠标移动
								['command','mousemove']		//事件mousemove
						]
					},
					//鼠标左键状态
					{
						name : "Bind",		//同上
						param : [
								['trigger','MouseButton0'],		//鼠标左键
								['command','mouseleft']			//事件mouseleft
						]
					},
					//视角向前拉近
					{
						name : "Bind",   	//同上
						param : [
							['trigger', 'MouseButton3'],	//鼠标滚轮向前
							['command', 'mouseforward']		//事件mouseforward
						]
					},
					//视角向后拉远
					{
						name : "Bind",		//同上
						param : [
							['trigger', 'MouseButton4'],   //鼠标滚轮向后
							['command', 'mousebackward']	//事件mousebackward
						]
					},
					{
					
					 name : "Bind", //绑定按键
					 param:[
					    ['trigger','a'], //控制平行左移
						['command','paraxleft']
					 ]
					},
					{
					  name : "Bind",
					  param:[
					    ['trigger','d'],//控制平行右移
						['command','paraxright']
					  ]
					}
			
				]
			}
		},
		
		// 订阅来自entity自身发出的事件，类似于`ent.behavious();`，
		// 一般这些事件都是entity内部的property class发出的。
		event : {
		   //水平左移开始
			"pccommandinput_paraxleft1" : function(){
			  Event.Send({
					name: "player.effect.StrafeLeft",
					player: this
				});
			},
			//水平左移停止
			"pccommandinput_paraxleft0":function(){
			   Event.Send({
					name: "player.effect.StrafeLeft.stop",
					player: this
				});
			},
			"pccommandinput_paraxright1":function(){
			  	Event.Send({
					name: "player.effect.StrafeRight",
					player: this
				});
			},
			"pccommandinput_paraxright0":function(){
			  	Event.Send({
					name: "player.effect.StrafeRight.stop",
					player: this
				});
			},
			//使用event 必须使用全名。系统确保在函数内使用this会调用到相关联的entity上。
			"pctimer_position" : function(e){
				var pos = this.pcarray['pcmesh'].GetProperty("position");
		
				//发送消息调用effect.js中的定义过的某方法
				Event.Send({
					name : "broadcast.position",	//被调用的方法name
					player : this,	//调用的entity
					position : pos	//调用时所传的参数（可传可不传）
				});
				CONSOLE.Write("player's position is : ----------------------[" + pos.x + ", " + pos.y + ", " + pos.z + "] .\n");
			},
			"pccommandinput_quit0" : function(){
				System.Quit();//程序退出
			},	
			
			"pccommandinput_strafeleft1" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.strafeleft.start",
						self : this
					});
				}
			},
			//向左键弹起
			"pccommandinput_strafeleft0" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.strafeleft.stop",
						self : this
					});
				}
			},
			//向右键按下
			"pccommandinput_straferight1" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.straferight.start",
						self : this
					});
				}	
			},
			//向右键弹起
			"pccommandinput_straferight0" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.straferight.stop",
						self : this
					});
				}
			},
		
			//鼠标移动
			"pccommandinput_mousemove" : function (msgid, x, y){
				if(this.mouseleft){
					Event.Send({	//同上参考
						name : "effect.mousemove.start",
						self : this,
						mouse_x : x[1],	//调用时所传的参数
						mouse_y : y[1]	//调用时所传的参数
					});
				}   
			},
			//鼠标左键按下
			"pccommandinput_mouseleft1" : function (){
				CONSOLE.Write("[debug] [effect mousemove] : true .\n");	//输出
				this.mouseleft=true;//给entity属性赋值
			  
			},
			//鼠标左键弹起
			"pccommandinput_mouseleft0" : function (){
				this.mouseleft=false;//给entity属性赋值
			
				Event.Send({	//同上参考
						name : "effect.mousemove.stop",
						self : this
					});
			},
			//滚轮向前
			"pccommandinput_mouseforward1":function(){
				if(this.pcarray['pcdefaultcamera'].distance>-5){
					Event.Send({	//同上参考
						name:"effect.mouse.forward",
						self:this
					});
				}
			},
			//滚轮向后
			"pccommandinput_mousebackward1":function(){
				if(this.pcarray['pcdefaultcamera'].distance<10){
					Event.Send({	//同上参考
						name:"effect.mouse.backward",
						self:this
					});
				}
			}
		
		
		},
	// 订阅全局的事件。一般这些事件都是使用`Event.Send()`发送的。
		subscribe : {
			//谁会发出这些事件呢？答案是UI,所以，这里上接UI同事。
			
		}
	};
	
}
catch (e)
{
	alert(e);
}









