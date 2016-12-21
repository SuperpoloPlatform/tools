#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys,os
import Image
import ImageDraw
import argparse # 处理参数使用

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
# rootdir = r'c:\users\mingl_wang\desktop\diffuse'
# logdir = r'c:\users\mingl_wang\desktop\check_similarity_err.txt'

fd = open(logdir,'w')

#将图像尺寸定义在256*256,并且转换成RGB图像
def make_regalur_image(img, size = (256, 256)):
	return img.resize(size).convert('RGB')

#接受一个图像,将其分割成64*64的小块
def split_image(img, part_size = (64, 64)):
	w, h = img.size
	pw, ph = part_size

	assert w % pw == h % ph == 0
#这里需要补充crop()方法
	return [img.crop((i, j, i+pw, j+ph)).copy() \
				for i in xrange(0, w, pw) \
				for j in xrange(0, h, ph)]

#这里需要补充zip的方法
def hist_similar(lh, rh):
	assert len(lh) == len(rh)
	return sum(1 - (0 if l == r else float(abs(l - r))/max(l, r)) for l, r in zip(lh, rh))/len(lh)

#同上
def calc_similar(li, ri):
#	return hist_similar(li.histogram(), ri.histogram())
	return sum(hist_similar(l.histogram(), r.histogram()) for l, r in zip(split_image(li), split_image(ri))) / 16.0

#打开图片,规范化,返回
def calc_similar_by_path(lf, rf):
	li, ri = make_regalur_image(Image.open(lf)), make_regalur_image(Image.open(rf))
	return calc_similar(li, ri)

#
def make_doc_data(lf, rf):
	li, ri = make_regalur_image(Image.open(lf)), make_regalur_image(Image.open(rf))
	li.save(lf + '_regalur.png')
	ri.save(rf + '_regalur.png')
	fd = open('stat.csv', 'w')
	fd.write('\n'.join(l + ',' + r for l, r in zip(map(str, li.histogram()), map(str, ri.histogram()))))
	fd.close()
	li = li.convert('RGB')
	draw = ImageDraw.Draw(li)
	for i in xrange(0, 256, 64):
		draw.line((0, i, 256, i), fill = '#ff0000')
		draw.line((i, 0, i, 256), fill = '#ff0000')
	li.save(lf + '_lines.png')

fileArr = list()
#将文件路径写成list存在fileArr当中
for parent,dirnames,filenames in os.walk(rootdir):
	for filename in filenames:
		fName = filename
		filename = parent + os.sep + fName
		fileArr.append(filename)

#创建一个将要写入文件的list()
logList = list()
for i in xrange(1,len(fileArr)):
	try:
		imgOne = Image.open(fileArr[i-1])
	except:
		i += 1
	for j in xrange(i-1,len(fileArr)):
		if j == (i-1):
			continue
		else:
			try:
				imgTwo = Image.open(fileArr[j])
			except:
				continue
			li, ri = make_regalur_image(imgOne), make_regalur_image(imgTwo)
			similarityValue = int(calc_similar(li, ri)*100)
			print encodeChinese('当前循环中的文件是: ') + '\n' + str(fileArr[i-1]) + '\n' + str(fileArr[j])
			print encodeChinese('他们的相似度是: ') + str(similarityValue)
			if similarityValue > int(thresholdValue):
				print fileArr[i-1]
				print fileArr[j]
				print similarityValue
				print '\n'
				fd.write(fileArr[i-1] + '\n')
				fd.write(fileArr[j] + '\n')
				fd.write(encodeChinese('相似度是: ') +  str(similarityValue) + '\n')
				fd.write('\n')
fd.close()