# -*- coding: utf-8 -*-
import sys,os
import Image
import numpy
import colorsys
import ImageEnhance
checkdir = r'c:\users\mingl_wang\desktop\lightmaps'
dodir = r'c:\users\mingl_wang\desktop\test2'
overdir = r'c:\users\mingl_wang\desktop\test1'

def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('UTF-8').encode(type)

#总像素数
pix = 0
#亮度分量总数
brightValue = 0
#亮度平均数
reset = 0

for parent,dirnames,filenames in os.walk(checkdir):
	for filename in filenames:
		#保存当前文件名
		fName = filename
		#获取当前全路径
		filename = checkdir + os.sep + filename
		#尝试打开文件夹当中的图片
		try:
			img = Image.open(filename)
		except:
			print encodeChinese('打开checkdir中文件出现问题,这个图像的名字是: ') + str(filename)
		#在尝试将颜色通道转换成数组的时候,需要加载当前图像句柄
		img.load()
		if img.mode == 'RGB':
			red,green,bule = img.split()
		elif img.mode == 'RGBA':
			red,green,bule,alpha = img.split()
			alphaArr = numpy.asarray(alpha)
		redArr = numpy.asarray(red)
		greenArr = numpy.asarray(green)
		buleArr = numpy.asarray(bule)
		for i in (0,img.size[0]-1):
			for j in (0,img.size[1]-1):
				if img.mode == 'RGB':
					item = colorsys.rgb_to_hls(redArr[j][i]/255.0,greenArr[j][i]/255.0,buleArr[j][i]/255.0)
					brightValue += item[1]
					pix += 1
				if img.mode == 'RGBA':
					if alphaArr[j][i] < 128:
						continue
					else:
						item = colorsys.rgb_to_hls(redArr[j][i]/255.0,greenArr[j][i]/255.0,buleArr[j][i]/255.0)
						brightValue += item[1]
						pix += 1
print encodeChinese("计算出亮度分量总数为: ") + str(brightValue)
print encodeChinese("计算出像素总数为: ") + str(pix)
reset = brightValue/pix
print encodeChinese("计算出平均亮度: ") + str(reset)

for parent,dirnames,filenames in os.walk(dodir):
	for filename in filenames:
		#保存当前文件名
		fName = filename
		#得到当前文件全路径
		filename = dodir + os.sep + fName
		print encodeChinese('待处理文件路径: ') + str(filename)
		#打开当前图片文件
		try:
			img = Image.open(filename)
		except:
			encodeChinese('打开处理文件时出错,这个文件的名字是: ') + str(filename)
		img.load()
		enhancer = ImageEnhance.Brightness(img)
		img = enhancer.enhance(reset*2)
		print encodeChinese('保存路径:') + str(overdir + os.sep + fName)
		img.save(overdir + os.sep + fName)