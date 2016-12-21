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

fn buildCHname =
( -- 特定建筑的中文名称----user define  
/* 	
	<world>
		<meshobj name="cc_02#001" cname="教学楼" />
	</world>
 */	
	pathN = checkProPath() + "\\src\\art\\position\\"
	makeDir pathN
	fileN = "build.xml"
	outFile = createFile ( pathN + fileN )
	
	if selection.count ==0 then
	(
		messagebox"请选择需要输出中文信息的物体！"
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
	messageBox "带中文信息的物体已经输出完毕！"
)

--这个是测试使用
buildCHname()

--这个是用来设置选中模型的中文名称
setUserProp $ "cname" "图书馆"