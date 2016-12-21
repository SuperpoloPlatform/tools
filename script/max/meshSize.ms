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


macroScript MeshSize
category:"Superpolo"
internalcategory:"SppExportMeshSize"
ButtonText:"Export MeshSize" 
tooltip:"Spp Export MeshSize" Icon:#("Maxscript",1)
(
	fn export outFile duration delaytime = 
	(
		format "<meshsize>\n" to: outFile
		for iobj in geometry do
		(
			ct = iobj.center
			mx = iobj.max
			mn = iobj.min

			format "\t<meshmax name = \"%\" difX = \"%\" difY = \"%\" difZ = \"%\" />\n" (iobj.name) (mx.x) (mx.z) (mx.y) to: outFile
			format "\t<meshmin name = \"%\" difX = \"%\" difY = \"%\" difZ = \"%\" />\n" (iobj.name) (mn.x) (mn.z) (mn.y) to: outFile
			format "\t<meshcenter name = \"%\" difX = \"%\" difY = \"%\" difZ = \"%\" />\n" (iobj.name) (ct.x) (ct.z) (ct.y) to: outFile
			
			format "\t<meshdiff name = \"%\" difX = \"%\" difY = \"%\" difZ = \"%\" />\n" (iobj.name) (mx.x - ct.x) (mx.z - ct.z) (mx.y - ct.y) to: outFile
		)
		format "</meshsize>\n" to: outFile
	)
	rollout MeshSize "MeshSize" width:402 height:128
	(
		button btn1 "export" pos:[142,58] width:94 height:32
		label lbl1 "outputfile:" pos:[14,9] width:83 height:17
		edittext edt1 "" pos:[108,6] width:266 height:22
		on MeshSize open do
		(
			edt1.text = "D:\\meshsize.xml"
		)
		on btn1 pressed do
		(
		
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
			export outFile  duration delaytime
			close outFile 
			messageBox "exprot done"
		)
	)
	gw = newRolloutFloater "Spp Export MeshAnim" 450 164 
	addRollout MeshSize gw 
)