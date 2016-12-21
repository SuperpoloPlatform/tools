//调整场景亮度功能实现。
try {
	CRA = {
		name : "cra",
		pc : {
			"pccommandinput" : {
				action : [
					{
						name : "Bind",//降低场景中的整体亮度
						param : [
							['trigger','PadMinus'],
							['command','darkness']
						]
					},
					{
						name : "Bind",  //提高场景中的整体亮度
						param : [
							['trigger','PadPlus'],
							['command','brilliance']
						]
					},
					{
						name : "Bind",  //提高场景中的对比度
						param : [
							['trigger','Ctrl+-'],
							['command','combinationadd']
						]
					},
					{
						name : "Bind",  //提高场景中的对比度
						param : [
							['trigger','Ctrl+='],
							['command','combinationcut']
						]
					},
					{
						name : "Bind",  //还原
						param : [
							['trigger','Home'],
							['command','revert']
						]
					},
					{
						name : "Bind",//关闭窗体
						param : [
							['trigger','ESC'],
							['command','quit']
						]
					}
				]
			},
			"pclight" : {
				
			}
		},
		event : {
			//close
			"pccommandinput_quit1" : function(){
				System.Quit();
			},
			/*  降低环境的亮度  */
			"pccommandinput_darkness1" : function(){
				Event.Send({
					name: "cra.effect.darkness",
					player: this
				});
			},
			//提高对比度使用组合键
			"pccommandinput_combinationadd1" : function(){
				Event.Send({
					name: "cra.effect.combinationadd",
					player: this
				});
			},
			//降低对比度使用组合键
			"pccommandinput_combinationcut1" : function(){
				Event.Send({
					name: "cra.effect.combinationcut",
					player: this
				});
			},
			//还原功能
			"pccommandinput_revert1" : function(){
				Event.Send({
					name: "cra.effect.revert",
					player: this
				});
			},
			/*
			"pccommandinput_combinationcut0" : function(){
				Event.Send({
					name: "cra.effect.combinationcut.stop",
					player: this
				});
			},
			*/
			/*
			//还原功能
			"pccommandinput_revert0" : function(){
				Event.Send({
					name: "cra.effect.revert.stop",
					player: this
				});
			},
			*/
			/*调整对比度使用组合键
			"pccommandinput_combination0" : function(){
				Event.Send({
					name: "cra.effect.combinationadd.stop",
					player: this
				});
			},
			*/
			/*  降低环境的亮度 
			"pccommandinput_darkness0" : function(){
				Event.Send({
					name: "cra.effect.darkness.stop",
					player: this
				});
			},
			 */
			 /* 提高场景中的整体亮度
			"pccommandinput_brilliance0" : function(){
				Event.Send({
					name: "cra.effect.brilliance.stop",
					player: this
				});
			},
			*/
			/*  提高环境的亮度  */
			"pccommandinput_brilliance1" : function(){
				Event.Send({
					name: "cra.effect.brilliance",
					player: this
				});
			}
		}
	};
}
catch (e)
{
	alert(e);
}