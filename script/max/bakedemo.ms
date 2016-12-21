
macroScript SPP_BAKE
category:"Superpolo"
ButtonText:"Scene Bake" 
tooltip:"Spp Scene Bake" Icon:#("Maxscript",2)
(
	rollout bakeNew "bakeNew"
(
local objs=#()
local Mps=#()
local defaultRenderSet
----------------------------------------------
button interCreateBox " create a box"
button interBake " bake "
button interBBack "Bake Back"
----------------------------------------------
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
-------------------------------------------------
fn addMaterial obj MapPath:"" =
(
local tempMat=standardMaterial()
local theMap=bitMapTexture fileName:MapPath filtering:1

tempMat.name=obj.name
tempMat.diffuseMap=theMap
--tempMat.selfillumMap=theMap
tempMat.selfIllumAmount=100.0
tempMat.showInViewPort=on

obj.material=tempMat
obj.material.showInViewPort=on
return tempMat
)
-------------------------------------------------
fn addUVW obj theMapChannel:1=
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
unwrapMod.name = "lanhaibo_UVW"

addmodifier obj unwrapMod
unwrapMod.flattenMap 45.0 \
#([1,0,0],[-1,0,0], [0,1,0],[0,-1,0], [0,0,1],[0,0,-1]) \
0.03 true 0 true true
return obj
)
---------------------------------------
fn completeMapElement theFileType:".tga" cmSize:512 =
(
bakeC=completeMap()
bakeC.enabled=on
bakeC.outputSzX=bakeC.outputSzY=cmSize--element size . && mapSize of bakeRender
bakeC.fileType= theFileType
bakeC.shadowsOn=on
return bakeC
)
fn lightingMapElement theFileType:".tga" cmSize:512 =
(
bakeC=lightingMap()
bakeC.enabled=on
bakeC.outputSzX=bakeC.outputSzY=cmSize--element size . && mapSize of bakeRender
bakeC.fileType= theFileType
bakeC.shadowsOn=on
return bakeC
)
fn diffuseMapElement theFileType:".tga" cmSize:512 =
(
bakeC=diffuseMap()
bakeC.enabled=on
bakeC.outputSzX=bakeC.outputSzY=cmSize--element size . && mapSize of bakeRender
bakeC.fileType= theFileType
bakeC.shadowsOn=on
return bakeC
)

----------------------------------------
fn addElement obj theElement theChannel:3 thePadding:16 =
(
obj.InodeBakeproperties.addBakeElement theElement
obj.InodeBakeproperties.bakeEnabled=on
obj.InodeBakeproperties.bakeChannel=theChannel
obj.InodeBakeproperties.nDilations=thePadding
return obj
)
----------------------------------------
fn bakeRender obj MapSize:512 theOutPutFile:"d:\\lanhaibo.tga" =
(
render renderType:#bakeSelected outputsize:[mapSize,mapSize] \
vfb:on filterMaps:on antiAliasFilter:(catmull_rom()) \
outputFile:theOutPutFile

)
-----------------------------------------------
on interCreateBox pressed do (box prefix:"lanhaibo" isSelected:on )
-----------------------------------------------------
on interBake pressed do
(

objs=selectObjs()
for i in objs do
(

set coordsys local
select i --step 1
max modify mode --step 2


PRINT (i.modifiers[1])

--------------------------------------------------------------------
if i.modifiers[1]==undefined then \
addUVW i theMapChannel:3 \
else
(
if (findString (i.modifiers[1].name)\
"lanhaibo")==undefined do \
addUVW i theMapChannel:3 --step 3
)
--<< --------------------------------------------------------------------
addElement i (lightingMapElement theFileType:("d:\\"+(i.name)+"lighting"+".jpg"))
addElement i (diffuseMapElement theFileType:("d:\\"+(i.name)+"diffuse"+".jpg"))
-->> ----------------------------------------------------------------------
addElement i (completeMapElement theFileType:("d:\\"+(i.name)+".tga"))
--step 4
bakeRender i --theOutPutFile:("d:\\"+(i.name)+".tga")--step 5
i.INodeBakeProperties.removeAllBakeElements() --step 6

)
select objs
)
-------------------------------------------------------
on interBBack pressed do
(
for i in objs do
(

set coordsys local
convertToMesh i --step 1
addUVW i theMapChannel:1
addMaterial i MapPath:("d:\\"+(i.name)+".tga" )

)

)
--------------------------------------------------------
on bakeNew open do
(
defaultRenderSet=renderers.current
--defaultRenderSet.antiAliasFilter
myRenderSet=default_scanline_renderer()
myRenderSet.mapping=on
myRenderSet.shadows=on
myRenderSet.autoReflect=on
myRenderSet.antiAliasing=on
myRenderSet.antiAliasFilter=catmull_rom()--has set in fn.bakeRender

renderers.current=myRenderSet
)
on BakeNew close do
(
renderers.current=defaultRenderSet

)

)createdialog bakeNew

)