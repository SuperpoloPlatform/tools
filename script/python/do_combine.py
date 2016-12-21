# coding=utf-8
import shutil
import config		
import common
import pack
import sppbuild 
import os, zipfile
import config 
from os.path import join

##############################################
##########本模块用于对360网站和3Ｄ客户端合并打包，最终将安装包和网站压缩为ｚｉｐ包
##############################################

flag=False               #boolean标示
realPath= os.path.split(config.PROJECT_HOME)[0] #截取出项目名的绝对路径


def process(combineName):
	
	print ""
	print common.encodeChinese("开始检查3D客户点和360网站....")
	dir=join(realPath,combineName)
	setupFile="%s\\publish\\%s.exe"%(dir,os.path.split(dir)[1])
	web360dir="%s\\web360\\"%(dir)
	
	if os.path.isdir(join(realPath,combineName)):
		if  isSetup(dir)and isWeb360(dir):
			print common.encodeChinese("检查完毕可以进行3+2............")
			print""
			
			##将360网站和setup.exe压缩 这里需要写一个压缩方法，可以直接使用python的zipFIle函数
			## 打包之前先将setup.exe拷贝到web360包里
			shutil.copyfile(setupFile,web360dir+combineName+".exe")
			zipfolder("web360",combineName+".zip")
			
			# 最后将zip拷贝会publish下
			shutil.copyfile(combineName+".zip",join(dir,"publish\\")+combineName+".zip")
			os.remove(combineName+".zip")
			print""
			print common.encodeChinese(".........客户端和web360网站合并完成")
		else:
			print common.encodeChinese("error！请检查本项目3D安装包或者360网站已完成！")
		
	else:
		print common.encodeChinese(config.ERR501)
	 
	# 检查该项目是否已经存在
	# 检查项目是否已经build
	# 检查项目是否打包
	# 检查web360网站是否存在


#检查是否build	
def isBuild(dir):
	flag=False
	target="%s\\target\\"%(dir)
	runFile="%srun.bat"%(target)
	if os.path.isfile(runFile):
		flag=True
	else:
		print common.encodeChinese("该项目还没有build")
		flag=False
	return flag
	
#检查是否已经生成安装包
def isSetup(dir):
	flag=False
	setupFile="%s\\publish\\%s.exe"%(dir,os.path.split(dir)[1])
	print setupFile
	if os.path.isfile(setupFile):
		flag=True
	else:
		print common.encodeChinese("该项目的3D客户端还没有生成安装包")
		flag=False

	return flag
	
#检查是否build360web
def isWeb360(dir):
	web360dir="%s\\web360\\"%(dir)
	htmlFile="%s\\index.html"%(web360dir)
	flag=False

	if os.path.isfile(htmlFile):
		flag=True
	else:
		print common.encodeChinese("该项目的360网站还没有build")
		flag=False
		
	return flag


#压缩为zip的方法
def zipfolder(foldername, filename, includeEmptyDIr=True): 
    empty_dirs = []
    zip = zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED)
    for root, dirs, files in os.walk(foldername):
        empty_dirs.extend([dir for dir in dirs if os.listdir(join(root, dir)) == []])
        for name in files:
            zip.write(join(root ,name))
        if includeEmptyDIr:
            for dir in empty_dirs:
                zif = zipfile.ZipInfo(join(root, dir) + "/")
                zip.writestr(zif, "")
        empty_dirs = []
    zip.close()	