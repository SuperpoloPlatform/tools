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
		if p_arr.count>3 and allProjectsPath == "D:\p" then 
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
	cmd_p = ""
	cmd = ""
	if p != "" then 
	(-- 判断是否保存文件
		p_arr = filterString p "\\"
		projectPath = p_arr[1] + "\\" + p_arr[2]
		if p_arr.count>3 and projectPath == "D:\p" then 
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

--######################################## mesh's effect export to effect.xml ###########################################

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
	  outFile = createFile filename
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
								append tmpname iname
								append tmp effecttype
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
		--sppbuild
		format "</lib>" to:outFile
		close outFile 
		
		--artbuild
		--format "</lib>" to:outartFile
		--close outartFile
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
		outFile = createFile filename
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
		artdir  = "\\src\\art\\factory\\neirong01\\effect"
		arthudfilename = cp + artdir + fileN
		try(
			deletefile arthudfilename
			copyfile filename arthudfilename
		)catch()
	)
	


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
	expHudxml()
	expxml()
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