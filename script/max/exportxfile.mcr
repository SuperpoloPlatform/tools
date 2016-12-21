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

--getUserProp <node> <key_string> setUserProp <node> <key_string> <value>



macroScript Spp_xfile_export
category:"Superpolo"
internalcategory:"Spp xfile export"
ButtonText:"Xfile Export" 
tooltip:"Spp xfile export" Icon:#("Maxscript",1)
(
	
	fn checkpPath = 
	(--get project path

		p =maxFilePath
		cmd = ""
		if p != "" then 
		(
			p_arr = filterString p "\\"
			local len = (p_arr.count)
			local bfound = false
			local artidx
			for idx = 2 to len - 1 do (
				if ( p_arr[idx] == "src" and  p_arr[idx + 1] == "art" ) do
				(
					bfound = true
					artidx = idx - 1
					break
				)
			)
			if(bfound) then(
				for ppidx = 1 to artidx do(
					if (cmd != "") then(
						cmd = cmd + "\\"
					)
					cmd = cmd + p_arr[ppidx] as string ;
				)
			)else
			(
				messagebox "请保存在正确的项目目录下！"
			)
		)else
		(
			messagebox "请保存场景！"
		)
		cmd

	)
	
 

	rollout Export "Export" width:201 height:131
	(
		editText edt1 "path" pos:[10,23] width:173 height:25
		button btn1 "Export" pos:[48,77] width:122 height:24
		on Export open do
		(
			edt1.text = checkpPath() +"\src\art\scene\\" + "scene.x"
		)
		
		on btn1 pressed do
		(
			filename = edt1.text
			
			exportfile filename #noPrompt selectedOnly:false

			messagebox "export end"
		)
		
		
	)
	createdialog Export
)	
