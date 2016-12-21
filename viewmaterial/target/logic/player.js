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
		name : "player",//定义entity的name
		pc : {
			//地图管理器
			"pczonemanager" : {
				action : [
					{
						name : "Load",	//加载文件，一般为xml文件
						param : [
							['path', '.'],	//路径
							['file', 'art/level.xml']	//文件名称
						]
					}
				]
			},
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
							['entity', 'player'], 	//同name一致，将摄像机绑定到模型上
							['region', 'main'],		//
							['start', 'Camera']		//
						]
					}
				],
				property : [
					{
						/* name : "distance",		//设置摄像机离模型的远近
						value : 3.8		//目前大于0的情况下是正确的；等于0时摄像机会跑到人前面去，前后变反，左右无作用；小于0时，所有功能全变反。
			 */		
			    distance : 5,
				pressbtnpromp: false,
				mousebtnpromp:false
			 
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
							['name','mesh_camera']	//被绑定的模型名称。值：从world.xml中读取							
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
					     ['visible',false]
					   ]
					}
				]
			},
			//线性运动
			"pclinearmovement" : {
				action : [
					{
						name : "InitCD",	//初始设置  //是否为实体
						param : [
							['offset',[0, 0.0, 0]],
							['body',[0,0,0]],
							['legs',[0,0,0]]
						]
					}
				]
			},
			//范围
			"pctrigger" : {
				action : [
					{
						name : "SetupTriggerSphere",	//方圆感应
						param : [
							['sector', 'Scene'],	//地区设置为整个场景
							['position', [3, 0.2, -6]],	//位置
							['radius', 10]	//范围设置
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
							['time', 1000],		//设置计时时间
							['repeat', false],	//是否重复
							['name', 'position']	//所触发的方法
						]
					}
				]
			},
			// "pcinventory" :{
				// action : [
					// {
						// name : "AddTemplate",
						// param : [
							// ['name', 'test'],
							// ['amount', 2],
							// ['returns', true]
						// ]
					// }
				// ]
			// },
			//键盘输入
			"pccommandinput" : {
				action : [
					//向前移动
					{
						name : "Bind",		//绑定键值
						param : [
							['trigger','w'],	//设置键值w键
							['command','forward']	//所触发的事件forward
						]
					},
					//向后移动
					{
						name : "Bind",		//同上
						param : [
							['trigger','s'],	//s键
							['command','backward']	//事件backward
						]
					},
					//向左旋转
					{
						name : "Bind",		//同上
						param : [
							['trigger','a'],	//a键
							['command','rotateleft']	//事件rotateleft
						]
					},
					//向右旋转
					{
						name : "Bind",		//同上
						param : [
							['trigger','d'],	//d键
							['command','rotateright']	//事件rotateright
						]
					},
					//向左移动
					{
						name : "Bind",		//同上
						param : [
							['trigger','left'],	//向左键位
							['command','strafeleft']	//事件strafeleft
						]
					},
					//向右移动
					{
						name : "Bind",		//同上
						param : [
							['trigger','right'],	//向右键位
							['command','straferight']	//事件straferight
						]
					},
					//跳跃
					{
						name : "Bind",		//同上
						param : [
							['trigger','space'],	//空格键
							['command','jump']		//事件jump
						]
					},
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
					//隐身
					{
						name : "Bind",		//同上
						param : [
							['trigger', 'v'],   //v键
							['command', 'visible']	//事件visible
						]
					},
					//人称视角切换
					{
						name : "Bind",		//同上
						param : [
							['trigger','tab'],   //tab键
							['command','cameraPerson']	//事件cameraPerson
						]
					},
					//加速移动
					{
						name : "Bind",		//同上
						param : [
							['trigger','shift'],   //shift键
							['command','hurry']	//事件hurry
						]
					},
					//自杀
					{
						name : "Bind",		//同上
						param : [
							['trigger','k'],   //k键
							['command','death']	//事件death
						]
					},
				]
			}
		},
		
		// 订阅来自entity自身发出的事件，类似于`ent.behavious();`，
		// 一般这些事件都是entity内部的property class发出的。
		event : {
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
			//W键按下
			"pccommandinput_forward1" : function(){
				if(this.state!="die"){
					//发送消息调用effect.js中的定义过的某方法
					Event.Send({
						name : "effect.forward.start",	//被调用的方法name
						self : this	//调用的entity
					});
				}
			},
			//W键弹起
			"pccommandinput_forward0" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.forward.stop",
						self : this
					});
				}
			},
			//S键按下
			"pccommandinput_backward1" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.backward.start",
						self : this
					});
				}
			},
			//S键弹起
			"pccommandinput_backward0" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.backward.stop",
						self : this
					});
				}
			},
			//A键按下
			"pccommandinput_rotateleft1" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.rotateleft.start",
						self : this
					});
				}
			},
			//A键弹起
			"pccommandinput_rotateleft0" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.rotateleft.stop",
						self : this
					});
				}
			},
			//D键按下
			"pccommandinput_rotateright1" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.rotateright.start",
						self : this
					});
				}
			},
			//D键弹起
			"pccommandinput_rotateright0" : function(){
				if(this.state!="die"){
					Event.Send({	//同上参考
						name : "effect.rotateright.stop",
						self : this
					});
				}
			},
			//向左键按下
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
			//跳跃
			"pccommandinput_jump1":function(){
				if(this.state!="die"){
				this.pcarray['pctimer'].WakeUp(800,false,'jumpStop');
					Event.Send({	//同上参考
						name : "effect.jump",
						self : this
					});
				}
			},
			//跳跃结束
			"pctimer_jumpStop" : function(){
				Event.Send({	//同上参考
					name : "effect.jump.stop",
					self : this
				});
			},
			//鼠标移动
			"pccommandinput_mousemove" : function (msgid, x, y){
				if(this.mouseleft){
					Event.Send({	//同上参考
						name : "effect.mousemove.start",
						self : this,
						mouse_x : x[1],	//调用时所传的参数
						mouse_y : y[1],	//调用时所传的参数
						pressbtnpromp:true
					    
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
				if(this.pcarray['pcdefaultcamera'].distance<5){
					Event.Send({	//同上参考
						name:"effect.mouse.backward",
						self:this
					});
				}
			},
			//选中mesh---------------------------------------------------------------------------------!!!!!
			"pcmeshsel_down" : function (msgid, x, y, button, entity) {
				var sel = entity[1];	//接收选中的第一个mesh对象
				CONSOLE.WriteLine("[Debug] [name]: '" + sel.name + "' is selected from mouse.");
			},
			//隐身
			"pccommandinput_visible1":function(){
				if(this.state!="die"){
					this.pcarray['pctimer'].WakeUp(5000,false,'visibleStop');	//计时5秒触发隐身结束功能visibleStop
					Event.Send({	//同上参考
						name:"effect.visible.start",
						self:this
					});
				}
			},
			//隐身结束
			"pctimer_visibleStop":function(){
				Event.Send({	//同上参考
					name:"effect.visible.stop",
					self:this
				});
			},
			//人称视角切换
			"pccommandinput_cameraPerson1":function(){
				if(this.person=="firstperson"){
					this.person="thirdperson";//给entity属性赋值
				}else{
					this.person="firstperson";//给entity属性赋值
				}
				Event.Send({	//同上参考
					name:"effect.camera.person",
					self:this
				});
			},
			//加速移动
			"pccommandinput_hurry1":function(){
				if(this.state=="run"){
					Event.Send({	//同上参考
						name:"effect.hurry.start",
						self:this
					});
				}
			},
			//停止加速移动
			"pccommandinput_hurry0":function(){
				if(this.state=="run"){
					Event.Send({	//同上参考
						name:"effect.hurry.stop",
						self:this
					});
				}
			},
			//自杀
			"pccommandinput_death1":function(){
				if(this.state!="die"){
					this.pcarray['pctimer'].WakeUp(10000,false,'bornAgain');	//计时10秒触发重生功能bornAgain
					Event.Send({	//同上参考
						name:"effect.death",
						self:this
					});
				}
			},
			//自动重生
			"pctimer_bornAgain":function(){
				var position=this.pcarray['pcmesh'].GetProperty("position");	//获得当前mesh位置坐标
				this.pcarray['pcmesh'].MoveMesh([position.x+5,position.y,position.z-5]);	//将mesh移动到周围5个单位之内
				this.state="stand";		//让entity重生，entity重新可以控制
			},
			//进入范围
			"pctrigger_entityenters" : function (){
				var pos = this.pcarray['pcmesh'].GetProperty("position");	//角色当前坐标
				CONSOLE.Write("[debug] [tigger in]" + pos.x + "," + pos.y + "," + pos.z+".\n");	//输出
			},
			//退出范围
			"pctrigger_entityleaves" : function (){
				var pos = this.pcarray['pcmesh'].GetProperty("position");	//角色当前坐标
				CONSOLE.Write("[debug] [tigger out]" + pos.x + "," + pos.y + "," + pos.z+".\n");//输出
			},
		},
		// 为这个entity添加属性。
		property : {
			type : "player",
			life : 100, // 当前生命值
			mouseleft:false,//鼠标左键状态，true为按下，false为弹起
			person:"thirdperson",//人称视角状态，firstperson为第一人称视角，thirdperson为第三人称视角，目前这两种
			state : "stand", // 状态分为stand,attack,run，其他的状态想到再补充。
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