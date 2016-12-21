--◊º±∏∏˜÷÷Ã˘Õº
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

-----------------≈‰÷√-----------------------
fn addElement obj theElement theChannel:1 thePadding:16 =
(
obj.InodeBakeproperties.addBakeElement theElement
obj.InodeBakeproperties.bakeEnabled=on
obj.InodeBakeproperties.bakeChannel=theChannel
obj.InodeBakeproperties.nDilations=thePadding
return obj
)

------------------‰÷»æ----------------------
fn bakeRender obj width:512  height:512 theOutPutFile:"d:\\sppbake.tga" =
(
render renderType:#bakeSelected outputsize:[width,height] \
vfb:on filterMaps:on antiAliasFilter:(catmull_rom()) \
outputFile:theOutPutFile

)

--‰÷»æ∆˜≈‰÷√≥ı ºªØ
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

--ªπ‘≠‰÷»æ∆˜…Ë÷√
fn bakeSetdefault =
(
renderers.current=defaultRenderSet

)

fn createsun = 
(
	global sunObj = vraysun pos:(point3 100 100 100) --create sun object
	targetObj = dummy pos:(point3 0 0 0) --then target
	targetObj.lookat = sunObj
)


fn deletesun =
(
	delete sunObj
)








fn bake_unwrap obj bakeoutpath = 
(
	set coordsys local
	select obj 
	max modify mode 
	if (obj.modifiers[#unwrap_uvw] == undefined)do
	(
		max modify mode
		modPanel.addModToSelection (Unwrap_UVW ()) ui:on
	)
	
	
	tmpmat = obj.mat
	obj.mat = undefined
	
	obj.wirecolor = color 255 255 255

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
	
	macros.run "Modifier Stack" "Convert_to_Poly"
	
	addElement obj (lightingMapElement theFileType:(bakeoutpath+(obj.name)+"lighting"+".png") width:512  height:512) 
	addElement obj (diffuseMapElement theFileType:(bakeoutpath+(obj.name)+"diffuse"+".png") width:512 height:512) 
	addElement obj (completeMapElement theFileType:(bakeoutpath+(obj.name)+"complete.png") width:512  height:512) 
		
		
	bakeRender obj width:512  height:512 theOutPutFile:(bakeoutpath+(obj.name)+".png")--theOutPutFile:("d:\\"+(i.name)+".tga")--step 5
	obj.INodeBakeProperties.removeAllBakeElements()
	
	ChannelInfo.CopyChannel obj 3 1
	ChannelInfo.PasteChannel obj 3 2
	ChannelInfo.CopyChannel obj 3 3
	ChannelInfo.PasteChannel obj 3 1
	macros.run "Modifier Stack" "Convert_to_Poly"
	obj.mat = tmpmat 
)

bakeSet()
createsun()

for iobj in selection do
(
	bake_unwrap iobj "d:\\"
)


deletesun()