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

macroScript SPP_sceneTool
category:"Superpolo"
ButtonText:"Scene ToolSet" 
tooltip:"Spp Scene ToolSet" Icon:#("Maxscript", 2)
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
	 -- outFile = createFile filename
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
								id = Currentmat.materialIDList[iSubMtl]
								subidname = "submatid" + (id as string)				
								iname = CurrentSubMtl.name --��ǰ�Ӳ�������
								effecttype = getUserProp i subidname --�����Ƿ����Զ�������Ч��
								if effecttype != "" and effecttype != undefined then
								 (
									 --messagebox iname
									 imatname = Currentmat.name
									 imatname = imatname + "_" + iname + "Sub" +((id - 1) as string) --sppbuildʱΪx�ļ�assimp��������ʸ���
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
		/*artdir  = "\\src\\art\\factory\\neirong01\\effect"
		arthudfilename = cp + artdir + fileN
		try(
			deletefile arthudfilename
			copyfile filename arthudfilename
		)catch()*/
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
				
		for t in animationRange.start to animationRange.end by (1s/frameRate) do
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
		tmpstr = icam.name
		idx = findstring tmpstr "00"
		if idx == undefined then
		(
			camname=replace tmpstr 7 1 "00" 
		)
		else
			camname = tmpstr
		filename = dir + "wander_" + camname + ".xml"
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
	--��ע�͵�
	fnmeshgen() --meshgen
	expHudxml() --hud tree
	expxml() 	-- effect xml
	explodxml()	--lod xml
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









































-- ##################################### function ##############################################

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
-- 	checkpPath()
 	fn scene_reset doit_prog=
	(
		del_dummy()
		moveToo()
		-- ungroup
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

		-- ambient color setting
		ambientColor = color 255 255 255

		-- render preset
		theRenderPreset = renderPresetMRUList[1][2] 
		renderpresets.Load 0 theRenderPreset #{32}

		-- layout setting
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
				-- unwrap_UVW
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
		

	
--######################################## Checking resource ###########################################
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
		delete delete_arr
		
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
	)
/* 	
	fn checkSameMatObj =
	  (
		mess = ""
		err= 0
		cp = checkpPath()
		  
		mtl = #() ; tmp = #() ; fin = #()
		sel = geometry as array
-- 		format "sel= %\n"sel.count 
	-- 	print sel.count as string	
		sel = for i in sel where canConvertTo i Editable_Poly collect i
		for i in sel do
		(
			--format i.material.name
			if findItem mtl i.material.name == 0 do
				append mtl i.material.name
		)
-- 		print "mtl="
-- 		print mtl.count as string
		 for m in mtl do
		(
			--print m
			tmp = for i in sel where i.material.name == m collect i
			append fin tmp
		)
-- 		print "fin="
-- 		print fin.count as string 
		local k=0
		sameMat_arr = #()
		 for i in fin do
		(
			if i.count > 1 do
			(
	-- 			print i.count
	-- 			print i[1].mat.name
				join sameMat_arr i
			)
		)
		if sameMat_arr.count >10 do
		(
			
			err+=1
			message = stringStream ""
			message = "���ò��ʵ�ģ���������࣬��Ҫattach��ͬmesh��ģ�ͣ� \n"
			mess = mess + message
			
			delete sameMat_arr
		)
	-- 	sameMat_arr.count
	-- 		print k
		wtpath = cp  + "\\plan\\����"	
		makedir  wtpath	
		filename = wtpath +  "\\���ò��ʵ�ģ���������ࡪ����Ҫ�޸�.txt"
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
	)
	
	
	
	 */
	
-- Checking same name
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
			select delete_arr
			delete delete_arr
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
		)
	)
-- checkSameNobj()

	
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
				if objname.count> 16 do
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
 	 if(mesherr.count) > 0 do
	 (
		 for im in mesherr do
		 (
			 --select im
			 delete im
		 )
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
	
---1.���mesh mat texture	
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
		 -- check name length
-- 		 if iobj.name.count > 8 then
-- 		 (
-- 			objname= iobj.name
-- 			fs=findString objname "#" 
-- 			if fs == undefined then
-- 			(
-- 				i = i +1
-- 				message = stringStream ""
-- 				message = "[1006]���壺" + (iobj.name) + "��mesh���ֳ��ȳ�����10���ַ�����Ҫ�Ķ̣�\n"
-- 				mess = mess + message
-- 				errcount = errcount + 1
-- 			)else
-- 			(
-- 				fs= fs-1
-- 				nobjname = substring objname 1 fs
-- 				if objname.count> 10 do
-- 				(
-- 					i = i +1
-- 					message = stringStream ""
-- 					message = "[1006]���壺" + (iobj.name) + "��mesh���ֳ��ȳ�����10���ַ�����Ҫ�Ķ̣�\n"
-- 					mess = mess + message
-- 					errcount = errcount + 1
-- 				)
-- 			)	
-- 		 )else
-- 		 (
-- 			objname= iobj.name
-- 			fs=findString objname "#"  
-- 			if fs == undefined do
-- 			(
-- 				i = i +1
-- 				message = stringStream ""
-- 				message = "���壺" + (iobj.name) + "��mesh����û�ж���#�����к�,����������֣���ִ�С�����淶��������\n"
-- 				mess = mess + message
-- 				errcount = errcount + 1
-- 			)
-- 		 )

		 
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
								if cnt > 12 do
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
											if cnt > 16 do
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
	 
 	 if(mesherr.count) > 0 do
	 (
		 for im in mesherr do
		 (
			 --select im
			 delete im
		 )
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
	
--- 2. set path ֱ�Ӿ���rollout����
 
 
---3.���mesh mat texture
 
 -- ��ѡ�е�ģ��ִ�н������
-- deleteFacesָʾ���ִ���ʱ,�Ƿ�ɾ����, ͨ���������ݹ�����һ����飬һ���޶�









fn checkSelectedModel deleteFaces = 
(
	/*tot = selection.count
	if (tot == 0) then
	(
		message = "you need Select some mesh!"
		messageBox message
        return 0
	)*/
	
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
			-- check for at least 2 axis are equal on all tree vertexes
			if (v1x==v2x and v2x==v3x) then
				equal = equal + 1;
			if (v1y==v2y and v2y==v3y) then
				equal = equal + 1;
			if (v1z==v2z and v2z==v3z) then
				equal = equal + 1;

			if (equal>1) then
				bad = 1;

			-- check for 2 vertexes in the same spot
			equal = 0;
			if (v1x==v2x and v1y==v2y and v1z==v2z) then
				equal = equal + 1;
			if (v1x==v3x and v1y==v3y and v1z==v3z) then
				equal = equal + 1;
			if (v2x==v3x and v2y==v3y and v2z==v3z) then
				equal = equal + 1;

			if (equal>0) then
				bad = 1;

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
		message = "Total bad polygons found and deleted: " + cs
	else
		message = "���л��汻�ҵ�: " + cs
	
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
			
		for iobj in mesherr do
		(
			--select iobj
			delete iobj
			--print (iobj.name)
		)

	)else
	(
		wtpath = checkpPath()
		wtpath = wtpath  + "\\plan\\����"
		filename = wtpath +  "\\ģ�������⡪����Ҫ�޸�.txt"
		existFile = (getfiles filename).count != 0
		if existFile then deletefile filename
	)
	
	--messagebox ((mesherr.count) as string)
	
	
	
	--messageBox message
)	

--###################################  ���嵼��  ###################################
 
-- ��Ҫ��rollout��
 
	-------------------------����������--------------------------------------
	fn rename nn = 
	(
		sel = getcurrentselection()
		for i =1 to sel.count do
		(
			if i<10 do
			(
				sel[i].name = nn + "#" + "00" +(i as string) 
			)
			if i<100 and i>=10 do 
			(
				sel[i].name = nn + "#" + "0" +(i as string)
			)
			if i>100 do
			(
				sel[i].name = nn + "#" +(i as string)
			)
		)
	)
 
	

	
	
	
-------------------------x�ļ��Լ�������Ϣ����--------------------------------------


--rename lightingmap
fn renamelightmap = 
(
	lp = checkpPath()
	lp +=  "\\src\art\scene\lightmap\\"
	lmarr = a = getFiles (lp+"*.jpg")
	for i in lmarr do
	(
		if (matchPattern i pattern:"*VRayTotalLightingMap*") == true do
		(
			fsIndex = findString i "VRayTotalLightingMap"
			
			s1=replace i fsIndex 20 "" 
			renameFile  i s1
		)
	)
)	
	

/*fn xfile_export =
(
	rename_materials()
	
	renamelightmap()
	
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
)*/	
	
	
	
	
	
-------------------------lightmap����--------------------------------------
	
 fn lightmap_export =
(
	
	cp = checkpPath()
	for obj in geometry  do
	(
		
		
		-- ��¼�ڷ�λ��
		
		
		if((getUserProp obj "bake") == 1) do
		(
			
			select obj
			subobjectLevel = 0
			max modify mode
			ResetXForm obj
			convertToPoly obj
			--print ((obj.name) + ((obj.transform) as string))
			scene_pos = obj.transform
			-- �ƶ�����������ԭ��
			obj.transform = (matrix3 [1,0,0] [0,1,0] [0,0,1] [0,0,0])
			ResetXForm obj
			convertToPoly obj
			ChannelInfo.CopyChannel obj 3 1
			ChannelInfo.PasteChannel obj 3 3
			ChannelInfo.CopyChannel obj 3 2
			ChannelInfo.PasteChannel obj 3 1
			srcdir = "\\src\\art\\uv_lightmap"
			outputPath = cp + srcdir 
			makedir outputPath
			filename = outputPath + "\\" + "light_" + obj.name  + ".3ds"
			select obj
			exportfile filename #noPrompt selectedOnly:TRUE
			
			ChannelInfo.CopyChannel obj 3 3
			ChannelInfo.PasteChannel obj 3 1
			-- �ص��ڷ�λ��
			obj.transform = scene_pos
			clearSelection()
		)
		
	)
)
	
-------------------------���嵼��--------------------------------------
 fn basemodel_export =
(
	disableSceneRedraw()
	cp = checkpPath()
	if cp.count>6 do
	(
		i = 0
		clearSelection()
		allGeom = for i in geometry collect i
		--ResetXForm allGeom
		--convertToPoly allGeom
		--����ǰ����ɾ�����е�����3ds
		srcdir = "\\src\\art\\factory\\neirong01"
		outputPath=cp+srcdir
		oldfiles=outputPath + "\\" +  "*.3ds"
		for oldfile in getFiles oldfiles do deleteFile oldfile
		for obj in geometry  do
		(
			
			
			-- ��¼�ڷ�λ��
			
			select obj
			subobjectLevel = 0
			max modify mode
			ResetXForm obj
			convertToPoly obj
			--print ((obj.name) + ((obj.transform) as string))
			scene_pos = obj.transform
			-- �ƶ�����������ԭ��
			obj.transform = (matrix3 [1,0,0] [0,1,0] [0,0,1] [0,0,0])
			ResetXForm obj
			convertToPoly obj
			-- ��������
			objname = obj.name 
			fs=findString objname "#"
			if fs == undefined then
			(-- �������û��#�ſ���ֱ�ӵ���
				-- export selected
				srcdir = "\\src\\art\\factory\\neirong01"
				outputPath = cp + srcdir 
				makedir outputPath
				filename = outputPath + "\\" + objname  + ".3ds"
				select obj
				exportfile filename #noPrompt selectedOnly:TRUE
				i += 1
				-- �ص��ڷ�λ��
				obj.transform = scene_pos
				rename objname
				clearSelection()
			)else
			(-- ���������#�ţ��ȸı�mesh���֣���������ص�λ�ã������������أ�ȡ��ѡ��
				fs= fs-1
				nobjname = substring objname 1 fs
				obj.name = nobjname
				
				-- export selected
				srcdir = "\\src\\art\\factory\\neirong01"
				outputPath = cp + srcdir 
				makedir outputPath
				filename = outputPath + "\\" + nobjname  + ".3ds"
				select obj
				exportfile filename #noPrompt selectedOnly:TRUE
				i += 1
				-- �ص��ڷ�λ��
				obj.transform = scene_pos
				rename nobjname
				clearSelection()
			)
			
		)
	)
	enableSceneRedraw() 
	message = format"��������%���壬ʵ�ʵ���%�����壡\n" allGeom.count i
-- 	messagebox"���嵼�������ϣ����Խ�����һ����"
	
)






-- basemodel_export()
	fn basem_export =
	(
		disableSceneRedraw()
		cp = checkpPath()
		if cp.count>6 do
		(
			i = 0
			allGeom = getcurrentselection()
			--ResetXForm allGeom
			--convertToPoly allGeom
			for obj in allGeom do
			(
				-- ��¼�ڷ�λ��
				
				select obj
				subobjectLevel = 0
				max modify mode
				ResetXForm obj
				convertToPoly obj
				--print ((obj.name) + ((obj.transform) as string))
				scene_pos = obj.transform
				-- �ƶ�����������ԭ��
				obj.transform = (matrix3 [1,0,0] [0,1,0] [0,0,1] [0,0,0])
				ResetXForm obj
				convertToPoly obj
				-- ��������
				objname = obj.name 
				fs=findString objname "#"
				if fs == undefined then
				(-- �������û��#�ſ���ֱ�ӵ���
					-- export selected
					srcdir = "\\src\\art\\factory\\neirong01"
					outputPath = cp + srcdir 
					makedir outputPath
					filename = outputPath + "\\" + objname  + ".3ds"
					existFile = ((getfiles filename).count != 0)
					if existFile then deletefile filename
					select obj
					exportfile filename #noPrompt selectedOnly:TRUE
					i += 1
					-- �ص��ڷ�λ��
					obj.transform = scene_pos
					rename objname
					clearSelection()
				)else
				(-- ���������#�ţ��ȸı�mesh���֣���������ص�λ�ã������������أ�ȡ��ѡ��
					fs= fs-1
					nobjname = substring objname 1 fs
					obj.name = nobjname
					
					-- export selected
					srcdir = "\\src\\art\\factory\\neirong01"
					outputPath = cp + srcdir 
					makedir outputPath
					filename = outputPath + "\\" + nobjname  + ".3ds"
					existFile = (getfiles filename).count != 0
					if existFile then deletefile filename
					select obj
					exportfile filename #noPrompt selectedOnly:TRUE
					i += 1
					-- �ص��ڷ�λ��
					obj.transform = scene_pos
					rename nobjname
					clearSelection()
				)
			)
		)
		enableSceneRedraw() 
		message = format"��������%���壬ʵ�ʵ���%�����壡\n" allGeom.count i
		
	)
--###################################  ����༭   ����  ###################################

	-----------�����ķ����������·�-----------------
	fn pivot2minz =
	(
		sel = getcurrentselection()
		if sel.count == 1 do
		(
			x = $.center.x
			y = $.center.y
			z = $.min.z
			$.pivot = [x,y,z]
			ResetXForm $
			convertToPoly $
		)

	)


	----------------------��������ģɣ��´�����ά����--------------------------------------
	fn newMulByObjID matName = 
	(-- ���������id������������ͬ�������ݵ�multimat������
		--1.�õ��������� id ����
		theObj = selection[1]
		if (classof theObj == Editable_Poly) then
		(
			id_arr = #()
			faceNum = polyop.getNumFaces theObj
			for i = 1 to faceNum do
			(
				faceId = polyop.getFaceMatID theObj i
				appendIfUnique id_arr faceId
			)
			format "%\n" id_arr
			idNum = id_arr.count

			-- 2.��������id �ƶ�multi mat,     ����������
			m = multimaterial numsubs:idNum
			theObj.material = m
			m.name = matName + "m"
			for i=1 to idNum do
			(
				m[i].name = matName + "m"+ (i as string)
			)
			meditMaterials[1] = m
		)else
		(
			messagebox "�����ת����polygon��"
		)

	)
-- 	newMulByObjID "xx"
	
	-------------------����ģ�͵�ID�����������Ķ�ά����---------------------------------
	fn renameMulByObjID matName = 
	(

		obj = selection[1]
		if (classof obj == Editable_Poly) then
		(
			if obj.mat != undefined do
			(
				if classof obj.material == Multimaterial do
				(
					obj.mat.name = matName +"m"
					num = obj.mat.numsubs
					for i = 1 to num do
					(
						obj.mat[i].name = matName + "m"+ (i as string)
					)
					max mtledit
					meditMaterials[1] = obj.mat
					redrawviews()
				)
			)
		)else
		(
			messagebox "�����ת����polygon��"
		)

	)
-- 	renameMulByObjID "xw"
-----------------------------------------------------------------------------------------------��������	

	-- rename "tr01"	
		
--###################################  �����༭  ###################################
	


	
--###################################  ���Ա༭  ###################################
 
	---------------------------------��ע����Ҫ�決��ģ�͵�fn------------------------------------------------------
	fn  noLightMap=
	(-- ��ʼ
	/* 
			<nolightMap>
				<meshobj name="cc_1#001" />
			</nolightMap>
	 */
		pathN = checkpPath() + "\\src\\art\\lights\\lightmap"
		makeDir pathN
		fileN = "\\nolightmap.xml"
		outFile = createFile (pathN + fileN )
		
		if selection.count !=0 do
		(
			format"<nolightMap>\n"  to:outFile
			for i in selection do
			(
				format"\t<meshobj name=\"%\" />\n" i.name to:outFile
			)
			format"</nolightMap>\n"  to:outFile
		)
		close outFile 
		messageBox "����Ҫ�決�������Ѿ������ϣ�"
	 )
	-----------------------------�����崴����������------------------------------------------------------
	fn buildCHname =
	( -- �ض���������������----user define  
	/* 	
		<world>
			<meshobj name="cc_02#001" cname="��ѧ¥" />
		</world>
	 */	
		pathN = checkpPath() + "\\src\\art\\position"
		makeDir pathN
		fileN = "\\build.xml"
		outFile = createFile (pathN + fileN )
		
		if selection.count ==0 then
		(
			messagebox"��ѡ����Ҫ���������Ϣ�����壡"
		)else
		(
			format "<world>\n" to:outFile
			for i in selection do
			(
				objzhn = getUserProp i "cname"
				if objzhn != undefined do
				(
					format "\t<meshobj name=\"%\" cname=\"%\" />\n" i.name objzhn  to:outFile
				)
			)
			format "</world>\n" to:outFile
		)
		close outFile 
		messageBox "��������Ϣ�������Ѿ������ϣ�"
	)
	
	
	---------------------------�����־�Խ�������ͼ����-----------------------------------------------------
	fn exporttexname =
	(
		
		if (selection.count == 0) then
		(
			message = "you need Select Some Mesh!"
			messageBox message
			return 1
		)
		for obj in selection do
		(
			texname = ""
			mat = obj.material
			submatnum = getNumSubMtls mat
			if submatnum == 0 do
			(
				 texname = texname + (mat.diffuseMap.filename) + "\n"
			)
			--add
			if(classof obj.baseobject != Editable_Mesh)then	convertToMesh obj
			arrTexMap = #()
			if submatnum > 0 do
			(
				objfaces = obj.numfaces
				bkflag = false
				matcount = 0
				for f = 1 to objfaces while bkflag == false do
				(	--�˴�����ֱ���Ȱ�������
					submatid = getFaceMatID obj f
					CurrentSubMtl = mat.materialList[submatid]
					try(
						if (CurrentSubMtl.diffuseMap) != undefined  then
						(
							tmptexname = CurrentSubMtl.diffuseMap.filename
							findindex = finditem arrTexMap tmptexname
							if(findindex == 0)then
							(
								append arrTexMap tmptexname
								matcount += 1
							)
						)
					)catch()
					if matcount == submatnum then bkflag = true
				)
			)
			for istr in arrTexMap do texname += istr + "\n"
			
			cp = checkpPath()
			srcdir = "\\plan\\��־����"
			outputPath = cp + srcdir
				
			makedir  outputPath	

			filename = outputPath +  "\\" + obj.name + ".txt"
			--deletefile filename
			outFile = createFile filename
		
			format "%\n" texname to:outFile
			close outFile
			
		)
		messagebox"��鿴��plan\��־�������ļ��У�����"
		

	 )
	 
	 
	 ------------------------------------repair uv 
	fn repUVW =
	(
		fn RepairUVW targetMesh =
		(
			sourceClass = ClassOf targetMesh.Baseobject
			ConvertToMesh targetMesh
			for  fi = 1 to GetNumFaces targetMesh.mesh do
			(
				ft = GetTVFace targetMesh.mesh fi
		 
				for ni = 1 to 3 do
				(
					tempUvw = getTVert  targetMesh.mesh  ft[ni]
					for ui = 1 to 3 do
					(
						if (not tempUvw[ui] >= 0) and (not tempUvw[ui] <= 0) do tempUvw[ui] = 1
					)
					SetTVert  targetMesh.mesh  ft[ni] tempUvw
				)
			)
			Update targetMesh
			if sourceClass == Editable_Poly do ConvertTo targetMesh Editable_Poly
			AddModifier targetMesh (Unwrap_UVW())
			converttomesh targetMesh
		)
		 
		for tempObj in Selection  as array do RepairUVW tempObj
	)

	
---####################################################################################################
---########################################   rollout����     #########################################
---####################################################################################################
	rollout version_rollout "�汾Ver1.0.3.4" width:171 height:55
	(
		label version_lbl "Copyright (C) 2012 Sanpolo Co.LTD     http://www.spolo.org" pos:[13,7] width:146 height:45
	)
---########################################   ���û���     #########################################
	rollout resetScn_tool "һ.���û���" width:171 height:300
	(
		button sceneRest_btn "1.���û��� (reset)" pos:[4,4] width:160 height:18
		progressBar doit_prog "" pos:[13,27] width:145 height:14 color:(color 255 0 0)
		label lbl_bitmap "2.��bitmap/photometric paths     ָ����ͼ·��" pos:[13,52] width:146 height:35
		label lbl_saveScene "3.������·�������棬�ش�    ������" pos:[12,85] width:154 height:28
		on sceneRest_btn pressed do
		(
			scene_reset doit_prog
		)
	)
	
---########################################   �زļ��     #########################################
	-- ����·��
	
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
	----
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
				if((curmat.diffuseMap) != undefined) then
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
					if(CurrentSubMtl != undefined) then --��ά�����п��ܳ���ĳidδ��������
					(
						if (CurrentSubMtl.diffuseMap) != undefined  then
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
	
	---########################################   ģ����ת����     #########################################
	rollout captureRollout "ģ����ת����" width:162 height:194
	(
		slider sld_distance "��                           Զ" pos:[20,20] width:122 height:44 ticks:20
		slider sld_height "��                            ��" pos:[21,76] width:124 height:44
		GroupBox grp1 "" pos:[11,5] width:138 height:129
		button btn_capture "�� ��" pos:[56,139] width:44 height:23
		button btn_close "�� ��" pos:[103,139] width:45 height:23
		button btn_reset "�� ��" pos:[10,139] width:44 height:23
		progressBar pb_capture "����:" pos:[43,169] width:104 height:16 enabled:true value:0 color:(color 255 0 0)
		label lbl_progress "����:" pos:[7,170] width:35 height:18
		local xyz=#(0,0,0),xyzmin=#(0,0,0)
		local xvalue=0,zvalue=0
		local value=0
		local myIncrement=1
		--function rotate z 
		fn RotateViewPort inputAxis inputDegrees = 
		(
		if viewport.getType() != #view_persp_user do viewport.setType #view_persp_user
		ViewPortMatrix = inverse(ViewPort.GetTM())
		RotationMatrix = (quat inputDegrees inputAxis ) as Matrix3
		ViewPortMatrix *= RotationMatrix
		ViewPort.SetTM (inverse ViewPortMatrix)
		global capturecam
		)			
		--adjust camera angle
		fn rotateangle=
		(
			--����ģ����viewport�İ뾶�Է��㰲��camera
			for i in objects do
			(
				temp =#()
				temp=i.max
				tp=#()
				tp=i.min
				for n=1 to 3 do
				(	
					if(temp[n]>xyz[n])do xyz[n]=temp[n]
					if(tp[n]<xyzmin[n]) do xyzmin[n]=tp[n]
				)
				
			)
			value=(xyz[1]+abs(xyzmin[1]))/2
			--create a targetcamera for adjust distance angle
			capturecam=Targetcamera fov:45 nearclip:1 farclip:1000 nearrange:0 farrange:1000 mpassEnabled:off mpassRenderPerPass:off pos:[value,0,value*tan(30)] isSelected:on target:(Targetobject transform:(matrix3 [1,0,0] [0,1,0] [0,0,1] [0,0,0]))
			max vpt camera
		)
		--capture img
		fn grabViewport =
		(
			try(
				if(myIncrement>4)do myIncrement=1			
				--myBitmap = gw.getViewportDib()
				gc light:true
				myBitmap = bitmap renderWidth renderHeight
				render to:myBitmap vfb:false
				myJPEG = bitmap myBitmap.width  myBitmap.height
				copy  myBitmap myJPEG 
				wtpath = checkpPath()
				JPEG.setQuality 99
				myDir = wtpath  + "\\plan\\����"		
				makedir  myDir	
				myJPEG.filename = (myDir + "\\"+"cam" + myIncrement as string + ".jpg")
				print ("saved as " + myJPEG.filename as string)
				save myJPEG
				myIncrement += 1
			)catch(messagebox"�ڴ治������ر���������Ҫ�������")
		)
		--init rollout settings
		fn init=
		(
			rotateangle()
			sld_height.range=[1,89,0]
			sld_distance.range=[1,8*value,value]
			xvalue=value
			sld_distance.value=value
			sld_height.value=30
			sld_distance.enabled=true
			sld_height.enabled=true
		)
		on captureRollout open do
		(
			init()
		)
		on captureRollout close do
		(
			try delete capturecam catch()
		)
		--adjust camera distance
		on sld_distance changed val do
		(
			d=sld_distance.value-xvalue
			if((capturecam.position.x)!=0) do
			move capturecam [d,0,d*tan(sld_height.value)]
			xvalue=sld_distance.value
			--print capturecam.pos
		)
		--adjust camera height
		on sld_height changed val do
		(
			d=sld_height.value
			zvalue=capturecam.position.z
			move capturecam[0,0,value*tan(sld_height.value)-zvalue]
		)
		--capture img
		on btn_capture pressed do
		(
			try delete capturecam catch()
			enableSceneRedraw()
			if(checkpPath()!="")then
			(
				renderWidth=3072
				renderHeight=2304
			   for nloop = 1 to 4 do
			   (
					RotateViewPort [0,0,1] 90
					completeRedraw()
					grabViewport()
					pb_capture.value=100*nloop/4
					nloop+=1
				)
				messagebox "capture success!"
			)
			else messagebox "capture failed!"
			sld_distance.enabled=false
			sld_height.enabled=false
		)
		on btn_close pressed do
		(
			destroydialog captureRollout
		)
		--reset rollout settings
		on btn_reset pressed do
		(
			try delete capturecam catch()
			init()
		)
	)
	---################################��ͼ�ߴ�淶 ##################################
	arrTexMap = #()
	arrTexArea = #()
	arrtexObj = #() --test 
	fn getArea meshobj i =
	(
		local uvX=0.0,uvY =0.0,uvWidth =0.0,uvHeight=0.0,uvFaceArea=0.0,objGeomArea=0.0
		temparea = 0.0
		meshobj.modifiers["Unwrap_UVW"].getArea #{i} &uvX &uvY &uvWidth &uvHeight &uvFaceArea &objGeomArea
		facearea=meshop.getFaceArea meshobj #{i}
		try(
			if(objGeomArea > 1.0e+010 or objGeomArea < 0)then
			(
				print meshobj.name
				facearea = 0.0
				return 0
			)	
			if(uvFaceArea>1)then
			(
				temparea =temparea + (float)facearea/uvFaceArea
			)	
			else
				temparea = facearea
			--�ӽ�camera������ͼ�߶�
			xyzpos = meshop.getFaceCenter meshobj i
			zpos = xyzpos.z
			indx = 1.0
			if(zpos > 20)then
			(
				indx = 0.01
			)
			temparea = indx*temparea
		)catch()
		return temparea	
	)
	--get all 
	fn getAllTexArea=
	(
		for iobj in geometry do
		(
			select iobj	
			if(classof iobj.baseobject != Editable_Mesh)then
				convertToMesh iobj
			if getCommandPanelTaskMode() != #modify do setCommandPanelTaskMode #modify
			AddModifier iobj (Unwrap_UVW ())	
			curmat = iobj.mat
			if(classof curmat == Standardmaterial) then
			(
				if((curmat.diffuseMap) != undefined) then
				(
					texname = curmat.diffuseMap.filename
					findindex = finditem arrTexMap texname
					if(findindex == 0) then
					(
						append arrTexMap texname
						tmparea = 0.0
						for facenum = 1 to (iobj.numfaces) do
						(
							tmp = (getArea iobj facenum)
							if(tmp< 1.0e+010 and tmp > 0)then tmparea +=tmp
						)
						append arrTexArea tmparea
						tempobj = #()
						append tempobj (iobj.name)
						append arrtexObj tempobj
					)
					else
					(
						tmparea = 0.0
						for facenum = 1 to (iobj.numfaces) do
						(
							tmp = (getArea iobj facenum)
							if(tmp< 1.0e+010 and tmp > 0)then tmparea +=tmp
						)
						
						arrTexArea[findindex] += tmparea
						--add obj test
						appendIfUnique 	arrtexObj[findindex] (iobj.name)				
					)
				)
			)
			else if((classof curmat) == multimaterial ) then
			(
				for f = 1 to iobj.numfaces do
				(	
					submatid = getFaceMatID iobj f
					CurrentSubMtl = curmat.materialList[submatid]
					try(
						if (CurrentSubMtl.diffuseMap) != undefined  then
						(
							texname = CurrentSubMtl.diffuseMap.filename
							findindex = finditem arrTexMap texname
							if(findindex == 0)then
							(
								append arrTexMap texname	
								tmparea = 0.0
								tmp = (getArea iobj f)
								if(tmp< 1.0e+010 and tmp > 0)then tmparea +=tmp
								--add area 
								append arrTexArea tmparea
								--test obj name
								tempobj = #()
								append tempobj (iobj.name)
								append arrtexObj tempobj
							)
							else
							(
								tmparea = 0.0
								tmp = (getArea iobj f)
								if(tmp< 1.0e+010 and tmp > 0)then tmparea +=tmp
								arrTexArea[findindex] += tmparea
								--add obj test
								appendIfUnique  arrtexObj[findindex] (iobj.name)	
							)
						)
					)catch()	
				)	
			) 
			DeleteModifier iobj 1
		)
	)
	--compute standard size
	fn fourmod nums =
	(
		num = 1
		while(nums>=4)do
		(
			num *=2
			nums/=4
		)
		return num
	)

	fn cmptsize imghw size =
	(
		hei = imghw[1]
		wei = imghw[2]
		texarea = hei*wei
		facearea = size
		l = 8192
		size = l*size
		tmpsize = sqrt(size)
		k = (float)hei/wei
		if(k>1)do k = (float)1/k
		str = ""
		size = k*size
		--����ͼ���С�ڼ������,��pass
		if(texarea<size)then return str
		beishu = texarea/size
		if(beishu<4)then return str
		scaleinx = fourmod beishu
		--test
		str = "����ߴ�Ϊ:"+ (tmpsize as string)+"*"+(tmpsize as string) +" facearea: "+(facearea as string)+" ,����ߴ�Ϊ:"+((hei/scaleinx) as string) +"*"+((wei/scaleinx) as string)+" "
		return str
	)

	fn gettexname tex =
	(
		texname_arr = filterstring arrTexMap[i] "\\"
		texname = texname_arr[texname_arr.count]
		return texname
		bm1 =openBitMap (arrTexMap[i])
		strsizeinfo = (bm1.height  as string) +"*" + (bm1.width as string)
		strsize = #((bm1.height) ,(bm1.width))
	)

	fn CheckTexSize=
	(
		--get all texture area array
		getAllTexArea()
		strNormalTex = ""--�淶��ͼ��Ϣstring
		nums = 0
		for i = 1 to arrTexMap.count do
		(
			--texture name
			texname_arr = filterstring arrTexMap[i] "\\"
			texname = texname_arr[texname_arr.count]
			--texture diffusemap size
			bm1 =openBitMap (arrTexMap[i])
			--texture map sizeinfo
			strsizeinfo = (bm1.height  as string) +"*" + (bm1.width as string)
			--texture height weidth
			strsize = #((bm1.height) ,(bm1.width))
			--compute 
			str1 = cmptsize strsize arrTexArea[i]
			if(str1!="")then
			(
				--test
				strobj = " ģ����:"
				for texobj in arrtexObj[i] do
					strobj = strobj + texobj+","
				--test	
				--format ("��ͼ:"+texname+ "ʵ�ʳߴ�Ϊ:"+strsizeinfo+str1+strobj+"\n") to:outFile
				strNormalTex = strNormalTex + ("\n��ͼ:"+texname+ "ʵ�ʳߴ�Ϊ:"+strsizeinfo+str1+strobj+"\n")
				nums +=1
			 )
		)
		if(nums > 0)then
		(
			cp = checkpPath()
			srcdir = "\\plan\\����"
			outputPath=cp+srcdir
			makeDir outputPath
			fileN  = "\\������ͼ�ߴ�.txt"
			filename = (outputPath + fileN )
			--outFile = createFile filename
			  --try delete existed file
			existFile = (getfiles filename).count != 0
			if existFile then 
				try(deletefile filename)catch()
			outFile = createFile filename
			
			format ("��ͼ������Ϊ:"+arrTexMap.count as string) to:outFile
			format ("\n��ͼ������ϵ:  8192 \n") to:outFile
			format ("��Ҫ�޸ĵ���ͼ����Ϊ:"+nums as string+"\n") to:outFile
			format strNormalTex to:outFile
			close outFile
		)
		else
			messagebox "��ͼ�ߴ����Ҫ��"

	)

	--########################################   �زļ��     #########################################
	rollout check_tool "��.�زļ��" width:171 height:300
	(
		button capture_btn "1.���� (capture)" pos:[4,4] width:160 height:18
		button checkmt_btn "2.���1 (check1)" pos:[4,25] width:160 height:18
		button checkTexa_btn "3.���2 (check2)" pos:[4,46] width:160 height:18
		button settpath_btn "4.������ͼ·�� (setpath)" pos:[4,67] width:160 height:18
		
		on checkmt_btn pressed do
		(
			disableSceneRedraw()
-- 			moveToo()
			--DelVrayMesh expflag delflag --del vrayfur mesh
			DelVrayMesh true true
			checkSameNobj()
			checkMeshName()
			checkmattex()
			checkSelectedModel false
			checkFaceNum() --��鵥ģ������
			ChkTexMapNums()
			ChkSceneFaceNums()
			enableSceneRedraw()
			messagebox "������,��鿴�����ļ��У�����"
		)
 		on checkTexa_btn pressed do
		(
		
			--��ͼ�ߴ��С�Ƿ���Ϲ淶
			--CheckTexSize()
			-- �Ѷ�png͸����飬��ͼ�ߴ磬��С���������жϷ�������
			pp = getProjectPath()
			if pp == false then
			(
				return 0
			)
			
			dp = pp + "\\src\\art\\scene\\diffuse"
			
			if doesDirExist(dp) == false then
			(
				messagebox ("[" + dp + "]�ļ��в�����,�����ļ����Ƿ����?")
				return 0
			)
			
			try
			(
				-- ���png͸��ͨ��
				param =  " --dir="+ dp + " "
				param += " --log=" + (pp + "\\plan\\����\\A14��������png��ͼ��͸��������Ҫ�޸�.txt") + " "
				startSppTool "check_png_alpha" param
				
				-- �����ͼ�Ƿ���Ϲ淶
				param =  " --dir=\""+ dp + "\" "
				param += " --log=\"" + (pp + "\\plan\\����\\A15������ͼ�����Ϲ淶,��Ҫ�޸�.txt") + "\" "
				startSppTool "checkTexture" param
			)catch(
				messagebox "��ȷ����ͼ�� \src\art\scene\diffuse �ļ������棡"
			)
			
		) 
		on settpath_btn pressed do
		(
			CreateDialog texpath
		)
		on capture_btn pressed do
		(
			CreateDialog captureRollout	
		)
	)
/* 	
	rollout createBuildName "�������Ľ�������" width:259 height:42
	(
		editText chname "" pos:[7,8] width:173 height:22
		button yes "ȷ��" pos:[196,7] width:53 height:25
		on yes pressed  do
		(
			setUserProp $ "cname" chname.text
		)	
	)
	
	 */
	---########################################   ����ͳ�������    #########################################
 
	rollout model_tool "��.����ͳ�������" width:171 height:300
	(
		button export_btn "1.����ͳ������� (Export)" pos:[4,4] width:160 height:18
 		on export_btn pressed do
		(
			export_x_file()
		) 
	) 
/*  		rollout model_tool "��.����ͳ�������" width:171 height:300
	(
		button export_btn "1.����ͳ������� (Export)" pos:[4,4] width:160 height:18
-- 	--label lbl_copy "2.��scene�µ���ͼ�ļ��п�      ����neirong01�У�����Ϊ       diffuse" pos:[6,35] width:150 height:43

		on export_btn pressed do
		(
			xfile_export()
		)
	)  */
	


/* 
	--------------���������崴���������ֵĶԻ���---------------------------------
	rollout createBuildName "�������Ľ�������" width:259 height:42
	(
		editText chname "" pos:[7,8] width:173 height:22
		button yes "ȷ��" pos:[196,7] width:53 height:25
		on yes pressed  do
		(
			setUserProp $ "cname" chname.text
		)	
	)
	
 */
/* 	rollout prop_tool "�������Զ���͵���" width:171 height:300
	(
		button nolight_btn "��ע����Ҫ�決������" pos:[4,4] width:160 height:18
		button c_ch_btn "����ǰ���崴�����ı�ע" pos:[4,48] width:160 height:18
		button ex_ch_btn "������������ֵ�����" pos:[4,68] width:160 height:18
		button roleP_btn "������ɫ����λ������" pos:[4,98] width:160 height:18
		
		GroupBox grp2 "�������ע����" pos:[2,28] width:167 height:64
		
		on nolight_btn pressed do
		(
			noLightMap()
		)
		on c_ch_btn pressed do
		(
			CreateDialog createBuildName
		)
		on ex_ch_btn pressed do
		(
			buildCHname()
		)
		on roleP_btn pressed do
		(
			v_arr =  #([-0.612091,0,-0.621535], [0.612091,0,-0.621535], [0,3.21875,0], [-0.612091,0,0.621535], [0.612091,0,0.621535])
			f_arr =  #([1,3,2], [4,5,3], [5,4,1], [1,2,5], [2,3,5], [3,1,4])
			mesh vertices:v_arr faces:f_arr
		)
	)
	
	 */
	 ---########################################   ����鿴��    #########################################
	rollout builder "��.����鿴��" width:171 height:101
	(
		button btn3 "1.�������� (sppbuild)" pos:[4,4] width:160 height:18
		button btn47 "2.Ԥ������ (viewscene)" pos:[12,62] width:147 height:18
		checkbox chk_MultiThreadLoading "���̼߳��� (MT)" pos:[12,40] width:146 height:18
		GroupBox grp_MultiThreadLoading  "" pos:[5,28] width:160 height:61
		on btn3 pressed do
		(
			build_scene()
		)
		on btn47 pressed do
		(
			view_scene chk_MultiThreadLoading.checked SPP_DEBUG
		)
	)
		rollout basebuilder "��.�ʸ���ͼ" width:171 height:133
	(
		button vfact_btn "1.����鿴 (ViewFact)" pos:[4,4] width:160 height:18
		on vfact_btn pressed do
		(
			messagebox"������..."
			/*if selection.count == 1 then
			(
				-- ��̬�ƹ�build
				cmd = getCmdPath()
				if cmd != "" do
				(
			-- 			DOSCommand (cmd+" & sppbuild")
					
					objName = ""
					o = selection[1].name
					fs=findString o "#"
					if fs == undefined then
					(
						objName = o
					)else
					(
						fs= fs-1
						objName = substring o 1 fs					
					)
					cp = checkpPath()
					srcdir = "\\src\\art\\factory\\neirong01"
					outputPath = cp + srcdir 
					makedir outputPath
					filename = outputPath + "\\" + objName  + ".3ds"
					existFile = ((getfiles filename).count != 0)
					if existFile then
					(
					cmdstr = "/C \"" +	cmd+" & sppbuild --viewfact=neirong01/"+objName+"\""
					ShellLaunch "cmd" cmdstr
					)else
					(
						messagebox"���ȵ������壡"
					)					
					
				)
			)else
			(
				messagebox"��ѡ��һ�����壡"
			)*/
		)
	)
	
	---#########################################  Ч�������ֿ�ʼ   #########################################
	--declare rollout
	MulMatRollout;
	effectRollout;
	showeffectRollout;
	try(DestroyDialog mesheffectRollout)catch()
	try(DestroyDialog showeffectRollout)catch()
	 

	   --------------------------add effect to mesh material ---------------
		fn processeffect =
		(
			--local mesh
			if(selection .count >0)then
				(
					mesh = selection[1]
					currentmesh = mesh
					macros.run "Tools" "Isolate_Selection"
					max zoomext sel all
					if(classof mesh.mat == Standardmaterial)then
					(
						createdialog effectRollout
					)
					else
					(
						--�л��߿�ģʽ
						--max wire smooth
						if(viewport.isWire() == true) then
						(
							max wire smooth
						)
						macros.run "Modifier Stack" "Convert_to_Poly"
						--mesh.EditablePoly.SetSelection #Face #{1}
						--subobjectLevel = 4
						createdialog MulMatRollout
					)
					
				)
				else
				(
					messagebox "����ѡ��һ��ģ��"
				)
		)	
		


	/* rollout mesheffectRollout "Ч������:" width:156 height:67
	(
		button btn_do "Ч��������" pos:[23,8] width:112 height:25
		button btn_expxml "����Ч��xml�ļ�" pos:[23,34] width:112 height:25
		

		on btn_do pressed do
		(	
			processeffect()
			)
		on btn_expxml pressed do
		(
			expxml()
			)
	) */
	rollout MulMatRollout "�����ģ�ʹ���" width:123 height:86
	(
		button btn_complete "Ч���������" pos:[13,45] width:100 height:25
		button btn_set "����Ч��" pos:[12,11] width:100 height:25
		local mymesh
		local matname
		local modeflag = 0
		local submatid
		/* fn getsubmat =
		(
			Currentmat = mymesh.mat
		   for iSubMtl = 1 to Currentmat.materialList.count do
		   (
				CurrentSubMtl = Currentmat.materialList[iSubMtl]
				iname = CurrentSubMtl.name
		   )
		) */
		
		on MulMatRollout open do
		(
			max select
			subobjectLevel = 4
			mymesh  = selection[1]
			
			)
		on MulMatRollout close do
		(
			--	try(createdialog mesheffectRollout)catch()
			if(viewport.isWire() == false) then
			(
				max wire smooth
			)
			subobjectLevel = 0
		)
		on btn_complete pressed do
		(
			subobjectLevel = 0
			if(viewport.isWire() == false) then
			(
				max wire smooth
			)
			try(DestroyDialog MulMatRollout)catch()
		)
		on btn_set pressed do
		(
			--�ж��Ƿ�ѡ����һ����
			if classof mymesh ==Editable_Poly then--�����Polygon����
			(
				mymesh.EditablePoly.selectByMaterial (mymesh.EditablePoly.getMaterialIndex true) clearCurrentSelection: false
				 try(
						modeflag = 1
						submatid = mymesh.EditablePoly.getMaterialIndex true
						--matname = mymesh.mat.materialList[subid].name
					try(DestroyDialog effectRollout)catch()
						createdialog effectRollout
				 )catch(messagebox "��ģ���治������Ч��") 
				
			)
		)
	)
	rollout effectRollout "Ч������" width:135 height:141
	(
		button btn_seteffect "����Ч��" pos:[13,60] width:111 height:20
		button btn_delete "ɾ��Ч��" pos:[12,85] width:111 height:20
		button btn_view "�鿴Ч��" pos:[13,112] width:111 height:20
		dropdownList ddl_list "Ч���б�:" pos:[14,13] width:108 height:41 --items:#("ˮ", "����", "����")
		local shaderstr =""
		local mymesh,matname
		local tflag ,mutlflag = 0;
		fn addeffect  mymeshs strname =
		(
		--submatid
			str = ""
			--realname = matname
			--fakename = replacenames  realname  " " ")"
			--effecttype = getUserProp mymesh fakename
			if(classof (mymeshs.mat) == Standardmaterial)then
				submatid="submatid0"
			else submatid = "submatid" + (MulMatRollout.submatid) as string
			instancemgr.getinstances mymeshs &instances
			for j in instances do 
			(
				setUserProp j submatid strname
			)
			if(tflag == 0)then
				str = "ģ��\"" + mymeshs.name + "\"������Ч���ɹ�"
			else if(tflag == 1)then
				str = "ģ��\"" + mymeshs.name + "\"��ɾ��Ч���ɹ�"
			messagebox str
		)
		fn vieweffect mymeshs =
		(
			--fakename = replacenames  realname  " " ")"		
			if(classof (mymeshs.mat) == Standardmaterial)then
				submatid="submatid0"
			else submatid = "submatid" + (MulMatRollout.submatid) as string
			effecttype = getUserProp mymeshs submatid
			str = ""
			if effecttype == "" or effecttype == undefined then
			 (
			  str = "û��ʹ��Ч��\n"
			 --messagebox str
			 )
			 else
			(
				ary = filterString effecttype ")"
				str = "ʹ����\"" + ary[1] + "\"Ч��\n"
			)
			messagebox str
		)

		on effectRollout open do
		(
			ddl_list.items = #("ˮ", "����", "����")
			ddl_list.selection = 0
			try(
				if(MulMatRollout.modeflag ==1)then
				(
					mymesh = MulMatRollout.mymesh
					matname = MulMatRollout.matname
					mutlflag = 1
				)
				else
				(
					mymesh = selection[1]
					matname = mymesh.mat.name
					if(viewport.isWire() == true) then
					(
						max wire smooth
					)
				)
			)catch()
			--matname = mesheffectRollout.matname
			--mymesh = 
			
		)
		on effectRollout close  do
		(
			if(mutlflag == 0)do
			(
				if(viewport.isWire() == false) then
				(
					max wire smooth
				)
			)
		)
		on btn_seteffect pressed do
		(
			i = ddl_list.selection 
			if(i==0)then
			(
				messagebox "��ѡ��һ��Ч��"
			)else
			(
				tflag = 0
				addeffect  mymesh  shaderstr
				try(DestroyDialog effectRollout)catch()
			)
			
			--try(DestroyDialog effectRollout)catch()
		)
		on btn_delete pressed do
		(
			tflag = 1
			addeffect   mymesh ""
			try(DestroyDialog effectRollout)catch()
		)
		on btn_view pressed do
		(
			vieweffect mymesh
		)
		on ddl_list selected sel do
		(
			--<dropdownlist>.selected String
			i = ddl_list.selection 
			--messagebox (i as string)
			case i of
			(
				1: (
					shaderstr = "ˮ)"
					shaderstr = shaderstr + "<shader type=\"base\">reflect_water_plane</shader>)"
					shaderstr = shaderstr + "<shader type=\"diffuse\">reflect_water_plane</shader>)"
					shaderstr = shaderstr +"<shadervar name=\"tex normal\" type=\"texture\">generic_water_001_ani</shadervar>)"
					shaderstr = shaderstr +"<shadervar name=\"tex environment\" type=\"texture\">effectsky.dds</shadervar>)"
					shaderstr = shaderstr +"<shadervar name=\"water fog color\" type=\"vector4\">0.4,0.7,0.9,1</shadervar>)"
					shaderstr = shaderstr +"<shadervar name=\"water perturb scale\" type=\"vector4\">10,10,0,0</shadervar>)"
					shaderstr = shaderstr +"<shadervar name=\"water perturb fade\" type=\"float\">0.1</shadervar>)"
					shaderstr = shaderstr +"<shadervar name=\"specular\" type=\"vector4\">0.4,0.7,0.9,1</shadervar>"
				)
				2: (
						shaderstr = "����)"
						shaderstr = shaderstr + "<shader type=\"diffuse\">reflectsphere</shader>)"
						shaderstr = shaderstr + "<shader type=\"base\">reflectsphere</shader>)"
						shaderstr = shaderstr + "<shadervar type=\"texture\" name=\"tex normal\">bolinormal.jpg</shadervar>)"
						shaderstr = shaderstr + "<shadervar type=\"texture\" name=\"tex reflection\">bolireflection.jpg</shadervar>)"
						shaderstr = shaderstr +"<shadervar type=\"float\" name=\"reflection opacity\">0.8</shadervar>)"
						shaderstr = shaderstr +"<shadervar type=\"vector4\" name=\"specular\">[1.0,1.0,1.0,1.0]</shadervar>)"
				)
				3: (
					 shaderstr = "����)"
					  shaderstr = shaderstr + "<shader type=\"diffuse\">reflectsphere</shader>)"
					  shaderstr = shaderstr +"<shader type=\"base\">reflectsphere</shader>)"
					  shaderstr = shaderstr +"<shadervar type=\"texture\" name=\"tex reflection\">effectmetal.jpg</shadervar>)"
					  shaderstr = shaderstr +"<shadervar type=\"float\" name=\"reflection opacity\">0.8</shadervar>)"
					  shaderstr = shaderstr +"<shadervar type=\"vector4\" name=\"specular\">1,1,1,1</shadervar>"	
					)
				default: shaderstr = ""
			)
		
		)
	)
	---########################################  Ч�������ֽ���   #########################################
	rollout HudRollout "Hud��������" width:132 height:75
	(
		button btn_addhud "����Hud����" pos:[13,9] width:105 height:26
		button btn_delehud "ɾ��hud" pos:[12,39] width:105 height:26
		on btn_addhud pressed do
		(
		 if(selection.count < 1)then
		 (
		  messagebox "��ѡ��һ��ģ��"
		 )
		 else
		 (
		  for iobj in selection do
		  (
		   setUserProp iobj "hudmesh" iobj.name
		  )
		  messagebox "����HUD�ɹ�"
		 )
		)
		on btn_delehud pressed do
		(
		  if(selection.count < 1)then
		  (
		   messagebox "��ѡ��һ��ģ��"
		  )
		  else
		  (
		   for iobj in selection do
		   (
			setUserProp iobj "hudmesh" ""
		   )
		   messagebox "ɾ��HUD�ɹ�"
		  )
		 
		 )
	)
	
	---########################################## С��ͼλ����Ϣ��λ #####################################################
	
	rollout MapPosRollout "С��ͼ��λ" width:156 height:326
	(
		listbox lbx1 "" pos:[14,173] width:131 height:7
		button btn_importImg "1.�����ͼͼƬ      " pos:[5,5] width:145 height:21
		button btn_addLocation "���λ��" pos:[12,143] width:64 height:24
		button btn_dellocation "ɾ��λ��" pos:[80,143] width:64 height:24
		button btn_explocation "4.����λ����Ϣ" pos:[9,293] width:139 height:24
		button btn_scale "����" pos:[57,54] width:33 height:18
		button btn_move "�ƶ�" pos:[99,55] width:30 height:18
		button btn_lock "��ͼ" pos:[18,54] width:31 height:20
		label lbl9 "X:" pos:[13,115] width:18 height:18
		local meshobjary = #()
		local meshnameary = #()
		local arraypoint = #()
		/* tool foo
		(
			on mouseMove clickno do 
			(
				try(
					$.pos = worldPoint
				)catch()
			)
		) */
		label lbl10 "Y:" pos:[84,115] width:15 height:19
		edittext edt_x "" pos:[27,115] width:40 height:17
		edittext edt_y "" pos:[98,115] width:41 height:18
		groupBox grp3 "2.���ھ�ͷ���ͼ����" pos:[5,32] width:142 height:54
		groupBox grp4 "3.����λ����Ϣ:" pos:[6,94] width:144 height:190
		on MapPosRollout open do
		(
			viewport.setLayout #layout_1
			viewport.setType #view_top
			max select all	
			max zoomext sel all
			max select none
			max panview
			try(
				--LockButtonExt_i.bmp
				iconDir = (getDir #ui) + "icons\\" 
				--moveico = iconDir + "VFB_controls_i.bmp"
				lockico = iconDir + "LockButtonExt_i.bmp"
				scaleico = iconDir + "ViewControls_16i.bmp"
				--con = openBitMap iconDir
				btn_lock.images = #(lockico, undefined, 2, 1, 1, 1, 1)
				btn_scale.images = #(scaleico, undefined, 48, 1, 1, 1, 1)
				btn_move.images = #(scaleico, undefined, 48, 15, 1, 1, 1)
			 )
			catch()
		)
		on MapPosRollout close do
		(
			if(meshobjary.count > 0) do
			(
				for i in meshobjary do
				(
					select i
					max delete $
				)
			)
			try(
			backgroundImageFileName = ""
			)catch()
		)
		on lbx1 selected sel do
		(
			select meshobjary[sel]
			--print ("["  + ($.pos .x) as string + " , " + ($.pos .y) as string +" , " + ($.pos .z) as string +"]")
		)
		/* on lbx1 doubleClicked sel do
		(
			--try(
					select meshobjary[sel]
					startTool foo
			--	)catch()
		) */
		on btn_importImg pressed do
		(
			--max zoomext sel all
			--	max modify mode
			viewport.DispBkgImage = true
			img = getOpenFileName caption:"Open A Image File:"
			--messagebox img
			try(
				enableSceneRedraw()
				backgroundImageFileName = img
				--actionMan.executeAction 0 "40321"
				setBkgImageAspect #bitmap 
				completeredraw()--
			)catch()
			actionMan.executeAction 0 "40321"  -- Views: Update Background Image
		)
		on btn_addLocation pressed do
		(
			--messagebox backgroundImageFileName
			if((lbx1.items.count)<3) then
			(
				if((edt_x.text) != "" and (edt_y.text) != "")then
				(
					p = pickPoint()
					if(p != #rightClick ) then
					(
						breakflag = true
						num = (lbx1.items.count) + 1
						temp_array = lbx1.items
						for i=1 to num while breakflag do
						(
							strname = "MapPoint" + (i as string)
							if (finditem meshnameary strname) == 0 then
							(
								breakflag = false
								mypoint = Point pos:p isSelected:on centermarker:true
								mypoint.size = 300
								mypoint.name = strname
								mypoint.box = true
								appendIfUnique temp_array ("p" + (i as string) + ": ["+edt_x.text + " , "+edt_y.text +"]")
								append meshobjary mypoint 
								append meshnameary mypoint.name
								append arraypoint (edt_x.text + ","+edt_y.text)
								edt_x.text = ""
								edt_y.text = ""
							)
						)
						lbx1.items = temp_array
						lbx1.selection = (lbx1.items.count)
					)
				)
				else
					messagebox "���������ά����x,yֵ"
			)
			else
			(
				messagebox "С��ͼ��λ����ĵ�λ����Ϣ�ѹ�\n��ɾ����ӻ�ֱ��ѡ���޸ĵ�λ����Ϣ."
			)
		)
		on btn_dellocation pressed do
		(
			if lbx1.items.count > 0 and lbx1.selection > 0 do
			(
				--select (getNodeByName lbx1.selected )
				select meshobjary[lbx1.selection]
				deleteItem meshobjary lbx1.selection
				deleteItem arraypoint lbx1.selection
				deleteItem meshnameary lbx1.selection
				max delete $
				lbx1.items = deleteItem lbx1.items lbx1.selection
			)
		)		
		on btn_explocation pressed do
		(
			cp = checkpPath()
			srcdir = "\\src\\product\\position"
			outputPath=cp+srcdir
			makeDir outputPath
			fileN  = "\\maxpos.xml"
			filename = (outputPath + fileN )
			existFile = (getfiles filename).count != 0
			if existFile then 
				try(deletefile filename)catch()
			outFile = createFile filename
			if (lbx1.items.count) == 3 then
			(
				format "<maxposition>\n" to:outFile
				--��������
				ypos = #(0,0,0)
				posinfo = #("top_left","right_bottom","roleInitialize")
				for i =1 to  3 do ypos[i] = (meshobjary[i]).pos.y
				for i =1 to  2 do 
				(
					for j = i+1 to 3 do
					(
						if(ypos[i]>ypos[j])do
						(
							tmp = ypos[i]
							ypos[i] = ypos[j]
							ypos[j] = tmp
						)
					)
				)
				/*
				<top_left>
					<point3d>
						<xpos>-271.524</xpos>
						<ypos>0.0</ypos>
						<zpos>307.241</zpos>
					</point3d>
					<point2d>
						<xpos>1</xpos>
						<ypos>1</ypos>
					</point2d>
				</top_left>
				*/
				for i =1 to 3 do
				(
					bkflag = false
					for j = 1 to 3 while bkflag == false do
					(	
						ypoint = (meshobjary[j]).pos.y
						if( ypoint == ypos[i])do
						(
							bkflag = true
							format ("\t<"+posinfo[i]+">\n") to:outFile
							format "\t\t<point3d>\n" to:outFile
							format ("\t\t\t<xpos>"+(meshobjary[i].pos.x) as string+"</xpos>\n") to:outFile
							format ("\t\t\t<ypos>"+(meshobjary[i].pos.z) as string+"</ypos>\n") to:outFile
							format ("\t\t\t<zpos>"+((meshobjary[i]).pos.y) as string+"</zpos>\n") to:outFile
							format "\t\t</point3d>\n" to:outFile
							--background 2d
							xypoint = filterString (arraypoint[i]) ","
							format "\t\t<point2d>\n" to:outFile
							format ("\t\t\t<xpos>"+ xypoint[1] as string+"</xpos>\n") to:outFile
							format ("\t\t\t<ypos>"+ xypoint[2] as string+"</ypos>\n") to:outFile
							format "\t\t</point2d>\n" to:outFile
							format ("\t</"+posinfo[i]+">\n") to:outFile
						)
					)
				)
				format "</maxposition>\n" to:outFile
				messagebox "�����ɹ�"
			)
			else
				messagebox "С��ͼ��λ��ȱ�ٱ������Ϣ,����Ӻ��ٵ���!"
		)
		on btn_scale pressed do
		(
			max tool zoom
		)
		on btn_move pressed do
		(
		   max panview
		)
		on btn_lock pressed do
		(
		actionMan.executeAction 0 "343"  -- Tools: Background Lock Toggle
		)
	)
	
	
	---##########################################  #####################################################
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
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
					cname = cname as string
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
				cname = cname as string
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
				
				--xmlString = "<world>\n\t<buildiInfo>\n" + xmlString + "\t</buildInfo>\n</world>"
				xmlString = "<world>\n\t<buildInfo>\n" + xmlString + "\t</buildInfo>\n</world>"
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
	
	
---########################################   ��ʱ��������ģ��uv    #########################################
	
	/*
	ticket:1417
	chenyang20120703 : ����
	rollout tmprepairUV "��.��ʱ��������ģ��uv" width:171 height:300
	(
		button tmprepairUV_btn "1.����uv������" pos:[4,4] width:160 height:18
		on tmprepairUV_btn pressed do
		(
			if selection.count >0 then
			(
				repUVW()
				basem_export()
			)else
			(
				messagebox"��ѡ��uv�д�������壡"
			)
		)
	)*/
	rollout fixTexture "һ.��ͼ" width:171 height:300
	(
		button fixTexture_btn "1.�ü���ͼ (Cuttexture)" pos:[4,4] width:160 height:18
		button dataEdit_btn "2.����꽨��ͼ�� (Bldg Name)" pos:[4,25] width:160 height:18
		on fixTexture_btn pressed do
		(
			param = "--dir " + getProjectPath() + "\\src\\art\\scene\\diffuse  --log " + getProjectPath() + "\\src\\art\\scene\\diffuse"
			startSppTool "autoCutImage" param
		)
		on dataEdit_btn pressed do
		(
			exporttexname()
		)
	)
	--���lodЧ���Ƿ���ӵ���������,�������Ϣ
	fn checkEffectLod =
	(
		arrErrLod = #()
		for i in geometry do
		(
			Currentmat = i.mat
			if( classof Currentmat == multimaterial ) then
			(		  
				bkflag = false
				for iSubMtl = 1 to Currentmat.materialList.count while bkflag == false do
				(
				   try(
						CurrentSubMtl = Currentmat.materialList[iSubMtl]
						subidname = "submatid" + (iSubMtl as string)				
						iname = CurrentSubMtl.name --��ǰ�Ӳ�������
						effecttype = getUserProp i subidname --�����Ƿ����Զ�������Ч��
					  
						if effecttype != "" and effecttype != undefined then
						(
							
							str = effecttype as string
							ary = filterString str ")"
							if(ary[1] == "ˮ") then
							(
								append arrErrLod i.name
								bkflag = true
							)
						)		
					)catch()
				)
			)
		)
		--print arrErrLod.count
		if(arrErrLod.count > 0)then
		(
			cp = checkpPath()
			srcdir = "\\plan\\����"
			outputPath=cp+srcdir
			makeDir outputPath
			fileN  = "\\���Զ�����󱨸�.txt"
			filename = (outputPath + fileN )
			--outFile = createFile filename
			existFile = (getfiles filename).count != 0
			if existFile then 
				try(deletefile filename)catch()
			outFile = createFile filename	
			for ilodname in arrErrLod do
				format "A16--���壺%�Ĳ���Ӧ���ǵ�һ����standard���ʣ���Ӧ�Ƕ�ά����\n" (ilodname) to:outFile
			close outFile
		)
	)
	rollout setMaterialProperty "��.���Զ���" width:171 height:300
	(
		button setMaterialProperty_btn "1.���ʶ��� (Shader)" pos:[4,4] width:160 height:18
		button setHUD_btn "2.HUD���� (HUD)" pos:[4,25] width:160 height:18
		button btn_chkeffect "3. ����Ч����� (Check)" pos:[4,46] width:160 height:18
		on setMaterialProperty_btn pressed do
		(
			processeffect()
		)
		on setHUD_btn pressed do
		(
			try(destroyDialog HudRollout)catch()
			createdialog HudRollout
		)
		on btn_chkeffect pressed do
		(
			checkEffectLod()
			messagebox "������,��鿴�����ļ���"
		)
	)
	rollout exprot_meshtex "��.���ݱ༭" width:171 height:300
	(
		button export_btn "1.��������" pos:[4,4] width:160 height:18
		button exportSequence_btn "2.�����·������ (Camera)" pos:[4,25] width:160 height:18
		button btn_mappos "3.С��ͼ��λ" pos:[7,45] width:158 height:18
		on export_btn pressed do
		(
			try(destroyDialog builder)catch()
			CreateDialog spp_sdk_position
		)
		on exportSequence_btn pressed do
		(
			export_camera_path()
		)
		on btn_mappos pressed  do
		(
			try(destroyDialog MapPosRollout)catch()
			CreateDialog MapPosRollout
		)
	)
	rollout WenAn_Tools "��.�İ��޸�" width:171 height:300
	(
		button WenAn_Tools_btn "1.�İ��޸Ĺ��� (Modify)" pos:[4,4] width:160 height:18
		on WenAn_Tools_btn pressed do
		(
			wa_toolset = newrolloutfloater "�İ��޸Ĺ���" 185 230
			addrollout  fixTexture wa_toolset
			addrollout  setMaterialProperty wa_toolset
			addrollout  exprot_meshtex wa_toolset
		)
	)
---########################################   �����־�Խ�������ͼ����    #########################################


---########################################   �������Զ���͵���    #########################################


	--bake()
---########################################   �決���ڵ���̫��λ����Ϣ������ģ��    #########################################
	--����̫��λ����Ϣ
	/* fn expSunPosXml =
	(
		cp = checkpPath()
		srcdir = "\\src\\product\\position"
		outputPath=cp+srcdir
		makeDir outputPath
		fileN  = "\\sunposition.xml"
		filename = (outputPath + fileN )
		existFile = (getfiles filename).count != 0
		if existFile then 
			try(deletefile filename)catch()
		outFile = createFile filename
		varysun = getNodeByName "VRaySun01"
		select varysun
		format "<sunpos>\n" to:outFile
		format ("\t<xpos>"+ (varysun.pos.x) as string + "</xpos>\n") to:outFile
		format ("\t<ypos>"+ (varysun.pos.z) as string + "</ypos>\n") to:outFile
		format ("\t<zpos>"+ (varysun.pos.y) as string + "</zpos>\n") to:outFile
		format "</sunpos>" to:outFile
		
	)

	rollout RLLigthPos "����̫��λ��" width:161 height:195
	(
		button btn_lockSunPos "1.ȷ��̫��λ��" pos:[7,8] width:143 height:27
		button btn_view "Ԥ��" pos:[17,155] width:127 height:28
		GroupBox grp2 "�����λ�ö��崰��" pos:[8,38] width:145 height:152
		slider sld_distance "��              Զ" pos:[16,56] width:128 height:44 enabled:true range:[0,100,10]
		slider sld_height "��              ��" pos:[16,103] width:128 height:44 enabled:true range:[0,100,10]
		local yvalue=0,zvalue=0
		local Suncapturecam
		local value=0
		--------------------------
		--get skybox radius
		fn skyradius =
		(
			local tmp = 0
			xyz =#(0, 0, 0)
			xyzmin = #(0, 0, 0)
			for i in geometry do
			(
				temp =#()
				temp=i.max
				tp=#()
				tp=i.min
				for n=1 to 3 do
				(	
					if(temp[n]>xyz[n]) do xyz[n]=temp[n]
					if(tp[n]<xyzmin[n]) do xyzmin[n]=tp[n]
				)
			)
			for i = 1 to 3 do
			(
				if(xyz[i] >tmp) do tmp =xyz[i]
				k = abs(xyzmin[i])
				if(k >tmp) do tmp = k
			)
			return tmp
		)
		--����Բ��ʵ�ʳ����еı�����ϵ bili 
		fn bili pos pviot lengths =
		(
		   --�����ֵ����,posΪСԲλ��,lengthsΪԲ�뾶
			local Linelen = pos - pviot
			local bili = (float)((float)linelen / (float)lengths)
			return (float)bili
		)
		--��vraysun��circle
		fn drawcircle =
		(
			local length = skyradius()
			--print length
			--get varysun pos,
			--circle
			ReginCircle = Circle radius:1000 pos:[10000,10000,0] isSelected:on name: "ReginCircle"
			suncircle = Circle radius:20 pos:[10000,10000,0] isSelected:on name: "suncircle"
			
			select ReginCircle
			max zoomext sel all
			select suncircle
			--
			sunarry = getNodeByName "VRaySun01" all:true
			if(sunarry.count < 1) then
				messagebox "����к決׼������"
			else
			(
				meshobj = sunarry[1]
				x = (meshobj.pos.x)
				y = (meshobj.pos.y)
				xpos = bili x 0 length
				ypos = bili y 0 length
				virx = xpos * 1000 + 10000
				viry = ypos * 1000 + 10000
				suncircle.pos = [virx, viry, 0]
			)
			max move
		)
		--�õ�vraysun�ĸ߶�
		fn cptheight x y lengths =
		(
			local sqrd = lengths*lengths - (x * x + y * y)
			local lengths = sqrt sqrd
			lengths
		)
		--�ƶ�max�����е�vraysun
		fn moveVraySun =
		(
			sunarry = getNodeByName "suncircle" all:true
			local length = skyradius()
			if(sunarry.count < 1) then
				messagebox "��׼���ú決����"
			else
			(
				suncir = sunarry[1]		
				x = suncir.pos.x
				y = suncir.pos.y
				bianjieflag = (x - 10000) * (x - 10000) + (y - 10000) * (y - 10000)
				if( (sqrt bianjieflag) >1000) then
					messagebox "�ƹ�λ�ó�����Բ�߽�,���Ƶ���Բ��"
				else
				(
					xpos = bili x 10000 1000
					ypos = bili y 10000 1000
					factxpos = length * xpos
					factypos = length * ypos
					factzpos = cptheight factypos factxpos length
					anglevalue = (float)(factzpos / length)
					if( anglevalue< (sin 10) )then
						messagebox "�ƹ�Ƕ�̫��,�����ƹ�߶�"
					else
					(
						varysun = getNodeByName "VRaySun01"
						select varysun
						varysun.pos = [factxpos, factypos, factzpos]
					)
				)
			)
		)
		--��ʼ׼����������
		on RLLigthPos open do
		(
			--����viewport����
			viewport.ResetAllViews()
			viewport.setLayout #layout_2v
			viewport.setGridVisibility #all false
			viewport.SetRenderLevel #wireFrame
			enableSceneRedraw()
			max zoomext sel all
			viewport.activeViewport = 1
			viewport.setType #view_top
			--��Բ
			drawcircle()
			--�ұ�
			viewport.activeViewport = 2
			value = skyradius()
			--���������
			Suncapturecam=Targetcamera fov:45 nearclip:1 farclip:value nearrange:0 farrange:value mpassEnabled:off mpassRenderPerPass:off pos:[0,(-1)*value,value*tan(30)] isSelected:on target:(Targetobject transform:(matrix3 [1,0,0] [0,1,0] [0,0,1] [0,0,0]))
			Suncapturecam.name = "locationcamera"
			viewport.setType #view_camera
			max vpt camera
			--
			sld_height.range=[1,89,0]
			sld_distance.range=[1,8*value,value]
			yvalue=(-1) * value
			sld_distance.value=value
			sld_height.value=30
			sld_distance.enabled=true
			sld_height.enabled=true
			local varysun = getNodeByName "suncircle" all:true
			select varysun[1]
		)
		on RLLigthPos close do
		(
			x = getNodeByName "ReginCircle" all:true
			select x
			max delete 
			y=getNodeByName "suncircle" all:true
			select y
			max delete 
			z=getNodeByName "locationcamera" all:true
			select z
			max delete 
			--����Ҫ����xml
			expSunPosXml()
		)
		on btn_lockSunPos pressed do
		(
			moveVraySun()
		)
		on btn_view pressed do
		(
			gc light:true
			viewport.activeViewport = 2
			render camera:$locationcamera outputwidth:1024 outputheight:800 vfb:on
		)
		on sld_distance changed val do
		(
			d=(-1)*sld_distance.value-yvalue
			if((Suncapturecam.position.y)!=0) do
				move Suncapturecam [0,d,(-1)*d*tan(sld_height.value)]
			yvalue=(-1)*sld_distance.value
		)
		on sld_height changed val do
		(
			d=sld_height.value
			zvalue=Suncapturecam.position.z
			move Suncapturecam[0,0,value*tan(sld_height.value)-zvalue]
		)
	) */
		
------------
	
	rollout bake_section "��. ���໷�� (Bake)" width:171 height:300
	(
		button btn_bake "2.�決����׼�� (bake)" pos:[3,22] width:160 height:18
		button btn_reset "4.��ԭ����(reset bake)" pos:[4,65] width:160 height:18
		button select_unbake "3.�ϵ���ѡ����" pos:[4,43] width:160 height:18
		button lightmap_export_btn "5.���� (export)" pos:[4,88] width:160 height:18
-- 		button build_n_view_btn "������Ԥ�� (build&view)" pos:[4,88] width:160 height:18
		button sppbuild_btn "6.�������� (sppbuild)" pos:[4,109] width:160 height:18
		checkbox chk_MultiThreadLoading "���̼߳��� (MT)" pos:[12,138] width:146 height:18
		button vscene_btn "7.Ԥ������(viewscene)" pos:[11,159] width:146 height:18
		GroupBox grp_MultiThreadLoading "" pos:[5,124] width:160 height:61
		button btn_adjSunPos "1.����/����̫��λ��" pos:[6,1] width:160 height:18

		
			
/* 		
		
		fn addUVW obj theMapChannel =
		(
			local unwrapMod = unwrap_UVW()


-- 			unwrapMod.setAlwaysEdit off
			unwrapMod.setMapChannel theMapChannel
-- 			unwrapMod.setFlattenAngle 45.0
-- 			unwrapMod.setFlattenSpacing 0.00
-- 			unwrapMod.setFlattenNormalize on
-- 			unwrapMod.setFlattenRotate on
-- 			unwrapMod.setFlattenFillHoles on
-- 			unwrapMod.setApplyToWholeObject on
-- 			unwrapMod.name = "spp_UVW"

			addmodifier obj unwrapMod

			subobjectLevel = 3

			objs = modPanel.getCurrentObject();
			uv = obj.modifiers[ #unwrap_uvw ]
			nodeFaceNum = uv.numberPolygons()
			uv.selectFacesByNode #{1..nodeFaceNum} obj



			objs.flattenMap 45.0 \
			#([1,0,0],[-1,0,0], [0,1,0],[0,-1,0], [0,0,1],[0,0,-1]) \
			0.01 true 0 true true
			
			return obj
		) */

		fn addUVW obj theMapChannel=
		(
			converttopoly obj
			max modify mode
			unwrapMod = unwrap_UVW()

			unwrapMod.setAlwaysEdit off
			unwrapMod.setMapChannel theMapChannel
			unwrapMod.setFlattenAngle 45.0
			unwrapMod.setFlattenSpacing 0.00
			unwrapMod.setFlattenNormalize on
			unwrapMod.setFlattenRotate on
			unwrapMod.setFlattenFillHoles on
			unwrapMod.setApplyToWholeObject on

			addmodifier obj unwrapMod

			modPanel.setCurrentObject obj.Unwrap_UVW
			uv = modPanel.getCurrentObject();
			if classof (uv) == Unwrap_UVW then
			(
				uv.unwrap2.setTVSubObjectMode 3
-- 				format"%----------%\n" obj uv
				nodeFaceNum = uv.unwrap6.numberPolygonsByNode obj
-- 				format"%----------%\n" obj nodeFaceNum
				uv.unwrap6.selectFacesByNode #{1..nodeFaceNum} obj
				uv.unwrap2.flattenMap 45.0 \
				#([1,0,0],[-1,0,0], [0,1,0],[0,-1,0], [0,0,1],[0,0,-1]) \
				0.01 true 0 true true
				converttopoly obj
			)else
			(
				format"%\n" obj.name
			)
		)
		
		fn createbakew =
		(
			-- �޳�����geometry��ģ��
			objs = #()
			try (
				objarry = geometry as array
				if selection.count == 0 then
				(
					messagebox "û��ѡ���κ����壡"
					return false
				)
				else
				(
						objs = for i in selection where (finditem objarry i != 0) collect i
						if objs.count == 0 then 
						(
							messagebox "������ѡ������Ϊgeometry��ģ��"
							return false
						)
						else
						(
							select objs
						)
				)

			)catch messagebox "pls select objects"
					
			--createdialog bakeNew
			--set all opacityMapEnable off
			for iobj in geometry do
			(
				mat = iobj.mat
				if((classof mat) == Standardmaterial) then			
				(
					mat.opacityMapEnable = off
				)
				else
				(
					if((classof mat) == Multimaterial) do
					(
						submatnum = getNumSubMtls mat
						for im = 1 to submatnum do
						(
							if(classof (mat[im])) == Standardmaterial do
							mat[im].opacityMapEnable = off
						)
					)
				)
			)
			
			--set all mat alpha
			for iobj in geometry do
			(
				if(iobj.mat != undefined) do
				(
					if((classof iobj.mat) == Standardmaterial) then			
					(
						if(iobj.mat.diffusemap != undefined) do
						(
							texname_arr = #()
							texname_arr = filterstring iobj.mat.diffusemap.filename "\\ ."
							if((toLower (texname_arr[texname_arr.count])) == "png") do 
							(
								iobj.mat.opacityMap = Bitmaptexture fileName:(iobj.mat.diffusemap.filename)
								iobj.mat.opacityMap.monoOutput = 1
							)
						)
					)
					else
					(
						if((classof iobj.mat) == Multimaterial) do
						(
							submatnum = getNumSubMtls iobj.mat
							for im = 1 to submatnum do
							(
								if(((classof (iobj.mat[im])) == Standardmaterial) and (iobj.mat[im].diffusemap != undefined)) do
								(
									
									
									texname_arr = #()
									texname_arr = filterstring iobj.mat[im].diffusemap.filename "\\ ."
									if((toLower (texname_arr[texname_arr.count])) == "png") do 
									(
										--messagebox "alpha"
										iobj.mat[im].opacityMap = Bitmaptexture fileName:(iobj.mat[im].diffusemap.filename)
										iobj.mat[im].opacityMap.monoOutput = 1
									)
									
								)
							)
						)
					)
				)
			)
			
			--set all diffuseMapEnable off
			for i in geometry do
			(
				if(i.mat == undefined) do
				(
					continue
				)
				if((classof i.mat) == Standardmaterial) then			
				(
					if(i.mat.diffusemap != undefined)do
					(
						i.mat.diffuseMapEnable = off
						i.mat.Diffuse = color 128 128 128
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
								i.mat[im].diffuseMapEnable = off
								i.mat[im].Diffuse = color 128 128 128
							)
						)
					)
				)
			)
			
			
			
			
			-- setheightmap
			for iobj in geometry do
			(
				
				
				--iobj = $
				mat = iobj.mat
				
				
				if((classof mat) == Standardmaterial) then			
				(
					if(mat.diffusemap != undefined)do
					(
						 texfilename = mat.diffuseMap.filename
						 texNameArr = filterString texfilename "\\."
						 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
						 
						 texN = ""
						 for itexN =1 to (texNameArr.count-3) do
						 (
							 texN += texNameArr[itexN] + "\\" 
						 )
						 
						 hmapn = texN + "heightmap\\" + "h" + texname
						 
						
						if(getFileSize  hmapn) > 0 do
						(
							mat.displacementMap = Bitmaptexture fileName:hmapn
						)
						 
					)
				)
				else
				(
					if((classof mat) == Multimaterial) do
					(
						submatnum = getNumSubMtls mat
						for im = 1 to submatnum do
						(
							if(((classof (mat[im])) == Standardmaterial) and (mat[im].diffusemap != undefined)) do
							(
								
								 texfilename = mat[im].diffuseMap.filename
								 texNameArr = filterString texfilename "\\."
								 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
								 
								 texN = ""
								 for itexN =1 to (texNameArr.count-3) do
								 (
									 texN += texNameArr[itexN] + "\\" 
								 )
								 
								 hmapn = texN + "heightmap\\" + "h" + texname
								 

								 if(getFileSize  hmapn) > 0 do
								 (
									mat[im].displacementMap = Bitmaptexture fileName:hmapn
								 )							
							)
						)
					)
				)
				
				
			)	
		
		-- setnormalmap =
			for iobj in geometry do
			(
				
				
				--iobj = $
				mat = iobj.mat
				
				
				if((classof mat) == Standardmaterial) then			
				(
					if(mat.diffusemap != undefined)do
					(
						 texfilename = mat.diffuseMap.filename
						 texNameArr = filterString texfilename "\\."
						 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
						 
						 texN = ""
						 for itexN =1 to (texNameArr.count-3) do
						 (
							 texN += texNameArr[itexN] + "\\" 
						 )
						 
						 nmapn = texN + "normalmap\\" + "n" + texname

						if(getFileSize  nmapn) > 0 do
						(
							mat.bumpMap = Normal_Bump()
							mat.bumpMap.normal_map = Bitmaptexture fileName:nmapn
						)
						 
					)
				)
				else
				(
					if((classof mat) == Multimaterial) do
					(
						submatnum = getNumSubMtls mat
						for im = 1 to submatnum do
						(
							if(((classof (mat[im])) == Standardmaterial) and (mat[im].diffusemap != undefined)) do
							(
								
								 texfilename = mat[im].diffuseMap.filename
								 texNameArr = filterString texfilename "\\."
								 texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
								 
								 texN = ""
								 for itexN =1 to (texNameArr.count-3) do
								 (
									 texN += texNameArr[itexN] + "\\" 
								 )
								 
								 nmapn = texN + "normalmap\\" + "n" + texname
								 
								 if(getFileSize  nmapn) > 0 do
								 (
									mat[im].bumpMap = Normal_Bump()
									mat[im].bumpMap.normal_map = Bitmaptexture fileName:nmapn
								 )
							
							)
						)
					)
				)
				
				
			)		
			--process sky
			

			sel = for obj in selection collect obj
			clearselection()
			icount = 0;
			for i in sel do
			(
-- 				print (i.name)
				--inamearr = filterstring (i.name) "#"
-- 				print (inamearr[1])
				if(matchPattern i.name pattern:("sky*") ignoreCase:false) do
				(
-- 					print ("process sky")
					select i
					addUVW i 3
					max hide selection
					icount += 1
				)
			)
			enablesceneredraw()
			select sel
			completeRedraw()
			if(sel.count == icount) then
			(
				messagebox "ѡ���������û�п���bake�����壬\n����ѡ��һ��������Ҫbake������"
				max unhide all
				return false
			)
				
			for i in geometry do
			(
				i.INodeBakeProperties.removeAllBakeElements() 
			)
			
			--addUVW
/* 			for obj in objs do
			(
				--messagebox (obj.name)
				macros.run "Modifier Stack" "Convert_to_Poly"
				addUVW obj 2
				macros.run "Modifier Stack" "Convert_to_Poly"
			) */
			----------------------------------------------------
			clearlistener()
			disablesceneredraw()
			sel = for obj in selection collect obj
			clearselection()
			for i in sel do
			(	
				select i
				addUVW i 2
				clearselection()
			)
			enablesceneredraw()
			select sel
			----------------------------------------------------			
			for obj in objs do
			(
				

				
				 l = (obj.max.y - obj.min.y)
				 w = (obj.max.x - obj.min.x)
				 h = (obj.max.z - obj.min.z)
				 
				sizen = (((log10 (sqrt(l^2 + w^2 + h^2)))/(log10 2)) as Integer) + 2
				
				if(sizen > 8) do
					sizen = 8
				
				if(sizen < 5) do
					sizen = 5
				
				if((obj.name[1] +obj.name[2] + obj.name[3]) == "gnd") do
				(
					print (obj.name[1] +obj.name[2] + obj.name[3])
					sizen = 10
				)

				size = 2^sizen

				
				bakelm = VRayTotalLightingMap() -- instance of the bake element class
				bakelm.outputSzX =bakelm.outputSzY = size --set the size of the baked map --specifythe full file path, name and type:
				bakelm.fileType = (obj.name+".jpg")
				
				bakelm.fileName = filenameFromPath bakelm.fileType
				bakelm.filterOn = true --enable filtering
				bakelm.enabled = true --enable baking --Preparing theobjectfor baking:
				obj.INodeBakeProperties.addBakeElement bakelm --add first element
				obj.INodeBakeProperties.bakeEnabled = true --enabling baking
				obj.INodeBakeProperties.bakeChannel = 2 --channel to bake
				obj.INodeBakeProperties.nDilations = 1 --expand the texturea bit
			)
			
			
			
			

			
			
			
			
			global defaultRenderSet=renderers.current
				
		-- 	--renderPresets.LoadAll 0 (GetDir #renderPresets  + "bake.rps")
			myRenderSet=vray()
			myRenderSet.system_frameStamp_on = false
			myRenderSet.imageSampler_type = 1
			myRenderSet.twoLevel_baseSubdivs = 1
			myRenderSet.twoLevel_fineSubdivs = 4
			myRenderSet.gi_on = true
			myRenderSet.gi_primary_type = 2
			myRenderSet.gi_secondary_type = 2
			myRenderSet.environment_gi_on = true
			myRenderSet.environment_gi_color =  [255,255,255]
			myRenderSet.environment_gi_color_multiplier = 0.8
			myRenderSet.dmc_earlyTermination_threshold  = 0.001
			myRenderSet.dmc_subdivs_mult = 10.0
			myRenderSet.system_frameStamp_on = false
			myRenderSet.options_shadows = true
				
			-- myRenderSet.mapping=on
			-- myRenderSet.shadows=on
			-- myRenderSet.autoReflect=on
			-- myRenderSet.antiAliasing=on
			-- myRenderSet.antiAliasFilter=catmull_rom()--has set in fn.bakeRender

			renderers.current=myRenderSet
			
			renderPresets.LoadAll 0 (GetDir #renderPresets  + "\bake.rps")
			
			
			max file save
			
			
			selobjname = #()
			
			
			for i in objs do
			(
				append selobjname (i.name)
			)
			
			-- use another file to bake
			tmpmaxfilename = maxFilePath + "baketmpfile.max"
			saveMaxFile(tmpmaxfilename)
			
			
			loadMaxFile (tmpmaxfilename)
			--�滻���в���Ϊvray����
			
			for iobj in objects do
			(
				
				
				--iobj = $
				mat = iobj.mat
				
				
				if((classof mat) == Standardmaterial) then			
				(
					tmpa = Bitmaptexture()
					if(mat.opacityMap != undefined)do
					(
						tmpa = mat.opacityMap
					)
					mat = VRayMtl()
					mat.texmap_diffuse_on = off
					mat.Diffuse = color 128 128 128
					mat.texmap_opacity_on = off
					if((tmpa.filename) != "") do
					(
						mat.texmap_opacity_on = on
						mat.texmap_opacity = tmpa
					)
				)
				else
				(
					if((classof mat) == Multimaterial) do
					(
						submatnum = getNumSubMtls mat
						for im = 1 to submatnum do
						(
							if(((classof (mat[im])) == Standardmaterial) and (mat[im].diffusemap != undefined)) do
							(
								
								tmpa = Bitmaptexture()
								if(mat[im].opacityMap != undefined)do
								(
									tmpa = mat[im].opacityMap
								)
								mat[im] = VRayMtl()
								mat[im].texmap_diffuse_on = off
								mat[im].Diffuse = color 128 128 128
								mat[im].texmap_opacity_on = off
								
								if((tmpa.filename) != "") do
								(
									mat[im].texmap_opacity_on = on
									mat[im].texmap_opacity = tmpa
								)
								
							
							)
						)
					)
				)
				
				iobj.mat = mat
				
			)
			
			objs = #()
			for i in objects do
			(
				fo = findItem selobjname (i.name)
				if fo > 0 do
				(
					append objs i
				)
			)
			
			
			select objs
			
			max file save
			
			macros.run "Render" "BakeDialog"

			
		)
		
		
		fn resetbake = 
		(
			
			max unhide all --�����ص��������ʾ����
			vsun = #()
			for isun in objects do
			(
				if ((classof(isun)) == vraysun )do
				(
					append vsun isun
				)
			)
			
			delete vsun
			
			
			--set all diffuseMapEnable on
			for i in geometry do
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
			
			
			for i in geometry do
			(
				i.INodeBakeProperties.removeAllBakeElements() 
			)
		)
		
		
		
		fn getlightmappath = 
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
					messagebox "�뱣������ȷ����ĿĿ¼�£�"
				)
			)else
			(
				messagebox "�뱣�泡����"
			)
			cmd = cmd + "\src\art\scene\lightmap\\"

		)
		
		
		fn select_unbakefn = 
		(
-- 			lightpath = getlightmappath()
/* 			--messagebox (lightpath)
			objs = #()
			for iobj in objects do
			(
				iobjN = iobj.name
				fidx = findString iobjN "#"
				if fidx != undefined do
				(
					iobjNN = replace iobjN fidx 1 "_"
					lightfn = lightpath + iobjNN + ".png"
					print lightfn
					if(getFileSize  lightfn) > 0 then
					(
						--messagebox (iobj.name)
						continue
					)
					else
					(
						append objs iobj
					)	
				)
			)
			select objs
			 */
			 
			clearselection()
			pp = checkpPath()
			-- get 
			wtp
			if cmd != "" do
			(
				lmp = filterString pp "\\"
				wt = "D:\\" + lmp[lmp.count-1] + "\\" + lmp[lmp.count] + "\\src\\art\\scene\\lightmap"
				makedir wt
				wtp = wt + "\\lightmap.txt"
				
				dp = "\\\\" + pp + "\\src\\art\\scene\\lightmap\\"
				try
				(
					cmdstr = "/C \"" + "spp --tools=checklightmap --input="+ dp +" --output=" + wtp
					ShellLaunch "cmd" cmdstr
				)catch()

			)
			-- readfile
			pngs = #()
			oo = openFile  wtp
			while not eof oo do 
			(
				meshObjName = readLine oo
				append pngs meshObjName
			)
			pngs
			objs =#()

			for iobj in geometry do
			(
				same = 0
				iobjN = iobj.name
				fidx = findString iobjN "#"
				if fidx != undefined do
				(
					iobjNN = replace iobjN fidx 1 "_"
					lightfn = iobjNN + ".jpg"
					same = findItem pngs lightfn
					
					if same > 0 then
					(
						
						continue
					)
					else
					(
						append objs iobj
					)	
				)
			)
			select objs
			close oo
		)

		
-- 		on build_n_view_btn pressed do
-- 		(
-- 			sppbuild()
-- 		)

		on btn_bake pressed do
		(
			createbakew()
		)
		on btn_reset pressed do
		(
			resetbake()
		)
		on select_unbake pressed do
		(
			select_unbakefn()
		)
		on lightmap_export_btn pressed do
		(
			export_x_file()
		)
		on sppbuild_btn pressed do
		(
			build_scene()
		)
		on vscene_btn pressed do
		(
			view_scene chk_MultiThreadLoading.checked SPP_DEBUG
		)
		on btn_adjSunPos pressed do
		(
			global sunObj = vraysun pos:(point3 1000 1000 1000) --create sun object
			targetObj = dummy pos:(point3 0 0 0) --then target
			sunObj.intensity_multiplier = 0.05
			sunObj.ozone = 0.035
			sunObj.shadow_subdivs = 8
			sunObj.photon_emit_radius = 5000
			sunObj.size_multiplier = 0.1
			targetObj.lookat = sunObj
		)
	)
	gj = newrolloutfloater "Superpolo Scene ToolSet" 185 670
	addrollout	version_rollout gj rolledUp:true
	addrollout  resetScn_tool gj
	addrollout  check_tool gj
	addrollout  model_tool gj
	addrollout  builder gj
	addrollout	basebuilder gj
	addrollout	WenAn_Tools gj
	addrollout  bake_section gj

-- 	addrollout  prop_tool gj
)