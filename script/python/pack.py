# coding=utf-8
import os
import sys
import config
import common
import shutil
import sppbuild
import do_merge

####################################################
                           # ######本文件用于处理打包脚本###
############################################################
tempName = ""


################################
##配置文件的路径
temPath = "%stemplate"%(config.SPP_HOME)

dataPath = "%s\\data"%(config.SPP_HOME)
libsPath = "%slibs"%(config.SPP_HOME)
pluginsPath = "%s\\plugins"%(config.SPP_HOME)
libzPath = "%slibz-cs.dll"%(config.SPP_HOME)
sppPath = "%sspp.exe"%(config.SPP_HOME)
v8Path = "%sv8.dll"%(config.SPP_HOME)

nsiFile = "%s\\setup\\spp.nsi"%(temPath)
setupInfoPath = "%s\\src\\product\\setupInfo"%(config.PROJECT_HOME)
vcPath = "%s\\setup\\vcredist_x86.exe"%(temPath)
target = "%s\\target"%(config.PROJECT_HOME)

############################################################# HouDongqiang：0705

# 执行nsi脚本生成安装程序
def packDir(templateName):
	publishPath = "%s\\publish"%(config.PROJECT_HOME)
	addPath = "%s\\addition"%(publishPath) #安装包存放路径

	if templateName=="":
		templateName="school"
	if len(sppbuild.mergeList)>1:

		publishPath = "%s%s\\publish"%(sppbuild.pathP1,sppbuild.merName)
		addPath = "%s\\addition"%(publishPath) #安装包存放路径
	vcPath = "%s\\setup\\vcredist_x86.exe"%(temPath)
	target = "%s\\target"%(config.PROJECT_HOME)
	global tempName
	tempName = templateName
	newSppPath = "%s\\%s"%(publishPath, templateName)

	# 创建目录
	if  not os.path.isdir(publishPath):
		print publishPath
		os.makedirs(publishPath)		
	if  not os.path.isdir(addPath):
		os.makedirs(addPath)

	# 把模板pack打包素材拿到target下（因为nsis作为第三方，外路径下项目打包很蹩脚）
	
	os.system("xcopy /E /y /q "+	dataPath+" "+newSppPath+"\\data\\")
	os.system("xcopy /E /y /q "+	pluginsPath+" "+newSppPath+"\\plugins\\")
	os.system("xcopy  /y /q "+sppPath+" "+newSppPath)
	os.system("xcopy  /y /q "+libzPath+" "+newSppPath)
	os.system("xcopy  /y /q "+	v8Path+" "+newSppPath)
	os.system("xcopy  /E /y /q "+setupInfoPath+" "+addPath+"\\setupInfo\\")
	
	#VC环境安装包
	os.system("xcopy  /y /q "+	vcPath+" "+addPath)
	shutil.copyfile(vcPath, addPath+"\\vcredist_x86.exe")	# 使用这种方式复制文件是为避免出现“是文件还是目录”的提示
		
	#拷贝target下的项目
	if len(sppbuild.mergeList) >1:
		pPath =os.path.join(sppbuild.pathP1,sppbuild.merName)
		shutil.copyfile(nsiFile, pPath+"\\"+tempName+".nsi")		# 使用这种方式复制文件是为避免出现“是文件还是目录”的提示

	else:
		shutil.copyfile(nsiFile, publishPath+"\\"+templateName+".nsi")		# 使用这种方式复制文件是为避免出现“是文件还是目录”的提示
		os.system("xcopy  /E/y /q "+target+" "+newSppPath)
	# 删除 publish/[school]/ 目录下的  shadercache  CEGUI.log  build.log 文件
	delFile1 = "%s\\shadercache"%(newSppPath)
	delFile2 = "%s\\CEGUI.log"%(newSppPath)
	delFile3 = "%s\\build.log"%(newSppPath)
	
	if os.path.isdir(delFile1):
		shutil.rmtree(delFile1)
		
	if os.path.isfile(delFile2):
		os.remove(delFile2)
	
	if os.path.isfile(delFile3):
		os.remove(delFile3)
		
	print  sppbuild.setupType
	
	# 刻录版执行入口
	if sppbuild.setupType=="setupBurnGo":
	#
		tmpDir="%stemplate\\school\\python"%(config.SPP_HOME)
		sys.path.append(tmpDir)
		import burnGO
		burnGO.process()

	
	# 使用bat命令 调用nsis自身的编译器编译nsi脚本
def compileNsis():
	global tempName
	publishPath = "%s\\publish"%(config.PROJECT_HOME)
	addPath = "%s\\addition"%(publishPath) #安装包存放路径

	if len(sppbuild.mergeList)>1:	
		publishPath = "%s%s\\publish"%(sppbuild.pathP1,sppbuild.merName)
		addPath = "%s\\addition"%(publishPath) #安装包存放路径
		os.chdir(sppbuild.pathP1+"\\"+sppbuild.merName)
	else:
		os.chdir(publishPath)

	nowPath=os.getcwd()
	changeProName()	
	#编译nsis脚本
	os.system("makensis "+tempName+".nsi")
	#不删除打包脚本，一边手动打包使用
	# os.remove(tempName+".nsi")
	# shutil.rmtree(addPath)
	
#修改安装包的
def changeProName():	
	flag=False
	if sppbuild.setupType=="setupBurnGo":
		flag=True
	# try:
	nsisStr=common.readFile('school.nsi')
	proName=common.readFile(setupInfoPath+'\\setupName.txt')
	merName=sppbuild.mergeList[0].split("_")[0]
	prName=(config.PROJECT_HOME).split("\\")[-1]

	
	#刻录版打包
	if flag:
		prName +="BG" #替换安装包的名字为刻录版 

		#替换nsis代码
		oldString="File /r school\\*"
		bgString=oldString+"\n  File /r web360\\*"  	# 添加压缩360wab     
		executeSpp='ExecShell "" "$INSTDIR\\spp.exe" "start.js --mode=1024x768 "' # 修改执行程序   
		executeHtml='nsExec::Exec "$INSTDIR\\execute.bat" '
		nsisStr=nsisStr.replace(oldString,bgString)
		nsisStr=nsisStr.replace(executeSpp,executeHtml)    
	
	if os.path.isfile(setupInfoPath+'\\setupName.txt'):
		content=nsisStr.replace('n__n',proName)#替换安装包的名字
		content=content.replace('n_n_n',prName)#替换安装完成后的名字，因为spp不能在中文下运行
		
		#合并版打包
		if len(sppbuild.mergeList)>1:
			content=nsisStr.replace('n__n',merName)#替换安装包的名字
			content=content.replace('n_n_n',merName)#替换安装完成后的名字，因为spp不能在中文下运行
			content1=content.split("Section  SecSpp")[0]
			content2=content.split("Section  SecSpp")[1]  #  File addition\vcredist_x86.exe    File /r addition\setupInfo
		
		#添加合并的事宜
			for merge in sppbuild.mergeList:
				content1+="\n Section  project_"+merge
				content1+="\n  SetOutPath \"$INSTDIR\\"+merge+"\""
				content1+="\n  File /r "+merge+"\\*"
				content1+="\n SectionEnd"
				content1+="\n "
				
			content1+="\n Section  SecSpp"
			content=content1+content2
			content=content.replace("addition","publish\\addition")		
			content=content.replace("school","publish\\school")	
			content=content.replace("OutFile \""+merName+".exe\"","OutFile \"publish\\"+merName+".exe\"")	
			content+=do_merge.overrideNsis()
		

		
		f=open('school.nsi','w')
		f.write(content)
		f.close()
	else:
		print common.encodeChinese("找不到文件/src/product/setupInfo/setupName.txt")
	# except:
		# print common.encodeChinese('ERR800')
	

# copy360网站到publish下方便打包
def copy360web(dir):
	print ""
	
