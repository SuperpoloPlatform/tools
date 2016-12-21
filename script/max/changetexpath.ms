/*----------------------------------------------------------
--	
-- Copyright (C) 2012 Sanpolo Co.LTD
-- http://www.spolo.org
--
--  This file is part of the UGE(Uniform Game Engine).
--  Copyright (C) by SanPolo Co.Ltd. 
--  All rights reserved.
--
--  See http://uge.spolo.org/ for more information.
--
--  SanPolo Co.Ltd
--  http://uge.spolo.org/  sales@spolo.org uge-support@spolo.org

--
------------------------------------------------------------
*/
macroScript Spp_Texpath_Edit
category:"Superpolo"
internalcategory:"Spp Texpath Edit"
ButtonText:"Texpath Edit" 
tooltip:"Spp Edit Texpath" Icon:#("Maxscript",1)
(
	rollout texpath "texpath" width:394 height:194
	(
		editText edt1 "newpath" pos:[30,69] width:273 height:21
		button btn1 "change" pos:[212,134] width:104 height:28
		
		
		on btn1 pressed do
		(
			for iobjt in  geometry do
			(
				tmat = iobjt.material
				tsubmatnumber = getNumSubMtls tmat
				if tsubmatnumber == 0 do
				(
					 tmtexfilename = tmat.diffuseMap.filename
					 texNameArr = filterString tmtexfilename "\\."
					 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
					
					
					 tmat.diffuseMap.filename = (edt1.text)+texname
				)
				if tsubmatnumber >0 do
				(
					for itm = 1 to tsubmatnumber do
					(
						 itsmat = getSubMtl tmat itm
						
						if itsmat == undefined do
						 (
							 --print submatnum
							 --submatnum = submatnum + 1
							 continue
						  )
						 tmtexfilename = itsmat.diffuseMap.filename
						 texNameArr = filterString tmtexfilename "\\."
						 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
						
						
						 itsmat.diffuseMap.filename = (edt1.text)+texname
					)
				)
			)
			messagebox "ÌùÍ¼Â·¾¶ÐÞ¸ÄÍê±Ï£¡"
		)
		
	)
	
	texpathedit = newRolloutFloater "texpathedit" 394 200 
	addRollout texpath texpathedit 
)
