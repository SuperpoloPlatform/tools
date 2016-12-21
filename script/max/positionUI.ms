macroScript SPP_buildTool
category:"SPP_SDK"
ButtonText:"Position Edit ToolSet" 
tooltip:"SPP_SDK Position Edit ToolSet" Icon:#("Maxscript",2)
(	
	rollout spp_sdk_position "SPP_SDK���ݱ༭" width:178 height:111
	(
		-- ͨ��ʱ����ʵʱ��ȡѡ���������������
		Timer clock "testClock" pos:[13,497] width:24 height:24 interval:500 --tick once a second
		edittext edt1 "" pos:[28,30] width:118 height:25 enabled:true	-- ���뽨���������Ƶ��ı���
		button btn10 "������������" pos:[26,62] width:120 height:27
		GroupBox grp3 "������������" pos:[9,7] width:159 height:93
		GroupBox grp4 "��ɫ��ѡ��ͳ���λ��" pos:[10,112] width:158 height:210
		button btn11 "����ѡ���ɫ" pos:[31,134] width:110 height:27
		button btn12 "����ѡ�������" pos:[31,170] width:110 height:27
		button btn13 "����������ɫ" pos:[32,205] width:110 height:27
		button btn14 "�������������" pos:[32,239] width:110 height:27
		button btn15 "����λ��" pos:[22,275] width:133 height:32
		GroupBox grp5 "ɳ����Ϣ" pos:[11,333] width:157 height:159
		button btn17 "��������" pos:[32,358] width:110 height:27
		button btn18 "������ɫ" pos:[33,395] width:110 height:27
		button btn19 "����" pos:[30,434] width:118 height:28

---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
		
		-- ��ȡ��ǰ max �ļ���·�������ж��Ƿ�Ϊ��׼�� \src\art\ Ŀ¼
		fn checkProPath = 
		(
			proPath =""
			-- �жϵ�ǰ��Ŀ��·�����Ƿ���� \src\art
			srcIndex = findString maxFilePath "src\\art\\"
			
			if srcIndex!=undefined then
			(
				proPath = substring maxFilePath 1 (srcIndex-2)
			)
			else
			(
				messagebox "�뱣������ȷ����ĿĿ¼�£�"
			)
			
			proPath
			
		)
		
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
		-- �ж��Ƿ�Ϊ��һ�������������ƣ���ֹ�ظ�����
		global first = true, preCname=""
		-- ʵʱ������ѡ���������������
		
		
		
		

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
		(	-- �ڽ�����������������������ʱ�����¼�
			--------------------------------------
			------- ���뽨������������
			--------------------------------------
			if selection.count==0 then
			(
				messageBox "����ѡ��һ������"
			)else(
				setUserProp $ "cname" edt1.text
			)
		)
		on btn10 pressed do
		(	-- �ڵ���������������ơ���ťʱ�����¼�
			--------------------------------------
			------- ����ѡ�еĽ���
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
			
			messagebox "���д����������Ƶ�ģ���Ѿ�������"
		)
		on btn11 pressed do
		(
			--------------------------------------
			------- ���� ����ɫѡ��ʱ�Ľ�ɫ
			------- ���ģ����һ������������� roleSelect 
			------- ����ʱֻ��Ҫȡ������־Ϳ���
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
			------- ��������ɫѡ��ʱ�������
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
			------- ������ɫ����ʱ�Ľ�ɫ
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
			------- ������ɫ����ʱ�������
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
			------- ��������ɫѡ�񡱺ͽ�ɫ�����Ľ�ɫ���������λ�úͳ�����Ϣ
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
				messagebox "��ȷ���Ѿ��ڳ����д����ˣ�ѡ���ɫ��ѡ���������������ɫ�����������"
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
				messagebox "��ɫ�����������Ϣ�Ѿ�����"
			)
		)
		on btn17 pressed do
		(
			--------------------------------------
			------- ����ɳ�̵����ݣ��������ݵ�λ��
			--------------------------------------
		
		)
		on btn18 pressed do
		(
			--------------------------------------
			------- ����ɳ��ģʽ�£����ĳ���������볡��ʱ����ɫ�ڽ�����ǰ��λ�úͳ���
			--------------------------------------
			
		)
		on btn19 pressed do
		(
			--------------------------------------
			------- ����ɳ�̵����ݺͽ�ɫ����Ϣ
			--------------------------------------
			
		)
	)
	
	try(destroyDialog builder)catch()
	CreateDialog spp_sdk_position
	
	

	
)