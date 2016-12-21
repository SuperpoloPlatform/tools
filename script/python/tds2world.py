# coding=utf-8
import os
import sys
import time
import shutil

import config
import common

from datetime import datetime, date, time

######################################################################################################
# 从 /target/filesetinfo.xml 读取对应模型文件（x/3ds格式）和 texture（target 下facpro.xml） 文件的 time
# 根据time判断文件是否更新  , 决定重新构建哪个 factory


# 比较两个文件（绝对路径）的修改时间，
# 如果第一个文件的修改时间大于第二个文件的修改时间，则返回 True  否则返回 False
def compareFileMtime(file1, file2):
	if os.path.getmtime(file1) > os.path.getmtime(file2):
		return True
	else:
		return False

# 判断模型文件（x/3ds格式）文件是否需要更新
def needBuilding(filePath):
	flag = True
	#先判断 target 目录是否存在，如果存在则找 filesetinfo.xml文件，并比对时间，记录需要更新的文件
	if os.path.isdir(config.SRC_ART_OUTPUT):
		# 获取要转换的模型文件（x/3ds格式）文件的文件名，这里不带扩展名
		fileName = filePath[filePath.rfind('\\')+1:filePath.rfind('.')]
		targetFile = '%s%s%s'%(config.SRC_ART_OUTPUT, 'factories\\', fileName, '.xml')
		if os.path.isfile(targetFile):
			flag = compareFileMtime(filePath, targetFile)
		else:
			flag = True
	else:		#如果文件不存在则
		flag = True
	
	# return flag
	return True

		
# 根据模型文件（x/3ds格式）文件名，比较其使用的图片是否需要更新	
def compareTexFile(ds3File):
	# 这里需要从  /src/art/facpro.xml 读取模型文件（x/3ds格式）所使用到的图片,然后逐张比较图片

	repTexFiles = {}    # 记录需要替换的图片全路径    [原图片，新图片]
	
	# 先根据 ds3File  找到相关图片
	

	
######################################################################################################
# 遍历 src/art 下的所有模型文件（x/3ds格式）文件
list_factory3ds2world_cmds = []	# 存放本体3ds文件的数组
list_scene3ds2world_cmds = []	# 存放场景3ds文件的数组
list_lightmapuv3ds2world_cmds = []	# 存放lightmap uv数据的3ds文件的数组
# 扫描模型文件（x/3ds格式）文件的函数, 并生成命令行
def iterate3ds( dir ):
	if os.path.isdir( dir ):
		paths = os.listdir( dir )
		for path in paths:
			filePath = os.path.join( dir, path )
			if os.path.isfile( filePath ):
				# 如果不是3ds，x等文件类型，则跳过。
				if common.getFilenameExt(filePath) != ".3ds" and common.getFilenameExt(filePath) != ".x" :
					continue
				
				# ticket:1148 由于工具实现的问题，x文件的支持已经从artbuild中分离出来
				# 在此部分功能还没有合并进artbuild之前，只有通过x文件的后缀来判断调用的具体参数。
				spp_converter = config.SPP_CONVERTER
				if common.getFilenameExt(filePath) == ".x" :
					spp_converter = "sppbuild"
				
				# 取3ds 文件的名称作为存放 world.xml 的目录名称
				# 判断3ds文件是 factories 还是 scene
				convertMode = ''
				printMsg = ''
				if filePath.find('\\factory\\')>0:
					convertMode = 'factory'
					printMsg = "> 发现 %s 文件 : %s"%(convertMode, filePath)
				elif filePath.find('\\scene\\')>0:
					convertMode = 'scene'
					printMsg = "> 发现  %s  文件 : %s"%(convertMode, filePath)
				elif filePath.find('\\uv_lightmap\\') > 0 :
					convertMode = 'uv_lightmap'
					printMsg = "> 发现  %s  文件 : %s"%(convertMode, filePath)
				
				# ticket:1148 由于工具实现的问题，原本实现的方案是：
				# scene目录下放置convert mode为scene的3ds文件；
				# factory目录下放置convert mode为factory的3ds文件；
				# 但是现在对于x文件情况就不同了，factory目录被取消了，虽然x文件放在scene目录下，但是convert mode仍然是factory。
				# 所以在这块我只好做一个小的矫正。期待以后把这部分代码删除掉。
				if common.getFilenameExt(filePath) == ".x" :
					convertMode = 'factory'
				
				if needBuilding(filePath):
					# 开始拼装 3ds2world 命令
					cmd = config.SPP_BIN			# spp命令的地址
					# chenyang : 自动化测试需要添加一个参数，这样才能把alert等函数重置（清空）了。
					if config.AUTOTEST is True :
						cmd += " --autotest "
					if config.DEBUG is True :
						cmd += " --debug "
						if config.DEBUG_DEV_NAME is not "" :
							cmd += " --" + config.DEBUG_DEV_NAME + " "
					cmd += ' --input="%s" --output="%s" --ifeffect=Y --usepath="%s" --convertmode="%s" --tmpworldpath="%s" --tools="%s"' % (
						filePath,						# 3ds 文件全路径  --input=
						config.SRC_ART_OUTPUT,		# world的输出路径  --output=
						config.USEPATH,		# 运行时读取 world 资源的目录, 绝对路径
						convertMode,				# convertmode = factory, scene 或者 uv_lightmap  ;  表示以什么格式转换3ds文件,   
						config.worldTemplate,		# 指定一个 world.xml 文件作为场景模版
						spp_converter			# 调用SPP Tools的类型，比如artbuild
					)
					print common.encodeChinese(printMsg)
					
					# 将cmd命令存入数组
					#@fixme
					# ticket:1148 由于工具实现的问题，原本实现的方案是：
					# scene目录下放置convert mode为scene的3ds文件；
					# factory目录下放置convert mode为factory的3ds文件；
					# 但是现在对于x文件情况就不同了，factory目录被取消了，虽然x文件放在scene目录下，但是convert mode仍然是factory。
					# 所以在这块我只好做一个小的矫正。期待以后把这部分代码删除掉。
					# 当出现了x文件，前面做了一次适应，将convertmode改成了factory，但是如果这块是convertmode是factory，
					# 那么就会被添加到factory计数（数组）中，也就是scene计数（数组）就是空了，很郁闷的一个问题是，这种
					# 情况在3ds文件下，会提示出错，因为3ds的情况必须需要至少一个scene。
					# 所以在这块还需要一次矫正，才能避免开这个错误。
					# 这块代码已经彻头彻尾烂掉了，由于项目紧急，现在就不做重构了。
					# 如果看到这片代码的同事有任何异议，欢迎发email/ticket，或者直接回复ticket:1148。
					if common.getFilenameExt(filePath) == ".x" :
						list_scene3ds2world_cmds.append(cmd)
					else :
						if convertMode == "factory" :
							list_factory3ds2world_cmds.append(cmd)
						elif convertMode == "scene" :
							list_scene3ds2world_cmds.append(cmd)
						elif convertMode == "uv_lightmap" :
							list_lightmapuv3ds2world_cmds.append(cmd)
			elif os.path.isdir( filePath ):
				if filePath[-4:].lower() == ".svn".lower():
					continue
				else:
					iterate3ds( filePath )

	
######################################################################################################
# 输出文件个数					
def printTotal3ds():
	scene_count = len(list_scene3ds2world_cmds)
	print common.encodeChinese("> 完成!  ")
	print common.encodeChinese("> 共发现 %s 个模型文件（x/3ds格式）文件。" % (scene_count))
	# 判断 scene 目录下是否有模型文件（x/3ds格式）文件，如果没有则报错
	if scene_count < 1:
		print ''
		print 'ERROR : '
		print common.encodeChinese("> scene目录中未发现任何模型文件（x/3ds格式）文件，请检查后重新构建。")
		common.pause()
		os._exit(0)

######################################################################################################
# 输出 python 批处理脚本
def executeBatch():
	# 逐条执行 3ds2world 命令
	fileName = ''
	filePath = ""
	errorMsg = ""
	
	# 先处理所有本体的导出工作。
	for cmd in list_factory3ds2world_cmds:
		# 输出debug信息，打印每条cmd命令行，用于命令行参数是否出错。
		if config.DEBUG == True :
			print("Command to execute : [" + cmd + "]")
		
		fileName = cmd[cmd.find('input')+5:cmd.find('.')+4]
		filePath = cmd[cmd.find('input')+6:cmd.find('.')+4]
		print fileName
		
		# 执行3ds2world脚本，并取得返回值，用于输出错误信息。
		retCode = os.system(cmd)
		
		# 打开build日志并写入当前进行的模型文件（x/3ds格式）文件名称。
		dt = datetime.now()
		# '2012-05-25 04:30:11:12345678'
		common.writeToFile(config.BUILD_LOG,
			"[SppBuild] " + 
			dt.strftime("[%Y-%m-%d %H:%M:%S:%f]") + " " +
			filePath
		)
		
		# 有一些特殊的错误，可以让程序继续运行下去，不过需要在处理完
		# 所有的模型文件（x/3ds格式）文件之后，输出期间报出的所有错误信息。
		#@fixme 现在是把错误处理放在python中进行，也可以放在artbuild中进行。
		if retCode == 41 :
			common.writeToFile(config.ERROR_LOG, filePath)
			errorMsg += "Error Code 41 : UV error , please check error log : " + config.ERROR_LOG + "\n"
		elif retCode != 0 :
			print("Error code : " + str(retCode))
			common.pause()
			sys.exit(retCode)
	
	# 中间需要检查一下是否生成了错误日志
	# 如果错误日志存在，则不需要再导场景了，因为很有可能是错误的。
	if os.path.isfile(config.ERROR_LOG):
		print errorMsg
		common.pause()
		sys.exit(1)
	
	# 再处理所有场景的导出工作。
	for cmd in list_scene3ds2world_cmds:
		# 输出debug信息，打印每条cmd命令行，用于命令行参数是否出错。
		if config.DEBUG == True :
			print("Command to execute : [" + cmd + "]")
		
		fileName = cmd[cmd.find('input')+5:cmd.find('.')+4]
		print fileName
		
		# 执行3ds2world脚本，并取得返回值，用于输出错误信息。
		if len(list_scene3ds2world_cmds) !=0:
			retCode = os.system(cmd)
		else:
			print ("There is no any scene be find !" )
		# 针对返回错误码的情况，需要直接退出，这一点很严格。
		if retCode != 0 :
			print("Error code : " + str(retCode))
			common.pause()
			sys.exit(retCode)
	
	# 最后处理lightmap的uv信息。
	for cmd in list_lightmapuv3ds2world_cmds:
		# 输出debug信息，打印每条cmd命令行，用于命令行参数是否出错。
		if config.DEBUG == True :
			print("Command to execute : [" + cmd + "]")
		
		filePath = cmd[cmd.find('input')+7:cmd.find('.')+4]
		print filePath
		
		# 执行3ds2world脚本，并取得返回值，用于输出错误信息。
		retCode = os.system(cmd)
	
	# 如果程序全部执行完毕，则看看有没有错误信息需要输出的。
	if errorMsg != "" :
		print errorMsg
		
	print common.encodeChinese("> 完成!  ")
	print '-------------------------------'
	print ''

# 在模型文件（x/3ds格式）转换成了world之后需要处理的问题
# * 降低贴图亮度
def postBuild() :
	diffuse_path = config.PROJECT_HOME + "\\target\\art\\textures"
	lightmaps_path = config.PROJECT_HOME + "\\target\\art\\lightmaps"
	diffuse_bri = "-53"
	# lightmaps_bri = "-10"
	# target下是否存在lightmap，如果存在，则需要降低亮度。
	if os.path.exists(lightmaps_path) is True :
		# 设定diffuse亮度
		param = " --src=\"" + diffuse_path + "\" "
		param += " --dst=\"" + diffuse_path + "\" "
		param += " --brightness=\"" + diffuse_bri + "\" "
		# param += " --saturation=\"-1\" "
		# param += " --donotwait "
		cmd = "setBrightness " + param
		if config.DEBUG is True :
			print cmd
		os.system(cmd)
		# 设定lightmap亮度
		param = " --src=\"" + lightmaps_path + "\" "
		param += " --dst=\"" + lightmaps_path + "\" "
		param += " --brightness=\"" + lightmaps_bri + "\" "
		# param += " --saturation=\"-1\" "
		# param += " --donotwait "
		cmd = "setBrightness " + param
		if config.DEBUG is True :
			print cmd
		os.system(cmd)

# EOF