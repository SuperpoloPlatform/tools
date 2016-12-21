# coding=utf-8
import os
import sys
import config
import common
import shutil 

# 该函数完成清空 target 目录操作
def freeTarget():
	print common.encodeChinese("清空 target 目录 ...")
	targetPath = '%s%s' % ( config.PROJECT_HOME, '\\target')
	# 判断 target 目录是否存在，如果存在则删除
	if os.path.isdir( targetPath ):
		try:
			shutil.rmtree( targetPath )
			print common.encodeChinese("> 完成!")
			print '-------------------------------'
			print ''
		except Exception as inst :
			print common.encodeChinese(config.ERR600)
			if not config.AUTOTEST:
				common.pause()
			os._exit(0)