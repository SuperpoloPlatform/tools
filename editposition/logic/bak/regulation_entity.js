//�����������ȹ���ʵ�֡�
try {
	CRA = {
		name : "cra",
		pc : {
			"pccommandinput" : {
				action : [
					{
						name : "Bind",//���ͳ����е���������
						param : [
							['trigger','PadMinus'],
							['command','darkness']
						]
					},
					{
						name : "Bind",  //��߳����е���������
						param : [
							['trigger','PadPlus'],
							['command','brilliance']
						]
					},
					{
						name : "Bind",  //��߳����еĶԱȶ�
						param : [
							['trigger','Ctrl+-'],
							['command','combinationadd']
						]
					},
					{
						name : "Bind",  //��߳����еĶԱȶ�
						param : [
							['trigger','Ctrl+='],
							['command','combinationcut']
						]
					},
					{
						name : "Bind",  //��ԭ
						param : [
							['trigger','Home'],
							['command','revert']
						]
					},
					{
						name : "Bind",//�رմ���
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
			/*  ���ͻ���������  */
			"pccommandinput_darkness1" : function(){
				Event.Send({
					name: "cra.effect.darkness",
					player: this
				});
			},
			//��߶Աȶ�ʹ����ϼ�
			"pccommandinput_combinationadd1" : function(){
				Event.Send({
					name: "cra.effect.combinationadd",
					player: this
				});
			},
			//���ͶԱȶ�ʹ����ϼ�
			"pccommandinput_combinationcut1" : function(){
				Event.Send({
					name: "cra.effect.combinationcut",
					player: this
				});
			},
			//��ԭ����
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
			//��ԭ����
			"pccommandinput_revert0" : function(){
				Event.Send({
					name: "cra.effect.revert.stop",
					player: this
				});
			},
			*/
			/*�����Աȶ�ʹ����ϼ�
			"pccommandinput_combination0" : function(){
				Event.Send({
					name: "cra.effect.combinationadd.stop",
					player: this
				});
			},
			*/
			/*  ���ͻ��������� 
			"pccommandinput_darkness0" : function(){
				Event.Send({
					name: "cra.effect.darkness.stop",
					player: this
				});
			},
			 */
			 /* ��߳����е���������
			"pccommandinput_brilliance0" : function(){
				Event.Send({
					name: "cra.effect.brilliance.stop",
					player: this
				});
			},
			*/
			/*  ��߻���������  */
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