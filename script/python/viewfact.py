# coding=utf-8
import os
import sys
import config
import common
import shutil 
import xml.dom.minidom
from xml.dom import minidom,Node


def view(pathrun):
	ac = pathrun.split('/')
	tdsName = ac[0]
	#******************************************************************************
	#这段代码是定义全路径的，用来存放.x文件的全路径	
	fullPath = ''
	#******************************************************************************
	#它是用来判断解析之后的target存不存在，如果存在，直接删除，如果没有就不进行处理
	targetName='%s\\%s\\art\\' % (config.PROJECT_HOME,tdsName)
	#******************************************************************************
	#target_dir是需要往目标目录当中加的地址
	#needXML是从artBuild拷贝出一的world.xml文件	
	target_dir='%s\\%s\\art' % (config.PROJECT_HOME,tdsName)
	needXML="%s%s"%(config.worldTemplate,'world.xml')
	# print targetName
	#******************************************************************************
	#这是3DS的判断路径，如果正确就把filepath赋值给fullpath,如果错误就返回一个错信息	
	filePath = ''
	#******************************************************************************
	#在这里判断targetName是否存在,如果存在直接删除
	if os.path.isdir('%s\\%s' % (config.PROJECT_HOME,tdsName)):
		shutil.rmtree('%s\\%s' % (config.PROJECT_HOME,tdsName))
	#******************************************************************************	
	# print targetPath
	# 首先，美术提供的目录已经确定
	# 目录是有变动性的，例如：src/factory/***.3DS文件,注意：美术导过来的3DS文件，.3ds一定要大写,写成.3DS
	# tdsName是kk_01格式的，需要手动拼成 D://baiqiang/src/art/factory/kk_01.3DS,下面就是针对3DS文件的操作  
	#美术的3DS文件必须放在这个目录F://ci_uge_test/src/art/scene 要不然找不到，先要确定下来
	filePath = "%s\\scene\\%s.x"%(config.SRC_ART_INPUT,tdsName)
	#下面代码是用来查看，拼装的路径是否存在，不存在它就为空了,为了方便在此就注掉了
	# print filePath
	#******************************************************************************
	#这是要最终执行的命令路径
	operatefile = '%s\\%s'%(config.PROJECT_HOME,tdsName)
	# print operatefile
	#******************************************************************************
	# 1 先根据tdsName去 src/art/scenen目录中找对应x文件		
	if os.path.isfile(filePath):
		fullPath = filePath	 
	else:
		print common.encodeChinese('此%s.x文件不存在'%(tdsName))#告诉你所输入的sppbuild --viewfact=***  ***不存在
		os._exit(200)		#没有了就退出,不继续往下运行了，200自己定义的错误码，方便查看错误
	#******************************************************************************
	# 2 调用 spp --convertmode=factory --input= --output= --tools=sppbuild ,具体命令参考 tds2world.py 中
	cmd  = '%s --input=%s --output=%s --ifeffect=Y --usepath=%s --convertmode=%s --tmpworldpath=%s  %s' % (
		config.SPP_BIN,				# spp命令的地址
		fullPath,					# x 文件全路径  --input=
		targetName,					# world的输出路径  --output=
		config.USEPATH,				# 运行时读取 world 资源的目录, 绝对路径
		"factory",				    # convertmode = factory 或者  scene ;  表示以什么格式转换3ds文件,   
		config.worldTemplate,		# 指定一个 world.xml 文件作为场景模版
		config.START_JS				# start.js 所在路径
	)
	#*****************************************************************************
	#查看cmd代码是否可以执行出来，与一开始的进行对比sppbuild -debug来进行调试
	#执行代码，使用转换器来执行	
	os.system(cmd)
	#*****************************************************************************
	#找到工厂的名字
	#这里用来引入工厂的操作
	factpath = "%s\\art\\factories"%tdsName
	facpath = ''
	if(os.path.isdir(factpath)):
		paths = os.listdir(factpath)
		facpath = paths[0]
	
	#*****************************************************************************
	# 3 把 spp_sdk/tools/artbuild/world.xml 文件拷贝到 output/art/ 中	
	#shutil.copytree拷贝一个目录，copy拷贝一个文件
	shutil.copy(needXML,target_dir)
	#*****************************************************************************
	# 4 修改 world.xml 文件，这步就开始操作xml文件
		# 首先把kk_01.xml引入到world.xml中
		# 然后把materials.xml引入到world.xml 
		# 创建meshobj节点，并加入到 <sector>		
	finalWorldXML='%s%s'%(targetName,'world.xml')
	#*****************************************************************************
	#为了结构更加的清晰，在这里又定义了别一个函数来进行操作，对world.xml编辑与解析	
	parseXML(finalWorldXML,tdsName,facpath)	
#*********************************************************************************	
#下面的代码是用来解析xml的,其中传入两个参数，第一个是world.xml,第二个是factory的名字	
def parseXML(val,param,facpath):
	operatefile = '%s\\%s'%(config.PROJECT_HOME,param)
	fname = facpath.split('.')	
#*********************************************************************************
#首先判断world.xml是不是文件或者存在与否，不成立则不执行
	if os.path.isfile(val):
		try:
			#*********************************************************************
			#首先解析xml需要使用xml.dom.minidom，不能使用open打开，不能返回值			
			dom = xml.dom.minidom.parse(val)
			#*********************************************************************
			#获取根元素，现在的根元素是world，所以就可以获取根元素			
			root = dom.documentElement
			#*********************************************************************
			#创建一个library一个节点，需要将factories当中的xml引入其中			
			library = dom.createElement('library')
			#*********************************************************************
			#创建节点内容
			libraryText = dom.createTextNode('/art/factories/%s'%(facpath))
			#*********************************************************************
			#把节点内容加入到节点当中
			library.appendChild(libraryText)
			#*********************************************************************
			#获取所有节点的数组
			librarys = dom.getElementsByTagName('library')
			#*********************************************************************
			#把它插入到节点之前 ,且有回车跳至表位操作			
			root.insertBefore(library,librarys[0])
			root.insertBefore(dom.createTextNode('\n\t'),librarys[0])
			#*********************************************************************
			#创建meshobj，并且把工厂加入其中
			#场景当中可能有多个sector，但是我需要判断是哪个sector,需要名字为scene的scector
			for node in dom.getElementsByTagName("sector"):
				if(node.getAttribute('name')=='Scene'):
					sector = node		
					
			#*********************************************************************
			#给树创建一个新的节点,meshobj			
			ambient = dom.createElement('ambient')
			ambient.setAttribute('blue','0.3')
			ambient.setAttribute('green','0.3')
			ambient.setAttribute('red','0.3')
			sector.appendChild(dom.createTextNode('\n\t'))
			sector.appendChild(ambient)
			
			meshobj = dom.createElement('meshobj')		
			#*********************************************************************
			#给meshobj设置一个属性名字，名为mesh_为前的名称
			meshobj.setAttribute("name","mesh_obj") 
			#*********************************************************************
			#给树加一个节点plugin			
			plugin = dom.createElement('plugin')
			#*********************************************************************
			#给plugin加一个节点内容为genmesh
			pluginText = dom.createTextNode('crystalspace.mesh.loader.genmesh')
			#*********************************************************************
			#给plugin加一个节点内容为genmesh	
			sector.appendChild(dom.createTextNode('\n\t'))
			plugin.appendChild(pluginText)
			params = dom.createElement('params')		
			factory = dom.createElement('factory')
			factoryText = dom.createTextNode(fname[0])
			sector.appendChild(dom.createTextNode('\n\t'))
			factory.appendChild(factoryText)
			move = dom.createElement('move')
			v = dom.createElement('v')
			v.setAttribute('x','0')
			v.setAttribute('y','0')
			v.setAttribute('z','0')
			sector.appendChild(dom.createTextNode('\n\t'))			
			sector.appendChild(meshobj)
			meshobj.appendChild(dom.createTextNode('\n\t'))
			meshobj.appendChild(plugin)			
			params.appendChild(dom.createTextNode('\n\t'))
			params.appendChild(factory)	
			params.appendChild(dom.createTextNode('\n\t'))
			meshobj.appendChild(params)	
			meshobj.appendChild(dom.createTextNode('\n\t'))	
			meshobj.appendChild(move)
			move.appendChild(dom.createTextNode('\n\t'))
			move.appendChild(v)
			move.appendChild(dom.createTextNode('\n\t'))
			meshobj.appendChild(dom.createTextNode('\n\t'))	
			sector.appendChild(dom.createTextNode('\n\t'))			
			meshobj.insertBefore(dom.createTextNode('\n\t'),params)
			#*********************************************************************
			#下面的操作是给节点加灯的操作
			#创建所有的节点
			light = dom.createElement('light');
			center = dom.createElement('center');
			color = dom.createElement('color');
			radius = dom.createElement('radius');
			dynamic = dom.createElement('dynamic');
			influenceradius = dom.createElement('influenceradius');
			specular = dom.createElement('specular');
			attenuation = dom.createElement('attenuation');
			type = dom.createElement('type');
			#*********************************************************************
			#根据所需要的要求添加属性与节点内容
			light.setAttribute('name','Omni01')
			center.setAttribute('x','0')
			center.setAttribute('y','0')
			center.setAttribute('z','0')
			color.setAttribute('blue','1.0')
			color.setAttribute('green','1.0')
			color.setAttribute('red','1.0')
			specular.setAttribute('blue','1.0')
			specular.setAttribute('green','1.0')
			specular.setAttribute('red','1.0')	
			attenuation.setAttribute('c','0')
			attenuation.setAttribute('l','1')
			attenuation.setAttribute('q','0')	
			radiusText = dom.createTextNode('60.01045')
			dynamicText = dom.createTextNode('true')
			attenuationText = dom.createTextNode('linear')
			influenceradiusText = dom.createTextNode('60.99202')
			typeText = dom.createTextNode('pointlight')
			#*********************************************************************
			#对节点的复合连接
			radius.appendChild(radiusText)
			dynamic.appendChild(dynamicText)
			influenceradius.appendChild(influenceradiusText)
			attenuation.appendChild(attenuationText)
			type.appendChild(typeText)
			#*********************************************************************
			#组装拼装节点
			sector.appendChild(light)
			light.appendChild(dom.createTextNode('\n\t\t'))		
			light.appendChild(center)
			light.appendChild(dom.createTextNode('\n\t\t'))
			light.appendChild(color)
			light.appendChild(dom.createTextNode('\n\t\t'))
			light.appendChild(radius)
			light.appendChild(dom.createTextNode('\n\t\t'))
			light.appendChild(dynamic)
			light.appendChild(dom.createTextNode('\n\t\t'))
			light.appendChild(influenceradius)
			light.appendChild(dom.createTextNode('\n\t\t'))
			light.appendChild(specular)
			light.appendChild(dom.createTextNode('\n\t\t'))
			light.appendChild(attenuation)
			light.appendChild(dom.createTextNode('\n\t\t'))
			light.appendChild(type)
			light.appendChild(dom.createTextNode('\n\t'))
			sector.appendChild(dom.createTextNode('\n\t'))
			#*********************************************************************
			#打开world.xml进行,写的操作
			f =  open( val ,  'w')
			#*********************************************************************
			#将我执行过的操作节码，写入到world.xml当中即可完成相应的操作
			dom.writexml(f , encoding='utf-8' )
			#*********************************************************************
			#文件关闭，格式规定，有开就有关
			f.close()
			#*********************************************************************
			# 5 启动; 到kk_01/art目录中执行命令 spp --tools=viewfact 
			# cmd2 =spp --debug --tools=viewfact  cd /d operatefile
			cmd2 = "spp --tools=viewfact"
			os.chdir(operatefile)
			os.system(cmd2)
		except:
			s=sys.exc_info()
			print common.encodeChinese("错误 '%s' 发生在 第 %d 行" % (s[1],s[2].tb_lineno))

	
	
	
	
	
	

	
	