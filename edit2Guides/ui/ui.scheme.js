/************************************************************************
* this is a data.js
**************************************************************************/
try{
	//ui .scheme load
	UIDATA = {
		scheme : {
			filename : "general.scheme",
			mourseImgSet : "ice",
			mourseImgName : "MouseArrow"
		},
		freeTypeFont : {
			"You8" : {
			    filename : "/tools/ui/fonts/SIMYOU.TTF",
			    pointSize : "8",
				antiAliased : "true",
			    autoScaled : "true",
			    nativeHorzRes : 800,
				nativeVertRes : 600
			},
		    "You10" : {
			    filename : "/tools/ui/fonts/SIMYOU.TTF",
			    pointSize : "10",
				antiAliased : "true",
			    autoScaled : "true",
			    nativeHorzRes : 800,
				nativeVertRes : 600
			},
			"You12" : {
			    filename : "/tools/ui/fonts/SIMYOU.TTF",
			    pointSize : "12",
				antiAliased : "true",
			    autoScaled : "true",
			    nativeHorzRes : 800,
				nativeVertRes : 600
			},
			"You14" : {
			    filename : "/tools/ui/fonts/SIMYOU.TTF",
			    pointSize : "14",
				antiAliased : "true",
			    autoScaled : "true",
			    nativeHorzRes : 800,
				nativeVertRes : 600
			}
		}
	};
	UI_IMAGE = {};
}catch(e){
	alert(e);
}