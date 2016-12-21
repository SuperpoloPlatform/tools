--选择导出模型的时候需要按照顺序选择先选择壶在选择box。
fielbuild="D:\\sand.xml"
outFile = createFile (fielbuild)

if selection.count ==0 then
(
messagebox"请选择需要输出中文信息的物体！"
)
else
(
	format "<application type='school'>\n\t<sandTable>\n" to:outFile
	
	for i in selection do
	( 
	
		
		if(classof i)==Teapot then (
			format "\t\t\t<label id=\"%\">\n" i.name to:outFile
			fa =i.position
			format "\t\t\t\t<uiPosition>[% % %]" fa.x fa.z fa.y  to:outFile
			format "</uiPosition>\n" to:outFile
		)
		if (classof i)==BOX then (
		fa = i.Position
		--eularf = (quatToEuler (i.transform as quat))
		local eular = (quatToEuler (i.transform as quat))		
		format "\t\t\t\t<playerPosition>[% % %]"fa.x fa.z fa.y  to:outFile
		format "</playerPosition>\n" to:outFile
		format "\t\t\t\t<playerRotation>[% % %]" (((eular.x)/180)*3.1415926)  (((eular.z)/180)*3.1415926) (((eular.z)/180)*3.1415926)  to:outFile
		format "</playerRotation>\n" to:outFile
		format "\t\t\t</label>\n"to:outFile
		)
		
	)
	
	format "\t</sandTable>\n</application>" to:outFile
	
)
close outFile


