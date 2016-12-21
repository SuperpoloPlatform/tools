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
try{
	/**********************************************
	* MINI_MAP={ index : 3,现在地图比例的大小
	*	data : {   id:{
	*					areaSize :""
	*					xrationx :
	*					zrationy :
	*					ui_x :
	*					ui_y :
	*					width :
	*					height:
	*		}}
	****************************************************/
	MINI_MAP={
        index : 1,
        data :{
                1 :{
                        areaSize :"{{1.024,0},{0.922,0}}",
                        xrationx :-124.12752211093903,
                        zrationy :360.64157879016403,
                        ui_x :-2.68,
                        ui_y :-2.79,
                        pos_x :127.10658264160156,
                        pos_z :-332.51153564453125,
                        width :1.024,
                        height :0.922
                },
                2 :{
                        areaSize :"{{1.536,0},{1.383,0}}",
                        xrationx :-82.75168140729268,
                        zrationy :240.4277191934427,
                        ui_x :-4.33,
                        ui_y :-4.47,
                        pos_x :127.10658264160156,
                        pos_z :-332.51153564453125,
                        width :1.536,
                        height :1.383
                },
                3 :{
                        areaSize :"{{2.048,0},{1.844,0}}",
                        xrationx :-62.003211044683695,
                        zrationy :180.32078939508202,
                        ui_x :-5.99,
                        ui_y :-6.13,
                        pos_x :127.10658264160156,
                        pos_z :-332.51153564453125,
                        width :2.05,
                        height :1.844
                },
                4 :{
                        areaSize :"{{2.56,0},{2.305,0}}",
                        xrationx :-49.65100884437561,
                        zrationy :144.2566315160656,
                        ui_x :-7.63,
                        ui_y :-7.81,
                        pos_x :127.10658264160156,
                        pos_z :-332.51153564453125,
                        width :2.56,
                        height :2.305
                },
                5 :{
                        areaSize :"{{3.072,0},{2.766,0}}",
                        xrationx :-41.37584070364634,
                        zrationy :120.21385959672135,
                        ui_x :-9.34,
                        ui_y :-9.51,
                        pos_x :127.10658264160156,
                        pos_z :-332.51153564453125,
                        width :3.072,
                        height :2.766
                }
        }
}
}catch(e){
	alert(e);
}