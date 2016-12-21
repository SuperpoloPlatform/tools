# coding=utf-8
import os
import sys
import getopt
import shutil 
from xml.dom.minidom import parse
from os.path import join

# 以下是自定义的模块
import config		# 一些路径的全局变量
import common	# 一些通用的函数

import freetarget	# 清空 target 目录
import copyfile
import publish		# 发布应用程序
import tds2world	# 将3ds文件转换为world 文件

import help 
import viewfact 
import pack
import do_merge
import do_combine


# Declaration：
#  os._exit(0)  代表错误引发的终止，错误详情参考 ERROR CODE
#	os._exit(1)  代表程序正常终止，通常代表当前操作的执行到此为止


######################################################################################################
#1   判断用户是否需要清空target目录
#   --clean  清空并退出
#   --rebuild  清空后重新构建
#   --publish  清空后重新构建安装包
#   如果没有参数则默认为增量，下面这个操作被跳过
#  关于获得命令参数的介绍http://docs.python.org/library/getopt.html    
#	这里还有一个更好的解释http://www.cnblogs.com/xuxm2007/archive/2010/08/09/1795668.html

#  当前全局变量
needFreeTarget = True	# 命令行中是否包含 --clean 操作
needTds2world = True	# 命令行中是否包含 --build 或 --rebuild操作； sppbuild  默认带 --rebuild
needLighter2 = False		# 命令行中是否包含 --lighter2=[integer] 操作，烘焙场景；
lighter2par = 9

needTemplate=False       # 命令行中是否包含 --publish=[templateName] 操作，发布应用程序
templateName = ""		# 保存模板的名称
needSetup = False  		# 命令行中是否包含 --setup 操作，将应用程序编译成安装包
needMerge = False  		# 命令行中是否包含 --merge 操作，合并场景
needCombine = False  		# 命令行中是否包含 --combine 操作，3+2合并
mergeList=""                    #需要合并的项目名称列表
combineName=""             #需要3+2的项目名称
setupType=""
# 这里获取命令行参数
try:
	opts, args = getopt.getopt(sys.argv[1:] , "h", ["clean", "build", "rebuild", "publish=","lighter2=","help","create=","viewfact=","debug=","autotest", "setup","setupBurnGo","merge=","combine="])
except getopt.GetoptError:
	print common.encodeChinese("命令参数格式错误，请使用  -h  查看帮助")
	os._exit(0)

print common.encodeChinese("#######################################################")
print common.encodeChinese("################ 欢迎使用SPP Builder ##################")
print common.encodeChinese("#######################################################")		

################################
#   判断执行 sppbuild 命令的目录是否正确
def checkCurrentDir():
	if not os.path.isdir("src"):
		print common.encodeChinese(config.ERR1000)
		os._exit(0)
	
# 遍历用户输入的命令行参数
# 需要判断命令参数之间的互斥，否则会有bug
for key,val in opts:
		
		########################################################
		#    			项目构建命令
		########################################################
		# 增量式构建，适用于大场景修改	
		if key == "--rebuild":
			checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
			needFreeTarget = True
			needTds2world = True
		# 重新构建：先清空target，再构建
		if key == "--build":
			needFreeTarget = False
			needTds2world = False
			checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
			# print common.encodeChinese("该参数还在支持中...")
		
		# 使用指定的模板发布一个应用程序
		if key == "--publish":
			checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
			if val :
				templateName = val
				# 先判断模板是否存在，不存在则报错并终止构建
				templatePath  = "%stemplate\\%s\\"%(config.SPP_HOME, val)
				if os.path.isdir(templatePath):
					# 先检查模板所需的资源文件是否齐备
					sys.path.append(templatePath+"\\python")	# 这个路径是 /spp_sdk/template/[templateName]/python
					import checkbuild
					if checkbuild.check():
						needTemplate = True
					else :
						# 这里的错误信息在 checkbuild 中打印了
						common.pause()
						os._exit(0)
					if templateName=="web360":
						needFreeTarget = False
						needTds2world = False
				else:
					print common.encodeChinese(config.ERR700)
					common.pause()
					os._exit(0)
	
		
		# 将应用程序编译为安装包
		if key.find("setup") >0:
			checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
			needSetup = True
			
			if key=="--setupBurnGo":
				setupType="setupBurnGo"
			# needFreeTarget = False
			# needTds2world = False		
		# 使用Lighter2工具对场景进行烘焙
		if key == "--lighter2":
			if val:
				needLighter2 = True
				lighter2par = val
				
				
		# 合并场景
		if key == "--merge":
			if val:
				checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
				needMerge = True
				mergeList=val
				needFreeTarget = False
				needTds2world = False
				# os._exit(0)
		
		# 3+2合并
		if key == "--combine":
			if val:
				checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
				needCombine = True
				combineName=val
				needFreeTarget = False
				needTds2world = False
				# os._exit(0)		
		
		########################################################
		#    			工具命令，只执行一次
		########################################################
		# factory 查看工具
		if key == "--viewfact":
			checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
			if val:
				viewfact.view(val)
				os._exit(1)
			
		# 创建一个新的项目，并提交到SVN
		if key == "--create":
			if val:
				copyfile.createProject(val)
			else:
				print "请输入你要提交的项目名字"
			os._exit(1)		
			
		# 清空 target 目录操作
		if key == "--clean":
			checkCurrentDir()	#判断执行 sppbuild 命令的目录是否正确
			freetarget.freeTarget()	
			os._exit(1)

		########################################################
		#    			打印信息相关的命令
		########################################################
		# 是否打印debug信息的开关
		if key == "--debug":
			# debug开关
			# 1. 给artbuild传送“--debug”参数
			# 2. 在不同阶段输出各种调试信息。
			config.DEBUG = True
			# 开发者名称，类似于spp_dev_name环境变量，
			# 允许每个开发者根据自己的需要写一些调试语句，而不影响其他开发人员
			# 目前只用在为artbuild工具传参数。
			if val:
				config.DEBUG_DEV_NAME = val
		
		# 开启自动测试
		if key == "--autotest":
			config.AUTOTEST = True
		
		# 打印帮助信息
		if key == "-h" or key=="--help":
			help.usage()
			os._exit(0) #config.exit_help
	
# os._exit(0)	
#################################################################
####   DEBUG 输出所有全局“常量”
#################################################################
if config.DEBUG == True :
	print "===================="
	print "DEBUG Mode is open!!"
	print "===================="
	print "SPP_HOME=" + config.SPP_HOME
	print "SPP_BIN=" + config.SPP_BIN
	print "CONVERT_JS=" + config.CONVERT_JS
	print "START_JS=" + config.START_JS
	print "worldTemplate=" + config.worldTemplate
	print "PROJECT_HOME=" + config.PROJECT_HOME
	print "SRC_ART_INPUT=" + config.SRC_ART_INPUT
	print "SRC_ART_OUTPUT=" + config.SRC_ART_OUTPUT
	print "USEPATH=" + config.USEPATH
	print "lightFolder=" + config.lightFolder
	print "bakeLightFile=" + config.bakeLightFile
	print "staticLightFile=" + config.staticLightFile
	print "dynamicLightFile=" + config.dynamicLightFile
	print "noLightFile=" + config.noLightFile
	print "heightBakeCmd=" + config.heightBakeCmd
	print "lowBakeCmd=" + config.lowBakeCmd
	

# 判断当前所在目录是否为标准项目目录，是否包含src
checkCurrentDir()
	
	
######################################################################################################	
# 1 清空 target 目录操作
if needFreeTarget:
	freetarget.freeTarget()
	
######################################################################################################
# 2 执行3DS处理
if needTds2world:
	print common.encodeChinese("扫描 src 目录中的模型文件 ...")
	
	#ticket:1317 这里隐含一个问题，由于遍历的时候使用字母顺序，所以对于factory和scene来说
	#顺序是正确的，也就是先factory然后再scene，但是现在添加了Lightmap的uv信息保存在3ds文件中，
	#由于这些3ds文件保存在lightmap_uv目录下，所以就会导致遍历（执行）顺序成为
	#factory -> lightmap_uv -> scene。但是我们设计的build顺序应该是：
	#factory -> scene -> lightmap_uv。否则会出错。
	#所以这里需要refine一下结构。
	
	# 扫描并处理3DS文件
	tds2world.iterate3ds( config.SRC_ART_INPUT )	# 搜集需要处理的模型文件，将 /src/art/ 资源目录作为参数
	
	# 打印处理的场景文件数量
	tds2world.printTotal3ds()
	print ''
	print common.encodeChinese("开始转换模型文件 ...")
	print ''
	tds2world.executeBatch()	# <<<<<<<<<<<<<  开始批量处理 3ds 文件
	print '-------------------------------'
	print common.encodeChinese("处理贴图文件开始 ...")
	print ''
	tds2world.postBuild()
	print ''
	print common.encodeChinese("处理贴图文件结束 ...")


######################################################################################################
#3    判断命令行参数  是否请求Lighter2 , 否则跳过
if needLighter2:
	# 先直接import进来，以后需要修改时再重构
	import lighter2
	lighter2.lmdensity = lighter2par
	lighter2.lighter2()
	

######################################################################################################
# 4	调用模版的  builder  模版会有扩充  
#    先从 def.xml 中获取所应用的模版名   例如 school
# 	  然后从 spp_sdk/template 中检查文件是否存在 ， 存在则，   控制权转交   /template/school/build/build.py
#    sys.path.join('/template/school/build/')  import build  Builder.build(src, target, schoolPath, option )  @option 编译参数，publish -- 去掉临时文件
if needTemplate:
	publish.ifTemplate(templateName)



	
#定义些合并的参数
mergeList=mergeList.split(",")
pathP=(config.PROJECT_HOME).split("\\")[-1]
pathP1=(config.PROJECT_HOME).split(pathP)[0]
merName=mergeList[0].split("_")[0]	



#5 合并场景
if needMerge:
	do_merge.process(mergeList)
	

######################################################################################################
# 6   创建安装包   windows：NSIS     linux:
#  获取 --setup="win32,win64,linux32/64" 参数
#  如果有 publish  删除所有临时文件      
#   从 /src/setup 目录中获取安装文件所需的素材信息  
#   数字签名
#copy spp环境



if needSetup:
	if templateName!="" :
		print ''
		print common.encodeChinese("开始生成安装程序...")
		pack.packDir(templateName)
		# 编译安装脚本
		pack.compileNsis()
		print ''
		print common.encodeChinese("完成！")
	elif len(mergeList)>1:
		print common.encodeChinese("开始生成合并后的安装程序...")
		pack.packDir(templateName)
		pack.compileNsis()
		
		print""
		print  common.encodeChinese("安装包完成")

	else:
		print common.encodeChinese("该参数需要配合 --publish=[templateName] 参数一起使用")

######################################################################################################
# 6  打印场景统计信息

#7 3+2合并
if needCombine:
	# if templateName!="" :
	if combineName!="":
		do_combine.process(combineName)
		print ''
	
	# else:
		# print""
		# print common.encodeChinese("该参数需要配合 --publish=[templateName] 参数一起使用")


# 将 项目一次copy到总项目下

	# else:
		# print common.encodeChinese("该参数需要配合 --publish=[templateName] 参数一起使用")

######################################################################################################
#  操作结束提示
# cmd1 = 'pause>nul'
# print common.encodeChinese("操作完成 , 按下回车键结束")
# if not config.AUTOTEST :
	# os.system(cmd1)

print common.encodeChinese("操作完成 , 按下回车键结束")
common.pause()


# os.system('%s\\target\\run'%(config.PROJECT_HOME))





