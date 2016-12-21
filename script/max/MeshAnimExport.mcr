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

-- Author liuyingtao  // todo
-- v 0.02
------------------------------------------------------------
*/

/*messagebox "hello maxscript!"
if (cameras.count == 1) then
(
	message = "ok!"
	messageBox message
)



dir ="c:\\"
filename = "c:\\camera.xml"
makeDir  dir
outFile = createFile filename
format "<library>\n" to:outFile

for c in cameras do
(
	format "\t<start name = \"%\">\n" c.name to:outFile
	format "\t\t<sector>Scene</sector>\n" to:outFile
	format "\t\t<position x=\"%\" y=\"%\" z=\"%\"/>\n" c.pos.x c.pos.y c.pos.z to:outFile
	format "\t\t<rotation x=\"%\" y=\"%\" z=\"%\"/>\n" c.rotation.x c.rotation.y c.rotation.z to:outFile
	format "\t</start>\n" to:outFile                              
) 


format "</library>\n" to:outFile
close outFile */









macroScript Spp_Export_MeshAnim
category:"Superpolo"
internalcategory:"SppExportMeshAnim"
ButtonText:"Export MeshAnim" 
tooltip:"Spp Export MeshAnim" Icon:#("Maxscript",1)
(
	fn export outFile duration delaytime = 
	(
		format "<wanders>\n" to:outFile
		for selectcamera in selection do
		(
			
			format "\t<wander>\n" to:outFile
-- 				// todo
-- 				format "\t\t<meshObj name = \"%\" />\n" (selectcamera.name) to:outFile
				local eular = (quatToEuler ((selectcamera.transform) as quat))
				format "\t\t<start posX=\"%\" posY=\"%\" posZ=\"%\" rotX=\"%\" rotY=\"%\" rotZ=\"%\" />\n" (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y) (-((eular.x-90)/180)*3.1415926) (-((eular.z)/180)*3.1415926) (-((eular.y)/180)*3.1415926)  to: outFile
				format "\t\t<wander0 posX=\"%\" posY=\"%\" posZ=\"%\" rotX=\"%\" rotY=\"%\" rotZ=\"%\" />\n" (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y) (-((eular.x-90)/180)*3.1415926) (-((eular.z)/180)*3.1415926) (-((eular.y)/180)*3.1415926)  to: outFile
			
-- 					format "\t\t<move x=\"%\" y=\"%\" z=\"%\" />\n" (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y)  to: outFile
-- 					local eular = (quatToEuler ((selectcamera.transform) as quat))
			
-- 					format "\t\t<rotate mesh=\"%\" duration=\"%\">\n" selectcamera.name duration to: outFile
-- 						format "\t\t\t<rotx>%</rotx>\n" -(((eular.x - 90)/180)*3.1415926) to: outFile
-- 						format "\t\t\t<rotz>%</rotz>\n" -(((eular.y)/180)*3.1415926) to: outFile
-- 						format "\t\t\t<roty>%</roty>\n" -(((eular.z)/180)*3.1415926) to: outFile
-- 					format "\t\t</rotate>\n" to: outFile
-- 				format "\t\t</start>\n" to:outFile
-- 				format "\t\t<mesh value=\"%\" />\n" selectcamera.name to:outFile
-- 				format "\t\t<duration value=\"%\" />\n" duration to:outFile
					
			for t in animationRange.start to animationRange.end by (1s/30) do
			(
				if(t>=1) then
				(
-- 					--print (classof t) 
-- 					if((mod (t.frame) 10.0) != 0.0) do
-- 					(
-- 						continue
-- 					)
-- 					at time (t-1)
-- 					(
-- 						posf = selectcamera.pos
-- 						transformf = selectcamera.transform
-- 				
-- 						itransformf = inverse transformf
-- 						
-- 					)
					at time t 
					(
						--format "\t\t<move mesh=\"%\" duration=\"%\" x=\"%\" y=\"%\" z=\"%\" />\n" selectcamera.name duration (selectcamera.pos.x-posf.x) (selectcamera.pos.z-posf.z) (selectcamera.pos.y-posf.y)  to: outFile
-- 						format "\t\t<move mesh=\"%\" duration=\"%\" x=\"%\" y=\"%\" z=\"%\" />\n" selectcamera.name duration (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y)  to: outFile
						
						thistransform = selectcamera.transform
				
						--tmptransform = itransformf * thistransform
						local eular = (quatToEuler (thistransform as quat))
										
-- 						format "\t\t<rotate mesh=\"%\" duration=\"%\">\n" selectcamera.name duration to: outFile
						format "\t\t<wander% posX=\"%\" posY=\"%\" posZ=\"%\" rotX=\"%\" rotY=\"%\" rotZ=\"%\" />\n" (t.frame as integer) (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y) (-((eular.x-90)/180)*3.1415926) (-((eular.z)/180)*3.1415926) (-((eular.y)/180)*3.1415926)  to: outFile
-- 						format "\t\t<seq% Mx=\"%\" My=\"%\" Mz=\"%\" Rx=\"%\" Ry=\"%\" Rz=\"%\" />\n" (t.frame as integer) (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y) (-((eular.x-90)/180)*3.1415926) (-((eular.z)/180)*3.1415926) (-((eular.y)/180)*3.1415926)  to: outFile
-- 						format "\t\t\t<rotx>%</rotx>\n" (((eular.x)/180)*3.1415926) to: outFile
-- 						format "\t\t\t<rotz>%</rotz>\n" (((eular.y)/180)*3.1415926) to: outFile
-- 						format "\t\t\t<roty>%</roty>\n" -(((eular.z)/180)*3.1415926) to: outFile
-- 						
-- 						format "\t\t</rotate>\n" to: outFile
-- 							
-- 						format "\t\t<delay time=\"%\"/>\n" delaytime to: outFile
					)
				)
				/*else
				(
					at time t 
					(
						format "\t\t<move mesh=\"%\" duration=\"%\" x=\"%\" y=\"%\" z=\"%\" />\n" selectcamera.name duration selectcamera.pos.x selectcamera.pos.z selectcamera.pos.y  to: outFile
						
						local eular = (quatToEuler (selectcamera.transform as quat))					
						format "\t\t<rotate mesh=\"%\" duration=\"%\">\n" selectcamera.name duration to: outFile
							
						format "\t\t\t<rotx>\"%\"</rotx>\n" eular.x to: outFile
						format "\t\t\t<roty>\"%\"</roty>\n" eular.z to: outFile
						format "\t\t\t<rotz>\"%\"</rotz>\n" eular.y to: outFile
						
						format "\t\t</rotate>\n" to: outFile
							
						format "\t\t<delay time=\"%\"/>\n" delaytime to: outFile
					)
				)*/
			)
			format "\t</wander>\n\n" to:outFile
		)
		
		format "</wanders>\n" to:outFile
	)
	rollout prccamera "MeshAnim" width:402 height:128
	(
		button btn1 "export" pos:[259,56] width:94 height:32
		label lbl1 "outputfile:" pos:[14,9] width:83 height:17
		edittext edt1 "" pos:[108,6] width:266 height:22
		label lbl2 "duration:" pos:[25,43] width:63 height:22
		label lbl3 "delay time:" pos:[10,78] width:81 height:19
		edittext edt2 "" pos:[107,40] width:115 height:22
		edittext edt3 "" pos:[107,76] width:115 height:22
		on prccamera open do
		(
			edt1.text = "C:\\MeshAnim.xml"
			edt2.text = "20"
			edt3.text = "20"
		)
		on btn1 pressed do
		(
			if (selection.count == 0) then
			(
				message = "you need Select Some Mesh!"
				messageBox message
				return 1
			)
			filename = edt1.text
			duration = edt2.text
			delaytime = edt3.text
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
	addRollout prccamera gw 
)