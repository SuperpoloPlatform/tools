# -*- coding: utf-8 -*-
import os,sys,Image

rootDir = r'c:\images'
targetDir = r'c:\imagesover'
logFileDir = r'c:\errFile.txt'

def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('UTF-8').encode(type)

errFile = open(logFileDir,'w')

for parent,dirnames,filenames in os.walk(rootDir):
	for filename in filenames:
		fName = filename
		filename = rootDir + os.sep + filename
		fPostfix = os.path.splitext(filename)[1]
		if(fPostfix == '.jpg' or fPostfix == '.png'):
			try:
				img = Image.open(filename)
			except:
				print encodeChinese('打开图片文件出错,请检查该文件: ') + str(filename)
				errFile.write(filename + '\n')
				errFile.write(encodeChinese('上面这个文件打开图片文件时出错,请检查该文件'))
				errFile.write('\n')
				continue
			fSize = img.size
			if(( fSize[0]%2 == 0) and (fSize[1]%2 == 0) and ( fSize[0] == fSize[1]) and (fSize[0] >= 64) and (fSize[0] <=1024)):
				print str(filename) + ' is ok' + '\n'
			else:
				errFile.write(filename + '\n')
				errFile.write(encodeChinese('上面图片的分辨率不符合要求,它的分辨率是: ') + str(fSize))
				errFile.write('\n')
				errFile.write('\n')
		else:
			errFile.write(filename + '\n')
			errFile.write(encodeChinese('上面这个文件不是图片,请检查....') + '\n')
			errFile.write('\n')
errFile.close()