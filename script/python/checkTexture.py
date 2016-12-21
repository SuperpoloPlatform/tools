#!/usr/bin/python
# -*- coding: utf-8 -*-

#*************************************************************************
#
#  This file is part of the UGE(Uniform Game Engine).
#  Copyright (C) by SanPolo Co.Ltd. 
#  All rights reserved.
#
#  See http://uge.spolo.org/ for more information.
#
#  SanPolo Co.Ltd
#  http://uge.spolo.org/  sales@spolo.org uge-support@spolo.org
#
#************************************************************************

import Image
import os,sys
import argparse

def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('utf-8').encode(type)
	
image_path='保存图片的路径'
log_path='输出错误日志'
help_image_path=encodeChinese(image_path)
help_log_path=encodeChinese(log_path)
help_path=encodeChinese('检测给定的文件夹中的文件是否符合要求(格式,大小,分辨率)')

parser = argparse.ArgumentParser(description=encodeChinese('检测给定的文件夹中的文件是否符合要求(格式,大小,分辨率)'))
parser.add_argument('--dir', action='store', dest='image_dir',
                    help=help_image_path) #common.encodeChinese(help_log_path))
parser.add_argument('--log', action='store', dest='log_filename',
                    help=help_log_path) #common.encodeChinese(help_log_path))
parser.add_argument('--version', action='version', version='%(prog)s 1.0')
args = parser.parse_args()

err_image_dir=encodeChinese('没有输入保存图片文件的文件夹')
err_log_dir=encodeChinese('没有输入保存错误信息的日志文件名称')
                    
# 判断必须给定的参数
if args.image_dir is None :
	print err_image_dir#common.encodeChinese('没有输入保存图片文件的文件夹')
	sys.exit()
if args.log_filename is None :
	print err_log_dir #common.encodeChinese('没有输入保存错误信息的日志文件名称')
	sys.exit()

rootdir=args.image_dir
errPath=args.log_filename
#错误文件
errFile=open(errPath,'w')

def judgeImageType(filename):
	img = Image.open(filename)
	fPostfix = os.path.splitext(filename)[1]
	if((fPostfix == '.png' or fPostfix == '.jpg' or fPostfix == '.PNG' or fPostfix == '.JPG')
	and (img.mode == 'RGB' or img.mode == 'RGBA')):
		return True
	else:
		print str(filename) + '\t' + encodeChinese('文件不是图片')
		return False

def judgeImageSize(img):
	width,height = img.size
	if width > height:
		max = width
	else:
		max = height
	if max > 512:
		# print str(filename) + '\t' + encodeChinese('文件尺寸超过512')
		return False
	else:
		# print str(filename) + '\t' + encodeChinese('文件尺寸不超过512')
		return True
		
def judgeImageScale(img):
	width,height = img.size
	if(width % 2 == 0 and height % 2 == 0):
		# print str(filename
		return True
	else:
		return False

def judgeImageByte(filename):
	f = open(filename,'rb')
	f.seek(0,2)
	fSize = f.tell()
	standard = 1024
	if(fSize / standard > standard):
		return False
	else:
		return True

def main():
	for parent,dirnames,filenames in os.walk(rootdir):
		print 'ok'
		for filename in filenames:
			fName = filename 
			filename = parent + os.sep + fName
			try:
				img = Image.open(filename)
			except:
				print str(filename) + '\t' + encodeChinese('这个文件打开错误,不是贴图')
				errFile.write(str(filename) + '\t' + encodeChinese('这个文件打开错误,不是贴图') + '\n')
				continue
			if(judgeImageType(filename)):
				print str(filename) + '\t' + encodeChinese('这个文件类型正确')
				if(judgeImageSize(img)):
					print str(filename) + '\t' + encodeChinese('这个文件的尺寸小于512')
					if(judgeImageScale(img)):
						str(filename) + '\t' + encodeChinese('这个文件的尺寸是2的倍数')
						if(judgeImageByte(filename)):
							print str(filename) + '\t' + encodeChinese('这个文件不超过1M')
						else:
							print str(filename) + '\t' + encodeChinese('这个文件超过1M')
							errFile.write(str(filename) + '\t' + encodeChinese('这个文件超过1M'))
							errFile.write('\n')
							continue
					else:
						str(filename) + '\t' + encodeChinese('这个文件的尺寸不是2的倍数')
						errFile.write(str(filename) + '\t' + encodeChinese('这个文件的尺寸不是2的倍数'))
						errFile.write('\n')
						continue
				else:
					print str(filename) + '\t' + encodeChinese('这个文件的尺寸大于512')
					errFile.write(str(filename) + '\t' + encodeChinese('这个文件的尺寸大于512'))
					errFile.write('\n')
					continue
			else:
				print str(filename) + '\t' + encodeChinese('这个文件类型不正确')
				errFile.write(str(filename) + '\t' + encodeChinese('这个文件类型不正确') + '\n')
				continue

main()
errFile.close()				