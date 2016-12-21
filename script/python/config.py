# coding=utf-8
import os
import sys

#################################################################
####   工具的环境变量
#################################################################

# SPP_HOME 
SPP_HOME = os.environ['SPP_HOME']

# SPP HOME 
SPP_BIN = '%s%s' % (SPP_HOME, '\spp')

# chenyang: 该变量已经由`SPP_CONVERTER`变量取代。
# spp tools的名称，比如artbuild是可以定制的。
#	world_export HOME : world导出器的所在目录
CONVERT_JS = " --tools=artbuild"
START_JS = "--tools=sppbuild"

# 导出器名称，这个导出器属于SPP Tools的一部分。
SPP_CONVERTER = "artbuild"

# 指定一个world文件的模版
worldTemplate = '%s%s' % (SPP_HOME, 'tools\\artbuild\\')

#template目录
schoolTemDir= '%s%s' % (SPP_HOME, 'template\\school\\')
web360TemDir= '%s%s' % (SPP_HOME, 'template\\web360\\')
# 以参数来指定是否需要debug，默认没有debug功能
DEBUG = False
DEBUG_DEV_NAME = ""
# 自动化测试的时候需要屏蔽掉一些功能，比如pause，比如不能弹出alert窗口等。
AUTOTEST = False

#################################################################
####   定制项目时使用到的变量
#################################################################
# 这里获得的路径是project下 build.py 的当前路径
# 因为该文件被 import 到 build.py 文件中了
PROJECT_HOME = os.getcwd();

# 日志
ERROR_LOG = PROJECT_HOME + "/target/error.log"
BUILD_LOG = PROJECT_HOME + "/target/build.log"

#	3ds to world 的资源输入路径
SRC_ART_INPUT = '%s%s' % (PROJECT_HOME,'\\src\\art')

#  3ds to world 的资源输出路径
SRC_ART_OUTPUT = '%s%s' % (PROJECT_HOME,"\\target\\art\\")

# 项目运行时读取 world 资源的目录, 绝对路径
USEPATH = "/art"

# 灯光文件的路径 , 及各种灯光文件的名称
lightFolder = '%s\\lights\\'%( SRC_ART_INPUT )
bakeLightFile = 'bake.xml'		# 烘焙使用的灯光
staticLightFile = 'static.xml'		# 场景运行时的静态光源
dynamicLightFile = 'dynamic.xml'	# 场景运行时的动态光源，需要运行时动态创建
noLightFile = 'lightmap/nolightmap.xml'	# 场景运行时没有lighterMap的meshobj名字列表

# 烘焙时使用BAT脚本文件
heightBakeCmd = '%s\\target\\lighter2_height.bat' % (PROJECT_HOME)
lowBakeCmd = '%s\\target\\lighter2_low.bat' % (PROJECT_HOME)

#################################################################
####   ERROR CODE  501 --- 1000
#################################################################

ERR500 = "error code : 500 \n文件不存在"
ERR501 = "error code : 501 \n目录不存在"
ERR511 = "error code : 511 \n/src/art/scene目录中没有任何场景文件，请检查后重新构建"

ERR600 = "error code : 600 \n清空target目录失败 , target目录正在使用，无法删除！请关闭 target 目录及相关文件后重新执行。"

ERR700 = "error code : 700 \n你选择的模板不存在，请检查模板名称是否正确。"
ERR701 = "error code : 701 \n文件编码错误，该文件不是utf8编码的"
ERR702 = "error code : 702 \n模板编译错误，该错误发生在xml数据转JSON数据时。"
ERR703 = "error code : 703 \n模板编译错误，缺少必要的数据，文件内容不匹配。"
ERR704 = "error code : 704 \n模板编译错误，复制资源文件时发生错误。"
ERR705 = "error code : 705 \n模板编译错误，需要修改world.xml文件，但是该文件不存在。"
ERR706 = "error code : 706 \n模板编译错误，XML文件转换错误，请先将XML文件的编码转为UTF8，然后再检查XML文件的标签是不是匹配，标签书写是不是规范。"


ERR800 = "error code : 800 \n模板打包错误，这个错误发生在将模板编译为安装包时。"

ERR1000 = "error code : 1000 \n在当前目录下找不到 src 文件夹，请到 src 同级目录执行 sppbuild 命令"

