macroScript SPP_buildTool
category:"SPP_SDK"
ButtonText:"Position Edit ToolSet" 
tooltip:"SPP_SDK Position Edit ToolSet" Icon:#("Maxscript",2)
(	
	rollout spp_sdk_position "SPP_SDK数据编辑" width:178 height:111
	(
		-- 通过时间来实时获取选择物体的中文名称
		Timer clock "testClock" pos:[13,497] width:24 height:24 interval:500 --tick once a second
		edittext edt1 "" pos:[28,30] width:118 height:25 enabled:true	-- 输入建筑中文名称的文本框
		button btn10 "导出建筑名称" pos:[26,62] width:120 height:27
		GroupBox grp3 "建筑中文名称" pos:[9,7] width:159 height:93
		GroupBox grp4 "角色的选择和出生位置" pos:[10,112] width:158 height:210
		button btn11 "创建选择角色" pos:[31,134] width:110 height:27
		button btn12 "创建选择摄像机" pos:[31,170] width:110 height:27
		button btn13 "创建出生角色" pos:[32,205] width:110 height:27
		button btn14 "创建出生摄像机" pos:[32,239] width:110 height:27
		button btn15 "导出位置" pos:[22,275] width:133 height:32
		GroupBox grp5 "沙盘信息" pos:[11,333] width:157 height:159
		button btn17 "创建气泡" pos:[32,358] width:110 height:27
		button btn18 "创建角色" pos:[33,395] width:110 height:27
		button btn19 "导出" pos:[30,434] width:118 height:28

---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
		
		-- 获取当前 max 文件的路径，并判断是否为标准的 \src\art\ 目录
		fn checkProPath = 
		(
			proPath =""
			-- 判断当前项目的路径中是否包含 \src\art
			srcIndex = findString maxFilePath "src\\art\\"
			
			if srcIndex!=undefined then
			(
				proPath = substring maxFilePath 1 (srcIndex-2)
			)
			else
			(
				messagebox "请保存在正确的项目目录下！"
			)
			
			proPath
			
		)
		
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
		-- 判断是否为第一次设置物体名称，防止重复设置
		global first = true, preCname=""
		-- 实时设置所选择物体的中文名称
		
		
		
		

---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------		

		

---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------		


		on clock tick do
		(
			if selection.count < 2 then
			(
				if $ != undefined then
				(
					cname = getUserProp $ "cname"
					
					if cname == undefined then
					(
						edt1.text = ""
						setUserProp $ "cname" ""
						preCname = ""
						cname = ""
					)
					
					if preCname!=cname then
					(
						edt1.text = cname
						preCname = cname
					)
			
				)
				else
				(
					edt1.text = ""
				)
			)
		)
		on edt1 entered text do
		(	-- 在建筑中文名称输入框，输入完毕时触发事件
			--------------------------------------
			------- 输入建筑的中文名称
			--------------------------------------
			if selection.count==0 then
			(
				messageBox "请先选择一个建筑"
			)else(
				setUserProp $ "cname" edt1.text
			)
		)
		on btn10 pressed do
		(	-- 在点击“导出建筑名称”按钮时触发事件
			--------------------------------------
			------- 导出选中的建筑
			--------------------------------------
			max select all
			
			xmlString = ""
			
			for obj in selection do
			(
				cname = getUserProp obj "cname"
				if cname!=undefined and cname!="" then
				(
					xmlString += "\t\t<meshobj name=\""+obj.name+"\" cname=\""+cname+"\" />\n"
				)
			)
			clearSelection()
			
			if xmlString!="" then
			(
				pathN = checkProPath() + "\\src\\art\\position\\"
				makeDir pathN
				fileN = "build.xml"
				outFile = createFile ( pathN + fileN )
				
				xmlString = "<world>\n\t<buildiInfo>\n" + xmlString + "\t</buildInfo>\n</world>"
				format xmlString to:outFile
				
				close outFile
			)
			
			messagebox "所有带有中文名称的模型已经被导出"
		)
		on btn11 pressed do
		(
			--------------------------------------
			------- 创建 “角色选择”时的角色
			------- 这个模型是一个茶壶，名字是 roleSelect 
			------- 导出时只需要取这个名字就可以
			--------------------------------------
			
			tool roleSelectTool
			(
				on mousePoint clickno do
				(
					if clickno == 2 then
					(
						roleSelectNode = getnodebyname "roleSelect"
						if roleSelectNode==undefined then
						(
							tmpObj = Teapot radius:1.44848 smooth:on segs:4 body:on handle:on spout:on lid:on mapcoords:on pos:[128.684,-310.493,0] isSelected:on
							tmpObj.name = "RoleSelect"
							select (getnodebyname "roleSelect")
							rotate $ (eulerangles 0 0 90)
							resetXForm $
							in coordsys grid ($.pos = gridPoint)
						)
						else
						(
							select $roleSelect
							in coordsys grid ($.pos = gridPoint)
						)
						max move
					)
				)
		
			)
			startTool roleSelectTool
		)
		on btn12 pressed do
		(
			--------------------------------------
			------- 创建“角色选择”时的摄像机
			--------------------------------------
			tool roleSelectCameraTool
			(
				on mousePoint clickno do
				(
					if clickno == 2 then
					(
						roleSelectNode = getnodebyname "RoleSelectCamera"
						if roleSelectNode==undefined then
						(
							tmpObj = Freecamera fov:45 targetDistance:160 nearclip:1 farclip:1000 nearrange:0 farrange:1000 mpassEnabled:off mpassRenderPerPass:off pos:[130.467,-355.128,0] isSelected:on
							tmpObj.name = "RoleSelectCamera"
							select (getnodebyname "RoleSelectCamera")
							rotate $ (eulerangles 90 0 0)
							resetXForm $
							in coordsys grid ($.pos = gridPoint)
						)
						else
						(
							select $RoleSelectCamera
							in coordsys grid ($.pos = gridPoint)
						)
						max move
					)
				)
		
			)
			startTool roleSelectCameraTool
			
		)
		on btn13 pressed do
		(
			--------------------------------------
			------- 创建角色出生时的角色
			--------------------------------------
			tool roleInitializeTool
			(
				on mousePoint clickno do
				(
					if clickno == 2 then
					(
						roleSelectNode = getnodebyname "RoleInitialize"
						if roleSelectNode==undefined then
						(
							tmpObj = Teapot radius:1.44848 smooth:on segs:4 body:on handle:on spout:on lid:on mapcoords:on pos:[128.684,-310.493,0] isSelected:on
							tmpObj.name = "RoleInitialize"
							select (getnodebyname "RoleInitialize")
							rotate $ (eulerangles 0 0 90)
							resetXForm $
							in coordsys grid ($.pos = gridPoint)
						)
						else
						(
							select $RoleInitialize
							in coordsys grid ($.pos = gridPoint)
						)
						max move
					)
				)
		
			)
			startTool roleInitializeTool
		)
		on btn14 pressed do
		(
			--------------------------------------
			------- 创建角色出生时的摄像机
			--------------------------------------
			tool roleInitializeCameraTool
			(
				on mousePoint clickno do
				(
					if clickno == 2 then
					(
						roleSelectNode = getnodebyname "RoleInitializeCamera"
						if roleSelectNode==undefined then
						(
							tmpObj = Freecamera fov:45 targetDistance:160 nearclip:1 farclip:1000 nearrange:0 farrange:1000 mpassEnabled:off mpassRenderPerPass:off pos:[130.467,-355.128,0] isSelected:on
							tmpObj.name = "RoleInitializeCamera"
							select (getnodebyname "RoleInitializeCamera")
							rotate $ (eulerangles 90 0 0)
							resetXForm $
							in coordsys grid ($.pos = gridPoint)
						)
						else
						(
							select $RoleInitializeCamera
							in coordsys grid ($.pos = gridPoint)
						)
						max move
					)
				)
		
			)
			startTool roleInitializeCameraTool
		)
		on btn15 pressed do
		(
			--------------------------------------
			------- 导出“角色选择”和角色出生的角色和摄像机的位置和朝向信息
			--------------------------------------
			roleSelectNode = getnodebyname "RoleSelect"
			roleSelectCamera = getnodebyname "RoleSelectCamera"
			roleInitializeNode = getnodebyname "RoleInitialize"
			roleInitializeCamera = getnodebyname "RoleInitializeCamera"
			
			xmlString = ""
			
			if roleSelectNode!=undefined and roleSelectCamera!=undefined and roleInitializeNode!=undefined and roleInitializeCamera!=undefined then
			(
				eularfRoleSelect = (quatToEuler (roleSelectNode.transform as quat))
					
				eularfRoleSelectCamera = (quatToEuler (roleSelectCamera.transform as quat))
					
				eularfRoleInitializeNode = (quatToEuler (roleInitializeNode.transform as quat))
					
				eularfRoleInitializeCamera = (quatToEuler (roleInitializeCamera.transform as quat))
				
				xmlString = "\n\t<roleSelect>"
				xmlString += "\n\t\t<role>"
				xmlString += "\n\t\t\t<position>["+(roleSelectNode.pos.x as string)+","+(roleSelectNode.pos.z as string)+","+(roleSelectNode.pos.y as string)+"]</position>" 
				xmlString += "\n\t\t\t<rotation>["+(eularfRoleSelect.x as string)+","+(eularfRoleSelect.z as string)+","+(eularfRoleSelect.y as string)+"]</rotation>"
				xmlString += "\n\t\t</role>"
				xmlString += "\n\t\t<camrea>"
				xmlString += "\n\t\t\t<position>["+(roleSelectCamera.pos.x as string)+","+(roleSelectCamera.pos.z as string)+","+(roleSelectCamera.pos.y as string)+"]</position>"
				xmlString += "\n\t\t\t<rotation>["+(eularfRoleSelectCamera.x as string)+","+(eularfRoleSelectCamera.z as string)+","+(eularfRoleSelectCamera.y as string)+"]</rotation>"
				xmlString += "\n\t\t</camrea>"
				xmlString += "\n\t</roleSelect>"
				
				xmlString += "\n\t<roleInitialize>"
				xmlString += "\n\t\t<role>"
				xmlString += "\n\t\t\t<position>["+(roleInitializeNode.pos.x as string)+","+(roleInitializeNode.pos.z as string)+","+(roleInitializeNode.pos.y as string)+"]</position>" 
				xmlString += "\n\t\t\t<rotation>["+(eularfRoleInitializeNode.x as string)+","+(eularfRoleInitializeNode.z as string)+","+(eularfRoleInitializeNode.y as string)+"]</rotation>"
				xmlString += "\n\t\t</role>"
				xmlString += "\n\t\t<camrea>"
				xmlString += "\n\t\t\t<position>["+(roleInitializeCamera.pos.x as string)+","+(roleInitializeCamera.pos.z as string)+","+(roleInitializeCamera.pos.y as string)+"]</position>"
				xmlString += "\n\t\t\t<rotation>["+(eularfRoleInitializeCamera.x as string)+","+(eularfRoleInitializeCamera.z as string)+","+(eularfRoleInitializeCamera.y as string)+"]</rotation>"
				xmlString += "\n\t\t</camrea>"
				xmlString += "\n\t</roleInitialize>"
			)
			else
			(
				messagebox "请确认已经在场景中创建了：选择角色、选择摄像机、出生角色、出生摄像机"
			)			
			
			if xmlString!="" then
			(
				pathN = checkProPath() + "\\src\\art\\position\\"
				makeDir pathN
				fileN = "role.xml"
				outFile = createFile ( pathN + fileN )
				
				xmlString = "<application type=\"school\">" + xmlString + "\n</application>"
				format xmlString to:outFile
				
				close outFile
				messagebox "角色和摄像机的信息已经导出"
			)
		)
		on btn17 pressed do
		(
			--------------------------------------
			------- 创建沙盘的气泡，代表气泡的位置
			--------------------------------------
		
		)
		on btn18 pressed do
		(
			--------------------------------------
			------- 创建沙盘模式下，点击某个建筑进入场景时，角色在建筑面前的位置和朝向
			--------------------------------------
			
		)
		on btn19 pressed do
		(
			--------------------------------------
			------- 导出沙盘的气泡和角色的信息
			--------------------------------------
			
		)
	)
	
	try(destroyDialog builder)catch()
	CreateDialog spp_sdk_position
	
	

	
)