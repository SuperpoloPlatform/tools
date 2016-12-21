


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

-- Author ¡ı”¢ÃŒ
-- v 0.02
------------------------------------------------------------
*/








macroScript Spp_Export_node
category:"Superpolo"
internalcategory:"SppExportnode"
ButtonText:"Export node" 
tooltip:"Spp Export node" Icon:#("Maxscript",1)
(
	
	rollout prcnode "prcnode" width:402 height:128
	(
		button btn1 "export" pos:[259,56] width:94 height:32
		label lbl1 "outputfile:" pos:[14,9] width:83 height:17
		edittext edt1 "" pos:[108,6] width:266 height:22
		
		on prcnode open do
		(
			edt1.text = "C:\\node.xml"
		)
		on btn1 pressed do
		(
			objs = getcurrentselection()
			--print objs.count 
			if (objs.count == 0) then
			(
				message = "you need Select Some node!"
				messageBox message
				return 1
			)
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
			format "<xml>\n" to:outFile
			for obj in objs do
			(
				format "\t<node>\n" to:outFile
				format "\t\t<position>\n" to:outFile
				
				format "\t\t\t<x value = \"%\"/>\n" obj.pos.x to:outFile
				format "\t\t\t<y value = \"%\"/>\n" obj.pos.z to:outFile
				format "\t\t\t<z value = \"%\"/>\n" obj.pos.y to:outFile
				
				format "\t\t</position>\n" to:outFile				
				format "\t</node>\n" to:outFile
			)
			format "</xml>\n" to:outFile
			close outFile 
			messageBox "exprot done"
		)
	)
	gw = newRolloutFloater "Spp Export node" 450 164 
	addRollout prcnode gw 
)