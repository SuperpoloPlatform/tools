# coding=utf-8
import os
import sys
import getopt
import shutil 
from xml.dom.minidom import parse
from os.path import join

# 这里是自定义的模块
import config		# 一些路径的全局变量
import common	# 一些通用的函数


lmdensity = 9	# 这里给出默认值，这个值在 sppbuild --lighter2=[这里设置]

def lighter2():
	
	global lmdensity
	
	#  先手动处理判断   
	#  http://dev.masols.com/trac/spp/wiki/Doc/FeiluCookBook/Basic/Tools/lighter2 所描述的
	# <key name="lighter2"  noselfshadow=“yes”  /> 是否有效
	# 如果有效在这里根据 /src/art/lights/nolightset.xml 把world中对应的 meshobj 加入 <key ...
	# 如果无效 ， 跳到  Lighter2 后处理 
	# 经验证后，使用 <key ... 的方式是不行的，
	# 所以只能在烘焙之后去删掉对应meshobj及submesh中 的 shadervar  和  renderbuffer

	# 判断用户是否需要烘焙场景   review：可以用 do ....break;.. while  的方式中断

	print common.encodeChinese("开始烘焙模型...")
	print common.encodeChinese("> 准备灯光 ...")
	# 先准备需要访问的文件及路径
	bakeLightFile = '%s%s'%( config.lightFolder , config.bakeLightFile )	# 烘焙使用的灯光文件
	targetWorldFile = '%s%s'%( config.SRC_ART_OUTPUT , 'world.xml' ) # 烘焙使用的world文件

	# 检查文件或路径是否存在		
	common.fileExist(bakeLightFile)
	common.fileExist(targetWorldFile)

	# 先将烘焙使用的灯光加入到world中
	# 读取灯光文件,获得灯光节点
	bakeLightDoc = common.openXml( bakeLightFile );
	bakeLightWorld = bakeLightDoc.documentElement
	lights = bakeLightWorld.getElementsByTagName( "light" )
	# 获得 ambient 环境光节点  数组,但长度是1
	ambient = bakeLightWorld.getElementsByTagName( "ambient" )

	if lights.length > 0:
		targetWorldDoc = common.openXml( targetWorldFile )

		for node in targetWorldDoc.getElementsByTagName( "sector" ):
			if(node.getAttribute('name')=='Scene'):
				sector = node
				
		# 如果 sector 中已经有 ambient 节点了 则替换
		if ambient.length > 0 :		# 如果 lights.xml 中导出了 ambient 信息 , 这里的 ambient 是lights.xml中的
			oldAmbient = targetWorldDoc.getElementsByTagName( "ambient" )		
			if oldAmbient.length > 0 :
				sector.replaceChild(ambient[0], oldAmbient[0])		# 替换掉world中原有的ambient节点
			else:	# 如果没有 , 将 ambient 添加到 sector 中
				print sector.childNodes.length
				tmpNode = sector.childNodes[0]
				sector.insertBefore(  ambient[0],  tmpNode )
				sector.insertBefore( targetWorldDoc.createTextNode('\n\t'),  ambient[0] )
		
		# 获得整个场景中第一个 meshobj , 下面会用它来插入节点
		allMeshobj = targetWorldDoc.getElementsByTagName( "meshobj" )

		if allMeshobj.length >0:
			# 将灯光节点添加到 world 文件中
			for light  in lights:
				sector.insertBefore(  light , allMeshobj[0] )
				sector.insertBefore(  targetWorldDoc.createTextNode('\n\t') , allMeshobj[0] )
				
			# 将新的 world 文件重新写入
			f =  open( targetWorldFile ,  'w')
			targetWorldDoc.writexml(f , encoding='utf-8' )
			f.close()
		else:
			print common.encodeChinese("\n###错误###  %s 文件是空的 ! "%(targetWorldFile))
			if not config.AUTOTEST :
				os.system("pause>nul")
			os._exit(0)	# 0 会影响CI的构建，判断构建是否成功，以序号来代表环节

	#####################################################
	# lighter2烘培所需灯光准备完毕，开始烘焙
	print common.encodeChinese("正在烘焙模型 ...")
	# oldWorldName =  '%s%s'%( config.SRC_ART_OUTPUT , 'world.xml' )
	# newWorldName =  '%s%s'%( config.SRC_ART_OUTPUT , 'world' )

	# 烘焙前将 world.xml 修改为 world
	# if os.path.isfile( oldWorldName ):
		# os.rename(oldWorldName, newWorldName)

	# 将烘焙命令写到 /target/lighter.bat 中并执行该文件
	lighterBatFile = join(os.getcwd(),"target","lighter.bat")
	f = open(lighterBatFile, 'w')
	cmds = "cd /d %~dp0\nset CSROOTDIR=%~dp0\nlighter2 --lmdensity="+lmdensity+" --nobinary --pathprefix=/art art"
	f.write( cmds )
	f.close()
	os.system(lighterBatFile)

	# 删除 /target/lighter.bat 文件
	os.remove(lighterBatFile)

	# 烘焙前将 world 修改为 world.xml
	# if os.path.isfile( newWorldName ):
		# os.rename(newWorldName, oldWorldName)

	print common.encodeChinese("> 完成!  ")
	print '-------------------------------'
	print ''

	#####################################################
	# 烘培完毕，删除所有的灯
	targetWorldDoc= common.openXml( targetWorldFile );

	for node in targetWorldDoc.getElementsByTagName( "sector" ):
		if(node.getAttribute('name')=='Scene'):
			sector = node

	# 获得所有的灯光节点
	lights = targetWorldDoc.getElementsByTagName( "light" )

	# 开始遍历删除
	for light in lights:
		sector.removeChild( light )

	# 将新的 world 文件重新写入
	f =  open( targetWorldFile ,  'w')
	targetWorldDoc.writexml(f , encoding='utf-8' )
	f.close()




	######################################################################################################
	#4   根据 /src/art/lights/nolightset.xml 把world中对应的 meshobj及submesh中 的 shadervar  和  renderbuffer 删掉
	######################################################################################################

	print common.encodeChinese("烘焙后去除部分模型的 LightMap....")

	noLightMapFile = '%s%s'%( config.lightFolder , config.noLightFile )
	targetWorldFile = '%s%s'%( config.SRC_ART_OUTPUT , 'world.xml' )
	# 判断文件存在否
	if os.path.isfile(noLightMapFile):
		common.fileExist(targetWorldFile)

		noLightMapDoc = parse(noLightMapFile)
		nolightMeshList = noLightMapDoc.getElementsByTagName( "meshobj" )
		
		# 打开 world.xml 文件
		targetWorldDoc = parse( targetWorldFile )
		meshobjList = targetWorldDoc.getElementsByTagName( "meshobj" )
		
		procMeshList = []
		
		# 记录需要删除 shadervar 和 renderbuffer 的 meshobj实例
		for meshobj in meshobjList:
			for nolightMesh in nolightMeshList:
				meshobjName = meshobj.getAttribute("name")
				nolightMeshName = nolightMesh.getAttribute("name")
				if(meshobjName == nolightMeshName):
					procMeshList.append(meshobj)

		# 执行删除操作
		for meshobj in procMeshList:				
			# 先判断有无 submesh 
			submeshList = meshobj.getElementsByTagName("submesh")
			# 如果有submesh , 先删除submesh 中的 shadervar
			if(submeshList.length>0):
				for submesh in submeshList:
					shadervarList = submesh.getElementsByTagName("shadervar")
					for shadervar in shadervarList:
						submesh.removeChild(shadervar)
			
			# 删除 meshobj 下的shadervar
			parShaders = meshobj.getElementsByTagName("shadervar")
			for parShader in parShaders:
				meshobj.removeChild(parShader)
			
			# 删除 meshobj 下的 renderbuffer
			parRenbufs = meshobj.getElementsByTagName("renderbuffer")
			for renbuf in parRenbufs:
				params = meshobj.getElementsByTagName("params")[0]
				params.removeChild(renbuf)

		
		# 将新的 world 文件重新写入
		f =  open( targetWorldFile ,  'w')
		targetWorldDoc.writexml(f , encoding='utf-8' )
		f.close()

		print common.encodeChinese("> 完成!  有 %s 个模型的LightMap被删除。"%( len(procMeshList) ))
		print '-------------------------------'
		print ''
	else:
		print common.encodeChinese("> 没有找到 %s 文件，这将导致场景中错误的lightmap不能被校正。"%(noLightMapFile))


		
		
		
		
		
	######################################################################################################
	#5    加入 /src/art/lights/static.xml 中的所有灯光


	print common.encodeChinese("加入 static 灯光 ...")

	staticLightFile = '%s%s'%( config.lightFolder , config.staticLightFile )
	targetWorldFile = '%s%s'%( config.SRC_ART_OUTPUT , 'world.xml' ) 
	# 判断文件存在否
	common.fileExist(staticLightFile)
	common.fileExist(targetWorldFile)
		
	staticLightDoc = parse( staticLightFile )
	lights = staticLightDoc.getElementsByTagName( "light" )

	# 获得 ambient 环境光节点  数组,但长度是1
	ambient = staticLightDoc.getElementsByTagName( "ambient" )

	# 打开 world.xml 文件
	targetWorldDoc = parse( targetWorldFile )

	for node in targetWorldDoc.getElementsByTagName( "sector" ):
		if(node.getAttribute('name')=='Scene'):
			sector = node

	# 获得整个场景中第一个 meshobj , 下面会用它来插入节点
	allMesh = targetWorldDoc.getElementsByTagName( "meshobj" )
	if(allMesh.length < 1):   # 如果world文件中没有meshobj
		print common.encodeChinese("\n###错误###  %s 文件是空的 ! "%(targetWorldFile))
	else:
		if ambient.length>0:
			sector.insertBefore(  ambient[0] , allMesh[0] )
			sector.insertBefore(  targetWorldDoc.createTextNode('\n\t') , allMesh[0] )
		else:
			print""
			print "[[WARNING:]]"
			print common.encodeChinese("> static.xml中没有 ambient ，这将导致场景很暗。")
			print""

		# 将灯光节点添加到 world 文件中
		for light  in lights:
			sector.insertBefore(  light , allMesh[0] )
			sector.insertBefore(  targetWorldDoc.createTextNode('\n\t') , allMesh[0] )
			
		# 将新的 world 文件重新写入
		f =  open( targetWorldFile ,  'w')
		targetWorldDoc.writexml(f , encoding='utf-8' )
		f.close()

		print common.encodeChinese("> 完成!  共加入 %s 盏灯光。"%( str(lights.length) ))
		print '-------------------------------'
		print ''

		
			
			
		
	######################################################################################################
	#6   检查 /target/art/facpro.xml    判断是否有 normal 和 height   决定去掉哪些 staticlit  

	# if needLighter2:		# 如果场景执行过烘焙操作 ， 则需要删掉一部分  staticlit 节点

	print common.encodeChinese("开始清除 staticlit ...")

	# 判断文件是否存在
	# facproFile = '%s%s'%( config.SRC_ART_OUTPUT , "facpro.xml" )
	# common.fileExist(facproFile)

	# 获取xml中的所有 meshfactory
	# facproDoc = parse( facproFile )
	# meshfactoryList = facproDoc.getElementsByTagName( "meshfactory" )

	# removeNodeList = []	# 记录需要去除 staticlit 节点的 factory

	# 遍历所有的 meshfactory 
	# for meshfac in meshfactoryList:
		# normalTexList = meshfac.getElementsByTagName( "normaltexture" )
		# specularTexList = meshfac.getElementsByTagName( "speculartexture" )
		# heightTexList = meshfac.getElementsByTagName( "heighttexture" )
		
		# if normalTexList.length >0 or specularTexList.length >0 or heightTexList.length >0:
			# removeNodeList.append( meshfac.getAttribute("name") )
			# print meshfac.getAttribute("name") 
			
	# if meshfactoryList.length >0:		# 如果需要替换的节点数大于0，则执行删除
		# 打开 target/art/world.xml 文件，准备删除响应节点
	targetWorldFile = '%s%s'%( config.SRC_ART_OUTPUT , 'world.xml' ) 
	common.fileExist(targetWorldFile)
	targetWorldDoc = parse( targetWorldFile )
	meshobjList = targetWorldDoc.getElementsByTagName("meshobj")
		
		# 遍历world中的所有的 meshobj ， 根据removeNodeList 中的记录 去除 staticlit
		# for nodeName in removeNodeList:
			# for meshobj in meshobjList:
				# meshobjName = meshobj.getAttribute("name")
				# meshFactName = meshobjName[0:meshobjName.find("#")]
				# if meshFactName == nodeName:
					# staticlit = meshobj.getElementsByTagName("staticlit")
					# if staticlit.length >0:
						# meshobj.removeChild( staticlit[0] )
						# meshobjList.remove(meshobj)
						
		#  删除所有的 meshobj 中的 staticlit 节点
	for meshobj in meshobjList:
		staticlit = meshobj.getElementsByTagName("staticlit")
		if staticlit.length >0:
			meshobj.removeChild( staticlit[0] )
		
		
		# 将新的 world 文件重新写入
	f =  open( targetWorldFile ,  'w')
	targetWorldDoc.writexml(f , encoding='utf-8' )
	f.close()
		
	print common.encodeChinese("> 完成! ")
	print '-------------------------------'
	print ''

