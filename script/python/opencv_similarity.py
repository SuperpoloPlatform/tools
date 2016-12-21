#!/usr/bin/python
# -*- coding: utf-8 -*-

import cv2.cv as cv
import os
import sys
import Image
import argparse
import time

def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('UTF-8').encode(type)

parser = argparse.ArgumentParser(description = encodeChinese('进行贴图相似度判断'))
parser.add_argument('--src', action='store', dest='src_image_dir',
                    help = encodeChinese('需要进行相似度判断的贴图路径'))
parser.add_argument('--log', action='store', dest='log_dir',
                    help = encodeChinese('相似度日志的路径'))
parser.add_argument('--value',action='store',dest='similarity_value',
					help = encodeChinese('相似度数值'))
args = parser.parse_args()
					
# 判断必须给定的参数
if args.src_image_dir is None :
	print encodeChinese('Error : 没有输入需要进行相似度判断的贴图路径！\n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()
if args.log_dir is None :
	print encodeChinese('Error : 没有输入相似度日志的路径！\n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()
if args.similarity_value is None:
	print encodeChinese('Error : 没有输入相似度数值! \n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()

rootdir = args.src_image_dir
logdir = args.log_dir	
thresholdValue = args.similarity_value

fd = open(logdir,'w')
	
def createHist(img):
    b_plane = cv.CreateImage((img.width,img.height), 8, 1)
    g_plane = cv.CreateImage((img.width,img.height), 8, 1)
    r_plane = cv.CreateImage((img.width,img.height), 8, 1)


    cv.Split(img,b_plane,g_plane,r_plane,None)
    planes = [b_plane, g_plane, r_plane]
    
    bins = 4
    b_bins = bins
    r_bins = bins
    g_bins = bins

    hist_size = [b_bins,g_bins,r_bins]
    b_range = [0,255]
    g_range = [0,255]
    r_range = [0,255]

    ranges = [b_range,g_range,r_range]
    hist = cv.CreateHist(hist_size, cv.CV_HIST_ARRAY, ranges, 1)
    cv.CalcHist([cv.GetImage(i) for i in planes], hist)
    cv.NormalizeHist(hist,1)
    return hist

fileArr = list()
logList = list()

for parent,dirnames,filenames in os.walk(rootdir):
	for filename in filenames:
		fName = filename
		filename = parent + os.sep + fName
		fPath=os.path.splitext(filename)[1]
		if fPath.lower() == '.jpg' or fPath.lower() == '.png':
			fileArr.append(filename)

beginTime = time.strftime('%Y-%m-%d-%H-%M-%S',time.localtime(time.time()))

for i in xrange(1,len(fileArr)):
	try:
		print encodeChinese('当前循环比较的文件是: ') + str(fileArr[i-1])
		imgOne = cv.LoadImage(fileArr[i-1])
		histOne = createHist(imgOne)
	except:
		i += 1
	for j in xrange(i-1,len(fileArr)):
		if j == (i-1):
			continue
		else:
			try:
				imgTwo = cv.LoadImage(fileArr[j])
				histTwo = createHist(imgTwo)
			except:
				continue
			similarityValue = 100 - int(cv.CompareHist(histOne,histTwo,cv.CV_COMP_BHATTACHARYYA) * 100)
			if similarityValue > int(thresholdValue):
				fd.write(fileArr[i-1] + '\n')
				fd.write(fileArr[j] + '\n')
				fd.write(encodeChinese('它们的相似度很高，建议优化成一张贴图') + '\n')
				fd.write('\n')
			elif int(similarityValue) == int(100):
				fd.write(fileArr[i-1] + '\n')
				fd.write(fileArr[j] + '\n')
				fd.write(encodeChinese('它们的相似度很高，建议优化成一张贴图') + '\n')
				fd.write('\n')
	print time.strftime('%Y-%m-%d-%H-%M-%S',time.localtime(time.time()))
fd.close()

endTime = time.strftime('%Y-%m-%d-%H-%M-%S',time.localtime(time.time()))

print encodeChinese('程序开始的时间是: ') + str(beginTime)
print encodeChinese('程序结束的时间是: ') + str(endTime)
