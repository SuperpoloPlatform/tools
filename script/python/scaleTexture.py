# -*- coding: utf-8 -*-

import os,sys,Image
import argparse # 处理参数使用

def encodeChinese(msg):
	type = sys.getfilesystemencoding()
	return msg.decode('UTF-8').encode(type)


print ('#########################') + encodeChinese('文件调用方法') + str('#########################')
print encodeChinese('scaleTexture --src 待处理贴图路径 --dst 处理完的贴图的输出路径')
print ('##############################################################')

# 命令行参数,用于传进贴图地址和处理后贴图保存地址
parser = argparse.ArgumentParser(description = encodeChinese('对lightmap进行ResetBrightness'))
parser.add_argument('--src', action='store', dest='src_image_dir',
                    help = encodeChinese('待处理贴图路径'))
parser.add_argument('--dst', action='store', dest='dst_image_dir',
                    help = encodeChinese('处理完的贴图的输出路径'))
args = parser.parse_args()
					
# 判断必须给定的参数
if args.src_image_dir is None :
	print encodeChinese('Error : 没有输入待处理贴图路径！\n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()
if args.dst_image_dir is None :
	print encodeChinese('Error : 没有输入处理完的贴图的输出路径！\n<按任意键退出>')
	os.system('pause>nul')
	sys.exit()

rootDir = args.src_image_dir
targetDir = args.dst_image_dir
errFile = open(r'c:\errFile.txt','w')

def judgeSize(im):
	#判断图片分辨率,如果最大边超过1024返回False,如果不超过返回True
	sizeOne = im.size[0]
	sizeTwo = im.size[1]
	if(sizeOne >sizeTwo):
		max = sizeOne
		min = sizeTwo
	else:
		max = sizeTwo
		min = sizeOne
	if(max > 1024):
		return False
	else:
		return True

def returnSize(im):
	#返回图片大小,返回两个值,第一个返回值总为最大
	max,min = im.size
	if max > min:
		return max,min
	else:
		return min,max
#判断文件夹是否存在
def judgeDir(rootDir):
	return os.path.exists(rootDir)
	
def changeSize(im,max,min):
	value = max/1024
	min = min/value
	newimg = im.resize((1024,min),Image.ANTIALIAS)
	return newimg

def main():
	for parent,dirnames,filenames in os.walk(rootDir):
		for filename in filenames:
			fName = filename
			filename = parent + os.sep + filename
			fPostfix = os.path.splitext(filename)[1]
			#连接成需处理文件夹链
			#indexValue = parent.index('image')
			newPath = parent.split('\\image')[-1]
			#连接成保存处文件夹链
			newTarget = targetDir + os.sep + newPath
			print encodeChinese('newPath是: ') + newPath
			print encodeChinese('newTarget是: ') + newTarget + '\n'
			try:
				img = Image.open(filename)
			except:
				print filename
				print encodeChinese('打开这个文件出错')
				continue
			#img.load()
			print filename
			print fPostfix
			if(fPostfix.lower() !='.jpg' and fPostfix.lower() !='.png'):	
				errFile.write(str(filename) + '\n')
				errFile.write(encodeChinese('上面这个文件不是图片,请检查...') + '\n')
				errFile.write('\n')
			else:
				print 'juageSize()'	
				if(judgeSize(img) == False):
					print 'judgeSize == False'
					max,min = returnSize(img)
					newimg = changeSize(img,max,min)
					if(judgeDir(newTarget)):
						newimg.save(newTarget + os.sep + fName)
					else:
						#os.makedirs()默认的mode为0777,用于创建多级目录结构
						os.makedirs(newTarget)
						newimg.save(newTarget + os.sep + fName)
					print str(newTarget + os.sep + fName) 
					print encodeChinese('保存完毕')
				else:
					if (judgeDir(newTarget)):
						img.save(newTarget + os.sep + fName)
					else:
						os.makedirs(newTarget)
						img.save(newTarget + os.sep + fName)
	print encodeChinese('处理完毕')
	errFile.close()

main()