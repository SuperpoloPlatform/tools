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



macroScript Spp_Effect_Edit
category:"Superpolo"
internalcategory:"Spp Effect Edit"
ButtonText:"Effect Edit" 
tooltip:"Spp Edit Effect" Icon:#("Maxscript",1)
(
	rollout effect "Effect" width:162 height:300
	(
		button btn1 "Glass" pos:[21,59] width:100 height:25
		button btn2 "Matel" pos:[21,100] width:100 height:25
		label lbl1 "please click the effect you want" pos:[12,8] width:120 height:39
		button btn9 "export" pos:[36,247] width:104 height:26
		editText edt3 "" pos:[29,208] width:114 height:24
		
		
		on effect open do
		(
			edt3.text = "C:\\effect.xml"
		)
		
		
		on btn1 pressed do
		(
			--编辑玻璃材质的相应属性
			rollout glasseffectedit "glass" width:184 height:300
			(
				label lbl2 "reflection opacity" pos:[9,37] width:137 height:21
				button btn5 "set" pos:[72,247] width:50 height:28
				label lbl5 "specular(vector4)" pos:[11,103] width:137 height:21
				editText edt1 "" pos:[20,63] width:101 height:25
				editText edt2 "" pos:[20,129] width:101 height:25
				
				on glasseffectedit open do
				(
					edt1.text = "0.8"
					edt2.text = "1,1,1,1"
		
				)
				on btn5 pressed do
				(
					for iobj in selection do
					(
						setUserProp iobj "effecttype" "glass"
						
						setUserProp iobj "reflectionopacity" (edt1.text)
						
						setUserProp iobj "specular" (edt2.text)
					)
				)
			)
			
			glasseffect = newRolloutFloater "glasseffect" 162 300 
			addRollout glasseffectedit glasseffect 
		)
		
		
		
		on btn2 pressed do
		(
			--编辑金属材质的相应属性
			rollout mateleffectedit "matel" width:184 height:300
			(
				label matellbl2 "reflection opacity" pos:[9,37] width:137 height:21
				button matelbtn5 "set" pos:[72,247] width:50 height:28
				label matellbl5 "specular(vector4)" pos:[11,103] width:137 height:21
				editText mateledt1 "" pos:[20,63] width:101 height:25
				editText mateledt2 "" pos:[20,129] width:101 height:25
				
				on mateleffectedit open do
				(
					mateledt1.text = "0.8"
					mateledt2.text = "1,1,1,1"
		
				)
				on matelbtn5 pressed do
				(
					for iobj in selection do
					(
						setUserProp iobj "effecttype" "matel"
						
						setUserProp iobj "reflectionopacity" (mateledt1.text)
						
						setUserProp iobj "specular" (mateledt2.text)
					)
				)
			)
			
			mateleffect = newRolloutFloater "mateleffect" 162 300 
			addRollout mateleffectedit mateleffect
		)
		
		
		on btn9 pressed do
		(
			filename = edt3.text
			fileN_arr = filterString filename "\\"
			dir = ""
			for i = 1 to (fileN_arr.count-1) do
			(
				dir += fileN_arr[i] + "\\"
			)
			dir = substring dir 1  (dir.count-1)
			makeDir  dir  
			outFile = createFile filename

			for iobj in objects do
			(
				if (getUserProp iobj "effecttype")==undefined do
				(
					continue
				)
				format "<meshfact name = \"%\">\n" iobj.name to:outFile
				
				format "\t<effect effecttype = \"%\">\n" (getUserProp iobj "effecttype") to:outFile
				
				
				
				format "\t\t<shader type=\"%\">reflectsphere</shader>\n" "diffuse" to:outFile
				format "\t\t<shader type=\"%\">reflectsphere</shader>\n" "base" to:outFile
				
				format "\t\t<shadervar type=\"%\" name=\"%\">%</shadervar>\n" "float" "reflection opacity" (getUserProp iobj "reflectionopacity") to:outFile
				format "\t\t<shadervar type=\"%\" name=\"%\">%</shadervar>\n" "vector4" "specular" (getUserProp iobj "specular") to:outFile
				
				format "\t</effect>\n" to:outFile
				
				format "</meshfact>\n" to:outFile

			)
			close outFile 
		)
	)
	gw = newRolloutFloater "Spp Effect Edit" 162 300 
	addRollout effect gw 
)
