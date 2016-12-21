# coding=utf-8

import shutil
import config		
import common
import pack
import sppbuild 
import os 


def process(mergeList):
	global desPath
	prName=""
	tag=True
	pathP=sppbuild.pathP1

	#检查合并的项目
	if   checkSourceDir(pathP): #是否存在
		print ""
		print common.encodeChinese("开始复制项目....")
		print ("----------------------------------")
		
		for path in sppbuild.mergeList:
			desPath=pathP
			desPath=os.path.join(pathP,sppbuild.merName)
			srcPath=os.path.join(pathP,path)
			srcPath=("%s\\target")%(srcPath)
			desPath=os.path.join(desPath,path)
			#复制项目
			shutil.copytree
			if  os.path.isdir(desPath):
				shutil.rmtree(desPath)
			copyPro(srcPath,desPath)

			desPath=""
			srcPath=""
		print ""
		print common.encodeChinese("复制完成..")
		
		#处理json文件
		jsonPath="%s\\target\\json\\json_path.js"%(config.PROJECT_HOME)
		print jsonPath
		chaJson(jsonPath)
		print ""
		print common.encodeChinese("json_path.js已经改写................")
		print common.encodeChinese("合并完成----------------------------------")	
		print ("-----------------------------------")
		
	else:
		print ""
		print common.encodeChinese("请检查所需复制项目............")
		print "------------------------------------------"
		os._exit(0)

	
# 检查项目
def checkSourceDir(dir):
	global pName
	pName=""
	flag = True
	for merName in sppbuild.mergeList:
		filePath=os.path.join(dir,merName)
		if not os.path.isdir(filePath):
			flag = False
			print common.encodeChinese(config.ERR501)
			print (" >>>>"+filePath)
			print ''
		elif pName==merName : 
			print ">>需要合并的项目名相同"
			flag=False
		elif not checkTatget(filePath) :
			print ""
			print common.encodeChinese(">>项目没有build... "+filePath)
			print "---------------------------------------------------------------"
			flag=False
		else:
			flag=True
		pName=merName
	return flag

	
#检查文件
def checkTatget(dir):
	tarPath=("%s\\target")%(dir)
	worldPath=("%s\\art\\world.xml")%(tarPath)
	logPath=("%s\\logic")%(tarPath)
	srcPath=("%s\\src")%(dir)
	flag=False
	nowPath=os.getcwd() # 记录当前目录
	
	#target
	if  not os.path.isfile(worldPath): 
		print "------------------------"
		print ("没找到world.xml...............")+worldPath
		print "--------------------------------"
		os.chdir(srcPath) 	 # 切换工作目录
		os.system("sppbuild --publish=school") #进行build
		os.chdir(nowPath)   #切回
		if	os.path.isfile(worldPath): #build
			flag=Ture
	
	elif not os.path.isdir(logPath):
		print ""
		print "-----------------------------------"
		print ("数据尚未build...............")+logPath
		print "--------------------------------"
		os.chdir(srcPath)
		os.system("sppbuild --publish=school --build ")  #全部build
		os.chdir(nowPath)
		if os.path.isdir(logPath):  #build之后重新检查
			flag=True
	else:
		flag=True
	return flag
	
def copyPro(srcPath,desPath):
# 复制到一个总项目目录
	shutil.copytree(srcPath,desPath)

#修改json文件
def chaJson(dir):
	global mergeList
	mergeList=sppbuild.mergeList
	count=0
	strJson=common.readFile(dir)
	strJson=""
	strJson+="JSON_PATH={"
	strJson+="\n\t\"spp_path\":{"
	strJson+="\n\t\t\"0\":{"
	strJson+="\n\t\t\t\"id\": 1,"
	strJson+="\n\t\t\t\"value\": \"@"+config.SPP_HOME+"\""
	strJson+="\n\t\t\t}"
	strJson+="\n\t\t},"
	strJson+="\n\t\"rel_path\":{"

	for merge in mergeList:
		strJson+="\n\t\t\""+str(count)+"\":{"
		strJson+="\n\t\t\t\"id\":  "+str(count+1)+","
		strJson+="\n\t\t\t\"value\": \""+merge+"\\\""
		
		if count != len(mergeList)-1:
			strJson+="\n\t\t\t},"
		else:
			strJson+="\n\t\t\t}"
		count+=1
	
	strJson+="\n\t\t}"
	strJson+="\n\t}"
	strJson=strJson.replace("\\","\\\\")
	strJson= common.encodeChinese(strJson)
	common.writeNewFile(dir,strJson)
	print " "
	

#修改json脚本
def overrideNsis():
	nsisString=""
	mergeList=sppbuild.mergeList
	count=0
	
	for merge in mergeList:
		dataDir =""
		nsisString+="\nSection"
		nsisString+=" \n  ${LineFind} \"$INSTDIR\\"+merge+"\\json\\json_path.js\" \"$INSTDIR\\"+merge+"\\json\\json_path.js\" \"1:-1\" \"Config\""
		nsisString+=" \nSectionEnd"
		nsisString+="\n"
		
	nsisString+=" \nFunction Config"
	nsisString+=" \n  ${WordReplace} \"$INSTDIR\" \"\\\" \"\\\\\" \"+\" $R0"
	nsisString+="\n  ${WordReplace} $R9 \"@"+config.SPP_HOME.split("\\","\\\\")+"\" \"@$R0\\\spp\" \"+*\" $R9"
	nsisString+="\n  Push $0"
	nsisString+="\nFunctionEnd"
	
	return nsisString