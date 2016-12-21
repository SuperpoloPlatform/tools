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

 macroScript Spp_Export_Lights
category:"Superpolo"
internalcategory:"SppExportLights"
ButtonText:"Export Lights" 
tooltip:"Spp Export Lights" Icon:#("Maxscript",1)
(

 
 
 	fn checkpPath = 
	(--得到项目的路径 

		p =maxFilePath
		cmd = ""
		if p != "" then 
		(-- 判断是否保存文件
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
 
	 fn creatLightFile labelt lightName =
	(
		if (selection.count == 0) do
		(
			message = "you need Select some lights!"
			messageBox message
	        return 1
		)
	
		-- 获取文件名。
		filename = labelt +  lightName   

		-- 得先创建目录才能createFile，如果直接在一个没有的目录创建文件，会报错，除非是在磁盘的根目录
		--------------------------------------------------------------
		makeDir  labelt 
		--------------------------------------------------------------
		-- 下面输出灯光的一般信息，到这里，obj一定是灯光了。
		outFile = createFile filename
	
		format "<library>\n" to:outFile
		format "<sector name=\"Scene\">\n" to:outFile
		format "\t<ambient red=\"%\" green=\"%\" blue=\"%\" />\n" ((ambientColor.r)/255) ((ambientColor.g)/255) ((ambientColor.b)/255) to:outFile
		
		for obj in selection do
	    (
			if ( (classOf obj) == Omnilight) then (
			)else if ( (classOf obj) == Directionallight) then (
			)else if ( (classOf obj) == freeSpot) then (
			)else(
				message = stringStream ""
				format "\"%\" 不是灯! 会忽略它，但还会继续输出文件." obj.name to: message
				messageBox message as string
				continue
			)
			
			-- 下面输出灯光的一般信息，到这里，obj一定是灯光了。
			format "\t<light name=\"%\">\n" obj.name to:outFile
			-- 3dmax是右手坐标系，所以这里yz互换。
			format "\t\t<center x=\"%\" y=\"%\" z=\"%\"/>\n" obj.pos.x obj.pos.z obj.pos.y to:outFile
			format "\t\t<color red=\"%\" green=\"%\" blue=\"%\"/>\n" ((obj.rgb.r)/255) ((obj.rgb.g)/255) ((obj.rgb.b)/255) to:outFile
			if (obj.multiplier != 1) then (
				format "\t\t<radius brightness=\"%\">%</radius>\n" obj.multiplier obj.DecayRadius to:outFile
			)else(
				format "\t\t<radius>%</radius>\n" obj.DecayRadius to:outFile
			)
			if(not obj.castShadows) then (
				format "\t\t<noshadows>true</noshadows>\n" to:outFile
			)
			format "\t\t<dynamic>%</dynamic>\n" obj.useGlobalShadowSettings to:outFile
			if(obj.showFarAtten) then(
				format "\t\t<influenceradius>%</influenceradius>\n" obj.farAttenStart to:outFile
			)
			if(obj.lightAffectsShadow)then(
				format "\t\t<specular red=\"%\" green=\"%\" blue=\"%\"/>\n" ((obj.ShadowColor.r)/255) ((obj.ShadowColor.g)/255) ((obj.ShadowColor.b)/255) to:outFile
			)else(
				format "\t\t<specular red=\"%\" green=\"%\" blue=\"%\"/>\n" (((obj.rgb.r)/255)) (((obj.rgb.g)/255))  (((obj.rgb.b)/255))  to:outFile
			)
			c = 0
			l = 1
			q = 0
			attenuation = "none"
			case obj.attenDecay of
			(
				1 : (if(obj.useNearAtten)then(
						attenuation = "linear"
					)else if(obj.useFarAtten)then(
						attenuation = "clq"
						c = obj.nearAttenStart
						l = obj.nearAttenEnd
						q = obj.farAttenEnd 
					)
				)
				2 : (attenuation = "inverse")
				3 : (attenuation = "realistic")
			)
			format "\t\t<attenuation c=\"%\" l=\"%\" q=\"%\">%</attenuation>\n" c l q attenuation  to:outFile
			if ( (classOf obj) == Omnilight) then (
				format "\t\t<type>pointlight</type>\n"  to:outFile
			)else if ( (classOf obj) == Directionallight) then (
				format "\t\t<type>directional</type>\n"  to:outFile
			)else if ( (classOf obj) == freeSpot) then (
				format "\t\t<type>spotlight</type>\n"  to:outFile
				inner = ((obj.hotspot/180)*3.1415926)
				outer = ((obj.falloff/180)*3.1415926)
				format "\t\t<spotlightfalloff inner=\"%\" outer=\"%\"/>\n" inner outer  to:outFile
			)
			
			if ( (classOf obj) != Omnilight) do (
				-- 如果obj不是一个点光源，计算欧拉角：注意3dmax是右手坐标系。
				-- local eular = (quatToEuler obj.rotation) 参考maxscript参考手册(http://www.kxcad.net/autodesk/Autodesk_MAXScript_Reference_9/Node_Transform_Properties.htm)。我们不需要计算欧拉角。
				
				if(obj.rotation.x_rotation != 0 or obj.rotation.y_rotation != 0 or obj.rotation.z_rotation != 0) do (
					format "\t\t<move>\n\t\t\t<matrix>\n"  to:outFile
					if(obj.rotation.x_rotation != 0) then(
						local xangle = ((obj.rotation.x_rotation/180)*pi)
						format "\t\t\t\t<rotx>%</rotx>\n" xangle to:outFile
					)
					if(obj.rotation.y_rotation != 0) then(
						local zangle = ((obj.rotation.y_rotation/180)*pi)
						format "\t\t\t\t<rotz>%</rotz>\n" zangle to:outFile
					)
					if(obj.rotation.z_rotation != 0)then(
						local yangle = ((obj.rotation.z_rotation/180)*pi)
						format "\t\t\t\t<roty>%</roty>\n" yangle to:outFile
					)
					format "\t\t\t</matrix>\n\t\t</move>\n"  to:outFile
				)
			)
			format "\t</light>\n" to:outFile
		)
	
		format "</sector>\n" to:outFile
		format "</library>\n" to:outFile
		-- 关闭灯光文件。
		close outFile 
	
		message = "输出完毕!"
		messageBox message
	) 
 
 
rollout Test1 "Export Lights" width:360 height:164
(
	button btn2 "重新确定灯光路径" pos:[218,29] width:124 height:77
	button btn11 "输出bake灯光信息" pos:[6,128] width:163 height:27
	button btn12 "输出static灯光信息" pos:[184,128] width:167 height:27
	label lbl6 "Label" pos:[14,37] width:199 height:21 style_sunkenedge:true
	label lbl9 "如果上面显示的路径正确，就不需要重新确定灯光路径了！！" pos:[20,67] width:183 height:49
	GroupBox grp1 "灯光存放路径" pos:[6,10] width:346 height:107
	
	on Test1 open do
	(
		cp = checkpPath()
		if cp != "" then 
		(
			lbl6.text = cp + "\\src\art\\lights"
		)else
		(
			lbl6.text = "项目路径错误，或者没保存场景!"
		)
		
	)
	on btn2 pressed do
	(
		cp = checkpPath()
		if cp != "" then 
		(-- 如果为空，就说明没保存
			theLightsPath = cp + "\\src\art\\lights"
		
			theSavePath = getSavePath caption:"Primitive Maker - Output Folder" initialDir:theLightsPath
			if theSavePath != undefined then 
			(-- 害怕直接点击X,把这个对话框关掉
				lbl6.text = theSavePath
				
			)else
			(
				lbl6.text = cp + "\\src\art\\lights"
			)
		)else
		(
			lbl6.text = "项目路径错误，或者没保存场景!"
		)
		
	)
	on btn11 pressed do
	(
		aa = lbl6.text
		if aa != "项目路径错误，或者没保存场景!" then 
		(
			creatLightFile lbl6.text "\\bake.xml" 
		)else( messagebox "请确保正确的项目路径，并保存！"  )
	           	
	)
	on btn12 pressed do
	(
		aa = lbl6.text
		if aa != "项目路径错误，或者没保存场景!" then 
		(
			creatLightFile lbl6.text "\\static.xml" 
		)else( messagebox "请确保正确的项目路径，并保存！"  )		
	)
)
	try(destroyDialog Test1)catch()
	CreateDialog Test1
)
