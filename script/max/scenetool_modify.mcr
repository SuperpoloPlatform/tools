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

macroScript SPP_sceneToolModify
category:"Superpolo"
ButtonText:"Scene ToolModify" 
tooltip:"Spp Scene ToolModify" Icon:#("Maxscript", 3)
(
	-- ���ӵ��Թ���
	SPP_DEBUG = false
---####################################################################################################
---########################################   function     #########################################
---####################################################################################################














/**
 * @brief check if directory(not file) is exist
 */
fn doesDirExist dir =
(
	return (doesFileExist dir) and (getfileattribute dir #directory)
)



/**
 * @brief ����SPP SDK�ṩ�Ĺ���
 */
fn startSppTool toolname param =
(
	if cmd != "" do
	(
		--chenyang: replace `ShellLaunch`, `DOSCommand` can wait to execute end.
		DOSCommand (toolname + " " + param)
	)
)

/**
 * @brief �õ���Ŀ��·�� 
 * ����`D:\p\duiwaijingmaodaxue`
 */
fn getProjectPath = 
(
	p = maxFilePath
	p = tolower p
	thisProjectPath = ""
	if p == "" then -- �ж��Ƿ񱣴��ļ�
	(
		messagebox "�뱣�泡����"
		return false
	)
	else
	(
		p_arr = filterString p "\\"
		allProjectsPath = p_arr[1] + "\\" + p_arr[2]
		if p_arr.count>3 and allProjectsPath == "d:\p" then 
		(
			thisProjectPath = p_arr[1] + "\\" + p_arr[2] + "\\" + p_arr[3]
		)
		else
		(
			messagebox "�뱣������ȷ����ĿĿ¼�£�\n(Make sure this project is in [D:\\p\\] path)"
			return false
		)
	)
	return thisProjectPath
)


/**
 * @brief �õ���Ŀ��·�� 
 */
fn getCmdPath = 
(

	p =maxFilePath
	p = tolower p
	cmd_p = ""
	cmd = ""
	if p != "" then 
	(-- �ж��Ƿ񱣴��ļ�
		p_arr = filterString p "\\"
		projectPath = p_arr[1] + "\\" + p_arr[2]
		if p_arr.count>3 and projectPath == "d:\p" then 
		(
			cmd_p = p_arr[1] + "\\" + p_arr[2] + "\\" + p_arr[3]
			cmd = "cd /d " +cmd_p
		)else
		(
			messagebox "�뱣������ȷ����ĿĿ¼�£�\n(Make sure this project is in [D:\\p\\] path)"
		)
		
	)else
	(
		messagebox "�뱣�泡����"
	)
	cmd

)
--check spp-sdk�Ƿ��ڵ�����ע��
fn checksdk =
(
	sppenv = systemTools.getEnvVariable "SPP_HOME" 
	if sppenv != undefined then
		return true
	else
		return false
)
--######################################## mesh's effect export to effect.xml ###########################################

fn checkpPath = 
(--get project path

	p =maxFilePath
	p = tolower p
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
			messagebox "�뱣������ȷ����ĿĿ¼�£�"
		)
	)else
	(
		messagebox "�뱣�泡����"
	)
	cmd

)

fn rename_materials =
(
	namepostfix = 0;
	
	--�ȱ���matrial���ƣ�ȫ���޸����ƣ������档
	 for mat in scenematerials do
	 (
		if((classof mat) == Standardmaterial) then
		(
			--matname = mat.name
			mat.name = "m" + (namepostfix as string)
			namepostfix=namepostfix +1
		)
		else
		(
			if((classof mat) == Multimaterial) do
			(
				submatnum = getNumSubMtls mat
				
				mat.name = "m" + (namepostfix as string)
				namepostfix =namepostfix +1
--				matname = mat.name 
						
				for im = 1 to submatnum do
				(
					if((classof (mat[im])) == Standardmaterial) do
					(
--						submatname = mat[im].name
						mat[im].name = "ms" + (namepostfix as string)
						namepostfix=namepostfix +1
					)
				)
			)
		)
	 )
	 --save,not needed.
)

--Ч��effect.xml����
	fn expxml =
	(
	  cp = checkpPath()
	  --srcdir = "\\src\\art\\scene\\effect"
		--"D:\p\duiwaijingmaodaxue\src\art\scene\effect\effect.xml"
	  srcdir = "\\src\\art\\scene\\effect"
	  outputPath=cp+srcdir
	  --oldfiles=outputPath + "\\" +  "*.3ds"
	  makeDir outputPath
	  fileN  = "\\effect.xml"
	  filename = (outputPath + fileN )
	  --outFile = createFile filename
	  --try delete existed file
	  existFile = (getfiles filename).count != 0
	  if existFile then 
		try(deletefile filename)catch()
	  outFile = createFile filename
	  --artbuild
	 /*  makeDir	(cp +"\\src\\art\\factory\\neirong01\\effect")
	  artfilename = cp + "\\src\\art\\factory\\neirong01\\effect\\effect.xml"
	  try(
		  deletefile artfilename
		  outartFile = createFile artfilename
	  )catch()	 */	
	  --sppbuild
	  format "<lib>\n" to:outFile
	  --artbuild
	  --format "<lib>\n" to:outartFile
	  temparry = #()--�����ж�һ��mesh�Ƿ��Ѿ�������xmlЧ��
	  wtskyflag = false --�ж��Ƿ���ˮ��Ч��,��ʱ��sky meshobj����ڱ�����
	  for i = geometry do
		(
			index = 0
			--if(classof (i.mat) == Standardmaterial) then
			--(
			fdstr = findString (i.name) "#"
			--flag = 0
			if fdstr != undefined then
			(
					subname = substring (i.name) 1 (fdstr-1) --meshȥ��#�ź������
					if(finditem temparry subname ==0)then
					(
						append temparry subname
						Currentmat = i.mat
						
						tmp = #()
						tmpname = #()	
						--tmpartname = #() --artbuild ʹ��,
						
						if( classof Currentmat == multimaterial ) then
						(		  
							
						   for iSubMtl = 1 to Currentmat.materialList.count do
						   (
							   try(
								CurrentSubMtl = Currentmat.materialList[iSubMtl]
								subidname = "submatid" + (iSubMtl as string)				
								iname = CurrentSubMtl.name --��ǰ�Ӳ�������
								effecttype = getUserProp i subidname --�����Ƿ����Զ�������Ч��
								if effecttype != "" and effecttype != undefined then
								 (
									 --messagebox iname
									 imatname = Currentmat.name
									 imatname = imatname + "_" + iname + "Sub" +((iSubMtl - 1) as string) --sppbuildʱΪx�ļ�assimp��������ʸ���
									-- messagebox imatname
									 append tmpname imatname --sppbuild, material's name
									 append tmp effecttype  --shader ����
									-- append tmpartname iname --artbuild, material's name
								)		
								)catch()
						   )
						)else --��������
						(
    					   iname = Currentmat.name
							--x�ļ���3ds�ļ�û��
						   subidname = "submatid0"
						   --fakename = replacenames  iname  " " ")"
						   effecttype = getUserProp i subidname
							if effecttype != "" and effecttype != undefined then
							 (
								str = effecttype as string
								ary = filterString str ")"
								if(ary[1] != "ˮ") then
								(
									append tmpname iname
									append tmp effecttype
								)
								else
								(
									wtskyflag = true
								)
								--append tmpartname iname --artbuild, material's name
							 )
							 
					   )	
					   --sppbuild 
					   if(tmpname.count>0)do
					   (
						   format "\t<meshname name = \"%\">\n" subname to:outFile
						   for i =1 to tmpname.count do
						   (
							  -- print tmp[i]
							   str = tmp[i] as string
								ary = filterString str ")"
							   -- messagebox  tmpname[i]
							   if(ary[1] == "ˮ") then
								(
									wtskyflag = true
								)
								format "\t\t<materialname name = \"%\">\n" tmpname[i] to:outFile
								for ii=2 to ary.count do
								(  
									format "\t\t\t" to:outFile
									format ary[ii] to:outFile
									format "\n" to:outFile
								)
								format "\t\t</materialname>\n" to:outFile
						   )
						   format "\t</meshname>\n" to:outFile
					   )
					   
					   --artbuild export xml
					  /*  if(tmpartname.count>0)do
					   (
						   format "\t<meshname name = \"%\">\n" subname to:outartFile
						   for i =1 to tmpartname.count do
						   (
							  -- print tmp[i]
							   str = tmp[i] as string
								ary = filterString str ")"
							   -- messagebox  tmpname[i]
							   
								format "\t\t<materialname name = \"%\">\n" tmpartname[i] to:outartFile
								for ii=2 to ary.count do
								(  
									format "\t\t\t" to:outartFile
									format ary[ii] to:outartFile
									format "\n" to:outartFile
								)
								format "\t\t</materialname>\n" to:outartFile
						   )
						   format "\t</meshname>\n" to:outartFile
					   ) */
					   

					)
				--)
			)
		)
		if(wtskyflag)then
		(
			  format "\t<watersky>\n" to:outFile
			  format "\t\t<material name=\"sky_001\">\n" to:outFile
			  format "\t\t\t<texture>effectsky.dds</texture>\n" to:outFile
			  format "\t\t\t<shader type=\"base\">lighting_fullbright_fixed</shader>\n" to:outFile
			  format "\t\t\t<shader type=\"diffuse\">*null</shader>\n" to:outFile
			  format "\t\t</material>\n" to:outFile
			  format "\t\t<meshobj name=\"skydome_frankieisland_SkyDome\">\n" to:outFile
			  format "\t\t\t<plugin>crystalspace.mesh.loader.genmesh</plugin>\n" to:outFile
			  format "\t\t\t<params>\n" to:outFile
			  format "\t\t\t\t<factory>skydome_frankieisland_SkyDome</factory>\n" to:outFile
			  format "\t\t\t</params>\n" to:outFile
			  format "\t\t\t<trimesh>\n" to:outFile
			  format "\t\t\t\t<id>shadows</id>\n" to:outFile
			  format "\t\t\t</trimesh>\n" to:outFile
			  format "\t\t\t<zuse />\n" to:outFile
			  format "\t\t\t<noshadows />\n" to:outFile
			  format "\t\t\t<move>\n" to:outFile
			  format "\t\t\t\t<v x=\"5000\" y=\"0\" z=\"5000\" />\n" to:outFile
			  format "\t\t\t</move>\n" to:outFile
			  format "\t\t\t<priority>sky</priority>\n" to:outFile
			  format "\t\t</meshobj>\n" to:outFile
			  format "\t</watersky>\n" to:outFile
		)
		--sppbuild
		format "</lib>" to:outFile
		close outFile 
		
		--artbuild
		--format "</lib>" to:outartFile
		--close outartFile
	)
	---#####export lod xml
	--Ч��effect.xml����
	fn explodxml =
	(
		clearSelection()
		cp = checkpPath()
		srcdir = "\\src\\art\\scene"
		outputPath=cp+srcdir
		makeDir outputPath
		fileN  = "\\effect\\lod.xml"
		filename = (outputPath + fileN )
		
		jsfile = "\\water_lod.js"
		jsonfname = (outputPath + jsfile )
		--try delete existed file
	 	existFile = (getfiles filename).count != 0
		if existFile then 
			try(deletefile filename)catch()
		try(deletefile jsonfname)catch() 
		outFile = createFile filename
		
		jsonFile = createFile jsonfname
		--sppbuild
		format "<lod>\n" to:outFile
		format "WATER_LOD = [\n" to:jsonFile
		temparry = #()--�����ж�һ��mesh�Ƿ��Ѿ�������xmlЧ��
		for i = geometry do
		(
			index = 0
			--ʹ��lod��ģ����ʱ��Ϊֻ���ǵ����ʵ�ģ��
			if(classof (i.mat) == Standardmaterial) then
			(
				fdstr = findString (i.name) "#"
				--flag = 0
				if fdstr != undefined then
				(
					subname = substring (i.name) 1 (fdstr-1) --meshȥ��#�ź������
					if(finditem temparry subname ==0)then
					(
						append temparry subname
						Currentmat = i.mat
						
						tmp = #()
						tmpname = #()	
						if( classof Currentmat == Standardmaterial) then
						(
						   iname = Currentmat.name
							--x�ļ���3ds�ļ�û��
						   subidname = "submatid0"
						   --fakename = replacenames  iname  " " ")"
						   effecttype = getUserProp i subidname
							if effecttype != "" and effecttype != undefined then
							 (
								str = effecttype as string
								ary = filterString str ")"
								if ary[1] == "ˮ" then
								(
									format "\t<factname name = \"%\">\n" subname to:outFile
									format "\t\t<materialname name = \"%\">\n" iname to:outFile
									format "\t\t\t<effect>\n" to:outFile
									for ii=2 to ary.count do
									(  
										format "\t\t\t\t" to:outFile
										format ary[ii] to:outFile
										format "\n" to:outFile
									)
									format "\t\t\t</effect>\n" to:outFile
									
									--json
									--format "\t{\n" to:jsonFile
									
									--format "\t\t\t<meshobj>\n" to:outFile
									tmpobj = for i in geometry where matchPattern i.name pattern:(subname+"#*") ignoreCase:false collect i
									for itmpobj in tmpobj do
									(
										format "\t{\n" to:jsonFile
			
										format "\t\t\"meshobjName\" : \"%\", \n" itmpobj.name to:jsonFile
										format "\t\t\"material\" : {\n" to:jsonFile
										format "\t\t\t\"water\" : \"%\",\n" ("lod_"+iname) to:jsonFile
										format "\t\t\t\"normal\" : \"%\",\n" iname to:jsonFile
										format "\t\t},\n" to:jsonFile
										format "\t\t\"position\" : {\n" to:jsonFile
										format "\t\t\t\"x\" : %,\n" itmpobj.pos.x to:jsonFile
										format "\t\t\t\"y\" : %,\n" itmpobj.pos.z to:jsonFile
										format "\t\t\t\"z\" : %,\n" itmpobj.pos.y to:jsonFile
										format "\t\t},\n" to:jsonFile
										rmin = [-1,-1,-1]
										rmax = [1,1,1]
										tempmin = itmpobj.min - itmpobj.center
										tempmax = itmpobj.max - itmpobj.center
										if (tempmin.x<rmin.x) then rmin.x=tempmin.x
										if (tempmin.y<rmin.y) then rmin.y=tempmin.y
										if (tempmin.z<rmin.z) then rmin.z=tempmin.z
										if (tempmax.x>rmax.x) then rmax.x=tempmax.x
										if (tempmax.y>rmax.y) then rmax.y=tempmax.y
										if (tempmax.z>rmax.z) then rmax.z=tempmax.z
										distanline = 1.5*(distance (itmpobj.min) (itmpobj.max))
										format "\t\t\"distance\" : \"%\"\n" distanline to:jsonFile	
										format "\t},\n" to:jsonFile
									)
									format "\t\t</materialname>\n" to:outFile
									format "\t</factname>\n" to:outFile
									
								)
							 )
							 
					   )	
					)
				)
			)
		)
		--sppbuild
		format "]\n" to:jsonFile
		format "</lod>\n" to:outFile
		close jsonFile 
		close outFile 
		enablesceneredraw()
	)	
	--######################################## export HUD's Mesh to hudmesh.xml ###########################################

	fn expHudxml =
	(
		cp = checkpPath()
		--srcdir = "\\src\\art\\scene\\effect"
		--"D:\p\duiwaijingmaodaxue\src\art\scene\effect\effect.xml"
		srcdir = "\\src\\art\\scene\\effect"
		outputPath=cp+srcdir
		--oldfiles=outputPath + "\\" +  "*.3ds"
		makeDir outputPath
		fileN  = "\\hudmesh.xml"
		filename = (outputPath + fileN )
		--outFile = createFile filename
		--try delete existed file
		existFile = (getfiles filename).count != 0
		if existFile then 
			try(deletefile filename)catch()
		outFile = createFile filename
		format "<lib>\n" to:outFile
		format "\t<hud name =\"sprit2d\">\n" to:outFile
		for iobj in objects do
		(
			effecttype = getUserProp iobj "hudmesh"
			if effecttype == "" or effecttype == undefined do
			(
				continue
			)
			fdstr=findString iobj.name "#"
			--objname = 
			--fdstr = findString (i.name) "#"
			if fdstr != undefined do
			(
				objname = substring (iobj.name) 1 (fdstr-1)
			)
			--<meshname name = "Plane01"/>
			hudstr = "\t\t<meshname name = \"" + objname + "\"/>\n"
			format hudstr to:outFile
		)
		format "\t</hud>\n" to:outFile
		format "</lib>" to:outFile
		close outFile 
		--����artbuildʹ��
		/* artdir  = "\\src\\art\\factory\\neirong01\\effect"
		arthudfilename = cp + artdir + fileN
		try(
			deletefile arthudfilename
			copyfile filename arthudfilename
		)catch() */
	)
	
---################################### meshgen ���� ################################################
	--�Զ������򷽷�
	fn compareFN v1 v2 =
	(
		local d = (v1.len)-(v2.len)
		case of
		(
		(d < 0.): -1

		(d > 0.): 1
		default: 0
		)
	)
	--find meshgen xiaopin
	fn selectMeshgen =
	(
		struct stMesh (len,name)
		arrMesh =#()
		for i in geometry do
		(
			minpos = i.min
			maxpos = i.max
			lenline = distance minpos maxpos
			s1 = stMesh len:lenline name:i--.name
			append arrMesh 	s1
			
		)
		arrselect = #()
		if(arrMesh.count > 1)do
		(
			qsort arrMesh compareFN 
			--�������,���ñ���
			indx = 0.005
			count = arrMesh.count
			bizhi = indx*(arrMesh[count].len)
			--
			findflag = stMesh len:bizhi name:"findflag"
			append arrMesh findflag
			qsort arrMesh compareFN 
			--arrselect = #()
			bkflag = false
			for i in arrMesh while bkflag == false do
			(
				if(i.len == bizhi and i.name == "findflag")then
					bkflag =true
				else
					append arrselect (i.name)
			)
		)
		/* for p in arrMesh do print p
		print (arrMesh.count)
		for ip in arrselect do print ip
		print (arrselect.count) */
		arrselect
	)
	--yangxiuwu export json function
	fn export outFile xpitch zpitch arrymesh= 
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

		for iobj in arrymesh do
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
		format "\txpitch : %,\n" xpitch to: outFile
		format "\tzpitch : %,\n" zpitch to: outFile
		format "\tmin : [%, %],\n" (xMinPos) (zMinPos) to: outFile
		format "\tmax : [%, %],\n" (xMaxPos) (zMaxPos) to: outFile
		format "\tarrayx  : %,\n" (m) to: outFile
		format "\tarrayy  : %,\n" (n) to: outFile
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
				for iobj in arrymesh do
				(
					if (iobj.pos.x <= (xMinPos+(i+1)*xpitch) and iobj.pos.x >= (xMinPos+i*xpitch) and iobj.pos.y <= (zMinPos+(j+1)*zpitch) and iobj.pos.y >= (zMinPos+j*zpitch))
						then format "\t\t\t\"%\",\n" (iobj.name) to: outFile
				)
				format "\t\t],\n" to: outFile
			)
		format "\t}\n" to: outFile
		format "}\n" to: outFile
	)
	--��������
	fn fnmeshgen=
	(
		--�ɵ�����
		xpitch =100
		zpitch = 200
		cp = checkpPath()
		srcdir = "\\src\\art\\scene"
		outputPath=cp+srcdir
		makeDir outputPath
		fileN  = "\\meshgen_names.js"
		filename = (outputPath + fileN )
		--outFile = createFile filename
		--try delete existed file
		existFile = (getfiles filename).count != 0
		if existFile then 
			try(deletefile filename)catch()
		outFile = createFile filename
		--�õ�meshgenģ����
		arrymesh = selectMeshgen()
		--function
		export outFile xpitch zpitch arrymesh
	)
	--######################################

/**
 * @brief Call ArtBuild tool to build all the 3ds to xml files
 * SPP will use these xml files.
 * @details there is 3 section:
 *  1.build factory/*.3ds
 *  2.build scene/*.3ds
 *  3.build uv_lightmap/*.3ds
 */
fn sppbuild =
(
	-- ��̬�ƹ�build
	cmd = getCmdPath()
	if cmd != "" do
	(
		--DOSCommand (cmd+" & sppbuild")
		cmdstr = "/C \"" +	cmd+" & sppbuild"
		ShellLaunch "cmd" cmdstr	
		
	)
)

-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================



--instance���嵼������
fn expInstancMesh =
(
	/* try(
			heatsize = 600000000-heapsize
		)catch() */
	disableSceneRedraw()
	--ɾ�����е�3ds�ļ�
	cp = checkpPath()
	--geo =geometry as array
	--delete 
	srcdir = "\\src\\art\\factory\\neirong01"
	outputPath=cp+srcdir
	makedir outputPath
	try(
		oldfiles=outputPath + "\\" +  "*.3ds"
		for oldfile in getFiles oldfiles do deleteFile oldfile
	)catch()
	--
	myobj = #()
	arryname =#()
	for obj = geometry do
	(
		--objname = obj.name
		--if(matchPattern objname pattern:"*#1")then
		--	append myobj obj
		--����#��ǰ���ֲ�ͬ�͵���,�������÷���"*#1"�ŵ�����һ����
		fsindex=findString (obj.name) "#"
		objname = (substring (obj.name) 1 (fsindex-1))
		if((finditem arryname objname) ==0)do
		(
			append myobj obj
			append arryname objname
		)
	)
	for i in myobj do
	(
		oldname = i.name
		fsindex=findString (i.name) "#"
		objname = (substring (i.name) 1 (fsindex-1))
		i.name = objname
		filename=outputPath+"\\"+objname+".3ds"
		select i
		instancemgr.getinstances i &instances
		subobjectLevel = 0
		max modify mode
		ResetXForm i
		convertToPoly i
		scene_pos = i.transform
		i.transform = (matrix3 [1,0,0] [0,1,0] [0,0,1] [0,0,0])
		try(
			ResetXForm i
			convertToPoly i
		)catch()
		exportfile filename #noPrompt selectedOnly:TRUE
		i.name = oldname
			--print filename
		i.transform = scene_pos
	)
	enableSceneRedraw()
	--export help
)


----------------------------���һ��boundingbox�����泡�����ӵ�ģ��------------------------------------
fn exportTempbb = 
(
	disableSceneRedraw()
	l = LayerManager.getLayer 0
	l.current = true
	
	sceneN = 0
	emptyLayers =#()
	cp = checkpPath()    -- ���·��
	srcdir0 = "\\src\\art\\scene"    -- ����scene·��
	outputPath = cp + srcdir0  -- �����������·��
	oldfiles=outputPath + "\\" +  "*.3ds"
	try(
		for oldfile in getFiles oldfiles do deleteFile oldfile
	)catch()

	for il = 0 to layerManager.count-1 do
	(
		ilayer = layerManager.getLayer il
		layerName = ilayer.name 
		layer = ILayerManager.getLayerObject il
		layer.nodes &theNodes
		layerNodeCnt = theNodes.count
		--format"layer:%  %\n"il theNodes.count
		--�ղ�����
		if layerNodeCnt == 0 then
		(
			append emptyLayers (layerName as string)
			
		)else 
		(
			exportBox = #()
			for i in theNodes do
			(
				if ((classof i) != Editable_mesh) and ((classof i) != Editable_Poly)do
				(
					continue
				)
				b = box()  -- ��������
				converttopoly b  -- ���polygon
				b.transform = i.transform  --��ȡ�����transform
				b.name = i.name   -- ��ȡ���������
				append exportBox b  -- ���뵽�����������
			)
			cp = checkpPath()    -- ���·��
			srcdir = "\\src\\art\\scene"    -- ����scene·��
			outputPath = cp + srcdir  -- �����������·��
			--exportBox�����Ƿ�Ϊ��,�ղ���,���ղŵ�
			flag = exportBox.count
			if (flag>0) do
			(
			sceneN  += 1    -- scene�ż�1
			filename = outputPath + "\\" + "scene"+ (sceneN as string) + ".3ds"  -- ��������ļ�·�����ļ�����
			select exportBox  -- ѡ������ĺ���
			exportfile filename #noPrompt selectedOnly:TRUE  -- ֱ�����
			delete exportBox -- ɾ������
			)
-- 				clearSelection()	-- ���ѡ��
		)
	)
	for il = 1 to emptyLayers.count do ( layermanager.deleteLayerByName emptyLayers[il])
-- 		if LayerManager.isDialogOpen() ==true then (LayerManager.closeDialog();layermanager.editlayerbyname "") else(layermanager.editlayerbyname "")
-- 		messagebox"����������ϣ�"
	enableSceneRedraw() 
)

-------------------------x�ļ��Լ�������Ϣ����--------------------------------------


fn exprotmat outFile = 
(
	format "<materials>\n" to:outFile

	for mat in scenematerials do
	(
		if((classof mat) == Standardmaterial) then
		(
			matname = mat.name 	
			format "\t<% type = \"%\" twoSided = \"%\"/>\n" matname "Standardmaterial" mat.twoSided to:outFile
		)
		else
		(
			if((classof mat) == Multimaterial) do
			(
				--format "\t<material name = \"%\" type = \"%\">\n" mat.name "Multimaterial" to:outFile
				
				submatnum = getNumSubMtls mat
				
				matname = mat.name 
				
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

fn xfile_export =
(
	rename_materials()
	
	for iobj in objects do
	(
		if(classof iobj) != Editable_Poly do
		(
			converttopoly iobj
		)
		if(classof iobj) == Editable_Poly do
		(
			mapchannel = polyop.getNumMaps  iobj
			if(mapchannel > 3) do
			(
				for ic = 0 to  mapchannel-4 do
				(
					channelInfo.ClearChannel iobj (mapchannel-1-ic)
					converttopoly iobj
				)

			)
		)
	)
	
	for i in objects do
	(
		if(i.mat == undefined) do
		(
			continue
		)
		if((classof i.mat) == Standardmaterial) then			
		(
			if(i.mat.diffusemap != undefined)do
			(
				i.mat.diffuseMapEnable = on
				--i.mat.Diffuse = color 155 155 155
			)
		)
		else
		(
			if((classof i.mat) == Multimaterial) do
			(
				submatnum = getNumSubMtls i.mat
				for im = 1 to submatnum do
				(
					if(((classof (i.mat[im])) == Standardmaterial) and (i.mat[im].diffusemap != undefined)) do
					(
						i.mat[im].diffuseMapEnable = on
						--i.mat[im].Diffuse = color 155 155 155
					)
				)
			)
		)
	)
	
	
	xfilepath = checkpPath() +"\src\art\scene\\" + "scene.x"
	exportfile xfilepath #noPrompt selectedOnly:false
	
	matpropath = checkpPath() +"\src\art\scene\\" + "matpro.xml"

	matfileN_arr = filterString matpropath "\\"
	matdir = ""
	for i = 1 to (matfileN_arr.count-1) do
	(
		matdir += matfileN_arr[i] + "\\"
	)
	matdir = substring matdir 1  (matdir.count-1)
	makeDir  matdir  
	matoutFile = createFile matpropath
	exprotmat matoutFile
	close matoutFile
)


fn camera_path_export =
(
	fn export outFile selectcamera duration delaytime = 
	(
		format "<wanders>\n" to:outFile
		
		format "\t<wander>\n" to:outFile
		local eular = (quatToEuler ((selectcamera.transform) as quat))
		format "\t\t<start posX=\"%\" posY=\"%\" posZ=\"%\" rotX=\"%\" rotY=\"%\" rotZ=\"%\" />\n" (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y) (-((eular.x-90)/180)*3.1415926) (-((eular.z)/180)*3.1415926) (-((eular.y)/180)*3.1415926)  to: outFile
		format "\t\t<wander0 posX=\"%\" posY=\"%\" posZ=\"%\" rotX=\"%\" rotY=\"%\" rotZ=\"%\" />\n" (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y) (-((eular.x-90)/180)*3.1415926) (-((eular.z)/180)*3.1415926) (-((eular.y)/180)*3.1415926)  to: outFile
				
		for t in animationRange.start to animationRange.end by (1s/30) do
		(
			if(t>=1) then
			(
				at time t 
				(
					thistransform = selectcamera.transform
					local eular = (quatToEuler (thistransform as quat))
					format "\t\t<wander% posX=\"%\" posY=\"%\" posZ=\"%\" rotX=\"%\" rotY=\"%\" rotZ=\"%\" />\n" (t.frame as integer) (selectcamera.pos.x) (selectcamera.pos.z) (selectcamera.pos.y) (-((eular.x-90)/180)*3.1415926) (-((eular.z)/180)*3.1415926) (-((eular.y)/180)*3.1415926)  to: outFile
				)
			)
		)
		format "\t</wander>\n\n" to:outFile						
		format "</wanders>\n" to:outFile
	)
	
	dir = getProjectPath()
	dir += "\\src\\product\\position\\wander\\"
	
	
	-- This is default value
	duration = "20"
	delaytime = "20"
	
	
	makeDir  dir  
	
	for icam in cameras do
	(
		if (classof icam) == Targetobject do
		(
			continue
		)
		filename = dir + "wander_" + icam.name + ".xml"
		outFile = createFile filename
		export outFile icam duration delaytime
		close outFile 
	)
)


-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================
-- =================================================================================================================================



/**
 * @brief ����3ds�ļ�
 */
fn export_3ds =
(
	expInstancMesh()
	exportTempbb()
	messagebox"����ͳ���������ϣ�����"
)

/**
 * @brief ����x�ļ�
 */
fn export_x_file =
(
	xfile_export()
	messagebox"����ͳ���������ϣ�����"
)

/**
 * @brief ����x�ļ�
 */
fn export_camera_path =
(
	camera_path_export()
	messagebox"�����·��������ϣ�����"
)

/**
 * @brief ��x����3ds�ļ�����������
 */
fn build_scene =
(
	fnmeshgen() --meshgen
	expHudxml()
	expxml()
	explodxml()
	sppbuild()
)

/**
 * @brief Ԥ������
 */
fn view_scene isThreadLoading isDebug =
(
	projPath = getProjectPath()
	if projPath != false do
	(
		cmdstr = "/C \""
		cmdstr += "cd /d " + projPath + "\\target "
		cmdstr += " & spp --tools=viewscene "
		if isDebug then
		(
			cmdstr += " --debug "
		)
		-- threaded loading or not?
		if isThreadLoading do
		(
			cmdstr += " --thread "
		)
		cmdstr += "\""
		ShellLaunch "cmd" cmdstr
	)
)

/**
 * @brief Ϊѡ������������ǰ�����ǰ׺��
 */
fn renameSelection prefix =
(
	sel = getcurrentselection()
	if sel.count > 0 then
	(
		for i=1 to sel.count do
		(
			sel[i].name = prefix + (i as string)
		)
		messagebox"������ɣ��������һ������"
	)
	else
	(
		messagebox"��ѡ�����壡"
	)
)













































-- ##################################### �������� ##############################################
 	fn checkpPath = 
	(--�õ���Ŀ��·�� 

		p =maxFilePath
		p = tolower p
		cmd = ""
		if p != "" then 
		(-- �ж��Ƿ񱣴��ļ�
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
				messagebox "�뱣������ȷ����ĿĿ¼�£�"
			)
		)else
		(
			messagebox "�뱣�泡����"
		)
		cmd

	)
-- 	checkpPath()
-- ##################################### Ԥ����� ##############################################
	
	fn del_dummy =
	(
		dummy_arr = #()
		for i in objects do
		(
			if (classof i) == Dummy do
			(
				append dummy_arr i
			)
		)
		delete dummy_arr
	)
	
	 fn moveToo =
 (
	--------------------------------------------
	-- ��������bbox
	objectss = for i in objects  collect i
		
	group objectss name:"group_groupall"
	bbox = #()
	minb = $group_groupall.min
	maxb = $group_groupall.max
	zb = $group_groupall.pos.z
	bbox[1] = minb[1]
	bbox[2] = minb[2]
	bbox[3] = minb[3]

	bbox[4] = maxb[1]
	bbox[5] = maxb[2]
	bbox[6] = maxb[3]
	bbox_error =0
	for n in bbox do 
	(
		if n > 50000 do
		(
			bbox_error = bbox_error +1
		)
		if n < -50000 do
		(
			bbox_error = bbox_error +1
		)
	)
	if bbox_error >1 do
	(
		$group_groupall.pos = [0,0,zb]
		
	)
	ungroup $group_groupall
	--------------------------------------------

	max zoomext sel all	 
	 
 )
	
	
	
 	fn scene_reset doit_prog=
	(
		del_dummy()
		moveToo()
		-- ����
		objs = for i in geometry collect i
		select objs
		unhide objs doLayer:true 
		max group ungroup
		clearSelection()
		
		-- set scanline render 
		renderers.current = RendererClass.classes[1]()
		
		--layer hidden
		for il = 0 to layerManager.count-1 do
		(
			ilayer = layerManager.getLayer il
			layerName = ilayer.name 
			layer = ILayerManager.getLayerObject il
			layer.ishidden = false 
			layer.isfrozen = false 
		)

		-- ���û�����
		ambientColor = color 255 255 255

		-- ������ȾԤ��
		theRenderPreset = renderPresetMRUList[1][2] 
		renderpresets.Load 0 theRenderPreset #{32}

		-- layout
		viewport.ResetAllViews()
		viewport.setLayout #layout_2v
		viewport.setGridVisibility #all false
		viewport.SetRenderLevel #wireFrame
		enableSceneRedraw() 
		max zoomext sel all

		viewport.activeViewport = 1
		viewport.setType #view_front
		viewport.activeViewport = 2
		viewport.setType #view_top
		for o=1 to objs.count do 
		(
			if classof objs[o] == Editable_mesh or classof objs[o] == Editable_poly do
			(
				objs[o].showFrozenInGray = on
				objs[o].backfacecull = on
				addModifier objs[o] (Unwrap_UVW ())
				converttomesh objs[o]
				doit_prog.value = 100.*o/objs.count
			)
		)
		enableSceneRedraw() 
		max zoomext sel all
		max tool maximize
		messagebox"����������ϣ��������һ��������"
	)
	
-- ##################################### ���ģ������ ##############################################	
	--��Ϊvrayfur���͵�ģ�͵���x�ļ��������ɾ��Ϊ�����������İ�,��ΪexpflagΪ��������,delflagɾ��mesh
	fn DelVrayMesh expflag delflag=
	(
		errText = ""
		errMesh = #()
		for i in geometry do
		(
			classofi = classof i
			if classofi == VRayFur then
			(
				tmpstr = "ģ����:" + i.name + " ����Ϊ:"+ (classofi as string) + "\n"
				errText += tmpstr
				--delete i
				append errMesh i
			)
		)
		if errText == "" then
		(
			return errMesh
		)
		if(delflag) then
		(
			clearSelection()
			select errMesh
			max delete
			clearSelection()
		)
		if(expflag)then
		(	
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\����"
			filename = wtpath +  "\\B10�������������΢��x�ļ���֧�ֵĹ��߶�����Ҫ���.txt"
			existFile = (getfiles filename).count != 0
			if existFile then try(deletefile filename)catch()
			outFile = createFile filename	
			format "���������΢��x�ļ���֧�ֵĶ�����:\n\n" to:outFile
			format "%\n" errText to:outFile
			close outFile
		)
		errMesh
	)
	--���ÿ��ģ���ϵ�����
	fn checkFaceNum =
	(
		disablesceneredraw()
		mess = ""
		err= 0
		cp = checkpPath()
		delete_arr = #()
		for i in geometry do
		(
			try(
				converttomesh i
				faceNum = meshop.getNumFaces i
				if faceNum > 50000 do
				(
					err+=1
					message = stringStream ""
					message = "B4����ģ��:"+i.name+"  �������ǣ�"+  (faceNum as string)  +"   ������50000�������棬��Ҫ���棬���߲�ɢ���壡 \n"
					mess = mess + message
					
					append delete_arr i
				)
			)catch()
		)
		if err >0 then
		(
			wtpath = cp  + "\\plan\\����"	
			makedir  wtpath	
			filename = wtpath +  "\\��ģ���������ࡪ����Ҫ�޸�.txt"
			outFile = createFile filename	
			format "%\n" mess to:outFile
			close outFile
		)else
		(
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\����"
			filename = wtpath +  "\\��ģ���������ࡪ����Ҫ�޸�.txt"
			existFile = (getfiles filename).count != 0
			if existFile then deletefile filename
		)
		enablesceneredraw()
		if delete_arr.count >0 then
		(
			messagebox"�������г���5w���ģ�ͣ���鿴plan\���� �ļ��У���5w��Ϊ���ޣ�detach����ģ�ͣ���Ҫ̫�飡"
			
		)
	)	
	
	
		fn checkSameNobj =
	(
		mess = ""
		err= 0
		cp = checkpPath()
				
		if cp.count>6 do
		(
			clearListener()
			objsa = geometry as array
			objsb = geometry as array
			if(objsa.count < 2) then return err
			objsb = deleteItem objsb 1
			allSame_arr = #()
			for i=1 to objsa.count-1 do
			(
				sameN_arr = #()
				objaN = objsa[i].name
				for j = 1 to objsb.count do
				(
					if objsb[j] != "" do
					(
						objbN = objsb[j].name
						if objaN == objbN do
						(
							append sameN_arr objsb[j]
							objsb[j] = ""
						)
					)
				)
				append allSame_arr sameN_arr
				deleteItem objsb 1
			)
			-- output name list
			delete_arr = #()
			for i in allSame_arr do
			(
				if i.count > 0 do
				(
					err+=1
					message = stringStream ""
					message = "B3����ͬ��Ϊ��"+ i[1].name +"�����壬�ڳ�������"+ ((i.count+1)as string) +"���� \n"
					mess = mess + message
				)
				join delete_arr i
			)
			delete_arr = makeUniqueArray delete_arr
			-- select and delete
-- 			select delete_arr
-- 			delete delete_arr
			-- create  error path and file
			wtpath = cp  + "\\plan\\����"	
			makedir  wtpath	
			filename = wtpath +  "\\ģ���������ظ�������Ҫ�޸�.txt"
			if err >0 then
			(
				outFile = createFile filename	
				format "%\n" mess to:outFile
				close outFile
			)else
			(
				existFile = (getfiles filename).count != 0
				if existFile then deletefile filename
			)
			if delete_arr.count >0 then
			(
				messagebox"��������ģ���������ظ� ��鿴 plan\���� �ļ��У�"
				
			)else
			(
				messagebox"������û�������ظ������壬�������һ��������"
				
			)
		)
	)
	
fn checkMeshName =
(
	mess = "�����б�\n" 
	i = 0
	filename=""
	mesherr = #()
	 --��������mesh
	 for iobj in  geometry do
	 (
		 errcount = 0
		 -- check name length
		 -- check name length
		 if iobj.name.count > 11 then
		 (
			objname= iobj.name
			fs=findString objname "#" 
			if fs == undefined then
			(
				i = i +1
				message = stringStream ""
				message = "B5�������壺" + (iobj.name) + "��mesh���ֳ��ȳ�����16���ַ�����Ҫ�Ķ�,��û�ж���#�����к�,����������֣���ִ�С�����淶����������\n"
				mess = mess + message
				errcount = errcount + 1
			)else
			(
-- 				fs= fs-1
-- 				nobjname = substring objname 1 fs
				if objname.count> 10 do
				(
					i = i +1
					message = stringStream ""
					message = "B6�������壺" + (iobj.name) + "��mesh���ֳ��ȳ�����16���ַ�����Ҫ�Ķ̣�\n"
					mess = mess + message
					errcount = errcount + 1
				)
			)	
		 )else
		 (
			objname= iobj.name
			fs=findString objname "#"  
			if fs == undefined do
			(
				i = i +1
				message = stringStream ""
				message = "B7�������壺" + (iobj.name) + "��mesh����û�ж���#�����к�,����������֣���ִ�С�����淶��������\n"
				mess = mess + message
				errcount = errcount + 1
			)
		 )
		if errcount > 0 do
		(
			append mesherr iobj
		)
	 )
 	 if(mesherr.count) > 0 then
	 (
		messagebox"mesh����������,��鿴 ���� �ļ��У�"
	 )else
	(
		messagebox"mesh����û�����⣬�������һ��������"
	)	 
	 
-- 	 me = stringStream ""
-- 	 me = checkSameNobj()
-- 	 mess = mess + me
	 if mess.count >7 do ( i=i+1)
	 if i > 0 then
	(
		------------------------------------------------��������Ϣ����� �� �����ļ���    �������û�б�������ȷ��·���£��Ͳ�����������ļ���ֻ����ʾ
-- 		 messagebox mess
		try(
			
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\����"		
			makedir  wtpath	
			filename = wtpath +  "\\mesh���������⡪����Ҫ�޸�.txt"
			outFile = createFile filename
			format "%\n" mess to:outFile
			close outFile
		)catch()
		------------------------------------------------
-- 		messagebox"����ģ���д�����鿴���planĿ¼�µġ����⡱�б�"
	)else
	(
		wtpath = checkpPath()
		wtpath = wtpath  + "\\plan\\����"
		filename = wtpath +  "\\mesh���������⡪����Ҫ�޸�.txt"
		existFile = (getfiles filename).count != 0
		if existFile then deletefile filename
	)

	return 0
	
)	
-- ##################################### �����ʺ���ͼ ##############################################		
fn checkmattex = (
	mess = "�����б�\n" 
	i = 0
	filename=""
	mesherr = #()
	 --��������mesh
	 for iobj in  geometry do
	 (
		 errcount = 0
		 -- check name length
		 if iobj.name.count > 11 do
		 (
			objname= iobj.name
			fs=findString objname "#" 
			if fs == undefined then
			(
				i = i +1
				message = stringStream ""
				message = "B6�������壺" + (iobj.name) + "��mesh���ֳ��ȳ�����16���ַ�����Ҫ�Ķ̣�\n"
				mess = mess + message
				errcount = errcount + 1
			)else
			(
				fs= fs-1
				nobjname = substring objname 1 fs
				if nobjname.count> 16 do
				(
					i = i +1
					message = stringStream ""
					message = "B6�������壺" + (iobj.name) + "��mesh���ֳ��ȳ�����16���ַ�����Ҫ�Ķ̣�\n"
					mess = mess + message
					errcount = errcount + 1
				)
			)	
		 )
		 if iobj.mat != undefined then
		 (
			--��ȡ��ǰmesh�µ����в���
			mat = iobj.material
			submatnum = 0
			submatnum = getNumSubMtls mat
			if submatnum == 0 do
			(-- ����û���Ӳ���  -- ��Ϊ�����Ӳ��ʻ��п�����arch,������standard
				  
				if (classof mat) == standard then
				(-- ������standard
					
					if (classof mat.diffuseMap) == Bitmaptexture  then
					(-- ���Ͳ���Bitmaptexture��û����ͼ
						
						texname = mat.diffuseMap.filename
						if texname.count >=12 then
						(
							fnameCnt = (getfiles texname).count
							if fnameCnt != 0 then
							(
								texname_arr = filterstring texname "\\"
								cnt = texname_arr[texname_arr.count].count
								if cnt > 16 do
								(-- check texture name length
									i = i +1
									 message = stringStream ""
									 message = "A10�������壺" + (iobj.name) + "��ͼ���ֳ��ȴ���16���ַ�����Ҫ�Ķ̣�\n"
									 mess = mess + message
									 errcount = errcount + 1	
								)
							)else
							(-- �鿴�ļ��Ƿ����
								i = i +1
								 message = stringStream ""
								 message = "A11�������壺" + (iobj.name) + "û��diffuse��ͼ��\n"
								 mess = mess + message
								 errcount = errcount + 1
							)
						)else
						(-- ���filename����С��8��û����ͼ����Ϊ��С��"c:\a.jpg"���������8λ
							i = i +1
							 message = stringStream ""
							 message = "A11�������壺" + (iobj.name) + "û��diffuse��ͼ��\n"
							 mess = mess + message
							 errcount = errcount + 1
						)
					)else
					(
						i = i +1
						message = stringStream ""
						message = "A11�������壺" + (iobj.name) + "û��diffuse��ͼ��\n"
						mess = mess + message
						errcount = errcount + 1
					)
				)else
				(
					i = i +1
					message = stringStream ""
					message = "A8�������壺" + (iobj.name) + "�Ķ��������ǣ�" + ((classof mat)as string) + ", Ӧ����standard��\n"
					mess = mess + message
					errcount = errcount + 1
				)     
			)
			 --������ǰ�����������Ӳ���
			 if submatnum >0 do
			 (-- ����û���Ӳ���  -- ��Ϊ���Ӳ��ʵĻ��п�����shellmat�Ĳ�����multimat
				 
				if (classof mat) == Multimaterial then
				(-- ������multimat
					
					for im = 1 to submatnum do
					(
						if mat[im] != undefined then
						(-- ���Ӳ�����û�в���
							
							if (classof mat[im]) == standard then
							(
								if (classof mat[im].diffuseMap) == Bitmaptexture  then
								(-- ���Ͳ���Bitmaptexture��û����ͼ
									
									texname = mat[im].diffuseMap.filename
									if texname.count >=12 then
									(
										fnameCnt = (getfiles texname).count
										if fnameCnt != 0 then
										(
											texname_arr = filterstring texname "\\"
											cnt = texname_arr[texname_arr.count].count
											if cnt > 12 do
											(-- check texture name length
												i = i +1
												 message = stringStream ""
												 message = "A4�������壺" + (iobj.name) + "��ID��"+ (im as string) + "��ͼ���ֳ��ȴ���16���ַ�����Ҫ�Ķ̣�\n"
												 mess = mess + message
												 errcount = errcount + 1	
											)
										)else
										(-- �鿴�ļ��Ƿ����
											i = i +1
											 message = stringStream ""
											 message = "A12�������壺" + (iobj.name)+ "��ID��"+ (im as string) + "û��diffuse��ͼ��\n"
											 mess = mess + message
											 errcount = errcount + 1	
										)
									)else
									(-- ���filename����С��8��û����ͼ����Ϊ��С��"c:\a.jpg"���������8λ
										i = i +1
										message = stringStream ""
										message = "A12�������壺" + (iobj.name)+ "��ID��"+ (im as string) + "û��diffuse��ͼ��\n"
										mess = mess + message
										errcount = errcount + 1
									)
								)else
								(
									i = i +1
									message = stringStream ""
									message = "A12�������壺" + (iobj.name)+ "��ID��"+ (im as string)+ "û��diffuse��ͼ��\n"
									mess = mess + message
									errcount = errcount + 1
								)
							)else
							(
								i = i +1
								message = stringStream ""
								message = "A5�������壺" + (iobj.name)+ "��ID��"+ (im as string)+"�Ĳ����ǣ�" + ((classof mat[im])as string) + ", Ӧ����standard��\n"
								mess = mess + message
								errcount = errcount + 1
							)
						)else
						(
							continue
						)
					)
				)else
				(
					i = i +1
					message = stringStream ""
					message = "A6�������壺" + (iobj.name)+ "�Ķ�ά�����ǣ�"+ ((classof mat)as string) + "�� Ӧ����muitmaterial��\n"
					mess = mess + message
					
					errcount = errcount + 1
					
				)
			 )
			
		)else
		(
			i = i +1
			message = stringStream ""
			message = "A7�������壺" + (iobj.name)+ "û�в��ʣ�\n"
			mess = mess + message
			errcount = errcount + 1
		)
		
		if errcount > 0 do
		(
			append mesherr iobj
		)
		
	 )
	 
/* 	 if(mesherr.count) > 0 do
	 (
		 for im in mesherr do
		 (
			 --select im
			 delete im
		 )
	 ) */
	 
-- 	 me = stringStream ""
-- 	 me = checkSameNobj()
-- 	 mess = mess + me
	 if mess.count >7 do ( i=i+1)
	 if i > 0 then
	(
		------------------------------------------------��������Ϣ����� �� �����ļ���    �������û�б�������ȷ��·���£��Ͳ�����������ļ���ֻ����ʾ
-- 		 messagebox mess
		try(
			
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\����"		
			makedir  wtpath	
			filename = wtpath +  "\\���ʺ���ͼ�����⡪����Ҫ�޸�.txt"
			outFile = createFile filename
			format "%\n" mess to:outFile
			close outFile
		)catch()
		------------------------------------------------
-- 		messagebox"����ģ���д�����鿴���planĿ¼�µġ����⡱�б�"
	)else
	(
		wtpath = checkpPath()
		wtpath = wtpath  + "\\plan\\����"
		filename = wtpath +  "\\���ʺ���ͼ�����⡪����Ҫ�޸�.txt"
		existFile = (getfiles filename).count != 0
		if existFile then deletefile filename
	)

	return 0
	
)		
--------------------------------------------------------------------------------------------
-- ##################################### ���ʺ���ͼ������ ##############################################	
   /* fn checkmat = (
	 i = 0;
	   
	 renmess = ""
	 --��������mesh
	 for iobj in  geometry do
	 (
		 --��ȡ��ǰmesh�µ����в���
		 mat = iobj.material
		 
		 if mat.name.count >= 12 do
		 (
			tmpname = ("m" + "_" + (i as string)) 
				
			renmess = renmess + mat.name + " " + tmpname + "\n"
				
			mat.name = tmpname	 
			i += 1
		 )
		 
		 submatnum = getNumSubMtls mat
		 --������ǰmesh�������Ӳ���
		 if submatnum >0 do
		 (
			 for im = 1 to submatnum do
			 (
				 imat = getSubMtl mat im
				 if imat == undefined do
				(
					continue 
				)
				 --�ж�name�����Ƿ����12
				if imat.name.count >= 12 do
				(--����������Ϊimat.name��material������
					tmpname = ("m" + "_" + (i as string)) 
					imat.name = tmpname
					
					i += 1
				)
			 )
		)
	 )
	  */
	 
/* 	  try(
			
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan"	
				
			makedir  wtpath	

			filename = wtpath +  "\\����������.txt"
			outFile = createFile filename
		
			format "%\n" renmess to:outFile
			close outFile
		)catch() */
 --)
-- checkmat()

  /* fn checktexture = (
	 i = 0;
	 renmess = ""
	 --��������mesh
	 for iobj in  geometry do
	 (
		 --��ȡ��ǰmesh�µ����в���
		 mat = iobj.material
		 submatnum = getNumSubMtls mat
		 if submatnum == 0 do
		 (
			 texfilename = mat.diffuseMap.filename
			 texNameArr = filterString texfilename "\\."
		     texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
			 
			 texN = ""
			 for itexN =1 to (texNameArr.count-2) do
			 (
				 texN += texNameArr[itexN] + "\\" 
			 )
			 
			 if texname.count >=12 do
			 (
				tmpname = ("t" + "_" + (i as string)) 
				for iobjt in  geometry do
				(
					tmat = iobjt.material
					tsubmatnumber = getNumSubMtls tmat
					if tsubmatnumber == 0 do
					(
						 tmtexfilename = tmat.diffuseMap.filename
						 
						if tmtexfilename == texfilename do
						(
							tmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
							--tmat.diffuseMap.filename = tmpname
						)
					)
					if tsubmatnumber >0 do
					(
						for itm = 1 to tsubmatnumber do
						(
							 itsmat = getSubMtl tmat itm
							if itsmat == undefined do
							(
								continue 
							)
							 tmtexfilename = itsmat.diffuseMap.filename

							if tmtexfilename == texfilename do
							(
								itsmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
								--tmat.diffuseMap.filename = tmpname
							)
						)
					)
				)
				
				renmess = renmess + ( texfilename + " " + tmpname +"."+ texNameArr[texNameArr.count] + "\n") 
				renameFile texfilename (texN + tmpname +"."+ texNameArr[texNameArr.count])

				--cmdstr = "ren " + texfilename +" "+ tmpname +"."+ texNameArr[texNameArr.count]
				--DOSCommand cmdstr
				i += 1
			)
		 )
		 --������ǰmesh�����в���
		 if submatnum >0 do
		 (
			 for im = 1 to submatnum do
			 (
				 imat = getSubMtl mat im
				 if imat == undefined do
				 (
				 	continue
				 )
				 itexfilename = imat.diffuseMap.filename
				 texNameArr = filterString itexfilename "\\."
				 itexname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]

				 if itexname.count >= 12 do
				 (
					 
					texN = ""
					for itexN =1 to (texNameArr.count-2) do
					(
						texN += texNameArr[itexN] + "\\" 
					)
					
					tmpname = ("t" + "_" + (i as string)) 
					
					for iobjt in  geometry do
					(
						tmat = iobjt.material
						tsubmatnumber = getNumSubMtls tmat
						if tsubmatnumber == 0 do
						(
							tmtexfilename = tmat.diffuseMap.filename

							if tmtexfilename == itexfilename do
							(
								tmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
								--tmat.diffuseMap.filename = tmpname
							)
						)
						if tsubmatnumber >0 do
						(
							for itm = 1 to tsubmatnumber do
							(
								 itsmat = getSubMtl tmat itm
								if itsmat == undefined do
								(
									continue 
								)
								
								 tmtexfilename = itsmat.diffuseMap.filename
				
								if tmtexfilename == itexfilename do
								(
									itsmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
									--tmat.diffuseMap.filename = tmpname
								)
							)
						)
					)
					renmess = renmess + ( itexfilename + " " + tmpname +"."+ texNameArr[texNameArr.count] + "\n") 
					
					renameFile itexfilename (texN + tmpname +"."+ texNameArr[texNameArr.count])
					--cmdstr = "ren " + itexfilename +" "+ tmpname +"."+ texNameArr[texNameArr.count]
					--DOSCommand cmdstr
					
					i += 1
				  )
				 
			 )
		)
	 ) */
/* 	 
	 try(
			
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan"	
				
			makedir  wtpath	

			filename = wtpath +  "\\��ͼ������.txt"
			outFile = createFile filename
		
			format "%\n" renmess to:outFile
			close outFile
		)catch() */
--  )
 
--  checktexture()
 -- #####################################��ͼ������#############################################
 fn renametexture namestr= (
	try(
	   heatsize = 600000000-heapsize
	)catch()
	 i = 0;
	 renmess = ""
	 --��������mesh
	 for iobj in  geometry do
	 (
		 --��ȡ��ǰmesh�µ����в���
		 mat = iobj.material
		 submatnum = getNumSubMtls mat
		 --���Ϊ������
		 if submatnum == 0 do
		 (
			 texfilename = mat.diffuseMap.filename
			 texNameArr = filterString texfilename "\\."
			 texN = ""
			 for itexN =1 to (texNameArr.count-2) do
			 (
				 texN += texNameArr[itexN] + "\\" 
			 )
			--tmpname = ("t" + "_" + (i as string)) 
			tmpname = ( namestr + (i as string))
				--����Ѿ�����������
			flag=matchPattern texfilename pattern: (texN + namestr+"*") ignoreCase:false 
			if(flag==true)do
			(
-- 				print "pass"
				continue
			)
			--����������gemo
			for iobjt in  geometry do
			(
				tmat = iobjt.material
				tsubmatnumber = getNumSubMtls tmat
				--�ڸ�������
				if tsubmatnumber == 0 do
				(
					try(
						tmtexfilename = tmat.diffuseMap.filename
					)catch()
					/* flag=matchPattern tmtexfilename pattern: (texN + namestr+"*") ignoreCase:false 
					if(flag==true) do
					(
						continue
						print "continue"
					)	 */
					if tmtexfilename == texfilename do
					(
						tmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
					)
				)
				--���Ӳ�����
				 if tsubmatnumber >0 do
				(
					for itm = 1 to tsubmatnumber do
					(
						itsmat = getSubMtl tmat itm
						if itsmat == undefined do
						(
							continue 
-- 							print "continue"
						)
						try(
							tmtexfilename = itsmat.diffuseMap.filename
						)catch()
						/* flag=matchPattern tmtexfilename pattern: (texN + namestr+"*") ignoreCase:false 
						if(flag==true) do
						(
							continue
						)	 */
						if tmtexfilename == texfilename do
						(
							itsmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
							--tmat.diffuseMap.filename = tmpname
						)
					)
				) 
			)
			--diplay
-- 			renmess = renmess + ( texfilename + " " + tmpname +"."+ texNameArr[texNameArr.count] + "\n") 
--  			print renmess
			/* flag=matchPattern texfilename pattern: (texN + namestr+"*") ignoreCase:false 
			 if(flag!=true) do
			(
				renameFile texfilename (texN + tmpname +"."+ texNameArr[texNameArr.count])
			) */
			renameFile texfilename (texN + tmpname +"."+ texNameArr[texNameArr.count])
			i += 1
			)
		 --������ǰmesh�����в���
		  if submatnum >0 do
		 (
			 for im = 1 to submatnum do
			 (
				 imat = getSubMtl mat im
				 if imat == undefined do
				 (
				 	continue
				 )
				 itexfilename = imat.diffuseMap.filename
				 texNameArr = filterString itexfilename "\\."
				 itexname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
				texN = ""
				for itexN =1 to (texNameArr.count-2) do
				(
					texN += texNameArr[itexN] + "\\" 
				)
				--tmpname = ("t" + "_" + (i as string)) 
				tmpname = ( namestr + (i as string))
					--pass
				flag=matchPattern itexfilename pattern: (texN + namestr+"*") ignoreCase:false 
				if(flag==true)do
				(
					--print "pass"
					continue
				)
				for iobjt in  geometry do
				(
					tmat = iobjt.material
					tsubmatnumber = getNumSubMtls tmat
					if tsubmatnumber == 0 do
					(
						try(
							tmtexfilename = tmat.diffuseMap.filename
-- 							flag=matchPattern tmtexfilename pattern: (texN + namestr+"*") ignoreCase:false 
						)catch()
						/* if(flag==true) do
						(
							continue
						)	 */
						if tmtexfilename == itexfilename do
						(
							tmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
							--tmat.diffuseMap.filename = tmpname
						)
					)
					if tsubmatnumber >0 do
					(
						for itm = 1 to tsubmatnumber do
						(
							 itsmat = getSubMtl tmat itm
							if itsmat == undefined do
							(
								continue 
							)
							try(
								tmtexfilename = itsmat.diffuseMap.filename
							)catch()
							/* flag=matchPattern tmtexfilename pattern: (texN + namestr+"*") ignoreCase:false 
							if(flag==true) do
							(
								continue
							)	 */
							if tmtexfilename == itexfilename do
							(
								itsmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
								--tmat.diffuseMap.filename = tmpname
							)
						)
					)
				)
				--display
-- 				renmess = renmess + ( itexfilename + " " + tmpname +"."+ texNameArr[texNameArr.count] + "\n") 
-- 				print renmess
				renameFile itexfilename (texN + tmpname +"."+ texNameArr[texNameArr.count])
				i += 1
			)
		) 
	 )
 )


 -- ##################################### �޸�ģ��  ##############################################
 fn checkSelectedModel deleteFaces = 
(
	try(
		heatsize = 600000000-heapsize
	)catch()
	


	/*tot = selection.count
	if (tot == 0) then
	(
		message = "you need Select some mesh!"
		messageBox message
        return 0
	)*/
	disablesceneredraw()
	mesherr = #()
	count = 0;
	longmessage = ""
	longmessage1 = ""
	message = ""
	unweld = false
	
	-- ����ȫ��selection,���Ǻ�����Ҫѡ�����岢ִ��ɾ�������?
	objset = #()
	for o in geometry do
	(
		append objset o
	)
	
	for obj in objset do
    (
		
		
		nomatc = 0
		-- exclude non exported objects
		if ((classOf obj)==Dummy) then
		(
-- 			format "discard Dummy % \n" obj.name
			continue
		)
		
		-- ���mesh�Ǵ�������
		if ((classOf obj)==Box or (classOf obj)==Torus or (classOf obj)==Editable_poly or (classOf obj)==PolyMesh or (classOf obj)==PolyMeshObject) then
		(
			class = (classOf obj) as String
			if (deleteFaces==false) then
			(
				message2 = "Object " + obj.name + " is a "+class+", convert it to editable mesh\n"
				--messageBox message2
				converttomesh obj
			) else (
				converttomesh obj
				message2 = "Object " + obj.name + " WAS "+class+", converted to editable mesh\n"
				--messageBox message2
			)
		)

		if ((classOf obj)!=Editable_mesh) then
		(
-- 			format "discard %" obj.name
			continue
		)
		
-- 		format "analizying object % \n" obj.name

		if (obj.numfaces==0) then (
-- 			format "Object % has 0 faces! \n" obj.name
			longmessage = longmessage + obj.name + " has 0 faces!\n"
			nomatc = nomatc + 1
		)
		
		
		/*if (obj.mat==undefined) do
		(
			longmessage1 = longmessage1 + "���壺" + obj.name + " û�ж����������\n"
			nomatc = nomatc + 1
		)*/
		
		
		for i = 1 to obj.numfaces do 
		(
			if (i>obj.numfaces) then
				continue;

			face = getface obj i
			if (face==undefined) then
				continue;

			matID = getFaceMatID obj i
			if (obj.mat==undefined) then
			(
				--longmessage1 = longmessage1 + "���壺" + obj.name + " û�ж����������\n"
				--nomatc = nomatc + 1
			)
			else (
				if ((classOf obj.mat)==Standardmaterial) then
				(
					if (obj.mat==undefined) then
					(
						longmessage1 = longmessage1 + "B2�������壺 " +obj.name+ " û��������� face " + (i as String) +"\n"
						nomatc = nomatc + 1
						continue
					)
				) else (
					if (obj.mat[matID]==undefined) then
					(
						longmessage1 = longmessage1 + "B2�������壺 " +obj.name+ " û��������� face " + (i as String) +"\n"
						nomatc = nomatc + 1
						continue
					)
				)
			)

			v1 = getvert obj face[1]
			v2 = getvert obj face[2]
			v3 = getvert obj face[3]
			
			-- we had problems with rounding. some decimals are not shown, but present in the float
			-- the hacky solution is to convert to string. that truncates the decimals to 5
			v1x = v1.x as String
			v1y = v1.y as String
			v1z = v1.z as String
			v2x = v2.x as String
			v2y = v2.y as String
			v2z = v2.z as String
			v3x = v3.x as String
			v3y = v3.y as String
			v3z = v3.z as String

			--format "% % % % \n" obj.name v1 v2 v3
			
			bad = 0;
			equal = 0;
/* 			-- check for at least 2 axis are equal on all tree vertexes
			if (v1x==v2x and v2x==v3x) then
				equal = equal + 1;
			if (v1y==v2y and v2y==v3y) then
				equal = equal + 1;
			if (v1z==v2z and v2z==v3z) then
				equal = equal + 1;
			if (equal>1) then
				bad = 1;
 */
			-- check for 2 vertexes in the same spot
			--equal =  0;
			vflag1 = (v1x==v2x and v1y==v2y and v1z==v2z)
			vflag2 = (v1x==v3x and v1y==v3y and v1z==v3z)
			vflag3 = (v2x==v3x and v2y==v3y and v2z==v3z)
			vflag4 = vflag1 or vflag2 or vflag3
			/* if (v1x==v2x and v1y==v2y and v1z==v2z) then
				equal = equal + 1;
			if (v1x==v3x and v1y==v3y and v1z==v3z) then
				equal = equal + 1;
			if (v2x==v3x and v2y==v3y and v2z==v3z) then
				equal = equal + 1;

			if (equal>0) then
				bad = 1; */
			if(vflag4 == true) then
			(
				bad = 1;
			)
			else
			(	-- check for at least 2 axis are equal on all tree vertexes
				if (v1x==v2x and v2x==v3x) then
					equal = equal + 1;
				if (v1y==v2y and v2y==v3y) then
					equal = equal + 1;
				if (v1z==v2z and v2z==v3z) then
					equal = equal + 1;
				if (equal>1) then
					bad = 1;
			)	
			if (bad==1) then (
-- 				format "The object % has an INVALID polygon: %\n" obj.name face
				longmessage = longmessage + "B1����ģ�ͣ�" +obj.name + " ��" +(face as String)+"���Ǹ����棡, �䶨������Ϊ: " + "[" + v1x + "," + v1y + "," + v1z + "]"+ "[" + v2x + "," + v2y + "," + v2z + "]"+ "[" + v3x + "," + v3y + "," + v3z + "]"+ "\n"
				count = count + 1;
				nomatc = nomatc + 1

				-- delete the polygon
				if (deleteFaces==true) then (
-- 					format "deleting % face %\n" obj.name i
					select obj
					subObjectLevel = 3 -- set subobjectlevel to triangle
					delete obj.faces[i]
				)
			)

		) -- end for numfaces
		
		if nomatc > 0 do
		(
			append mesherr obj
			--messagebox (obj.name)
		)

		/*verts = getNumVerts obj
		uvVerts = getNumTVerts obj
		format "% % \n" verts uvVerts
		if (uvVerts>verts) then (
		  if (unweld==false) then (
			unweld=true
			longmessage = longmessage + "�кܶ�δ�ϲ���uv���������������: "+obj.name
		  ) else (
			longmessage = longmessage + ", " +obj.name
		  )
		)*/
	)
	
-- 	format "Total bad polygons: % " count;

	cs = count as String
	if (deleteFaces) then
		(message = "Total bad polygons found and deleted: " + cs)
	else
		(message = "���л��汻�ҵ�: " + cs)
	
	message = message + "\n" + (longmessage1 as String) + (longmessage as String)
	
	
	
	if (mesherr.count) > 0 then
	(
		try(
		
				wtpath = checkpPath()
				wtpath = wtpath  + "\\plan\\����"	
				makedir  wtpath	
				filename = wtpath +  "\\ģ�������⡪����Ҫ�޸�.txt"
				outFile = createFile filename
				format "%\n" message to:outFile
				close outFile
			)catch()
			
/* 		for iobj in mesherr do
		(
			--select iobj
			delete iobj
			--print (iobj.name)
		) */

	)else
	(
		wtpath = checkpPath()
		wtpath = wtpath  + "\\plan\\����"
		filename = wtpath +  "\\ģ�������⡪����Ҫ�޸�.txt"
		existFile = (getfiles filename).count != 0
		if existFile then deletefile filename
	)
	
	--messagebox ((mesherr.count) as string)
	enablesceneredraw()
	
	
	messagebox"����ģ�ͼ����ϣ���鿴 plan\����  �ļ��У�"
)	
 fn checkSelectedModel_selection deleteFaces = 
(
	try(
		heatsize = 600000000-heapsize
	)catch()

	-- ��Ҫ���������ԭ�㣬
	/*tot = selection.count
	if (tot == 0) then
	(
		message = "you need Select some mesh!"
		messageBox message
        return 0
	)*/
	disablesceneredraw()
	mesherr = #()
	count = 0;
	longmessage = ""
	longmessage1 = ""
	message = ""
	unweld = false
	
	-- ����ȫ��selection,���Ǻ�����Ҫѡ�����岢ִ��ɾ�������?
	objset = #()
	sel_cnt = selection.count
	if sel_cnt>0 then
	(
		for obj in selection do
		(
			
			nomatc = 0
			-- exclude non exported objects
			if ((classOf obj)==Dummy) then
			(
	-- 			format "discard Dummy % \n" obj.name
				continue
			)
			
			-- ���mesh�Ǵ�������
			if ((classOf obj)==Box or (classOf obj)==Torus or (classOf obj)==Editable_poly or (classOf obj)==PolyMesh or (classOf obj)==PolyMeshObject) then
			(
				class = (classOf obj) as String
				if (deleteFaces==false) then
				(
					message2 = "Object " + obj.name + " is a "+class+", convert it to editable mesh\n"
					--messageBox message2
					converttomesh obj
				) else (
					converttomesh obj
					message2 = "Object " + obj.name + " WAS "+class+", converted to editable mesh\n"
					--messageBox message2
				)
			)

			if ((classOf obj)!=Editable_mesh) then
			(
	-- 			format "discard %" obj.name
				continue
			)
			
	-- 		format "analizying object % \n" obj.name

			if (obj.numfaces==0) then (
	-- 			format "Object % has 0 faces! \n" obj.name
				longmessage = longmessage + obj.name + " has 0 faces!\n"
				nomatc = nomatc + 1
			)
			
			
			/*if (obj.mat==undefined) do
			(
				longmessage1 = longmessage1 + "���壺" + obj.name + " û�ж����������\n"
				nomatc = nomatc + 1
			)*/
			
			
			for i = 1 to obj.numfaces do 
			(
				if (i>obj.numfaces) then
					continue;

				face = getface obj i
				if (face==undefined) then
					continue;

				matID = getFaceMatID obj i
				if (obj.mat==undefined) then
				(
					--longmessage1 = longmessage1 + "���壺" + obj.name + " û�ж����������\n"
					--nomatc = nomatc + 1
				)
				else (
					if ((classOf obj.mat)==Standardmaterial) then
					(
						if (obj.mat==undefined) then
						(
							longmessage1 = longmessage1 + "B2�������壺 " +obj.name+ " û��������� face " + (i as String) +"\n"
							nomatc = nomatc + 1
							continue
						)
					) else (
						if (obj.mat[matID]==undefined) then
						(
							longmessage1 = longmessage1 + "B2�������壺 " +obj.name+ " û��������� face " + (i as String) +"\n"
							nomatc = nomatc + 1
							continue
						)
					)
				)

				v1 = getvert obj face[1]
				v2 = getvert obj face[2]
				v3 = getvert obj face[3]
				
			
				-- we had problems with rounding. some decimals are not shown, but present in the float
				-- the hacky solution is to convert to string. that truncates the decimals to 5
				v1x = v1.x as String
				v1y = v1.y as String
				v1z = v1.z as String
				v2x = v2.x as String
				v2y = v2.y as String
				v2z = v2.z as String
				v3x = v3.x as String
				v3y = v3.y as String
				v3z = v3.z as String

				--format "% % % % \n" obj.name v1 v2 v3
				
				bad = 0;
				equal = 0;
	/* 			-- check for at least 2 axis are equal on all tree vertexes
				if (v1x==v2x and v2x==v3x) then
					equal = equal + 1;
				if (v1y==v2y and v2y==v3y) then
					equal = equal + 1;
				if (v1z==v2z and v2z==v3z) then
					equal = equal + 1;
				if (equal>1) then
					bad = 1;
	 */
				-- check for 2 vertexes in the same spot
				--equal =  0;
				vflag1 = (v1x==v2x and v1y==v2y and v1z==v2z)
				vflag2 = (v1x==v3x and v1y==v3y and v1z==v3z)
				vflag3 = (v2x==v3x and v2y==v3y and v2z==v3z)
				vflag4 = vflag1 or vflag2 or vflag3
				 if (v1x==v2x and v1y==v2y and v1z==v2z) then
					equal = equal + 1;
				if (v1x==v3x and v1y==v3y and v1z==v3z) then
					equal = equal + 1;
				if (v2x==v3x and v2y==v3y and v2z==v3z) then
					equal = equal + 1;

				if (equal>0) then
					bad = 1; 
				if(vflag4 == true) then
				(
					bad = 1;
				)
				else
				(	-- check for at least 2 axis are equal on all tree vertexes
  					if (v1x==v2x and v2x==v3x) then
						equal = equal + 1;
					if (v1y==v2y and v2y==v3y) then
						equal = equal + 1;
					if (v1z==v2z and v2z==v3z) then
						equal = equal + 1;
					if (equal>1) then
						bad = 1;
				)	
				if (bad==1) then (
	-- 				format "The object % has an INVALID polygon: %\n" obj.name face
					longmessage = longmessage + "B1����ģ�ͣ�" +obj.name + " ��" +(face as String)+"���Ǹ����棡, �䶨������Ϊ: " + "[" + v1x + "," + v1y + "," + v1z + "]"+ "[" + v2x + "," + v2y + "," + v2z + "]"+ "[" + v3x + "," + v3y + "," + v3z + "]"+ "\n"
					count = count + 1;
					nomatc = nomatc + 1

					-- delete the polygon
					if (deleteFaces==true) then (
	-- 					format "deleting % face %\n" obj.name i
						select obj
						subObjectLevel = 3 -- set subobjectlevel to triangle
						delete obj.faces[i]
					)
				)

			) -- end for numfaces
			
			if nomatc > 0 do
			(
				append mesherr obj
				--messagebox (obj.name)
			)

			/*verts = getNumVerts obj
			uvVerts = getNumTVerts obj
			format "% % \n" verts uvVerts
			if (uvVerts>verts) then (
			  if (unweld==false) then (
				unweld=true
				longmessage = longmessage + "�кܶ�δ�ϲ���uv���������������: "+obj.name
			  ) else (
				longmessage = longmessage + ", " +obj.name
			  )
			)*/
		)
	
	-- 	format "Total bad polygons: % " count;

		cs = count as String
		if (deleteFaces) then
			(message = "Total bad polygons found and deleted: " + cs)
		else
			(message = "���л��汻�ҵ�: " + cs)
		
		message = message + "\n" + (longmessage1 as String) + (longmessage as String)
		
		
		
		if (mesherr.count) > 0 then
		(
			try(
			
					wtpath = checkpPath()
					wtpath = wtpath  + "\\plan\\����"	
					makedir  wtpath	
					filename = wtpath +  "\\ģ�������⡪����Ҫ�޸�.txt"
					outFile = createFile filename
					format "%\n" message to:outFile
					close outFile
				)catch()
				
	/* 		for iobj in mesherr do
			(
				--select iobj
				delete iobj
				--print (iobj.name)
			) */

		)else
		(
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\����"
			filename = wtpath +  "\\ģ�������⡪����Ҫ�޸�.txt"
			existFile = (getfiles filename).count != 0
			if existFile then deletefile filename
		)
		
		--messagebox ((mesherr.count) as string)
		
		
		
		messagebox"����ģ�ͼ����ϣ���鿴 plan\����  �ļ��У�"
	)else
		(
			messagebox"��ѡ�����壡"
		)
		enablesceneredraw()
)

fn resetMesh =
(
	for obj in geometry do
	(
		select obj
		subobjectLevel = 0
		max modify mode
		ResetXForm obj
		convertToMesh obj
	)
	
	
)

fn checkSelectedModelmodify deleteFaces = 
	(
		clearlistener()
		tot = selection.count
		if (tot == 0) then
		(
			message = "��ѡ��һ������!"
			messageBox message
	        return 0
		)
		
		count = 0;
		longmessage = ""
		longmessage1 = ""
		message = ""
		unweld = false
		badface_arr = #{}
		faceID_arr = #{}
		faceID_i = 0
		
		-- ����ȫ��selection,���Ǻ�����Ҫѡ�����岢ִ��ɾ�������?
		objset = #()
		for o in selection do
		(
			append objset o
		)
		
		for obj in objset do
	    (
			-- exclude non exported objects
			if ((classOf obj)==Dummy) then
			(
-- 				format "discard Dummy % \n" obj.name
				continue
			)
			
			-- ���mesh�Ǵ�������
			if ((classOf obj)==Box or (classOf obj)==Torus or (classOf obj)==Editable_poly or (classOf obj)==PolyMesh or (classOf obj)==PolyMeshObject) then
			(
				class = (classOf obj) as String
				if (deleteFaces==false) then
				(
					message2 = "Object " + obj.name + " is a "+class+", convert it to editable mesh\n"
-- 					print message2
					converttomesh obj
				) else (
					converttomesh obj
					message2 = "Object " + obj.name + " WAS "+class+", converted to editable mesh\n"
-- 					print message2
				)
			)

			if ((classOf obj)!=Editable_mesh) then
			(
-- 				format "discard %" obj.name
				continue
			)
			
-- 			format "analizying object % \n" obj.name

			if (obj.numfaces==0) then (
-- 				format "Object % has 0 faces! \n" obj.name
				longmessage = longmessage + obj.name + " has 0 faces!\n"
			)
			
			for i = 1 to obj.numfaces do 
			(
				if (i>obj.numfaces) then
					continue;

				face = getface obj i
				if (face==undefined) then
					continue;

				matID = getFaceMatID obj i
				if (obj.mat==undefined) then
					longmessage1 = longmessage1 + "A7�������壺" + obj.name + " û�в���\n"
				else (
					if ((classOf obj.mat)==Standardmaterial) then
					(
						if (obj.mat==undefined) then
						(
							longmessage1 = longmessage1 + "A7�������壺 " +obj.name+ " û�в���\n"
							continue
						)
					) else (
						if (obj.mat[matID]==undefined) then
						(
							longmessage1 = longmessage1 + "B2�������壺 " +obj.name+ " û��������� face " + (i as String) +"\n"
							append faceID_arr i
							faceID_i += 1 
							continue
						)
					)
				)
				
				v1 = getvert obj face[1]
				v2 = getvert obj face[2]
				v3 = getvert obj face[3]
				
				-- we had problems with rounding. some decimals are not shown, but present in the float
				-- the hacky solution is to convert to string. that truncates the decimals to 5
				v1x = v1.x as String
				v1y = v1.y as String
				v1z = v1.z as String
				v2x = v2.x as String
				v2y = v2.y as String
				v2z = v2.z as String
				v3x = v3.x as String
				v3y = v3.y as String
				v3z = v3.z as String

				--format "% % % % \n" obj.name v1 v2 v3
				
				bad = 0;
				equal = 0;
				-- check for at least 2 axis are equal on all tree vertexes
				if (v1x==v2x and v2x==v3x) then
					equal = equal + 1;
				if (v1y==v2y and v2y==v3y) then
					equal = equal + 1;
				if (v1z==v2z and v2z==v3z) then
					equal = equal + 1;

				if (equal>1) then
				(
					
					bad = 1;
					append badface_arr i
				)

				-- check for 2 vertexes in the same spot
				equal = 0;
				if (v1x==v2x and v1y==v2y and v1z==v2z) then
					equal = equal + 1;
				if (v1x==v3x and v1y==v3y and v1z==v3z) then
					equal = equal + 1;
				if (v2x==v3x and v2y==v3y and v2z==v3z) then
					equal = equal + 1;

				if (equal>0) then
				(
					
					bad = 1;
					append badface_arr i
				)

				if (bad==1) then (
-- 					format "The object % has an INVALID polygon: %\n" obj.name face
					longmessage = longmessage + obj.name + " " +(face as String)+ "\n"
					count = count + 1;
					
					append badface_arr i
					 

					-- delete the polygon
					if (deleteFaces==true) then (
-- 						format "deleting % face %\n" obj.name i
						select obj
						subObjectLevel = 3 -- set subobjectlevel to triangle
						delete obj.faces[i]
						
					)
				)

			) -- end for numfaces
-- 			print badface_arr.count
			if ((badface_arr.count>0) or (faceID_arr.count >0)) do
			(
				select obj
				exit
			)

			/*verts = getNumVerts obj
			uvVerts = getNumTVerts obj
			format "% % \n" verts uvVerts
			if (uvVerts>verts) then (
			  if (unweld==false) then (
				unweld=true
				longmessage = longmessage + "�кܶ�δ�ϲ���uv���������������: "+obj.name
			  ) else (
				longmessage = longmessage + ", " +obj.name
			  )
			)*/
		)
-- format "%\n" badface_arr
		if tot == 1 do
		(
			if (badface_arr.count>0)do
			(-- ѡ��face
-- 				converttopoly obj
				max modify mode
				subObjectLevel = 3 
				setFaceSelection $ badface_arr
				badSel = getfaceselection $
-- 				format "%\n" badSel
			)
			if (faceID_arr.count >0)do
			(-- ѡ��face
-- 				converttopoly obj
				max modify mode
				subObjectLevel = 3 
				setFaceSelection $ faceID_arr
				idSel = getfaceselection $
-- 				format "%\n" idSel
			)
				
			if badface_arr.count == 0 and faceID_arr.count == 0  then
			(
				messagebox"������������"
				setFaceSelection $ #{}
			)
			else if badface_arr.count > 0 then
			(messagebox"�����廹�л��棬�봦��")
			else if faceID_arr.count > 0 then
			(messagebox"��������Щ��û�ж�����ʣ��봦��")
			
		)

		
-- 		format "Total bad polygons: % " count;

		cs = count as String
		if (deleteFaces) then
			message = "Total bad polygons found and deleted: " + cs
		else
			message = "���л��汻�ҵ�: " + cs
		
		message = message + "\n" + (longmessage1 as String) + (longmessage as String)
		--messageBox message
		
	)
	
	
	fn checkVertUVInfo =
	(
		sel = getcurrentselection()
		cnt = sel.count
		if cnt == 1 then
		(
			o = sel[1]
			converttomesh o
			isMapChannel = meshop.getMapSupport $ 1
			if isMapChannel then
			(
				vertCnt = meshop.getNumTVerts o
				
				i=1
				err = 0
				while i< vertCnt do
				(
					uvwInfo = getTVert o i
		-- 			format"%_uvwInfo: %\n" i uvwInfo
						
					info = (getTVert o i) as string
					fd = findString info "#QNAN"
					if fd !=undefined do 
					(
						err +=1
						messagebox"����uv�д�����鿴uv���޸ģ�"
						exit	
					)
					i+=1
				)
			)else (messagebox"������û��UV��")
			if err == 0 do messagebox"������uvû�д���"
		)else messagebox"��ѡ��һ�����壡"
	)
-- 	checkVertUVInfo()
---####################################################################################################
---########################################   rollout����     #########################################
---####################################################################################################
	
---########################################   rollout����    #########################################		
	rollout selbyname "��������ѡ��" width:163 height:163
	(
		button selectObj_btn "ѡ������" pos:[16,73] width:135 height:25
		edittext thename_edit "" pos:[12,39] width:140 height:26
		label n_lbl "�����������������" pos:[13,11] width:137 height:27
		label lbl11 "�û�Ҳ���Թص�����Ի���,ֱ���ڳ�����ѡ������" pos:[17,106] width:132 height:46
			
		on selectObj_btn pressed do
		(
			try
			(
			theobj = getnodebyname thename_edit.text
			select theobj
			selnameflag = true	
			--max zoomext sel all
			)catch(messagebox"������û�н�������ֵ�����!")
		)
	)
--------------------------------   ѡ��ϲ���ͬ���ʵ�����   -----------------------------------------
	
  rollout attachMeshes "�ϲ���ͬ���ʵ�����" width:162 height:90
  (
  	label lbl1 "�����ظ�����ģ��:" pos:[10,12] width:125 height:21
  	button btn_ok "�ϲ�����" pos:[8,60] width:146 height:20
  	label lbl_disp "" pos:[7,33] width:146 height:23
	fn matnum =
	(
		mtl = #() ; tmp = #() ; fin = #()
		flag=0
		sel = geometry as array
		sel = for i in sel where canConvertTo i Editable_mesh collect i
		for i in sel do
		(
			if findItem mtl i.material == 0 do
				append mtl i.material
		)			
		 for m in mtl do
		(
			tmp = for i in sel where i.material == m collect i
			append fin tmp
		)				
		 for i in fin do
		(
			if i.count > 2 do
			(	
				flag=flag+i.count
			)
		)
		lbl_disp.Text=flag as string
		if lbl_disp.Text == "0"do
		(
			lbl_disp.Text = "û������Ҫ�ϲ���ģ���ˣ�"
		)
	)
	
	fn mergemat =
	(
		try(
			heatsize = 600000000-heapsize
		)catch()
		mtl = #() ; tmp = #() ; fin = #()
		sel = geometry as array
		sel = for i in sel where canConvertTo i Editable_mesh collect i
			
		for i in sel do
		(
			if findItem mtl i.material == 0 do
				append mtl i.material
		)
		num=0 
		flag=true
		for m in mtl where flag == true  do
		(
			tmp = for i in sel where i.material == m collect i
				if(tmp.count>2)then
					num=num+tmp.count
			if(num<2000 and tmp.count>2) then
			(
				append fin tmp
			)
			else if(num>2000)then
			(
				if(fin.count<1)then
				   append fin tmp
				flag =false
				  
			)
		)				
		for i in fin do
		(
			--if i.count > 2 then
			--(				
				trg = snapshot i[1]
				selectMore trg
				delete i[1] -- del source obj
				deleteItem i 1 -- del item array
				for j in i do
					meshop.attach trg j attachMat:#IDToMat condenseMat:true		
		--	)
		)
-- 		messagebox "success"
	)

  	on attachMeshes open  do
	(
	matnum()
  	)
  	on btn_ok pressed do
  	(
  		mergemat()
  		matnum()
  	)
  )
	rollout checkfaceNumRollout "���ģ���������" width:162 height:250
	(
		button checkN_btn "1.���ģ������" pos:[11,11] width:134 height:28
		label lbl16 "2.����д��󱨸棬ѡ�񱨸���������岢detach�����û�б��棬��ֱ�ӵ���رգ�" pos:[13,49] width:134 height:60
		button sel_mesh_btn "3.ѡ������" pos:[15,107] width:132 height:25
		button detach_btn "5.detach" pos:[17,175] width:127 height:28
		label lbl17 "4.ת��Editablepoly����6w��Ϊ���ޣ�ѡ��element" pos:[14,140] width:128 height:29
		button closeop "�ر�" pos:[22,216] width:120 height:23
		on checkN_btn pressed do
		(
			checkFaceNum()
			)
		on sel_mesh_btn pressed do
		(
			createdialog selbyname
		)
		on detach_btn pressed do
		(
			facesel = polyop.getFaceSelection $
			polyop.detachFaces $ facesel asNode:true

			)
	)
	
	--
	fn renamemesh =
	(
		--disableSceneRedraw()
		--��ȥ�������д�#�ŵ�mesh����#�ź����������
		for i = geometry do
		(
			fdstr = findString (i.name) "#"
			if fdstr != undefined do
			(
				i.name = substring (i.name) 1 (fdstr-1)
			)
		)
		myobj = #()
		local subname
		--����#��������
		for i = geometry do
		(
			fdstr = findString (i.name) "#"
			flag = 0
			if fdstr != undefined then
			(
				subname = substring (i.name) 1 (fdstr-1)
				if(finditem myobj subname ==0)then
				(
					append myobj subname
					flag = 1
				)
			)
			else
			(
				flag = 1
				subname = i.name
			)
			if(flag == 1)do
			(
				instancemgr.getinstances i &instances
				n2=1
				for j in instances do 
				(
					j.name=subname+"#"+(n2 as string)
					n2+=1
				)
			 )
		)
		--������#�ź���ģ������,������ǰ����һ����ĸ
		arrySname = #()
		strasc = "abcdefghijklmnopqrstuvwxyz"
		errnum =0
		for i = geometry do
		(
			iname = i.name
			if(finditem arrySname iname ==0)then
			(
				append arrySname iname
			)
			else
			(
				iflag = true
				tmpname=""
				fdstr = findString (i.name) "#"
				for ia =1 to 26 while  iflag == true do
				(
					tmpname = substring strasc ia 1
					postname = replace iname fdstr 1 (tmpname+"#")
					if(finditem arrySname postname ==0)then
					(
						iflag = false
						instancemgr.getinstances i &instances
						for j in instances do 
						(	
							jname = replace j.name fdstr 1 (tmpname+"#")
							append arrySname jname
							j.name= jname
						)
					)
					--����������ֵĿ����Խ�С
					if ia==26 do 
					(
						str = "ģ��"+iname+"����,û���������ɹ�!"
						print str
						errnum +=1
					)
				)
			)	
		)
		if (geometry.count != 0 and errnum == 0) then 
			messagebox "ģ�������������ɹ�!"
		else
		(
			--str = "������û��ģ�ͻ���"+(errnum as string)+"��ģ������,���ֶ������޸�!"
			str = "A13����������ģ������̫��,����"+(errnum as string)+"��ģ��������,���ֶ������޸�!"
			messagebox str
		)
	)
	
	
	rollout renameGRollout "������������" width:162 height:71
	(
		label sel_g_lbl "1.��ѡ�����е��棬��Ҫ��ѡ" pos:[12,10] width:140 height:29
		button rename_g_btn "2.�����ʼ������" pos:[12,41] width:140 height:26 toolTip:""
		on rename_g_btn pressed do
		(
			sel = getcurrentselection()
			if sel.count > 0 then
			(
				for i=1 to sel.count do
				(
					sel[i].name = "gnd" + (i as string)
				)
				messagebox"������������ɣ��������һ������"
			)else(messagebox"��ѡ��������壡")
		)
	)
	rollout renameWRollout "��ˮ��������" width:162 height:71
	(
		label sel_w_lbl "1.��ѡ������ˮ�棬��Ҫ��ѡ" pos:[12,10] width:140 height:29
		button rename_w_btn "2.�����ʼ������" pos:[12,41] width:140 height:26 toolTip:""
		on rename_w_btn pressed do
		(
			sel = getcurrentselection()
			if sel.count > 0 then
			(
				for i=1 to sel.count do
				(
					sel[i].name = "wtr" + (i as string)
				)
				messagebox"������������ɣ��������һ������"
			)else(messagebox"��ѡ��ˮ�����壡")
		)
	)
	rollout texpath "texpath" width:404 height:94
	(
		edittext edt1 "��ͼ·����" pos:[4,58] width:322 height:21
		button btn_chan "����" pos:[338,55] width:52 height:28
		label texPath_lbl "��scene�ļ����µ���ͼ�ļ���·�����������棡�磺D:\p\daxue\src\art\scene\diffuse " pos:[9,11] width:325 height:32
		
		on btn_chan pressed do
		(
			for iobjt in  geometry do
			(
				tmat = iobjt.material
				tsubmatnumber = getNumSubMtls tmat
				if tsubmatnumber == 0 do
				(
					 tmtexfilename = tmat.diffuseMap.filename
					 texNameArr = filterString tmtexfilename "\\."
					 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
					
					
					 tmat.diffuseMap.filename = (edt1.text)+ "\\"+texname
				)
				if tsubmatnumber >0 do
				(
					for itm = 1 to tsubmatnumber do
					(
						 itsmat = getSubMtl tmat itm
						
						if itsmat == undefined do
						 (
							 --print submatnum
							 --submatnum = submatnum + 1
							 continue
						  )
						 tmtexfilename = itsmat.diffuseMap.filename
						 texNameArr = filterString tmtexfilename "\\."
						 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
						
						
						 itsmat.diffuseMap.filename = (edt1.text)+ "\\" +texname
					)
				)
			)
			messagebox"��ͼ·���������,���Խ�����һ����"
		)
	)
	
	

	rollout errorMeshto "����ģ�ʹ���" width:162 height:302
	(
		label gj_lbl "1.����plan\���� �е��б��ҵ�����mesh����,�����Ŀ��У����ѡ��" pos:[8,7] width:146 height:42
		button selectbyname_btn "ѡ��(sel)" pos:[91,51] width:68 height:23
		button checkone_btn "2.�鿴����(checkone)" pos:[4,78] width:153 height:30
		label lbl_bitmap "3.����ܿ���ѡ����棬���ֶ����������������ִ�е�5����ɾ�����棡�����ʾ�������������ͼ����һ������ģ�ͣ�" pos:[9,113] width:146 height:70
		button deleteface_btn "4.ɾ������(delbadPoly)" pos:[3,192] width:155 height:29
		button closethis_btn "6.�رմ���" pos:[7,262] width:148 height:29
		button btn_doModify "5.ȷ���޸�(doModify)" pos:[4,227] width:150 height:29 enabled:false
		edittext edt_meshname "" pos:[0,53] width:84 height:19
		local obj
		local obj_pos
		local arrobj=#()

		on selectbyname_btn pressed do
		(
			--createdialog selbyname
			errflag = true
			try
			(
			theobj = getnodebyname edt_meshname.text
			select theobj
			errflag = false	
			--max zoomext sel all
			)catch(
				messagebox"������û�н�������ֵ�����!"
				)
			if errflag == false do
			(
				--���viewport����ѡ��
				act=#()
				act=getViewSize()
				max tool maximize
				base=#()
				base=getViewSize()
				if(act[1]>=base[1])do (max tool maximize)
				--
				--�ҵ�������Щģ���йص�Instanceģ�Ͳ���¼����
				obj = selection[1]
				instancemgr.getinstances obj &instances
				for i in instances do append arrobj i
				subobjectLevel = 0
				max modify mode
				ResetXForm obj
				convertToPoly obj
				obj_pos = obj.transform
				objpos=obj.pos
				obj.transform = (matrix3 [1,0,0] [0,1,0] [0,0,1] objpos)
				--ResetXForm fake_obj
				--max tool maximize
				max zoomext sel all
				btn_doModify.enabled = true
				messagebox "��׼����,�����:"
			)
			
		)
		on checkone_btn pressed do
		(
			checkSelectedModelmodify false
		)
		on deleteface_btn pressed do
		(
			selface = $.selectedFaces 
			selface_arr = selface as bitarray 
			meshop.deleteFaces $  selface_arr
			update $

-- 			checkSelectedModelmodify true
			setFaceSelection $ #{}
			subobjectLevel = 0
		)
		on closethis_btn pressed do
		(
			destroydialog errorMeshto
		)
		on btn_doModify pressed do
		(
			try(
				select obj
				instanceReplace arrobj obj
				obj.transform = obj_pos
				ResetXForm obj
				convertToPoly obj
			)catch( messagebox "����ʧ��,�����²���")
			btn_doModify.enabled = false
		)
	)
	
	
	rollout uv_tool "uv���" width:171 height:53
	(
		button selmesh_btn "1.ѡ������(selectbyName)" pos:[4,4] width:160 height:18
		button uvCheck_btn "2.��ѡģ�ͼ��(checkUV)" pos:[4,25] width:160 height:18
		on selmesh_btn pressed do
		(
			createdialog selbyname
		)
		on uvCheck_btn pressed do
		(
			checkVertUVInfo()
		)
	)
	--�����ͼ���Ƿ񳬹�660
	fn ChkTexMapNums=
	(
		cp = checkpPath()
		outputPath=cp+"\\plan\\����"
		makeDir outputPath
		fileN  = "\\������Ч��ͼ�������࣬��Ҫ������ͼ����.txt"
		filename = (outputPath + fileN )
		--try delete existed file
		existFile = (getfiles filename).count != 0
		if existFile then 
			try(deletefile filename)catch()
		arrMap = #()
		for iobj in geometry do
		(
			curmat = iobj.mat
			if(classof curmat == Standardmaterial) then
			(
				if((curmat.diffuseMap) != undefined) and (classof(curmat.diffuseMap)) == Bitmaptexture then
				(
					texname = curmat.diffuseMap.filename
					appendIfUnique arrMap texname
				)
			)
			else if((classof curmat) == multimaterial ) then
			(
				 for submatid = 1 to curmat.materialList.count do
				 (
					CurrentSubMtl = curmat.materialList[submatid]
					if(CurrentSubMtl != undefined) and (classof CurrentSubMtl)  == Standardmaterial then --��ά�����п��ܳ���ĳidδ��������
					(
						--print iobj.name
						if (CurrentSubMtl.diffuseMap) != undefined  and (classof(CurrentSubMtl.diffuseMap)) == Bitmaptexture then
						(
							texname = CurrentSubMtl.diffuseMap.filename
							appendIfUnique arrMap texname
						)
					)
			    )
			)
		)
		mapnums = arrMap.count
		if(mapnums > 900) then
		(
			outFile = createFile filename
			format ("B9����������ͼ����������900�ţ���Ҫ������ͼ������\n") to:outFile
			close outFile
		)
	)
	--��鳡���������Ƿ񳬹�33��
	fn ChkSceneFaceNums =
	(
		arrXiaopin = selectMeshgen()
		Xpnum = 0
		try(
			if( arrXiaopin.count > 0)then
			(
				for iobj in arrXiaopin do
					Xpnum += iobj.numfaces
			)
		)catch()	
		arrGndmesh = for i in geometry where matchPattern i.name pattern:("gnd*") ignoreCase:false collect i
		terriannum = 0
		try(
			for ignd in arrGndmesh do
				terriannum += ignd.numfaces
		)catch()	
		jznum = 0
		for iobj in geometry do
		(
			if(finditem arrXiaopin iobj) != 0 then continue
			if(matchPattern iobj.name pattern:("gnd*") ignoreCase:false) == true then continue
			if(matchPattern iobj.name pattern:("sky*") ignoreCase:false) == true then continue
			if(matchPattern iobj.name pattern:("plant*") ignoreCase:false) == true then continue
			try(
				jznum += iobj.numfaces	
			)catch()	
		)
		cp = checkpPath()
		srcdir = "\\plan\\����"
		outputPath=cp+srcdir
		makeDir outputPath
		fileN  = "\\����ģ��������ʾ.txt"
		filename = (outputPath + fileN )
		--outFile = createFile filename
		existFile = (getfiles filename).count != 0
		if existFile then 
			try(deletefile filename)catch()
		outFile = createFile filename
		format "������Ϣ�� \n" (jznum as string) to:outFile		
		format " 1��������������Ϊ��% \n" (jznum as string) to:outFile
		format " 2��СƷ������Ϊ��%\n" (Xpnum as string) to:outFile
		format " 3������������Ϊ��% \n" (terriannum as string) to:outFile
		if(jznum >330000) then
		(
			format "���󱨸棺\n" to:outFile
			format " B8--����ģ���������ѳ���33�������棬��Ҫ�����洦��\n" to:outFile
		)
		close outFile
	)
	
	
	
	
---########################################   rollout���    #########################################
	rollout version_rollout "�汾Ver1.0.5.3" width:171 height:55
	(
		label version_lbl "Copyright (C) 2012 Sanpolo Co.LTD     http://www.spolo.org" pos:[13,7] width:146 height:45
	)
		rollout resetScn_tool "һ.���û���" width:171 height:300
		(
			button sceneRest_btn "1.���û���(reset)" pos:[4,58] width:160 height:18
			progressBar doit_prog "" pos:[13,81] width:145 height:14 color:(color 255 0 0)
			label lbl_bitmap "2.��bitmap/photometric paths     ָ����ͼ·��" pos:[13,106] width:146 height:35
			label lbl_saveScene "3.������·�������棬�ش�    ������" pos:[12,139] width:154 height:28
			label quebao_lbl "��֤��Ŀ·����ȷ��         D:\p\(��Ŀ����)\src\art\scene\max\\" pos:[7,6] width:157 height:48
			on sceneRest_btn pressed do
			(
				scene_reset doit_prog
			)
		)
			
		
	rollout attach_tool "��.ģ�ʹ���(1)" width:171 height:300
	(
-- 		button attach_btn "1.�ϲ�ͬ��������(attachMesh)" pos:[4,4] width:160 height:18
		button checkSameMesh_btn "1.���ͬ��Mesh(sameNMesh)" pos:[4,5] width:160 height:18
		button faceNum_btn "2.���ģ������(faceNum)" pos:[4,27] width:160 height:18
-- 		progressBar renameMesh_bar "" pos:[13,124] width:145 height:14 color:(color 255 0 0)
		--button setgroundN_btn "4.��������(renameground)" pos:[3,112] width:160 height:18
		label dandu_lbl "3.��֤ÿ���������ǵ���ģ�ͣ�������ǣ����ֶ��𿪣�" pos:[7,48] width:156 height:32
		label lbl7 "4.�������峬��300�����沢��Ҫ���õ����壬��ʹ��instance�ķ�ʽ����" pos:[7,87] width:151 height:46
-- 		on attach_btn pressed do
-- 		(
-- 			createdialog attachMeshes
-- 		)

-- 		on renameMesh_btn pressed do
-- 		(
-- 			objs = geometry as array
-- 			for o = 1 to objs.count do
-- 			(
-- 				objs[o].name = "o"+ (o as string)
-- 				renameMesh_bar.value = 100.*o/objs.count 
-- 			)
-- 			messagebox"mesh��������ϣ��������һ��������"
-- 		)

		/* on setgroundN_btn pressed do
		(
			createdialog renameGRollout
		) */
		on checkSameMesh_btn pressed do
		(
			checkSameNobj()
		)
		on faceNum_btn pressed do
		(
			checkFaceNum()
			ChkTexMapNums()
			ChkSceneFaceNums()
			messagebox "������,��鿴�����ļ��У�����"
		)
	)
	rollout checkmt_tool "��.���ʺ���ͼ" width:171 height:300
	(
		button checkmt_btn "1.������ͼ���(checkMatTex)" pos:[4,4] width:160 height:18
		button settpath_btn "2.������ͼ·��(setPath)" pos:[4,25] width:160 height:18
--  		button renameMatTex_btn "3.������ͼ������(rename)" pos:[4,46] width:160 height:18
		on checkmt_btn pressed do
		(
			checkmattex()
			messagebox "������,��鿴�����ļ��У�����"
		)
		on settpath_btn pressed do
		(
			CreateDialog texpath
		)
--  		on renameMatTex_btn pressed do
-- 		(
-- 		
-- 			checkmat()
-- 			checktexture()
-- 			--messagebox "�������Ƴ���12�ַ����Լ���ͼ��������8�ַ��Ѿ�����������������"
-- 			viewport.SetRenderLevel #wireFrame
-- 			 mystr="z"
-- 			 arry=getLocalTime()
-- 			 for i =4 to 8 do
-- 				 mystr=mystr+(arry[i] as string)
-- 			-- print mystr
-- 			messagebox ("��ʼ����,��ѡ��ȷ��,����ʱ������max�����ֶԻ���ſ��Խ�������!")
-- 			--mystr ="z"+(timestamp() as string)+(timestamp() as string)
-- 			renametexture mystr
-- 			renametexture "tex_"
-- 			messagebox "��ͼ�������ɹ�!"
-- 		) 
		
	)
	rollout mesh_tool "��.ģ�ʹ���(2)" width:175 height:300
	(
		button checkMesh_btn "1.����ģ�ͼ��(checkMesh)" pos:[4,32] width:160 height:18
		button errorMesh_btn "4.������(errorMesh)" pos:[4,111] width:160 height:18
		button checkUV_btn "5.����UV���(checkUV)" pos:[4,132] width:160 height:18
		label lbl3 "3.�����ͬ������Ĵ�����ӳ����ҳ����ĳ��������ɣ�" pos:[7,74] width:156 height:33
		radiobuttons checkMode_rdo "" pos:[5,8] width:136 height:16 labels:#("�Զ���", "ѡ���") default:1 columns:2
		button btn_clnVraymsh "2.�����֧�ֵĹ��߶���" pos:[6,53] width:160 height:18
		on checkMesh_btn pressed do
		(
			DelVrayMesh true false --DelVrayMesh expflag delflag
			if  checkMode_rdo.state == 1 do
			(
				checkSelectedModel false
			)
			if  checkMode_rdo.state == 2 do
			(
				checkSelectedModel_selection false
			)
			
		)
		on errorMesh_btn pressed do
		(
			CreateDialog errorMeshto
		)
		on checkUV_btn pressed do
		(
			createdialog uv_tool
		)
		on btn_clnVraymsh pressed do
		(
			DelVrayMesh false true  --DelVrayMesh expflag delflag
			messagebox "��֧�ֵĶ�����������"
			
		)
	)

	/**
	 * @brief ��.�淶���� -> �������������
	 */
	rollout rlt_renameSky "�������������" width:162 height:71
	(
		label sel_g_lbl "1.��ѡ����������򣬲�Ҫ��ѡ" pos:[12,10] width:140 height:29
		button rename_g_btn "2.�����ʼ������" pos:[12,41] width:140 height:26 toolTip:""
		on rename_g_btn pressed do
		(
			renameSelection "sky"
		)
	)
	/**
	 * @brief ��.�淶���� -> ��ֲ��������
	 */
	rollout rlt_renamePlant "��ֲ��������" width:162 height:71
	(
		label sel_g_lbl "1.��ѡ������ֲ���Ҫ��ѡ" pos:[12,10] width:140 height:29
		button rename_g_btn "2.�����ʼ������" pos:[12,41] width:140 height:26 toolTip:""
		on rename_g_btn pressed do
		(
			renameSelection "plant"
		)
	)
	--******************����������***************
	function comparemesh obj1 obj2 =
	(
		try(
		o1v = obj1.mesh.verts.count	
		o1f = obj1.mesh.faces.count
		o1e = obj1.mesh.edges.count
		o2v = obj2.mesh.verts.count
		o2f = obj2.mesh.faces.count
		o2e = obj2.mesh.edges.count
		)catch(return false)
		if o2v == o1v THEN 		
			if o2f == o1f THEN		
				if o2e == o1e THEN	
				(
					return true
				)
				else return false
			else return false
		else return false
	)
	function comparemats obj1 obj2 =
	(
		m1 = obj1.material
		m2 = obj2.material
		if m1 == m2 then 
			return true
		else 
			return false 
	)
	function comparesize obj1 obj2 =
	(
		theoldtransform2 = obj2.transform
		obj2.transform = obj1.transform	
		vnums = obj1.mesh.verts.count
		icount = 0
		for i = 1 to 7 do
		(	
			rdnum1 = random 1 vnums
			rdnum2 = random 1 vnums
			rdnum3 = random 1 vnums
			while(rdnum1 == rdnum2)do
			(
				rdnum2 = random 1 vnums
			)
			while(rdnum1 == rdnum3 or rdnum2 == rdnum3)do
			(
				rdnum3 = random 1 vnums
			)
			
			obj1p1 = (getVert obj1 rdnum1)
			obj1p2 = (getVert obj1 rdnum2)
			obj1p3 = (getVert obj1 rdnum3)
			obj2p1 = (getVert obj2 rdnum1)
			obj2p2 = (getVert obj2 rdnum2)
			obj2p3 = (getVert obj2 rdnum3)
			
			obj1line1 = distance obj1p1 obj1p2	
			obj1line2 = distance obj1p1 obj1p3
			obj2line1 = distance obj2p1 obj2p2
			obj2line2 = distance obj2p1 obj2p3
			bili1 = (float)(obj1line1/obj1line2)
			bili2 = (float)(obj2line1/obj2line2)
			tmpd = abs (bili2 - bili1)
			if(tmpd <= 1.0e-6) then
			(
				icount += 1
			)
		)
		obj2.transform = theoldtransform2	
		
		--print icount
		if(icount > 5) then
			return true
		else 
			return false
		--return true
	)

	-- main function comparison
	function similarobjects obj1 obj2  =
	(
		if (comparemesh obj1 obj2) != true then
			return false
		if (comparemats obj1 obj2) != true then
			return false 
		if (comparesize obj1 obj2) != true then 
			return false
		else
			return true
	)

	fn renameontology =
	(
		disablesceneredraw() -- disable scene redraw
		arrChange = #() --��¼ģ�����±�����
		for i=1 to geometry.count do 
		(
			iobj = geometry[i]
			if(classof iobj.baseobject != Editable_Mesh)then
					convertToMesh iobj
			arrChange[i] = false
		)
		theobjs = geometry as array
		arrSameMesh = #()
		gemcount = theobjs.count
		for i=1 to gemcount-1 do
		(
			thecompare = theobjs[i]
			if(arrChange[i] == false)then
			(
				arrChange[i] = true
				tmparr = #(thecompare)
				for ii = (i+1) to gemcount do
				(
					obj = theobjs[ii]
					sameflag = similarobjects thecompare obj 
					if(sameflag == true)then
					(
						append tmparr obj
						arrChange[ii] = true
					)
				)
				--if(tmparr.count>1)then
					append arrSameMesh tmparr
			)
		)
		for i=1 to geometry.count do 
		(
			iobj = geometry[i]
			if(arrChange[i] == false)then 
			(
				tmparr = #(iobj)
				append arrSameMesh tmparr
			)
		)
		arrName = #()
		for i = 1 to arrSameMesh.count do
		(
			bkflag = false
			tmpname = ""
			for j = 1 to arrSameMesh[i].count while bkflag == false do
			(
				orgname = arrSameMesh[i][j].name
				nameidx = findString orgname "#"
				if(nameidx != undefined)then
					tmpname = substring orgname 1 (nameidx-1)
				else
					tmpname = orgname
				fs = finditem arrName tmpname
				if(fs == 0)then
				(	
					append arrName tmpname
					bkflag = true
				)
			)
			if(bkflag == false)then
			(
				tmpname = "obj" + (random 1 100) as string
				while(finditem arrName tmpname != 0)do
				(
					tmpname = "obj" + (random 1 100) as string
				) 
				append arrName tmpname
			)
			--���ϴ����ֹģ�������ظ�,
			arrValue = arrSameMesh[i]
			count = arrValue.count
			for ii=1 to count do 
			(
				--orgname = arrValue[ii].name
				arrValue[ii].name = tmpname +"#" + ii as string
				--print (orgname +" change: "+ arrValue[ii].name)
			)
		)
		enablesceneredraw()
	)
	--over
	rollout meshrename_tool "��.�淶����" width:180 height:106
	(
		button btn_renameground "1.��������(renameground)" pos:[4,4] width:160 height:18
		button btn_renameSky "2.�������(renameSky)" pos:[4, 25] width:160 height:18
		button btn_renamePlant "3.ֲ������(renamePlant)" pos:[4, 46] width:160 height:18
		--@ticket:1545 liuyingtao���������Ҫ�Ĺ���
		--@fixme ������ע�͵���ť�ͺ��ˣ�����Ҫ����Ӧ����ɾ����
		--button btn_renamewater "2.ˮ������(renamewater)" pos:[4,25] width:160 height:18
		button btn_renameModel "4.����淶����(renameModel)" pos:[4, 67] width:160 height:18
		button btn_checkMeshName "5.���mesh����(checkMeshN)" pos:[4, 88] width:160 height:18
		on btn_renameground pressed do
		(
			createdialog renameGRollout
		)
		on btn_renameSky pressed do
		(
			createdialog rlt_renameSky
		)
		on btn_renamePlant pressed do
		(
			createdialog rlt_renamePlant
		)
		on btn_renamewater pressed do
		(
			createdialog renameWRollout
		)
		on btn_renameModel pressed do
		(
			renameontology()	--������ʵ��������
			messagebox "����淶�����ɹ�!"
			--renamemesh()		--��instance�������Ժ���,��ע�͵�
		)
		on btn_checkMeshName pressed do
		(
			checkMeshName()
		)
	)
	
	rollout spp_view "��.����Ԥ��" width:180 height:191
	(
		button btn_export_x "1.����x�ļ�(export X)" pos:[4,4] width:160 height:18
		button btn_sppbuild "2.��������(sppbuild)" pos:[4,25] width:160 height:18
		button btn_viewscene "3.Ԥ��(viewscene)" pos:[4,68] width:160 height:18
		checkbox chk_MultiThreadLoading "���̼߳��� (MT)" pos:[12,49] width:146 height:18
		GroupBox grp_MultiThreadLoading "" pos:[5,40] width:160 height:52
		on btn_export_x pressed do
		(
			export_x_file()
		)
		on btn_sppbuild pressed do
		(
			build_scene()
		)
		on btn_viewscene pressed do
		(
			view_scene chk_MultiThreadLoading.checked SPP_DEBUG
		)
	)
	
	rollout MEdgeRollout "�ڱߴ�����" width:150 height:98
	(
		button btn_deal "����ڱ�" pos:[8,68] width:137 height:23
		GroupBox grp1 "����ʽ:" pos:[3,7] width:144 height:57
		radiobuttons rdb_kinds "" pos:[9,29] width:121 height:40 enabled:true labels:#("��ѡ��ģ��  ", "��ȫ��(geometry)����")
		local arrMesh = #()
		local state = ""
		fn updateButton = (
			case rdb_kinds.state of (
			1: state = "selection "
			2: state = "all "
			)
		)--end fn


		
		fn addedges iobj=
		(
			--iobj = selection[1]
			--convertToPoly
			--convertto iobj editable_poly
			--setFaceSelection 
			select iobj
			--convertToPoly(iobj)
			macros.run "Modifier Stack" "Convert_to_Poly"
			subobjectLevel = 2
			--update iobj
			aryedge = #{}
			for iedge in iobj.edges do
			(
				try(
					--print (iedge.index)
					aiFaces = #()
					--print (aiFaces)
					--<mesh>.selectedFaces = (<array> | <bitarray>)
					aiFaces = polyOp.getEdgeFaces (iobj) (iedge.index)
					ltmpface = iobj.faces[aiFaces[1]]
					rtmpface = iobj.faces[aiFaces[2]]
					ltmpnor =  (polyop.getFaceNormal iobj ltmpface.index)
					rtmpnor =  (polyop.getFaceNormal iobj rtmpface.index)
					norangle = acos (dot ltmpnor rtmpnor)
					--polyop.getFaceEdges <Poly poly> <int face>
					--print (norangle)		
					if (0<norangle and norangle < 180) then
					(
						--append aryedge  (iedge.index)
						tmpary = #()
						tmpary = polyop.getFaceEdges iobj (ltmpface.index)
						for i in tmpary do appendIfUnique  aryedge	i
						tmpary = polyop.getFaceEdges iobj (rtmpface.index)
						for i in tmpary do appendIfUnique  aryedge	i
					)	
				)catch()
			)
			iobj.edgeChamfer = 0.001
			iobj.edgeChamferSegments = 3
			iobj.EditablePoly.SetSelection #Edge aryedge
			iobj.EditablePoly.buttonOp #Chamfer
			--subobjectLevel = 1
			convertToMesh iobj
			update iobj
		)

		on MEdgeRollout open do
		(	
			state = "selection "
			)
		on btn_deal pressed do
		(
			if state == "selection " then
			(
				if(selection.count < 1)then messagebox "û��ѡ��ģ��"
				else	arrMesh = selection as array	
			)
			else
			(
				if(geometry.count < 1)then messagebox "������û��ģ��"
				arrMesh = geometry as array
			)
			if( arrMesh.count > 0) then
			(
				for i in arrMesh do 
				(
					--print i.name
					addedges i
				)
				messagebox "�������"
			)
		)
		on rdb_kinds changed stat do
		(
			updateButton()
		)
	)

	rollout MovieLRollout "��.Ӱ�ӹ���" width:180 height:191
	(
		button btn_medges "1.�ڱߴ���" pos:[5,5] width:163 height:20
		on btn_medges pressed do
		(
			try(destroydialog MEdgeRollout)catch()
			createdialog MEdgeRollout
		)
	)

gw = newRolloutFloater "Spp Scene ToolModify" 185 705
addrollout	version_rollout gw rolledUp:true
addrollout  resetScn_tool gw
addrollout  attach_tool gw	
addrollout  checkmt_tool gw
addrollout  mesh_tool gw
addrollout	meshrename_tool gw
if(checksdk()) then
(
	addrollout	spp_view gw
	addrollout	MovieLRollout gw
)

)