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

import os, sys
import numpy
import Image

import argparse # 处理参数使用
import common	# 一些通用的函数

import argparse

def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('utf-8').encode(type)

parser = argparse.ArgumentParser(description=common.encodeChinese('检测给定的文件夹中的png图片是否包含alpha通道'))
parser.add_argument('--dir', action='store', dest='image_dir',
                    help=common.encodeChinese('保存图片的路径'))
parser.add_argument('--log', action='store', dest='log_filename',
                    help=common.encodeChinese('输出错误日志'))
parser.add_argument('--version', action='version', version='%(prog)s 1.0')
args = parser.parse_args()

# 判断必须给定的参数
if args.image_dir is None :
	print common.encodeChinese('没有输入保存图片文件的文件夹')
	sys.exit()
if args.log_filename is None :
	print common.encodeChinese('没有输入保存错误信息的日志文件名称')
	sys.exit()

f=open(args.log_filename, "w");
rootdir = args.image_dir
for parent,dirnames,filenames in os.walk(rootdir):
	for filename in filenames:
		filename=parent + os.sep + filename
		try:
			img=Image.open(filename)
		except:
			print str(filename) + '\t' + encodeChinese("这个文件不是贴图,无法打开")
			f.write(str(filename) + '\t' + encodeChinese("这个文件不是贴图,无法打开"))
			f.write('\n')
			continue
		if img.mode=='RGBA':
			img.load()
			r,g,b,alpha = img.split()
			arr=numpy.asarray(alpha)
			count = 0;
			print str(img.size)
			print str(filename)
			try:
				for i in range(0,img.size[0]-1):
					for j in range(0,img.size[1]-1):
					#print str(i) + " | " + str(j)
						if arr[j][i]<127:
							count += 1
			except:
				print str(filename)+ '\t' + encodeChinese("for循环出现问题,并未计算其透明通道")
				continue
			if(count < 10):
				notAlphafile = str(filename) + '\t' + encodeChinese("这个贴图文件的透明通道,透明的太少,不符合标准")
				f.write(notAlphafile+'\n');
			else:
				print filename + " is ok! "  + str(count)

            
f.close();
