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


macroScript MeshName
category:"Superpolo"
internalcategory:"SppExportMeshName"
ButtonText:"Export MeshName" 
tooltip:"Spp Export MeshName" Icon:#("Maxscript",1)
(
-- 	meshgenName.xml Format
-- 	fn export outFile duration delaytime = 
-- 	(
-- 		format "<meshname>\n" to: outFile
-- 		for iobj in geometry do
-- 		(
-- 			format "\t<%/>\n" (iobj.name) to: outFile
-- 		)
-- 		format "</meshname>\n" to: outFile
-- 	)

-- 	meshgenNameJson.js Format	
-- 	fn export outFile duration delaytime = 
-- 	(
-- 		i=0
-- 		format "MESHNAME = {\n" to: outFile
-- 		for iobj in geometry do
-- 		(
-- 			format "\t\"%\":{\n" (i) to: outFile
-- 			i=i+1
-- 			format "\t\tname:\"%\"\n" (iobj.name) to: outFile
-- 			format "\t},\n" to: outFile
-- 		)
-- 		format "}\n" to: outFile
-- 	)

-- 	meshgenBlockJson.js Format
	fn export outFile xpitch zpitch = 
	(
-- 		need the max and min
-- 		Init the var
		xMinPos=0
		zMinPos=0
		xMaxPos=0
		zMaxPos=0
		xStep=-1
		zStep=-1
-- 		xpitch=20
-- 		zpitch=30
		for iobj in geometry do
		(
			pos = iobj.pos
			if pos.x <= xMinPos then
			(
				xMinPos = pos.x
			)
					
			if pos.y <= zMinPos	then	
			(
				zMinPos = pos.y
			)
			
			if pos.x >= xMaxPos then
			(
				xMaxPos = pos.x
			)
					
			if pos.y >= zMaxPos	then	
			(
				zMaxPos = pos.y
			)
		)
-- 		get the max and min : xMinPos zMinPos xMaxPos zMaxPos
		if (mod (xMaxPos-xMinPos) xpitch)==0.0 then xStep=0 else xStep=1
		if (mod (zMaxPos-zMinPos) zpitch)==0.0 then zStep=0 else zStep=1
	--  x Direction
		m=((xMaxPos-xMinPos) as integer)/xpitch+xStep
	--  z Direction
		n=((zMaxPos-zMinPos) as integer)/zpitch+zStep
		
		format "//  array[%][%]\n" (m) (n) to: outFile
		format "MESHNAME = {\n" to: outFile
		format "\txpitch : %,    //  X 轴向每段的大小\n" xpitch to: outFile
		format "\tzpitch : %,    //  Z 轴向(即3DMax中的Y轴向)每段的大小\n" zpitch to: outFile
		format "\tmin : [%, %],     //  需要meshGen的模型的最小postion，俯视坐标\n" (xMinPos) (zMinPos) to: outFile
		format "\tmax : [%, %],     //  需要meshGen的模型的最大postion，俯视坐标\n" (xMaxPos) (zMaxPos) to: outFile
		format "\tdata : {\n" to: outFile
		
		index=-1
		--	m is x
		for i=0 to (m-1) do
			--	n is z
			for j=0 to (n-1) do
			(
-- 				m==x  n==y
				index = index +1
				format "\t\t\"x_%_z_%\" : [\n" (i) (j) to: outFile
				for iobj in geometry do
				(
					if (iobj.pos.x <= (xMinPos+(i+1)*xpitch) and iobj.pos.x >= (xMinPos+i*xpitch) and iobj.pos.y <= (zMinPos+(j+1)*zpitch) and iobj.pos.y >= (zMinPos+j*zpitch))
						then format "\t\t\t\"%\",\n" (iobj.name) to: outFile
				)
				format "\t\t],\n" to: outFile
			)
		format "\t}\n" to: outFile
		format "}\n" to: outFile
	)
	
	rollout MeshName "MeshName" width:403 height:182
	(
		button btn1 "export" pos:[290,98] width:94 height:32
		label lbl1 "outputfile:" pos:[20,15] width:83 height:17
		edittext edt1 "" pos:[105,6] width:266 height:25
		edittext edt2 "" pos:[105,69] width:115 height:25
		edittext edt3 "" pos:[105,123] width:115 height:25
		label lbl2 "xpitch" pos:[30,75] width:72 height:18
		label lbl3 "zpitch" pos:[30,130] width:72 height:18
		on MeshName open do
		(
			edt1.text = "E:\\meshNameJs.js"
			edt2.text = "20"
			edt3.text = "30"
		)
		on btn1 pressed do
		(
			xpitch = (edt2.text as integer)
			zpitch = (edt3.text as integer)
			filename = edt1.text
			fileN_arr = filterString filename "\\"
			dir = ""
			for i = 1 to (fileN_arr.count-1) do
			(
				dir += fileN_arr[i] + "\\"
			)
			dir = substring dir 1  (dir.count-1)
			makeDir  dir  
			outFile = createFile filename
			export outFile xpitch zpitch
			close outFile 
			messageBox "exprot done"
		)
	)
	gw = newRolloutFloater "Spp Export MeshAnim" 480 230 
	addRollout MeshName gw 
)