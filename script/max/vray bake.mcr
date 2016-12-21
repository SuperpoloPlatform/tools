






macroScript SPP_VRAYBAKE
category:"Superpolo"
ButtonText:"Scene Vray Bake"
tooltip:"Spp Scene Vray Bake" Icon:#("Maxscript",2)
(
--将选中的geometry对象放入tempArray中
fn selectObjs =
(
local tempArray=#()
try (
if selection[1]==undefined then messagebox "pls select objects"
else
(
if selection[2]==undefined then
(
if (superclassof selection[1])!=geometryclass then messagebox "not geometry"
else tempArray[1]=selection[1]
)
else tempArray=for i in selection where (superclassof i)==geometryclass collect i
)

)catch messagebox "pls select objects"

return tempArray
)







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



fn matalpha objs = 
(
	for iobj in objs do
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





fn addMaterial obj MapPath:"" =
(
local tempMat=standardMaterial()
local theMap=bitMapTexture fileName:MapPath filtering:1

tempMat.name="m" + obj.name
tempMat.diffuseMap=theMap
--tempMat.selfillumMap=theMap
tempMat.selfIllumAmount=100.0
tempMat.showInViewPort=on

obj.material=tempMat
obj.material.showInViewPort=on
return tempMat
)
-------------------------------------------------
fn addUVW obj theMapChannel:2=
(
local unwrapMod = unwrap_UVW()

unwrapMod.setAlwaysEdit off
unwrapMod.setMapChannel theMapChannel
unwrapMod.setFlattenAngle 45.0
unwrapMod.setFlattenSpacing 0.00
unwrapMod.setFlattenNormalize on
unwrapMod.setFlattenRotate on
unwrapMod.setFlattenFillHoles on
unwrapMod.setApplyToWholeObject on
unwrapMod.name = "spp_UVW"

addmodifier obj unwrapMod
unwrapMod.flattenMap 45.0 \
#([1,0,0],[-1,0,0], [0,1,0],[0,-1,0], [0,0,1],[0,0,-1]) \
0.03 true 0 true true
return obj
)


-- fn completeMapElement theFileType:".tga" cmSize:512 =
-- (
-- bakeC=completeMap()
-- bakeC.enabled=on
-- bakeC.outputSzX=bakeC.outputSzY=cmSize--element size . && mapSize of bakeRender
-- bakeC.fileType= theFileType
-- bakeC.shadowsOn=on
-- return bakeC
-- )
-- fn lightingMapElement theFileType:".tga" cmSize:512 =
-- (
-- bakeC=lightingMap()
-- bakeC.enabled=on
-- bakeC.outputSzX=bakeC.outputSzY=cmSize--element size . && mapSize of bakeRender
-- bakeC.fileType= theFileType
-- bakeC.shadowsOn=on
-- return bakeC
-- )
-- fn diffuseMapElement theFileType:".tga" cmSize:512 =
-- (
-- bakeC=diffuseMap()
-- bakeC.enabled=on
-- bakeC.outputSzX=bakeC.outputSzY=cmSize--element size . && mapSize of bakeRender
-- bakeC.fileType= theFileType
-- bakeC.shadowsOn=on
-- return bakeC
-- )


--准备各种贴图
fn completeMapElement theFileType:".tga" width:512  height:512 =
(
bakeC=VRayCompleteMap()
bakeC.enabled=on
bakeC.outputSzX=width
bakeC.outputSzY=height--element size . && mapSize of bakeRender
bakeC.fileType= theFileType
-- bakeC.shadowsOn=on
return bakeC
)
fn lightingMapElement theFileType:".tga" width:512  height:512 =
(
bakeC=VRayLightingMap()
bakeC.enabled=on
bakeC.color_mapping = off
bakeC.outputSzX=width
bakeC.outputSzY=height--element size . && mapSize of bakeRender
bakeC.fileType= theFileType
bakeC.color_mapping = false
-- bakeC.shadowsOn=on
return bakeC
)
fn diffuseMapElement theFileType:".tga" width:512  height:512 =
(
bakeC=VRayDiffuseFilterMap()
bakeC.enabled=on
bakeC.outputSzX=width
bakeC.outputSzY=height--element size . && mapSize of bakeRender
bakeC.fileType= theFileType
-- bakeC.shadowsOn=on
return bakeC
)

-----------------配置-----------------------
fn addElement obj theElement theChannel:1 thePadding:16 =
(
obj.InodeBakeproperties.addBakeElement theElement
obj.InodeBakeproperties.bakeEnabled=on
obj.InodeBakeproperties.bakeChannel=theChannel
obj.InodeBakeproperties.nDilations=thePadding
return obj
)

------------------渲染----------------------
fn bakeRender obj width:512  height:512 theOutPutFile:"d:\\sppbake.tga" =
(
render vfb:false renderType:#bakeSelected outputsize:[width,height] \
vfb:on filterMaps:on antiAliasFilter:(catmull_rom()) \
outputFile:theOutPutFile

)

--渲染器配置初始化
fn bakeSet =
(
global defaultRenderSet=renderers.current
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
)

--还原渲染器设置
fn bakeSetdefault =
(
renderers.current=defaultRenderSet

)




fn DetachMatIDOne obj materialIDs = (
	undo on
	(
		select obj
		detachmeshs = #()
		
		
		for thismapID in materialIDs do
		(
			totalfaces = polyop.getNumFaces obj
			faceArray = #()
			for thisFace = 1 to totalfaces do
			(
				facemapID = polyop.getFaceMatID obj thisFace
				if facemapID == thismapID then
				(
					appendIfUnique faceArray thisFace
				)
			)
			--print faceArray
			polyop.detachFaces obj faceArray delete:true asNode:true name:(obj.name + "_ID_"+thismapID as String)
			
			for iobj in objects do
			(
				if (iobj.name) == (obj.name + "_ID_"+thismapID as String) do
				(
					iobj.mat = iobj.mat[thismapID]
					appendIfUnique detachmeshs iobj
				)
			)
			--print obj.name
			--select faceArray
			--obj.wirecolor = [random 0 254,random 0 254,random 0 254]
		)
	)
	return detachmeshs
)



fn setdiffuseMapEnable mat falg =
(
	if((classof mat) == Standardmaterial) then			
	(
		if(mat.diffusemap != undefined)do
		(
			mat.diffuseMapEnable = falg
			mat.Diffuse = color 155 155 155
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
					mat[im].diffuseMapEnable = falg
					mat[im].Diffuse = color 155 155 155
				)
			)
		)
	)
)




fn bake_unwrap obj bakeoutpath = 
(
	
	
	
	
	
	
	if(obj.mat != undefined) then
	(
		if((classof obj.mat) == Standardmaterial) then			
		(
			if(obj.mat.diffusemap != undefined)do
			(
				texname_arr = #()
				texname_arr = filterstring obj.mat.diffusemap.filename "\\ ."
				if((toLower (texname_arr[texname_arr.count])) == "png") do 
				(
					return 0
				)
			)
		)
		else
		(
			if((classof obj.mat) == Multimaterial) do
			(
				submatnum = getNumSubMtls obj.mat
				for im = 1 to submatnum do
				(
					if(((classof (obj.mat[im])) == Standardmaterial) and (obj.mat[im].diffusemap != undefined)) do
					(
						texname_arr = #()
						texname_arr = filterstring obj.mat[im].diffusemap.filename "\\ ."
						if((toLower (texname_arr[texname_arr.count])) == "png") do
						(						
							return 0
						)
					)
				)
			)
		)
	)
	else
	(
		return 0
	)
	
	
	
	
	setUserProp obj "bake" 1
	
	if (obj.modifiers[#unwrap_uvw] == undefined)do
	(
		max modify mode
		modPanel.addModToSelection (Unwrap_UVW ()) ui:on
	)
	
	tmpmat = obj.mat
	--obj.mat.diffuseMapEnable = off
	setdiffuseMapEnable obj.mat off
	--obj.mat.Diffuse = color 155 155 155

	
	--obj.wirecolor = color 155 155 155
	

	obj.modifiers[#unwrap_uvw].unwrap.setMapChannel 2
	obj.modifiers[#unwrap_uvw].setFlattenAngle 45.0
	obj.modifiers[#unwrap_uvw].setFlattenSpacing 0.00
	obj.modifiers[#unwrap_uvw].setFlattenNormalize on
	obj.modifiers[#unwrap_uvw].setFlattenRotate on
	obj.modifiers[#unwrap_uvw].setFlattenFillHoles on
	obj.modifiers[#unwrap_uvw].setApplyToWholeObject on
	obj.modifiers[#unwrap_uvw].flattenMap 45.0 \
	#([1,0,0],[-1,0,0], [0,1,0],[0,-1,0], [0,0,1],[0,0,-1]) \
	0.03 true 0 true true
	macros.run "Modifier Stack" "Convert_to_Poly"

	ChannelInfo.CopyChannel obj 3 1
	ChannelInfo.PasteChannel obj 3 3
	ChannelInfo.CopyChannel obj 3 2
	ChannelInfo.PasteChannel obj 3 1
	
 	addElement obj (lightingMapElement theFileType:(bakeoutpath+(obj.name)+"lighting"+".png") width:512  height:512) 
-- 	addElement obj (diffuseMapElement theFileType:(bakeoutpath+(obj.name)+"diffuse"+".png") width:512 height:512) 
-- 	addElement obj (completeMapElement theFileType:(bakeoutpath+(obj.name)+"complete.png") width:512  height:512) 
		
		
	bakeRender obj width:512  height:512 theOutPutFile:(bakeoutpath+(obj.name)+".png")--theOutPutFile:("d:\\"+(i.name)+".tga")--step 5
	obj.INodeBakeProperties.removeAllBakeElements()
	--obj.mat.diffuseMapEnable = on
	setdiffuseMapEnable obj.mat on
	ChannelInfo.CopyChannel obj 3 3
	ChannelInfo.PasteChannel obj 3 1
	--obj.mat = tmpmat 
	
)










fn bake bakeoutpath process = 
(
--bakeSet()
objs=selectObjs()
ip = 0
for i in objects do
(
	if(i.mat == undefined) do
	(
		continue
	)
	setdiffuseMapEnable i.mat off
)
aobjcout = objs.count
--	messagebox aobjcout
for i in objs do
(

set coordsys local
select i --step 1
max modify mode --step 2
bake_unwrap i bakeoutpath
ip = ip +1

process.value = 100.*(ip/aobjcout)

-- if((classof i.mat) == Multimaterial) then
-- (
-- 	--addUVW i theMapChannel:3
-- 	
-- 	maxOps.cloneNodes i cloneType:#instance newNodes:&meshtmparr
-- 	--b.name = "tmpmesh"
-- 	tmpmesh = meshtmparr[1]
-- 	tmpmesh.name = "tmpmesh"
-- 	convertTo tmpmesh Editable_Poly
-- 	
-- 	if (classof tmpmesh) == Editable_Poly then
-- 	(
-- 		materialIDs = #()
-- 		--picked.text = tmpmesh.name
-- 		SelectedOBJ = tmpmesh
-- 		select tmpmesh
-- 		totalfaces = polyop.getNumFaces tmpmesh
-- 		for thisFace = 1 to totalfaces do
-- 		(
-- 				facemapID = polyop.getFaceMatID tmpmesh thisFace
-- 				appendIfUnique materialIDs facemapID
-- 		)
-- 		sort materialIDs
-- 		--deselect tmpmesh
-- 		--print materialIDs
-- 		
-- 		
-- 		detachmeshs = DetachMatIDOne  tmpmesh materialIDs
-- 		
-- 		for iobj in detachmeshs do
-- 		(
-- 			
-- 			
-- 			--print iobj.mat
-- 			map = iobj.mat.diffuseMap.bitmap 

-- 			select iobj 
-- 			max modify mode 
-- 			--<< --------------------------------------------------------------------
-- 			addElement iobj (lightingMapElement theFileType:(bakeoutpath+(iobj.name)+"lighting"+".png")  width:map.width  height:map.width)
-- 			addElement iobj (diffuseMapElement theFileType:(bakeoutpath+(iobj.name)+"diffuse"+".png")  width:map.width  height:map.width)
-- 			-->> ----------------------------------------------------------------------
-- 			addElement iobj (completeMapElement theFileType:(bakeoutpath+(iobj.name)+"complete.png") width:map.width  height:map.width)
-- 			bakeRender iobj width:map.width  height:map.width theOutPutFile:(bakeoutpath+(iobj.name)+".png")--theOutPutFile:("d:\\"+(i.name)+".tga")--step 5
-- 			iobj.INodeBakeProperties.removeAllBakeElements() --step 6
-- 		)
-- 		
-- 		
-- 		
-- 		delete detachmeshs
-- 		--idcount.text = "MaterialID Count: "+((amax materialIDs) as string)
-- 		--print [1,(amax materialIDs),1]
-- 		--print = [1,(amax materialIDs),(amax materialIDs)]
-- 	) else (
-- 		messagebox "You must select an editable poly object." title:"Detach MatIDs"
-- 	)
-- 	
-- 	
-- 	
-- 	
-- )
-- else
-- (
-- 	if(i.mat.diffuseMap != undefined) then
-- 	(

-- 		
-- 		--i.modifiers[#Unwrap_UVW].unwrap.setMapChannel 2
-- 		
-- 		addElement i (lightingMapElement theFileType:(bakeoutpath+(i.name)+"lighting"+".png") width:map.width  height:map.width)
-- 		addElement i (diffuseMapElement theFileType:(bakeoutpath+(i.name)+"diffuse"+".png") width:map.width  height:map.width)
-- 		addElement i (completeMapElement theFileType:(bakeoutpath+(i.name)+"complete.png") width:map.width  height:map.width)
-- 			
-- 			
-- 		bakeRender i width:map.width  height:map.width theOutPutFile:(bakeoutpath+(i.name)+".png")--theOutPutFile:("d:\\"+(i.name)+".tga")--step 5
-- 		i.INodeBakeProperties.removeAllBakeElements() --step 6
-- 	)else
-- 	(
-- 		
-- 		--i.modifiers[#Unwrap_UVW].unwrap.setMapChannel 2
-- 		
-- 		addElement i (lightingMapElement theFileType:(bakeoutpath+(i.name)+"lighting"+".png") width:512  height:512) 
-- 		addElement i (diffuseMapElement theFileType:(bakeoutpath+(i.name)+"diffuse"+".png") width:512 height:512) 
-- 		addElement i (completeMapElement theFileType:(bakeoutpath+(i.name)+"complete.png") width:512  height:512) 
-- 			
-- 			
-- 		bakeRender i width:512  height:512 theOutPutFile:(bakeoutpath+(i.name)+".png")--theOutPutFile:("d:\\"+(i.name)+".tga")--step 5
-- 		i.INodeBakeProperties.removeAllBakeElements() --step 6
-- 		)
-- )


--------------------------------------------------------------------

--addUVW i theMapChannel:3


--step 4


)

for i in objects do
(
	if(i.mat == undefined) do
	(
		continue
	)
	setdiffuseMapEnable i.mat on
)
select objs
messagebox "bake end!"
)


--bake()












fn bakeback bakeoutpath= 
(
	
--bakeSet()
objs=selectObjs()
for i in objs do
(

set coordsys local
convertToMesh i --step 1
--addUVW i theMapChannel:3
addMaterial i MapPath:(bakeoutpath + (i.name)+".png" )

)

)



fn createsun = 
(
	global sunObj = vraysun pos:(point3 1000 1000 1000) --create sun object
	targetObj = dummy pos:(point3 0 0 0) --then target
	sunObj.intensity_multiplier = 0.05
	targetObj.lookat = sunObj
)


fn deletesun =
(
	delete sunObj
)

--bakeback()

rollout bakeNew "bakeNew" width:229 height:244
(
	button btn1 "Bake" pos:[54,74] width:118 height:26
	button btn2 "Bakeback" pos:[52,156] width:118 height:29
	edittext edt1 "path:" pos:[13,28] width:174 height:24
	
	button btn3 "Back" pos:[55,119] width:117 height:22
	
	
	
	progressBar pb1 "ProgressBar" pos:[23,210] width:174 height:21
	
	
	on bakeNew open do
	(
		edt1.text = checkpPath() + "\src\art\scene\diffuse\lightmap\\"
		makedir  (edt1.text)
		bakeSet()
		createsun()
		matalpha selection
	)
	on bakeNew close do
	(
		bakeSetdefault()
		deletesun()
		
	
	)
	on btn1 pressed do
	(
		bake edt1.text pb1
	)
	on btn2 pressed do
	(
		bake(edt1.text)
		bakeback(edt1.tex)
	)
	on btn3 pressed do
	(
		bakeback(edt1.text)
	)
)
createdialog bakeNew

)