import os
import numpy
import Image
import stat
import argparse # 处理参数使用
import sys
def encodeChinese(msg):
   type=sys.getfilesystemencoding()
   return msg.decode('UTF-8').encode(type)
image_path='需要裁剪文件路径'
log_path='处理后文件保存路径'
help_image_path=encodeChinese(image_path)
help_log_path=encodeChinese(log_path)
help_path=encodeChinese('自动处理裁减贴图的工具')

parser = argparse.ArgumentParser(description=encodeChinese('自动处理裁减贴图的工具'))
parser.add_argument('--dir', action='store', dest='image_dir',
                    help=help_image_path) #common.encodeChinese(help_log_path))
parser.add_argument('--log', action='store', dest='log_filename',
                    help=help_log_path) #common.encodeChinese(help_log_path))
parser.add_argument('--version', action='version', version='%(prog)s 1.0')
args = parser.parse_args()

err_file_dir=r'c:\errFile.txt'
err_image_dir=encodeChinese('没有输入需要裁剪文件路径')
err_log_dir=encodeChinese('没有输入处理后文件保存路径')
                    
# 判断必须给定的参数
if args.image_dir is None :
	print err_image_dir#common.encodeChinese('没有输入保存图片文件的文件夹')
	sys.exit()
if args.log_filename is None :
	print err_log_dir #common.encodeChinese('没有输入保存错误信息的日志文件名称')
	sys.exit()

rootdir=args.image_dir
#rootdir=r'c:\users\MingL_Wang\desktop\tree'
#errPath=
#os.chmod("/tmp/foo.txt", stat.S_IXGRP)
targetDir=args.log_filename
#targetDir=r'c:\users\MingL_Wang\desktop\target_dir'
#os.makedirs(r"c:/python /test")
errFile = open(err_file_dir,'w')
for parent,dirnames,filenames in os.walk(rootdir):
	for filename in filenames:
		filename1,filename2 = os.path.split(filename)
		filename = parent + os.sep + filename
		fName,fPath = os.path.splitext(filename)
		value_r = 0
		value_g = 0
		value_b = 0
		count = 0
		if(fPath =='.png'):
         #os.chmod(filename,stat.S_IWRITE)
			try:
				img = Image.open(filename)
				img.load()
			except:
				print str(filename) + '\t' + encodeChinese('这张不是贴图文件')
				errFile.write(str(filename) + '\t' + encodeChinese('这张不是贴图文件') + '\n')
				continue
		# print img
			if (img.mode == 'RGBA'):
				rgba = encodeChinese('这张是RGBA图片')
				print rgba
				img.load()
				data = img.getdata()
				data_a = list()
				for item in data:
					if item[3] < 128:
						data_a.append((item[0],item[1],item[2],0))
					else:
						data_a.append((item[0],item[1],item[2],255))
				for item in data:
					if item[3] == 255:
						count += 1
						value_r += item[0]
						value_g += item[1]
						value_b += item[2]
				value_r = value_r / count
				value_g = value_g / count
				value_b = value_b / count
				print value_r
				print value_g
				print value_b
				print count
				newdata = list()
				for item in data_a:
					if item[3] == 0:
						newdata.append((value_r,value_g,value_b,item[3]))
						#print newdata[0]
					elif item[3] == 255:
						newdata.append((item[0],item[1],item[2],item[3]))
						#print newdata[0]
						#print data_a
				print len(newdata)
				img.putdata(newdata)
				print filename2
				print targetDir + os.sep +filename2
				img.save(targetDir + os.sep + filename2);
	#            checkdata=img.getdata()
	#            for item in checkdata:
	#               if item[3] == 0:
	#                  print 'RGBA' + str(item[0]) + '   ' + str(item[1]) + '   ' + str(item[2])
					  
				print str(filename2) + ' save'
			 #如果它没有alpha通道
			elif img.mode == 'RGB':
				print 'RGB'
				img.load()
				#转换出一个alpha通道
				img = img.convert('RGBA')
				data = img.getdata()
				mydata = list()
				newdata = list()
				for item in data:
					if item[0] == 0 and item[1] == 0 and item[2] == 0:
						mydata.append((item[0],item[1],item[2],0))
					else:
						mydata.append((item[0],item[1],item[2],255))
				for item in data:
					if item[3] == 255:
						count += 1
						value_r += item[0]
						value_g += item[1]
						value_b += item[2]
				value_r = value_r / count
				value_g = value_g / count
				value_b = value_b / count
				for item in mydata:
					newdata.append((value_r,value_g,value_b,item[3]))
				img.putdata(newdata)
				img.save(targetDir + os.sep + filename2)
      #如果它不是png格式
		elif(fPath == '.jpg'):
			jpgFile = encodeChinese('这是一张jpg图片,此工具不能对其裁剪,这张图片的名字是: ')
			print jpgFile + filename2
			errFile.write(filename + encodeChinese(' 这是一张jpg图片,此工具不能对其裁剪') + '\n')
			errFile.write('\n')
		else:
			not_png = encodeChinese('这张贴图既不是png也不是jpg,这张贴图的名字是: ')
			print not_png + filename2
			errFile.write(filename + encodeChinese(' 这张贴图既不是png也不是jpg') + '\n')
			errFile.write('\n')
errFile.close()
