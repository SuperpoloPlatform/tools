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



macroScript Spp_matpro_export
category:"Superpolo"
internalcategory:"Spp matpro export"
ButtonText:"Matpro Export" 
tooltip:"Spp matpro export" Icon:#("Maxscript",1)
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
	
 
 
 fn exprotmat outFile = 
 (
	 format "<materials>\n" to:outFile
 
	 for mat in scenematerials do
	 (
		if((classof mat) == Standardmaterial) then
		(
			matname = mat.name 
			for i=1 to matname.count do
			(
				if(matname[i] == " ") or (matname[i] == "#") or (matname[i] == ".")  do
				(
					matname[i] = "_"
				)
			)
				
				
				
			format "\t<% type = \"%\" twoSided = \"%\"/>\n" matname "Standardmaterial" mat.twoSided to:outFile
			
			
			
			
			
		)
		else
		(
			if((classof mat) == Multimaterial) do
			(
				--format "\t<material name = \"%\" type = \"%\">\n" mat.name "Multimaterial" to:outFile
				
				submatnum = getNumSubMtls mat
				
				matname = mat.name 
				for i=1 to matname.count do
				(
					if(matname[i] == " ") or (matname[i] == "#") or (matname[i] == ".") do
					(
						matname[i] = "_"
					)
				)
						
						
				for im = 1 to submatnum do
				(
					if((classof (mat[im])) == Standardmaterial) do
					(
						submatname = mat[im].name
						for i=1 to submatname.count do
						(
							if(submatname[i] == " ") or (submatname[i] == "#") or (submatname[i] == ".")  do
							(
								submatname[i] = "_"
							)
						)
						
						
						format "\t<% ftype = \"%\" type = \"%\" twoSided = \"%\"/>\n" (matname + "_" + submatname + "Sub" + ((im-1) as string)) "Multimaterial" "Standardmaterial" mat[im].twoSided to:outFile
						
						

					)
				)
				
				--format "\t</material>\n" to:outFile
			)
		)
		
	 )
	 
	 
	 
	 format "</materials>\n" to:outFile

 )


	rollout Export "Export" width:201 height:131
	(
		editText edt1 "path" pos:[10,23] width:173 height:25
		button btn1 "Export" pos:[48,77] width:122 height:24
		on Export open do
		(
			edt1.text = checkpPath() +"\src\art\scene\\" + "matpro.xml"
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
			exprotmat outFile
			close outFile
		)
		
		
	)
	createdialog Export
)	
