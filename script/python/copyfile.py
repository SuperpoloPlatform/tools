# coding=utf-8
import os
import sys
import shutil 
from os.path import join

import config
import common

def createProject(pname):
	# 选择模板
	templateName = "school"

	# 保存当前所在目录
	curDir = os.getcwd()
	# 在 SPP_HOME 下创建一个临时目录
	tempDir = "%stest\\"%(config.SPP_HOME)
	# print tempDir
	
	if not os.path.isdir(tempDir):
		os.mkdir(tempDir)
		
	# 切换到临时目录
	os.chdir(tempDir)
	
	res = os.system('svn log http://192.168.2.10/svn/t/'+pname+'>svn.log')
	if res==1:
		print ''
		print common.encodeChinese('忽略这个错误，程序正常执行....')
		print ''
		print '-------------------------------'
		print common.encodeChinese('正在创建项目...')
		# 将svn 中的 src 标准模板导出
		os.system('svn export http://192.168.1.7/svn/project/template/trunk/'+templateName+'/src_template  '+pname)
		msg = "新建项目 "+pname
		os.system('svn import -m "'+msg+'" '+pname+' http://192.168.2.10/svn/t/'+pname)
		# 先切换到之前的目录
		os.chdir(curDir)
		# 再检出项目
		os.system('svn checkout  http://192.168.2.10/svn/t/'+pname+' '+pname)
		print ''
		print '-------------------------------'
		print os.getcwd()
		print common.encodeChinese('<<< 项目已经检出到当前目录中。')
	else:
		print ''
		print ''
		print 'ERROR:'
		print common.encodeChinese('你要创建的目录SVN上已经存在了！')
		print ''
		print ''
		print ''
	
	if os.path.isdir(tempDir):
		os.chdir(config.SPP_HOME)
		shutil.rmtree(tempDir)
		
	os.chdir(curDir)
		
	common.pause()
		

