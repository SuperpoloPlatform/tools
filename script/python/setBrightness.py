# -*- coding: utf-8 -*-

import Image
import os
import sys
import ImageEnhance
import argparse

def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('utf-8').encode(type)

parser = argparse.ArgumentParser(description = encodeChinese('进行亮度整理'))
parser.add_argument('--src', action='store', dest='src_image_dir',
                    help = encodeChinese('待处理贴图路径'))
parser.add_argument('--dst', action='store', dest='dst_image_dir',
				          help = encodeChinese('处理后贴图路径'))
parser.add_argument('--brightness', action='store',dest='bright',
                    help = encodeChinese('设定亮度值'))
args = parser.parse_args()
					
# 判断必须给定的参数
if args.src_image_dir is None :
	print encodeChinese('Error : 没有输入待处理贴图路径！\n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()

if args.dst_image_dir is None:
	print encodeChinese('Error: 没有输入处理后贴图路径! \n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()
	
if args.bright is None:
	print encodeChinese('Error: 没有输入亮度值! \n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()
	
rootDir = args.src_image_dir
# targetDir = rootDir.split('src\\')[0]
targetDir = args.dst_image_dir
brightnessValue = args.bright

def changeBrightness(img,brightnessValue):
	brightnessValue = 1 + 0.01 * float(brightnessValue)
	if img.mode == 'RGB':
		enhancer = ImageEnhance.Brightness(img)
		img = enhancer.enhance(brightnessValue)
		return img
	elif img.mode == 'RGBA':
		data = img.getdata()
		enhancer = ImageEnhance.Brightness(img)
		img = enhancer.enhance(brightnessValue)
		newdata = img.getdata()
		truedata = list()
		i = 0
		for item in newdata:
			truedata.append((item[0],item[1],item[2],data[i][3]))
			i += 1
		img.putdata(truedata)
		return img

	
def loop(rootdir):
	for parent,dirnames,filenames in os.walk(rootdir):
		for filename in filenames:
			fName = filename
			filename = parent + os.sep + fName
			try:
				img = Image.open(filename)
			except:
				#print str(filename) + '\t' + encodeChinese('不是贴图')
				continue
			if img.mode.lower() == 'rgb' and fName.find('sky') == -1:
				newimg = changeBrightness(img,brightnessValue)
				try:
					newimg.save(targetDir + os.sep + fName)
					print targetDir + fName
				except:
					os.makedirs(targetDir)
					print 'os.mkdir'
					newimg.save(targetDir + os.sep + fName)
loop(rootDir)
