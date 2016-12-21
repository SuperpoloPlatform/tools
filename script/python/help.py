# coding=utf-8
import os
import sys

import common	# 一些通用的函数

def usage():
	print ''
	print "sppbuild [-option] [--option=]"
	print ''
	print "--clean"
	print common.encodeChinese("    清空target目录")
	print ''
	print "--build"
	print common.encodeChinese("    增量式构建，不清空target，将src中的最新修改更新到target目录")
	print ''
	print "--rebuild"
	print common.encodeChinese("    默认参数，清空target重新构建项目")
	print common.encodeChinese("    直接使用sppbuild时，默认就是rebuild参数")
	print ''
	print common.encodeChinese("--publish=[类型]")
	print common.encodeChinese("    重新构建项目并生成安装包")
	print common.encodeChinese("    [类型]指所构建的项目类型，譬如：game，school...")
	print ''	
	print common.encodeChinese("--merge=[project1,project2]")
	print common.encodeChinese("    合并项目，即实现场景切换")
	print common.encodeChinese("    []指所构建的项目类型,命名定位*_*形式截取_前的名字为整个项目名字，譬如：test_1，test_2...，最后项目名字test")
	print ''
	print common.encodeChinese("--combine=prjectName")
	print common.encodeChinese("    3+2合并，即3D客户端和web360网站合并压缩")
	print common.encodeChinese("    []指所构建的项目名称，必须确保该项目已经存在并且build完成。")
	print ''
	print "--create=[ProjectName]"
	print common.encodeChinese("    把本地的src目录提交到http://192.168.1.7/svn/t/ProjectName目录中")
	print ''
	print "--lighter2=[number]"
	print common.encodeChinese("    指定参数烘焙场景")
	print common.encodeChinese("    [number]为整数，代表烘焙时影子的硬度，推荐数值 4、9、16、25、36...")
	print ''	
	print "--viewfact=[param]"
	print common.encodeChinese("   指定某一个本体然后进行查看操作")
	print ''	
	print common.encodeChinese("-h 或 --help")
	print common.encodeChinese("    打印帮助信息")