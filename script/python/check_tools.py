# -*- coding: utf-8 -*- 
import os
import Image
import argparse
import numpy
import sys

def encodeChinese(msg):
        type = sys.getfilesystemencoding()
        return msg.decode('UTF-8').encode(type)
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
n=0
#父文件夹,子文件夹,文件名

for parent,dirnames,filenames in os.walk(rootdir):
    for filename in filenames:
        fName = filename
        filename = rootdir + os.sep + filename
        fPath,fPostfix = os.path.splitext(filename)
        if(fPostfix == '.png' or fPostfix == '.jpg'):
            f = open(filename,'rb')
            f.seek(0,2)
            fSize = f.tell()
            if(fSize / 1024 > 1024):
                print rootdir
                filename = parent + os.sep + fName
                errFile.write(filename + '\n')
                errFileSize = encodeChinese('文件大小超出1024 ')
                errFile.write(errFileSize + ': ' + str(fSize / 1024) + '\n')
                errFile.write('\n')
            elif(fSize / 1024 < 1024):
                img = Image.open(filename)
                imgSize = img.size
                if(imgSize[0] % 64 != 0 or imgSize[1] % 64 != 0):
                    print parent
                    print filename
                    print img.size
                    fileErrInfo = parent + os.sep + fName
                    errFile.write(fileErrInfo + '\n')
                    errFile.write(encodeChinese('图片分辨率不符合规格,这张图片的分辨率是: '))
                    errFile.write(str(imgSize) + '\n')
                    errFile.write('\n')
                    imgMode = img.mode
                else:
                    if(fPostfix == '.png' and imgMode == 'RGBA'):
                        img.load()
                        alpha = img.split()[3]
                        arr = numpy.asarray(alpha)
                        count = 0
                        for i in range(0,img.size[0]-1):
                            for j in range(0,img.size[1]-1):
                                if arr[j][i] < 128:
                                    count += 1
                        if(count < 10):
                            errFilename = parent + os.sep + fName
                            errChannel = encodeChinese(' 约等于没有alpha通道')
                            errFile.write(errFilename + ': ')
                            errFile.write(errChannel + '\n')
                            errFile.write('\n')
                        else:
                            print filename + ' is ok! '
                    elif(fPostfix == '.png' and imgMode != 'RGB'):
                        errFilename = parent + os.sep + fName
                        errFile.write(errFilename + '\n')
                        errFile.write(encodeChinese('虽然是png格式,但是它没有alpha通道') + '\n')
                        errFile.write('\n')
                    elif(fPostfix == '.jpg'):
                        continue
                        #errFilename = parent + os.sep + fName
                        #errFile.write(errFilename + '\n')
                        #errFile.write(encodeChinese('这是一张jpg图片,所以它没有alpha通道') + '\n')
                        #errFile.write('\n')
        else:
            errFilename = parent + os.sep + fName
            errFile.write(errFilename + '\n')
            errFile.write(encodeChinese('文件格式不正确') + '\n')
            errFile.write('\n')
errFile.close()

                    
                    
                                
					
