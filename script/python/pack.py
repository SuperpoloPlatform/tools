# coding=utf-8
import os
import sys
import config
import common
import shutil
import sppbuild
import do_merge

####################################################
                           # ######���ļ����ڴ������ű�###
############################################################
tempName = ""


################################
##�����ļ���·��
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

############################################################# HouDongqiang��0705

# ִ��nsi�ű����ɰ�װ����
def packDir(templateName):
	publishPath = "%s\\publish"%(config.PROJECT_HOME)
	addPath = "%s\\addition"%(publishPath) #��װ�����·��

	if templateName=="":
		templateName="school"
	if len(sppbuild.mergeList)>1:

		publishPath = "%s%s\\publish"%(sppbuild.pathP1,sppbuild.merName)
		addPath = "%s\\addition"%(publishPath) #��װ�����·��
	vcPath = "%s\\setup\\vcredist_x86.exe"%(temPath)
	target = "%s\\target"%(config.PROJECT_HOME)
	global tempName
	tempName = templateName
	newSppPath = "%s\\%s"%(publishPath, templateName)

	# ����Ŀ¼
	if  not os.path.isdir(publishPath):
		print publishPath
		os.makedirs(publishPath)		
	if  not os.path.isdir(addPath):
		os.makedirs(addPath)

	# ��ģ��pack����ز��õ�target�£���Ϊnsis��Ϊ����������·������Ŀ��������ţ�
	
	os.system("xcopy /E /y /q "+	dataPath+" "+newSppPath+"\\data\\")
	os.system("xcopy /E /y /q "+	pluginsPath+" "+newSppPath+"\\plugins\\")
	os.system("xcopy  /y /q "+sppPath+" "+newSppPath)
	os.system("xcopy  /y /q "+libzPath+" "+newSppPath)
	os.system("xcopy  /y /q "+	v8Path+" "+newSppPath)
	os.system("xcopy  /E /y /q "+setupInfoPath+" "+addPath+"\\setupInfo\\")
	
	#VC������װ��
	os.system("xcopy  /y /q "+	vcPath+" "+addPath)
	shutil.copyfile(vcPath, addPath+"\\vcredist_x86.exe")	# ʹ�����ַ�ʽ�����ļ���Ϊ������֡����ļ�����Ŀ¼������ʾ
		
	#����target�µ���Ŀ
	if len(sppbuild.mergeList) >1:
		pPath =os.path.join(sppbuild.pathP1,sppbuild.merName)
		shutil.copyfile(nsiFile, pPath+"\\"+tempName+".nsi")		# ʹ�����ַ�ʽ�����ļ���Ϊ������֡����ļ�����Ŀ¼������ʾ

	else:
		shutil.copyfile(nsiFile, publishPath+"\\"+templateName+".nsi")		# ʹ�����ַ�ʽ�����ļ���Ϊ������֡����ļ�����Ŀ¼������ʾ
		os.system("xcopy  /E/y /q "+target+" "+newSppPath)
	# ɾ�� publish/[school]/ Ŀ¼�µ�  shadercache  CEGUI.log  build.log �ļ�
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
	
	# ��¼��ִ�����
	if sppbuild.setupType=="setupBurnGo":
	#
		tmpDir="%stemplate\\school\\python"%(config.SPP_HOME)
		sys.path.append(tmpDir)
		import burnGO
		burnGO.process()

	
	# ʹ��bat���� ����nsis����ı���������nsi�ű�
def compileNsis():
	global tempName
	publishPath = "%s\\publish"%(config.PROJECT_HOME)
	addPath = "%s\\addition"%(publishPath) #��װ�����·��

	if len(sppbuild.mergeList)>1:	
		publishPath = "%s%s\\publish"%(sppbuild.pathP1,sppbuild.merName)
		addPath = "%s\\addition"%(publishPath) #��װ�����·��
		os.chdir(sppbuild.pathP1+"\\"+sppbuild.merName)
	else:
		os.chdir(publishPath)

	nowPath=os.getcwd()
	changeProName()	
	#����nsis�ű�
	os.system("makensis "+tempName+".nsi")
	#��ɾ������ű���һ���ֶ����ʹ��
	# os.remove(tempName+".nsi")
	# shutil.rmtree(addPath)
	
#�޸İ�װ����
def changeProName():	
	flag=False
	if sppbuild.setupType=="setupBurnGo":
		flag=True
	# try:
	nsisStr=common.readFile('school.nsi')
	proName=common.readFile(setupInfoPath+'\\setupName.txt')
	merName=sppbuild.mergeList[0].split("_")[0]
	prName=(config.PROJECT_HOME).split("\\")[-1]

	
	#��¼����
	if flag:
		prName +="BG" #�滻��װ��������Ϊ��¼�� 

		#�滻nsis����
		oldString="File /r school\\*"
		bgString=oldString+"\n  File /r web360\\*"  	# ���ѹ��360wab     
		executeSpp='ExecShell "" "$INSTDIR\\spp.exe" "start.js --mode=1024x768 "' # �޸�ִ�г���   
		executeHtml='nsExec::Exec "$INSTDIR\\execute.bat" '
		nsisStr=nsisStr.replace(oldString,bgString)
		nsisStr=nsisStr.replace(executeSpp,executeHtml)    
	
	if os.path.isfile(setupInfoPath+'\\setupName.txt'):
		content=nsisStr.replace('n__n',proName)#�滻��װ��������
		content=content.replace('n_n_n',prName)#�滻��װ��ɺ�����֣���Ϊspp����������������
		
		#�ϲ�����
		if len(sppbuild.mergeList)>1:
			content=nsisStr.replace('n__n',merName)#�滻��װ��������
			content=content.replace('n_n_n',merName)#�滻��װ��ɺ�����֣���Ϊspp����������������
			content1=content.split("Section  SecSpp")[0]
			content2=content.split("Section  SecSpp")[1]  #  File addition\vcredist_x86.exe    File /r addition\setupInfo
		
		#��Ӻϲ�������
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
		print common.encodeChinese("�Ҳ����ļ�/src/product/setupInfo/setupName.txt")
	# except:
		# print common.encodeChinese('ERR800')
	

# copy360��վ��publish�·�����
def copy360web(dir):
	print ""
	
