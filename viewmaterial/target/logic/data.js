/************************************************************************
* this is a data.js
**************************************************************************/
try{
	//ui .scheme load
	UIDATA = {
		scheme : {
             filename : "3dMyou.scheme",
             mourseImgSet : "ice",
             mourseImgName : "MouseArrow" 
         },
         freeTypeFont : {
             "HeiTi" : {
                 filename : "/fonts/SIMHEI.TTF",
                 pointSize : "11",
                 antiAliased : "true",
                 autoScaled : "false",
                 nativeHorzRes : 1440,
                 nativeVertRes : 900
             },
             "FangSongTi" : {
                 filename : "/fonts/SIMFANG.TTF",
                 pointSize : "20",
                 antiAliased : "true",
                 autoScaled : "false",
                 nativeHorzRes : 1440,
                 nativeVertRes : 900
             },
			 "HuaWenXinWei" : {
                 filename : "/fonts/SIMFANG.TTF",
                 pointSize : "16",
                 antiAliased : "true",
                 autoScaled : "false",
                 nativeHorzRes : 1440,
                 nativeVertRes : 900
             },
             "KaiTi" : {
                 filename : "/fonts/SIMKAI.TTF",
                 pointSize : "18",
                 antiAliased : "true",
                 autoScaled : "false",
                 nativeHorzRes : 1440,
                 nativeVertRes : 900
             },
			 "LiShu" : {
                 filename : "/fonts/SIMKAI.TTF",
                 pointSize : "20",
                 antiAliased : "true",
                 autoScaled : "false",
                 nativeHorzRes : 1440,
                 nativeVertRes : 900
             }
		}
	};
	// ui .layout load
	
	UILAYOUT = {
	   	name : "3dMyou.layout",
		method :{
					
			//更改下拉按钮图片和显示快速定位
			pushedbox : function (){
			   Event.Send({
			      name:"pushedbox.effect.status",
				  self:this
			   });
			},
			pushedsphere : function(){
			   Event.Send({
			      name:"pushedsphere.effect.status",
				  self:this
			   });
			},
			pushedteapot:function(){
			    Event.Send({
			      name:"pushedteapot.effect.status",
				  self:this
			   });
			},
			changetextures1:function(){			 
			   Event.Send({
			      name:"change.textures.picture1",
				  self:this
			   });
			},
			changetextures2:function(){			 
			   Event.Send({
			      name:"change.textures.picture2",
				  self:this
			   });
			},
			changetextures3:function(){			 
			   Event.Send({
			      name:"change.textures.picture3",
				  self:this
			   });
			},
			changetextures4:function(){			 
			   Event.Send({
			      name:"change.textures.picture4",
				  self:this
			   });
			},
			changetextures5:function(){			 
			   Event.Send({
			      name:"change.textures.picture5",
				  self:this
			   });
			},
			changetextures6:function(){			 
			   Event.Send({
			      name:"change.textures.picture6",
				  self:this
			   });
			}										
		
		},
		//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------!
		window: {			
		    "3dMyou/box":{
			  property : {},
			  event:{
			  "MouseClick":"pushedbox"
			  },
			  subscribe:{}
			},
			  "3dMyou/sphere":{
			  property : {},
			  event:{
			  "MouseClick":"pushedsphere"
			  },
			  subscribe:{}
			},
			  "3dMyou/teapot":{
			    property : {},
			    event:{
			     "MouseClick":"pushedteapot"
			     },
			     subscribe:{}
		    	},
		   	  "3dMyou/material1":{
			      property : {},
			      event:{
			        "MouseClick":"changetextures1"
			      },
			     subscribe:{}
			 },	
	         "3dMyou/material2":{
			      property : {},
			      event:{
			        "MouseClick":"changetextures2"
			      },
			     subscribe:{}
			 },
			  "3dMyou/material3":{
			      property : {},
			      event:{
			        "MouseClick":"changetextures3"
			      },
			     subscribe:{}
			 },
			   "3dMyou/material4":{
			      property : {},
			      event:{
			        "MouseClick":"changetextures4"
			      },
			     subscribe:{}
			 },
			  "3dMyou/material5":{
			      property : {},
			      event:{
			        "MouseClick":"changetextures5"
			      },
			     subscribe:{}
			 },
			  "3dMyou/material6":{
			      property : {},
			      event:{
			        "MouseClick":"changetextures6"
			      },
			     subscribe:{}
			 }
        }	
	};
}catch(e){
	alert(e);
}