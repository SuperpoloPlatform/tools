# -*- coding: utf-8 -*-
import sys,os
import Image
import numpy
import colorsys

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
#R,G,B三个颜色分量值
# redValue = 0
# greenValue = 0
# buleValue = 0
#R,G,B三个颜色分量的平均值
# redReset = 0 
# greenReset = 0
# buleReset = 0

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
		print filename
		try:
			img.load()
		except:
			continue;
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
					# redValue += redArr[j][i]
					# greenValue += greenArr[j][i]
					# buleValue += buleArr[j][i]
					# redValue += item[0]
					# buleValue += item[2]
					brightValue += item[1]
					pix += 1
				if img.mode == 'RGBA':
					if alphaArr[j][i] < 128:
						continue
					else:
						item = colorsys.rgb_to_hls(redArr[j][i]/255.0,greenArr[j][i]/255.0,buleArr[j][i]/255.0)
						# redValue += redArr[j][i]
						# greenValue += greenArr[j][i]
						# buleValue += buleArr[j][i]
						# redValue += item[0]
						# buleValue += item[2]
						brightValue += item[1]
						pix += 1
print encodeChinese("计算出亮度分量总数为: ") + str(brightValue)
print encodeChinese("计算出像素总数为: ") + str(pix)
try:
	reset = brightValue/pix
	# redReset = redValue/pix
	# greenReset = greenValue/pix
	# buleReset = buleValue/pix
except:
	print encodeChinese("pix = 0");
print encodeChinese("计算出平均亮度: ") + str(reset)
# print encodeChinese("计算出平均red: ") + str(redReset)
# print encodeChinese("计算出平均green: ") + str(greenReset)
# print encodeChinese("计算出平均bule: ") + str(buleReset)

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
		array = numpy.array(img)
		for i in range(0,img.size[0]-1):
			for j in range(0,img.size[1]-1):
				if img.mode == 'RGB':
					#item = colorsys.rgb_to_hls(array[j][i][0]/255.0,array[j][i][1]/255.0,array[j][i][2]/255.0)
					#下面这句是得到RGB三个颜色分量的平均值设置的:
					#item = colorsys.rgb_to_hls(redReset/255.0,greenReset/255.0,buleReset/255.0)
					#下面这句是的到色调和饱和度的平均值设置的:
					item = colorsys.rgb_to_hls(1,1,1)#array[j][i][0]/255.0,array[j][i][1]/255.0,array[j][i][2]/255.0)
					newitem = colorsys.hls_to_rgb(item[0],reset,item[2])
					array[j][i][0] = round(newitem[0]*255)
					array[j][i][1] = round(newitem[1]*255)
					array[j][i][2] = round(newitem[2]*255)
				elif img.mode == 'RGBA':
					item = colorsys.rgb_to_hls(1,1,1)
					newitem = colorsys.hls_to_rgb(item[0],reset,item[2])
					array[j][i][0] = round(newitem[0]*255)
					array[j][i][1] = round(newitem[1]*255)
					array[j][i][2] = round(newitem[2]*255)
					array[j][i][3] = 255
					# if array[j][i][3] < 128:
						# array[j][i][3] = 255#round((array[j][i][0] + array[j][i][1] + array[j][i][2])/3)
					# else:
						# array[j][i][3] = 255
						# continue
					# print array[j][i][3]
		img = Image.fromarray(array)
		print encodeChinese('保存路径:') + str(overdir + os.sep + fName)
		img.save(overdir + os.sep + fName)
