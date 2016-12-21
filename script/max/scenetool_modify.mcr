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
	-- 增加调试功能
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
 * @brief 运行SPP SDK提供的工具
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
 * @brief 得到项目的路径 
 * 比如`D:\p\duiwaijingmaodaxue`
 */
fn getProjectPath = 
(
	p = maxFilePath
	p = tolower p
	thisProjectPath = ""
	if p == "" then -- 判断是否保存文件
	(
		messagebox "请保存场景！"
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
			messagebox "请保存在正确的项目目录下！\n(Make sure this project is in [D:\\p\\] path)"
			return false
		)
	)
	return thisProjectPath
)


/**
 * @brief 得到项目的路径 
 */
fn getCmdPath = 
(

	p =maxFilePath
	p = tolower p
	cmd_p = ""
	cmd = ""
	if p != "" then 
	(-- 判断是否保存文件
		p_arr = filterString p "\\"
		projectPath = p_arr[1] + "\\" + p_arr[2]
		if p_arr.count>3 and projectPath == "d:\p" then 
		(
			cmd_p = p_arr[1] + "\\" + p_arr[2] + "\\" + p_arr[3]
			cmd = "cd /d " +cmd_p
		)else
		(
			messagebox "请保存在正确的项目目录下！\n(Make sure this project is in [D:\\p\\] path)"
		)
		
	)else
	(
		messagebox "请保存场景！"
	)
	cmd

)
--check spp-sdk是否在电脑上注册
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
			messagebox "请保存在正确的项目目录下！"
		)
	)else
	(
		messagebox "请保存场景！"
	)
	cmd

)

fn rename_materials =
(
	namepostfix = 0;
	
	--先遍历matrial名称，全部修改名称，并保存。
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

--效果effect.xml导出
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
	  temparry = #()--用来判断一个mesh是否已经被导出xml效果
	  wtskyflag = false --判断是否有水的效果,有时加sky meshobj解决黑边问题
	  for i = geometry do
		(
			index = 0
			--if(classof (i.mat) == Standardmaterial) then
			--(
			fdstr = findString (i.name) "#"
			--flag = 0
			if fdstr != undefined then
			(
					subname = substring (i.name) 1 (fdstr-1) --mesh去掉#号后的名字
					if(finditem temparry subname ==0)then
					(
						append temparry subname
						Currentmat = i.mat
						
						tmp = #()
						tmpname = #()	
						--tmpartname = #() --artbuild 使用,
						
						if( classof Currentmat == multimaterial ) then
						(		  
							
						   for iSubMtl = 1 to Currentmat.materialList.count do
						   (
							   try(
								CurrentSubMtl = Currentmat.materialList[iSubMtl]
								subidname = "submatid" + (iSubMtl as string)				
								iname = CurrentSubMtl.name --当前子材质名字
								effecttype = getUserProp i subidname --查找是否属性定义内有效果
								if effecttype != "" and effecttype != undefined then
								 (
									 --messagebox iname
									 imatname = Currentmat.name
									 imatname = imatname + "_" + iname + "Sub" +((iSubMtl - 1) as string) --sppbuild时为x文件assimp解析后材质改名
									-- messagebox imatname
									 append tmpname imatname --sppbuild, material's name
									 append tmp effecttype  --shader 内容
									-- append tmpartname iname --artbuild, material's name
								)		
								)catch()
						   )
						)else --单个材质
						(
    					   iname = Currentmat.name
							--x文件与3ds文件没差
						   subidname = "submatid0"
						   --fakename = replacenames  iname  " " ")"
						   effecttype = getUserProp i subidname
							if effecttype != "" and effecttype != undefined then
							 (
								str = effecttype as string
								ary = filterString str ")"
								if(ary[1] != "水") then
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
							   if(ary[1] == "水") then
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
	--效果effect.xml导出
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
		temparry = #()--用来判断一个mesh是否已经被导出xml效果
		for i = geometry do
		(
			index = 0
			--使用lod的模型暂时设为只能是单材质的模型
			if(classof (i.mat) == Standardmaterial) then
			(
				fdstr = findString (i.name) "#"
				--flag = 0
				if fdstr != undefined then
				(
					subname = substring (i.name) 1 (fdstr-1) --mesh去掉#号后的名字
					if(finditem temparry subname ==0)then
					(
						append temparry subname
						Currentmat = i.mat
						
						tmp = #()
						tmpname = #()	
						if( classof Currentmat == Standardmaterial) then
						(
						   iname = Currentmat.name
							--x文件与3ds文件没差
						   subidname = "submatid0"
						   --fakename = replacenames  iname  " " ")"
						   effecttype = getUserProp i subidname
							if effecttype != "" and effecttype != undefined then
							 (
								str = effecttype as string
								ary = filterString str ")"
								if ary[1] == "水" then
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
		--方便artbuild使用
		/* artdir  = "\\src\\art\\factory\\neirong01\\effect"
		arthudfilename = cp + artdir + fileN
		try(
			deletefile arthudfilename
			copyfile filename arthudfilename
		)catch() */
	)
	
---################################### meshgen 工具 ################################################
	--自定义排序方法
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
			--经验参数,设置比例
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
	--给出参数
	fn fnmeshgen=
	(
		--可调参数
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
		--得到meshgen模型名
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
	-- 动态灯光build
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



--instance本体导出功能
fn expInstancMesh =
(
	/* try(
			heatsize = 600000000-heapsize
		)catch() */
	disableSceneRedraw()
	--删除已有的3ds文件
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
		--采用#号前名字不同就导出,而不采用符合"*#1"才导出这一方法
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


----------------------------输出一个boundingbox来代替场景复杂的模型------------------------------------
fn exportTempbb = 
(
	disableSceneRedraw()
	l = LayerManager.getLayer 0
	l.current = true
	
	sceneN = 0
	emptyLayers =#()
	cp = checkpPath()    -- 检查路径
	srcdir0 = "\\src\\art\\scene"    -- 定义scene路径
	outputPath = cp + srcdir0  -- 定义最终输出路径
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
		--空层跳过
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
				b = box()  -- 创建盒子
				converttopoly b  -- 变成polygon
				b.transform = i.transform  --读取物体的transform
				b.name = i.name   -- 读取物体的名字
				append exportBox b  -- 加入到输出盒子数组
			)
			cp = checkpPath()    -- 检查路径
			srcdir = "\\src\\art\\scene"    -- 定义scene路径
			outputPath = cp + srcdir  -- 定义最终输出路径
			--exportBox数组是否为空,空不导,不空才导
			flag = exportBox.count
			if (flag>0) do
			(
			sceneN  += 1    -- scene号加1
			filename = outputPath + "\\" + "scene"+ (sceneN as string) + ".3ds"  -- 定义输出文件路径及文件名称
			select exportBox  -- 选择输出的盒子
			exportfile filename #noPrompt selectedOnly:TRUE  -- 直接输出
			delete exportBox -- 删除盒子
			)
-- 				clearSelection()	-- 清除选择
		)
	)
	for il = 1 to emptyLayers.count do ( layermanager.deleteLayerByName emptyLayers[il])
-- 		if LayerManager.isDialogOpen() ==true then (LayerManager.closeDialog();layermanager.editlayerbyname "") else(layermanager.editlayerbyname "")
-- 		messagebox"场景导出完毕！"
	enableSceneRedraw() 
)

-------------------------x文件以及材质信息导出--------------------------------------


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
 * @brief 导出3ds文件
 */
fn export_3ds =
(
	expInstancMesh()
	exportTempbb()
	messagebox"本体和场景导出完毕！！！"
)

/**
 * @brief 导出x文件
 */
fn export_x_file =
(
	xfile_export()
	messagebox"本体和场景导出完毕！！！"
)

/**
 * @brief 导出x文件
 */
fn export_camera_path =
(
	camera_path_export()
	messagebox"摄像机路径导出完毕！！！"
)

/**
 * @brief 从x或者3ds文件构建场景。
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
 * @brief 预览场景
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
 * @brief 为选择的物体的名称前面添加前缀。
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
		messagebox"命名完成！请进入下一步操作"
	)
	else
	(
		messagebox"请选择物体！"
	)
)













































-- ##################################### 公共程序 ##############################################
 	fn checkpPath = 
	(--得到项目的路径 

		p =maxFilePath
		p = tolower p
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
-- 	checkpPath()
-- ##################################### 预设程序 ##############################################
	
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
	-- 检查整体的bbox
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
		-- 解组
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

		-- 设置环境光
		ambientColor = color 255 255 255

		-- 设置渲染预设
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
		messagebox"环境重置完毕，请进入下一步操作！"
	)
	
-- ##################################### 检查模型面数 ##############################################	
	--若为vrayfur类型的模型导出x文件会崩溃故删除为方便美术与文案,改为expflag为导出报告,delflag删除mesh
	fn DelVrayMesh expflag delflag=
	(
		errText = ""
		errMesh = #()
		for i in geometry do
		(
			classofi = classof i
			if classofi == VRayFur then
			(
				tmpstr = "模型名:" + i.name + " 类型为:"+ (classofi as string) + "\n"
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
			wtpath = wtpath  + "\\plan\\问题"
			filename = wtpath +  "\\B10——场景里存在微软x文件不支持的工具对象，需要清除.txt"
			existFile = (getfiles filename).count != 0
			if existFile then try(deletefile filename)catch()
			outFile = createFile filename	
			format "场景里存在微软x文件不支持的对象有:\n\n" to:outFile
			format "%\n" errText to:outFile
			close outFile
		)
		errMesh
	)
	--检查每个模型上的面数
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
					message = "B4——模型:"+i.name+"  的面数是："+  (faceNum as string)  +"   ，超过50000个三角面，需要减面，或者拆散物体！ \n"
					mess = mess + message
					
					append delete_arr i
				)
			)catch()
		)
		if err >0 then
		(
			wtpath = cp  + "\\plan\\问题"	
			makedir  wtpath	
			filename = wtpath +  "\\有模型面数过多——需要修改.txt"
			outFile = createFile filename	
			format "%\n" mess to:outFile
			close outFile
		)else
		(
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\问题"
			filename = wtpath +  "\\有模型面数过多——需要修改.txt"
			existFile = (getfiles filename).count != 0
			if existFile then deletefile filename
		)
		enablesceneredraw()
		if delete_arr.count >0 then
		(
			messagebox"场景中有超过5w面的模型，请查看plan\问题 文件夹，以5w面为上限，detach出新模型，不要太碎！"
			
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
					message = "B3——同名为："+ i[1].name +"的物体，在场景中有"+ ((i.count+1)as string) +"个！ \n"
					mess = mess + message
				)
				join delete_arr i
			)
			delete_arr = makeUniqueArray delete_arr
			-- select and delete
-- 			select delete_arr
-- 			delete delete_arr
			-- create  error path and file
			wtpath = cp  + "\\plan\\问题"	
			makedir  wtpath	
			filename = wtpath +  "\\模型名字有重复——需要修改.txt"
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
				messagebox"场景中有模型名字有重复 请查看 plan\问题 文件夹！"
				
			)else
			(
				messagebox"场景中没有名字重复的物体，请进入下一步操作！"
				
			)
		)
	)
	
fn checkMeshName =
(
	mess = "错误列表：\n" 
	i = 0
	filename=""
	mesherr = #()
	 --遍历所有mesh
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
				message = "B5——物体：" + (iobj.name) + "的mesh名字长度超过了16个字符，需要改短,且没有定义#和序列号,请更换个名字，再执行“整体规范命名”！！\n"
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
					message = "B6——物体：" + (iobj.name) + "的mesh名字长度超过了16个字符，需要改短！\n"
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
				message = "B7——物体：" + (iobj.name) + "的mesh名字没有定义#和序列号,请更换个名字，再执行“整体规范命名”！\n"
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
		messagebox"mesh名字有问题,请查看 问题 文件夹！"
	 )else
	(
		messagebox"mesh名字没有问题，请进行下一步操作！"
	)	 
	 
-- 	 me = stringStream ""
-- 	 me = checkSameNobj()
-- 	 mess = mess + me
	 if mess.count >7 do ( i=i+1)
	 if i > 0 then
	(
		------------------------------------------------将错误信息输出到 ： 问题文件夹    如果场景没有保存在正确的路径下，就不会输出问题文件，只是提示
-- 		 messagebox mess
		try(
			
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\问题"		
			makedir  wtpath	
			filename = wtpath +  "\\mesh名字有问题——需要修改.txt"
			outFile = createFile filename
			format "%\n" mess to:outFile
			close outFile
		)catch()
		------------------------------------------------
-- 		messagebox"场景模型有错误，请查看输出plan目录下的“问题”列表！"
	)else
	(
		wtpath = checkpPath()
		wtpath = wtpath  + "\\plan\\问题"
		filename = wtpath +  "\\mesh名字有问题——需要修改.txt"
		existFile = (getfiles filename).count != 0
		if existFile then deletefile filename
	)

	return 0
	
)	
-- ##################################### 检查材质和贴图 ##############################################		
fn checkmattex = (
	mess = "错误列表：\n" 
	i = 0
	filename=""
	mesherr = #()
	 --遍历所有mesh
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
				message = "B6——物体：" + (iobj.name) + "的mesh名字长度超过了16个字符，需要改短！\n"
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
					message = "B6——物体：" + (iobj.name) + "的mesh名字长度超过了16个字符，需要改短！\n"
					mess = mess + message
					errcount = errcount + 1
				)
			)	
		 )
		 if iobj.mat != undefined then
		 (
			--获取当前mesh下的所有材质
			mat = iobj.material
			submatnum = 0
			submatnum = getNumSubMtls mat
			if submatnum == 0 do
			(-- 看有没有子材质  -- 因为不是子材质还有可能是arch,不光是standard
				  
				if (classof mat) == standard then
				(-- 必须是standard
					
					if (classof mat.diffuseMap) == Bitmaptexture  then
					(-- 类型不是Bitmaptexture就没有贴图
						
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
									 message = "A10——物体：" + (iobj.name) + "贴图名字长度大于16个字符，需要改短！\n"
									 mess = mess + message
									 errcount = errcount + 1	
								)
							)else
							(-- 查看文件是否存在
								i = i +1
								 message = stringStream ""
								 message = "A11——物体：" + (iobj.name) + "没有diffuse贴图！\n"
								 mess = mess + message
								 errcount = errcount + 1
							)
						)else
						(-- 如果filename长度小于8就没有贴图，因为最小的"c:\a.jpg"是最基础的8位
							i = i +1
							 message = stringStream ""
							 message = "A11——物体：" + (iobj.name) + "没有diffuse贴图！\n"
							 mess = mess + message
							 errcount = errcount + 1
						)
					)else
					(
						i = i +1
						message = stringStream ""
						message = "A11——物体：" + (iobj.name) + "没有diffuse贴图！\n"
						mess = mess + message
						errcount = errcount + 1
					)
				)else
				(
					i = i +1
					message = stringStream ""
					message = "A8——物体：" + (iobj.name) + "的独立材质是：" + ((classof mat)as string) + ", 应该是standard！\n"
					mess = mess + message
					errcount = errcount + 1
				)     
			)
			 --遍历当前材质下所有子材质
			 if submatnum >0 do
			 (-- 看有没有子材质  -- 因为有子材质的还有可能是shellmat的不光是multimat
				 
				if (classof mat) == Multimaterial then
				(-- 必须是multimat
					
					for im = 1 to submatnum do
					(
						if mat[im] != undefined then
						(-- 看子材质有没有材质
							
							if (classof mat[im]) == standard then
							(
								if (classof mat[im].diffuseMap) == Bitmaptexture  then
								(-- 类型不是Bitmaptexture就没有贴图
									
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
												 message = "A4——物体：" + (iobj.name) + "的ID："+ (im as string) + "贴图名字长度大于16个字符，需要改短！\n"
												 mess = mess + message
												 errcount = errcount + 1	
											)
										)else
										(-- 查看文件是否存在
											i = i +1
											 message = stringStream ""
											 message = "A12——物体：" + (iobj.name)+ "的ID："+ (im as string) + "没有diffuse贴图！\n"
											 mess = mess + message
											 errcount = errcount + 1	
										)
									)else
									(-- 如果filename长度小于8就没有贴图，因为最小的"c:\a.jpg"是最基础的8位
										i = i +1
										message = stringStream ""
										message = "A12——物体：" + (iobj.name)+ "的ID："+ (im as string) + "没有diffuse贴图！\n"
										mess = mess + message
										errcount = errcount + 1
									)
								)else
								(
									i = i +1
									message = stringStream ""
									message = "A12——物体：" + (iobj.name)+ "的ID："+ (im as string)+ "没有diffuse贴图！\n"
									mess = mess + message
									errcount = errcount + 1
								)
							)else
							(
								i = i +1
								message = stringStream ""
								message = "A5——物体：" + (iobj.name)+ "的ID："+ (im as string)+"的材质是：" + ((classof mat[im])as string) + ", 应该是standard！\n"
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
					message = "A6——物体：" + (iobj.name)+ "的多维材质是："+ ((classof mat)as string) + "， 应该是muitmaterial！\n"
					mess = mess + message
					
					errcount = errcount + 1
					
				)
			 )
			
		)else
		(
			i = i +1
			message = stringStream ""
			message = "A7——物体：" + (iobj.name)+ "没有材质！\n"
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
		------------------------------------------------将错误信息输出到 ： 问题文件夹    如果场景没有保存在正确的路径下，就不会输出问题文件，只是提示
-- 		 messagebox mess
		try(
			
			wtpath = checkpPath()
			wtpath = wtpath  + "\\plan\\问题"		
			makedir  wtpath	
			filename = wtpath +  "\\材质和贴图有问题——需要修改.txt"
			outFile = createFile filename
			format "%\n" mess to:outFile
			close outFile
		)catch()
		------------------------------------------------
-- 		messagebox"场景模型有错误，请查看输出plan目录下的“问题”列表！"
	)else
	(
		wtpath = checkpPath()
		wtpath = wtpath  + "\\plan\\问题"
		filename = wtpath +  "\\材质和贴图有问题——需要修改.txt"
		existFile = (getfiles filename).count != 0
		if existFile then deletefile filename
	)

	return 0
	
)		
--------------------------------------------------------------------------------------------
-- ##################################### 材质和贴图重命名 ##############################################	
   /* fn checkmat = (
	 i = 0;
	   
	 renmess = ""
	 --遍历所有mesh
	 for iobj in  geometry do
	 (
		 --获取当前mesh下的所有材质
		 mat = iobj.material
		 
		 if mat.name.count >= 12 do
		 (
			tmpname = ("m" + "_" + (i as string)) 
				
			renmess = renmess + mat.name + " " + tmpname + "\n"
				
			mat.name = tmpname	 
			i += 1
		 )
		 
		 submatnum = getNumSubMtls mat
		 --遍历当前mesh下所有子材质
		 if submatnum >0 do
		 (
			 for im = 1 to submatnum do
			 (
				 imat = getSubMtl mat im
				 if imat == undefined do
				(
					continue 
				)
				 --判断name长度是否大于12
				if imat.name.count >= 12 do
				(--将所有名字为imat.name的material都改名
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

			filename = wtpath +  "\\材质重命名.txt"
			outFile = createFile filename
		
			format "%\n" renmess to:outFile
			close outFile
		)catch() */
 --)
-- checkmat()

  /* fn checktexture = (
	 i = 0;
	 renmess = ""
	 --遍历所有mesh
	 for iobj in  geometry do
	 (
		 --获取当前mesh下的所有材质
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
		 --遍历当前mesh下所有材质
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

			filename = wtpath +  "\\贴图重命名.txt"
			outFile = createFile filename
		
			format "%\n" renmess to:outFile
			close outFile
		)catch() */
--  )
 
--  checktexture()
 -- #####################################贴图重命名#############################################
 fn renametexture namestr= (
	try(
	   heatsize = 600000000-heapsize
	)catch()
	 i = 0;
	 renmess = ""
	 --遍历所有mesh
	 for iobj in  geometry do
	 (
		 --获取当前mesh下的所有材质
		 mat = iobj.material
		 submatnum = getNumSubMtls mat
		 --如果为父材质
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
				--如果已经命过名跳过
			flag=matchPattern texfilename pattern: (texN + namestr+"*") ignoreCase:false 
			if(flag==true)do
			(
-- 				print "pass"
				continue
			)
			--遍历其他的gemo
			for iobjt in  geometry do
			(
				tmat = iobjt.material
				tsubmatnumber = getNumSubMtls tmat
				--在父材质上
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
				--在子材质上
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
		 --遍历当前mesh下所有材质
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


 -- ##################################### 修改模型  ##############################################
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
	
	-- 保存全部selection,我们后续需要选中物体并执行删趁娌僮鳌?
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
		
		-- 如果mesh是错误类型
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
			longmessage1 = longmessage1 + "物体：" + obj.name + " 没有定义材质属性\n"
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
				--longmessage1 = longmessage1 + "物体：" + obj.name + " 没有定义材质属性\n"
				--nomatc = nomatc + 1
			)
			else (
				if ((classOf obj.mat)==Standardmaterial) then
				(
					if (obj.mat==undefined) then
					(
						longmessage1 = longmessage1 + "B2——物体： " +obj.name+ " 没定义材质在 face " + (i as String) +"\n"
						nomatc = nomatc + 1
						continue
					)
				) else (
					if (obj.mat[matID]==undefined) then
					(
						longmessage1 = longmessage1 + "B2——物体： " +obj.name+ " 没定义材质在 face " + (i as String) +"\n"
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
				longmessage = longmessage + "B1——模型：" +obj.name + " 的" +(face as String)+"面是个坏面！, 其定点坐标为: " + "[" + v1x + "," + v1y + "," + v1z + "]"+ "[" + v2x + "," + v2y + "," + v2z + "]"+ "[" + v3x + "," + v3y + "," + v3z + "]"+ "\n"
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
			longmessage = longmessage + "有很多未合并的uv顶点在这个物体上: "+obj.name
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
		(message = "所有坏面被找到: " + cs)
	
	message = message + "\n" + (longmessage1 as String) + (longmessage as String)
	
	
	
	if (mesherr.count) > 0 then
	(
		try(
		
				wtpath = checkpPath()
				wtpath = wtpath  + "\\plan\\问题"	
				makedir  wtpath	
				filename = wtpath +  "\\模型有问题——需要修改.txt"
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
		wtpath = wtpath  + "\\plan\\问题"
		filename = wtpath +  "\\模型有问题——需要修改.txt"
		existFile = (getfiles filename).count != 0
		if existFile then deletefile filename
	)
	
	--messagebox ((mesherr.count) as string)
	enablesceneredraw()
	
	
	messagebox"场景模型检查完毕，请查看 plan\问题  文件夹！"
)	
 fn checkSelectedModel_selection deleteFaces = 
(
	try(
		heatsize = 600000000-heapsize
	)catch()

	-- 需要场景整体回原点，
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
	
	-- 保存全部selection,我们后续需要选中物体并执行删趁娌僮鳌?
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
			
			-- 如果mesh是错误类型
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
				longmessage1 = longmessage1 + "物体：" + obj.name + " 没有定义材质属性\n"
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
					--longmessage1 = longmessage1 + "物体：" + obj.name + " 没有定义材质属性\n"
					--nomatc = nomatc + 1
				)
				else (
					if ((classOf obj.mat)==Standardmaterial) then
					(
						if (obj.mat==undefined) then
						(
							longmessage1 = longmessage1 + "B2——物体： " +obj.name+ " 没定义材质在 face " + (i as String) +"\n"
							nomatc = nomatc + 1
							continue
						)
					) else (
						if (obj.mat[matID]==undefined) then
						(
							longmessage1 = longmessage1 + "B2——物体： " +obj.name+ " 没定义材质在 face " + (i as String) +"\n"
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
					longmessage = longmessage + "B1——模型：" +obj.name + " 的" +(face as String)+"面是个坏面！, 其定点坐标为: " + "[" + v1x + "," + v1y + "," + v1z + "]"+ "[" + v2x + "," + v2y + "," + v2z + "]"+ "[" + v3x + "," + v3y + "," + v3z + "]"+ "\n"
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
				longmessage = longmessage + "有很多未合并的uv顶点在这个物体上: "+obj.name
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
			(message = "所有坏面被找到: " + cs)
		
		message = message + "\n" + (longmessage1 as String) + (longmessage as String)
		
		
		
		if (mesherr.count) > 0 then
		(
			try(
			
					wtpath = checkpPath()
					wtpath = wtpath  + "\\plan\\问题"	
					makedir  wtpath	
					filename = wtpath +  "\\模型有问题——需要修改.txt"
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
			wtpath = wtpath  + "\\plan\\问题"
			filename = wtpath +  "\\模型有问题——需要修改.txt"
			existFile = (getfiles filename).count != 0
			if existFile then deletefile filename
		)
		
		--messagebox ((mesherr.count) as string)
		
		
		
		messagebox"场景模型检查完毕，请查看 plan\问题  文件夹！"
	)else
		(
			messagebox"请选择物体！"
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
			message = "请选择一个物体!"
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
		
		-- 保存全部selection,我们后续需要选中物体并执行删趁娌僮鳌?
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
			
			-- 如果mesh是错误类型
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
					longmessage1 = longmessage1 + "A7——物体：" + obj.name + " 没有材质\n"
				else (
					if ((classOf obj.mat)==Standardmaterial) then
					(
						if (obj.mat==undefined) then
						(
							longmessage1 = longmessage1 + "A7——物体： " +obj.name+ " 没有材质\n"
							continue
						)
					) else (
						if (obj.mat[matID]==undefined) then
						(
							longmessage1 = longmessage1 + "B2——物体： " +obj.name+ " 没定义材质在 face " + (i as String) +"\n"
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
				longmessage = longmessage + "有很多未合并的uv顶点在这个物体上: "+obj.name
			  ) else (
				longmessage = longmessage + ", " +obj.name
			  )
			)*/
		)
-- format "%\n" badface_arr
		if tot == 1 do
		(
			if (badface_arr.count>0)do
			(-- 选择face
-- 				converttopoly obj
				max modify mode
				subObjectLevel = 3 
				setFaceSelection $ badface_arr
				badSel = getfaceselection $
-- 				format "%\n" badSel
			)
			if (faceID_arr.count >0)do
			(-- 选择face
-- 				converttopoly obj
				max modify mode
				subObjectLevel = 3 
				setFaceSelection $ faceID_arr
				idSel = getfaceselection $
-- 				format "%\n" idSel
			)
				
			if badface_arr.count == 0 and faceID_arr.count == 0  then
			(
				messagebox"此物体正常！"
				setFaceSelection $ #{}
			)
			else if badface_arr.count > 0 then
			(messagebox"此物体还有坏面，请处理！")
			else if faceID_arr.count > 0 then
			(messagebox"此物体有些面没有定义材质，请处理！")
			
		)

		
-- 		format "Total bad polygons: % " count;

		cs = count as String
		if (deleteFaces) then
			message = "Total bad polygons found and deleted: " + cs
		else
			message = "所有坏面被找到: " + cs
		
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
						messagebox"物体uv有错误，请查看uv并修改！"
						exit	
					)
					i+=1
				)
			)else (messagebox"此物体没有UV！")
			if err == 0 do messagebox"此物体uv没有错误！"
		)else messagebox"请选择一个物体！"
	)
-- 	checkVertUVInfo()
---####################################################################################################
---########################################   rollout界面     #########################################
---####################################################################################################
	
---########################################   rollout内容    #########################################		
	rollout selbyname "根据名字选择" width:163 height:163
	(
		button selectObj_btn "选择物体" pos:[16,73] width:135 height:25
		edittext thename_edit "" pos:[12,39] width:140 height:26
		label n_lbl "在下面键入物体名称" pos:[13,11] width:137 height:27
		label lbl11 "用户也可以关掉这个对话框,直接在场景中选择物体" pos:[17,106] width:132 height:46
			
		on selectObj_btn pressed do
		(
			try
			(
			theobj = getnodebyname thename_edit.text
			select theobj
			selnameflag = true	
			--max zoomext sel all
			)catch(messagebox"场景中没有叫这个名字的物体!")
		)
	)
--------------------------------   选择合并相同材质的物体   -----------------------------------------
	
  rollout attachMeshes "合并相同材质的物体" width:162 height:90
  (
  	label lbl1 "还有重复材质模型:" pos:[10,12] width:125 height:21
  	button btn_ok "合并处理" pos:[8,60] width:146 height:20
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
			lbl_disp.Text = "没有再需要合并的模型了！"
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
	rollout checkfaceNumRollout "检查模型面数面板" width:162 height:250
	(
		button checkN_btn "1.检查模型面数" pos:[11,11] width:134 height:28
		label lbl16 "2.如果有错误报告，选择报告里面的物体并detach，如果没有报告，请直接点击关闭！" pos:[13,49] width:134 height:60
		button sel_mesh_btn "3.选择物体" pos:[15,107] width:132 height:25
		button detach_btn "5.detach" pos:[17,175] width:127 height:28
		label lbl17 "4.转成Editablepoly，以6w面为上限，选择element" pos:[14,140] width:128 height:29
		button closeop "关闭" pos:[22,216] width:120 height:23
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
		--先去掉场景中带#号的mesh名的#号后的名字内容
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
		--加上#号重命名
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
		--若加上#号后还有模型重名,在其名前加上一个字母
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
					--这种情况出现的可能性较小
					if ia==26 do 
					(
						str = "模型"+iname+"重名,没有重命名成功!"
						print str
						errnum +=1
					)
				)
			)	
		)
		if (geometry.count != 0 and errnum == 0) then 
			messagebox "模型名字重命名成功!"
		else
		(
			--str = "场景中没有模型或有"+(errnum as string)+"个模型重名,请手动进行修改!"
			str = "A13——场景中模型重名太多,还有"+(errnum as string)+"个模型须重名,请手动进行修改!"
			messagebox str
		)
	)
	
	
	rollout renameGRollout "给地面重命名" width:162 height:71
	(
		label sel_g_lbl "1.请选择所有地面，不要单选" pos:[12,10] width:140 height:29
		button rename_g_btn "2.点击开始重命名" pos:[12,41] width:140 height:26 toolTip:""
		on rename_g_btn pressed do
		(
			sel = getcurrentselection()
			if sel.count > 0 then
			(
				for i=1 to sel.count do
				(
					sel[i].name = "gnd" + (i as string)
				)
				messagebox"给地面命名完成！请进入下一步操作"
			)else(messagebox"请选择地面物体！")
		)
	)
	rollout renameWRollout "给水面重命名" width:162 height:71
	(
		label sel_w_lbl "1.请选择所有水面，不要单选" pos:[12,10] width:140 height:29
		button rename_w_btn "2.点击开始重命名" pos:[12,41] width:140 height:26 toolTip:""
		on rename_w_btn pressed do
		(
			sel = getcurrentselection()
			if sel.count > 0 then
			(
				for i=1 to sel.count do
				(
					sel[i].name = "wtr" + (i as string)
				)
				messagebox"给地面命名完成！请进入下一步操作"
			)else(messagebox"请选择水面物体！")
		)
	)
	rollout texpath "texpath" width:404 height:94
	(
		edittext edt1 "贴图路径：" pos:[4,58] width:322 height:21
		button btn_chan "处理" pos:[338,55] width:52 height:28
		label texPath_lbl "将scene文件夹下的贴图文件夹路径拷贝到下面！如：D:\p\daxue\src\art\scene\diffuse " pos:[9,11] width:325 height:32
		
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
			messagebox"贴图路径设置完毕,可以进行下一步！"
		)
	)
	
	

	rollout errorMeshto "错误模型处理" width:162 height:302
	(
		label gj_lbl "1.根据plan\问题 中的列表找到错误mesh名称,填到下面的框中，点击选择" pos:[8,7] width:146 height:42
		button selectbyname_btn "选择(sel)" pos:[91,51] width:68 height:23
		button checkone_btn "2.查看坏面(checkone)" pos:[4,78] width:153 height:30
		label lbl_bitmap "3.如果能看到选择的面，就手动处理，如果看不到就执行第5步，删除坏面！如果提示此物体正常，就检查下一个错误模型！" pos:[9,113] width:146 height:70
		button deleteface_btn "4.删除坏面(delbadPoly)" pos:[3,192] width:155 height:29
		button closethis_btn "6.关闭窗口" pos:[7,262] width:148 height:29
		button btn_doModify "5.确定修改(doModify)" pos:[4,227] width:150 height:29 enabled:false
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
				messagebox"场景中没有叫这个名字的物体!"
				)
			if errflag == false do
			(
				--最大化viewport与所选物
				act=#()
				act=getViewSize()
				max tool maximize
				base=#()
				base=getViewSize()
				if(act[1]>=base[1])do (max tool maximize)
				--
				--找到所有与些模型有关的Instance模型并记录下来
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
				messagebox "已准备好,请操作:"
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
			)catch( messagebox "操作失败,请重新操作")
			btn_doModify.enabled = false
		)
	)
	
	
	rollout uv_tool "uv检查" width:171 height:53
	(
		button selmesh_btn "1.选择物体(selectbyName)" pos:[4,4] width:160 height:18
		button uvCheck_btn "2.单选模型检查(checkUV)" pos:[4,25] width:160 height:18
		on selmesh_btn pressed do
		(
			createdialog selbyname
		)
		on uvCheck_btn pressed do
		(
			checkVertUVInfo()
		)
	)
	--检查贴图数是否超过660
	fn ChkTexMapNums=
	(
		cp = checkpPath()
		outputPath=cp+"\\plan\\问题"
		makeDir outputPath
		fileN  = "\\场景有效贴图总数过多，需要减少贴图数量.txt"
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
					if(CurrentSubMtl != undefined) and (classof CurrentSubMtl)  == Standardmaterial then --多维材质有可能出现某id未定义的情况
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
			format ("B9——场景贴图总数量超过900张，需要减少贴图数量！\n") to:outFile
			close outFile
		)
	)
	--检查场景中面数是否超过33万
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
		srcdir = "\\plan\\问题"
		outputPath=cp+srcdir
		makeDir outputPath
		fileN  = "\\场景模型面数提示.txt"
		filename = (outputPath + fileN )
		--outFile = createFile filename
		existFile = (getfiles filename).count != 0
		if existFile then 
			try(deletefile filename)catch()
		outFile = createFile filename
		format "面数信息： \n" (jznum as string) to:outFile		
		format " 1）建筑的总面数为：% \n" (jznum as string) to:outFile
		format " 2）小品总面数为：%\n" (Xpnum as string) to:outFile
		format " 3）地形总面数为：% \n" (terriannum as string) to:outFile
		if(jznum >330000) then
		(
			format "错误报告：\n" to:outFile
			format " B8--建筑模型总面数已超过33万三角面，需要做减面处理\n" to:outFile
		)
		close outFile
	)
	
	
	
	
---########################################   rollout框架    #########################################
	rollout version_rollout "版本Ver1.0.5.3" width:171 height:55
	(
		label version_lbl "Copyright (C) 2012 Sanpolo Co.LTD     http://www.spolo.org" pos:[13,7] width:146 height:45
	)
		rollout resetScn_tool "一.重置环境" width:171 height:300
		(
			button sceneRest_btn "1.重置环境(reset)" pos:[4,58] width:160 height:18
			progressBar doit_prog "" pos:[13,81] width:145 height:14 color:(color 255 0 0)
			label lbl_bitmap "2.用bitmap/photometric paths     指认贴图路径" pos:[13,106] width:146 height:35
			label lbl_saveScene "3.设置完路径，保存，重打开    场景！" pos:[12,139] width:154 height:28
			label quebao_lbl "保证项目路径正确：         D:\p\(项目名称)\src\art\scene\max\\" pos:[7,6] width:157 height:48
			on sceneRest_btn pressed do
			(
				scene_reset doit_prog
			)
		)
			
		
	rollout attach_tool "二.模型处理(1)" width:171 height:300
	(
-- 		button attach_btn "1.合并同材质物体(attachMesh)" pos:[4,4] width:160 height:18
		button checkSameMesh_btn "1.检查同名Mesh(sameNMesh)" pos:[4,5] width:160 height:18
		button faceNum_btn "2.检查模型面数(faceNum)" pos:[4,27] width:160 height:18
-- 		progressBar renameMesh_bar "" pos:[13,124] width:145 height:14 color:(color 255 0 0)
		--button setgroundN_btn "4.地面命名(renameground)" pos:[3,112] width:160 height:18
		label dandu_lbl "3.保证每个建筑都是单独模型，如果不是，请手动拆开！" pos:[7,48] width:156 height:32
		label lbl7 "4.单个物体超过300三角面并需要复用的物体，请使用instance的方式复制" pos:[7,87] width:151 height:46
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
-- 			messagebox"mesh重命名完毕，请进入下一步操作！"
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
			messagebox "检查完毕,请查看问题文件夹！！！"
		)
	)
	rollout checkmt_tool "三.材质和贴图" width:171 height:300
	(
		button checkmt_btn "1.材质贴图检查(checkMatTex)" pos:[4,4] width:160 height:18
		button settpath_btn "2.设置贴图路径(setPath)" pos:[4,25] width:160 height:18
--  		button renameMatTex_btn "3.材质贴图重命名(rename)" pos:[4,46] width:160 height:18
		on checkmt_btn pressed do
		(
			checkmattex()
			messagebox "检查完毕,请查看问题文件夹！！！"
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
-- 			--messagebox "材质名称超过12字符，以及贴图命名超过8字符已经被重新命名！！！"
-- 			viewport.SetRenderLevel #wireFrame
-- 			 mystr="z"
-- 			 arry=getLocalTime()
-- 			 for i =4 to 8 do
-- 				 mystr=mystr+(arry[i] as string)
-- 			-- print mystr
-- 			messagebox ("开始运行,请选择确定,运行时请勿触碰max，出现对话框才可以结束操作!")
-- 			--mystr ="z"+(timestamp() as string)+(timestamp() as string)
-- 			renametexture mystr
-- 			renametexture "tex_"
-- 			messagebox "贴图重命名成功!"
-- 		) 
		
	)
	rollout mesh_tool "四.模型处理(2)" width:175 height:300
	(
		button checkMesh_btn "1.场景模型检查(checkMesh)" pos:[4,32] width:160 height:18
		button errorMesh_btn "4.错误处理(errorMesh)" pos:[4,111] width:160 height:18
		button checkUV_btn "5.错误UV检查(checkUV)" pos:[4,132] width:160 height:18
		label lbl3 "3.如果有同名物体的错误，请从场景找出，改成新名即可！" pos:[7,74] width:156 height:33
		radiobuttons checkMode_rdo "" pos:[5,8] width:136 height:16 labels:#("自动查", "选择查") default:1 columns:2
		button btn_clnVraymsh "2.清除不支持的工具对象" pos:[6,53] width:160 height:18
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
			messagebox "不支持的对象已清除完成"
			
		)
	)

	/**
	 * @brief 五.规范命名 -> 给天空球重命名
	 */
	rollout rlt_renameSky "给天空球重命名" width:162 height:71
	(
		label sel_g_lbl "1.请选择所有天空球，不要单选" pos:[12,10] width:140 height:29
		button rename_g_btn "2.点击开始重命名" pos:[12,41] width:140 height:26 toolTip:""
		on rename_g_btn pressed do
		(
			renameSelection "sky"
		)
	)
	/**
	 * @brief 五.规范命名 -> 给植物重命名
	 */
	rollout rlt_renamePlant "给植物重命名" width:162 height:71
	(
		label sel_g_lbl "1.请选择所有植物，不要单选" pos:[12,10] width:140 height:29
		button rename_g_btn "2.点击开始重命名" pos:[12,41] width:140 height:26 toolTip:""
		on rename_g_btn pressed do
		(
			renameSelection "plant"
		)
	)
	--******************本体重命名***************
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
		arrChange = #() --记录模型是事遍历过
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
			--以上代码防止模型名字重复,
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
	rollout meshrename_tool "五.规范命名" width:180 height:106
	(
		button btn_renameground "1.地面命名(renameground)" pos:[4,4] width:160 height:18
		button btn_renameSky "2.天空命名(renameSky)" pos:[4, 25] width:160 height:18
		button btn_renamePlant "3.植物命名(renamePlant)" pos:[4, 46] width:160 height:18
		--@ticket:1545 liuyingtao提出不再需要改功能
		--@fixme 不仅仅注释掉按钮就好了，还需要把相应函数删除。
		--button btn_renamewater "2.水面命名(renamewater)" pos:[4,25] width:160 height:18
		button btn_renameModel "4.整体规范命名(renameModel)" pos:[4, 67] width:160 height:18
		button btn_checkMeshName "5.检查mesh命名(checkMeshN)" pos:[4, 88] width:160 height:18
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
			renameontology()	--本体与实例重命名
			messagebox "整体规范命名成功!"
			--renamemesh()		--按instance命名的以后不用,先注释掉
		)
		on btn_checkMeshName pressed do
		(
			checkMeshName()
		)
	)
	
	rollout spp_view "六.引擎预览" width:180 height:191
	(
		button btn_export_x "1.导出x文件(export X)" pos:[4,4] width:160 height:18
		button btn_sppbuild "2.场景构建(sppbuild)" pos:[4,25] width:160 height:18
		button btn_viewscene "3.预览(viewscene)" pos:[4,68] width:160 height:18
		checkbox chk_MultiThreadLoading "多线程加载 (MT)" pos:[12,49] width:146 height:18
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
	
	rollout MEdgeRollout "黑边处理工具" width:150 height:98
	(
		button btn_deal "处理黑边" pos:[8,68] width:137 height:23
		GroupBox grp1 "处理方式:" pos:[3,7] width:144 height:57
		radiobuttons rdb_kinds "" pos:[9,29] width:121 height:40 enabled:true labels:#("按选择模型  ", "按全部(geometry)处理")
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
				if(selection.count < 1)then messagebox "没有选择模型"
				else	arrMesh = selection as array	
			)
			else
			(
				if(geometry.count < 1)then messagebox "场景中没有模型"
				arrMesh = geometry as array
			)
			if( arrMesh.count > 0) then
			(
				for i in arrMesh do 
				(
					--print i.name
					addedges i
				)
				messagebox "处理完成"
			)
		)
		on rdb_kinds changed stat do
		(
			updateButton()
		)
	)

	rollout MovieLRollout "七.影视工具" width:180 height:191
	(
		button btn_medges "1.黑边处理" pos:[5,5] width:163 height:20
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