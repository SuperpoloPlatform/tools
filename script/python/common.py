# coding=utf-8
import os
import sys ,  codecs
import config
from xml.dom.minidom import parse


#################################################
# 将 ansi 格式的xml文件转换为 utf8 格式的
def ansixml2utf8xml(filepath):
	for i in [1]:
		# 判断文件是否存在
		if not os.path.isfile(filepath):
			break
			
		# 判断文件非空
		f = os.stat(filepath)	# 获取文件属性
		if f.st_size==0:	# 判断文件非空
			break
			
		# 读取文件中的数据
		f = open(filepath, "r")
		content = f.read() 
		f.close()	
		
		# 开始转换编码
		content = content.decode("gbk").encode("utf8")
		f = codecs.open(filepath, "w")	#,"utf-8"
		f.write(content)
		f.close()

#################################################
#  处理中文乱码
def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('UTF-8').encode(type)
	
#################################################
#  读取xml文件返回一个 document
def openXml(filepath):
	if os.path.isfile(filepath):
		return parse( filepath )
	else:
		print encodeChinese("找不到文件 %s"%(filepath))
		return False
		

def fileExist(filepath):
	if not os.path.isfile(filepath):
		print encodeChinese("\n###错误###  找不到 %s is not found  文件 ! "%(filepath))
		print encodeChinese("这个错误将导致程序无法继续执行...")
		pause()
		os._exit(1)

#
# 读文件
#
def readFile(filepath):
	content = ""
	f = os.stat(filepath)	# 获取文件属性
	if f.st_size>0:	# 判断文件非空
		f = open(filepath, "r")
		content = f.read() 
		# content=content.replace("&","a_a")
		f.close()
	return content

	# 读取文件每一行的内容
def readEachLine(filepath):
	content = ""
	f = open(filepath, "r")
	content = f.readlines()
	# for con in content:
		
		# con=con.replace("&","a_a")

	f.close()
	return content
	
# 读取文件第一行的内容
def readFileFirstLine(filepath):
	content = ""
	f = os.stat(filepath)	# 获取文件属性
	if f.st_size>0:	# 判断文件非空
		f = open(filepath, "r")
		content = f.readline()
		# content=content.replace("&","a_a")
		f.close()
	return content.replace("\n","").replace(" ","")

# 读取文件内容并排除第一行
def readFileExceptFirst(filepath):
	content = ""
	f = os.stat(filepath)	# 获取文件属性
	if f.st_size>0:	# 判断文件非空
		fileHandle = open ( filepath, 'r' )  
		fileList = fileHandle.readlines()
		fileList[0] = ""
		for fileLine in fileList:  
			content += "//n" + fileLine
		fileHandle.close()
	return content
	
# 读取文件内容并排除第一行
def readFileLines(filepath):
	content = ""
	f = os.stat(filepath)	# 获取文件属性
	if f.st_size>0:	# 判断文件非空
		fileHandle = open ( filepath, 'r' )  
		fileList = fileHandle.readlines()
		for fileLine in fileList:  
			content += "//n" + fileLine 	# 这里使用 //n 代表 \n ，在 xml2json 的后会替换；直接使用\n的话，在xml2json的之前会丢失。
			# content=content.replace("&","a_a")
		fileHandle.close()
	return content

	
##
# @brief 将string写入文件，如果文件不存在创建之。以append形式。
##
def writeToFile(filepath, content):
	# content=content.replace("a_a","&")
	f = open(filepath, "a")
	f.write(content + "\n")
	
	f.close()
	
def writeNewFile(filepath, content):
	# content=content.replace("a_a","&")
	f = codecs.open(filepath, "w")	#,"utf-8"
	f.write(content)
	f.close()

##
# @brief 让python暂停一下
##
def pause() :
	if not config.AUTOTEST:
		os.system("pause>nul")
	# 除了调用cmd来暂停，python也提供这样的“暂停”方式。
	#raw_input("Press ENTER to continue")>>>>>>> .r3643

##
# @brief 获取扩展名
# 扩展名应该全小写字母。
##
def getFilenameExt(filename) :
	return os.path.splitext(filename)[1].lower()

##
# @brief 记录日志
##
def console_log(str) :
	writeToFile(config.BUILD_LOG, str)
def console_error(str) :
	writeToFile(config.ERROR_LOG, str)
	

# 替换"&"