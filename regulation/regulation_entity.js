//调整场景亮度功能实现。
try {
	BRA = {
		name : "bra",
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
					name: "bra.effect.darkness",
					player: this
				});
			},
			/*  降低环境的亮度 
			"pccommandinput_darkness0" : function(){
				Event.Send({
					name: "bra.effect.darkness.stop",
					player: this
				});
			},
			 */
			 /* 提高场景中的整体亮度
			"pccommandinput_brilliance0" : function(){
				Event.Send({
					name: "bra.effect.brilliance.stop",
					player: this
				});
			},
			*/
			/*  提高环境的亮度  */
			"pccommandinput_brilliance1" : function(){
				Event.Send({
					name: "bra.effect.brilliance",
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