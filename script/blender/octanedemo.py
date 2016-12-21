
import Blender
from Blender.BGL import *
from Blender import Mesh, Scene, Window, sys, Image, Draw, Material, Mathutils, Ipo
import bpy
import BPyMesh
import BPyObject
import BPySys
import BPyMessages
from sys import *
import os, subprocess
from string import *

scene= bpy.data.scenes.active

ostype = platform
GLOBALS = {}
defaultDir=''
blendFileName=''

EVENT_NONE = 0
EVENT_EXIT = 1
EVENT_REDRAW = 2
EVENT_EXPORT = 3

eventBase=100
eventFileSelectorOctaneBinary = eventBase
eventFileSelectorOctaneProject = eventBase+1
eventFileSelectorOctaneExistingProject = eventBase+2
eventFileSelectorOctaneExistingProject=eventBase+3
eventFileSelectorOctaneNativeUnit=eventBase+4
eventSelectActiveCamera=eventBase+5
eventSelectActiveLightSource= eventBase+6
eventExportOBJOnly= eventBase+7
eventFrameRender= eventBase+8
eventFileSelectorImageOutput= eventBase+9
eventAnimationRender=eventBase+10
eventExportSamplesPerImagePresets=eventBase+11

octaneRenderBinary=Draw.Create('')
octaneProjectPath=Draw.Create('')
octaneProjectName=Draw.Create('')
octaneReplaceProject=Draw.Create(0)
octaneExportSamplesPerImage = Draw.Create(256)
octaneExportSamplesPerImagePresets = Draw.Create(2)
octaneCameraMotion=Draw.Create(0)
octaneNativeUnitSize=Draw.Create(3)
octaneResolution=Draw.Create(0)
octaneResolutionWidth=Draw.Create(1024)
octaneResolutionHeight=Draw.Create(512)
octanePercentSize=Draw.Create(0)
octaneExportCamera=Draw.Create(1)
octaneActiveCamera=Draw.Create('')
octaneLensAperture=Draw.Create(0)
octaneLensApertureValue=Draw.Create(1.0)
octaneLensApertureCurve=Draw.Create(0)
octaneFocalDepth=Draw.Create(0)
octaneFocalDepthValue=Draw.Create(5.0)
octaneFocalDepthCurve=Draw.Create(0)
octaneInterpolateFrame=Draw.Create(0)
octaneExportSunDirection=Draw.Create(0)
octaneActiveLightSource=Draw.Create('')
octaneImageOutput=Draw.Create('')
octaneAnimationStart=Draw.Create(1)
octaneAnimationEnd=Draw.Create(250)
octaneAnimationStep=Draw.Create(1)
octaneGPUSelector=Draw.Create(0)
octaneGPUUseList=Draw.Create('')

octaneWriteBatch=Draw.Create(0)

EXPORT_APPLY_MODIFIERS = Draw.Create(1)
EXPORT_ROTX90 = Draw.Create(1)
EXPORT_TRI = Draw.Create(0)
EXPORT_EDGES = Draw.Create(0)
EXPORT_NORMALS = Draw.Create(1)
EXPORT_NORMALS_HQ = Draw.Create(0)
EXPORT_UV = Draw.Create(1)
EXPORT_MTL = Draw.Create(1)
REPLACE_MTL = Draw.Create(1)
EXPORT_SEL_ONLY = Draw.Create(0)
EXPORT_NOTHING = Draw.Create(0)
EXPORT_REMOVE_HIDDEN = Draw.Create(0)
EXPORT_NOTRENDER = Draw.Create(1)
EXPORT_SEL_ONLY = Draw.Create(0)
EXPORT_ALL_SCENES = Draw.Create(0)
EXPORT_ANIMATION = Draw.Create(0)
EXPORT_COPY_IMAGES = Draw.Create(0)
EXPORT_BLEN_OBS = Draw.Create(0)
EXPORT_GROUP_BY_OB = Draw.Create(0)
EXPORT_GROUP_BY_MAT = Draw.Create(0)
EXPORT_KEEP_VERT_ORDER = Draw.Create(1)
EXPORT_POLYGROUPS = Draw.Create(0)
EXPORT_CURVE_AS_NURBS = Draw.Create(0)


if ostype == "linux2" or ostype == "darwin":
	batch_ext = '.sh'

if ostype == "win32":
	batch_ext = '.bat'

def matrix_vect(mat,vec):
	vecr = [0.,0.,0.,0.,0.]
	for i in range(4):
		for j in range(4):
			vecr[i] += vec[j] * mat[j][i] 
	return vecr
		
def rotate90x(vect):
	return [vect[0],vect[2],-vect[1]]
	
# Returns a tuple - path,extension.
def splitExt(path):
	dotidx = path.rfind('.')
	if dotidx == -1:
		return path, ''
	else:
		return path[:dotidx], path[dotidx:]

def extractBase(path):
	
	if ostype == "linux2" or ostype == "darwin":
		dotidx = path.rfind('/')
	
	if ostype == "win32":
		dotidx = path.rfind("\\")

	if dotidx == -1:
		return path
	else:
		return path[dotidx+1:]


def fixName(name):
	if name == None:
		return 'None'
	else:
		return name.replace(' ', '_')
		
def write_cam(filename):
	file = open(filename,"w")
	camera = Scene.GetCurrent().getCurrentCamera()
	cameradata = camera.getData()
	matrix = camera.mat
	
	position = rotate90x(matrix_vect(matrix,[0.0,0.0,0.0,1.0]))
	target = rotate90x(matrix_vect(matrix,[0.0,0.0,-1.0,1.0]))
	up = rotate90x(matrix_vect(matrix,[0.0,1.0,0.0,0.0]))

	file.write("#Camera name : %s\n" % camera.name)
	axes = ['x','y','z']
	for i in range(3):
		file.write("P%s %f\n" % (axes[i],position[i]))
	for i in range(3):
		file.write("T%s %f\n" % (axes[i],target[i]))
	for i in range(3):
		file.write("U%s %f\n" % (axes[i],up[i]))
	file.write("Fv %f\n" % cameradata.angle)
	
	file.close()

def init_command(filename):
	if EXPORT_NOTHING.val==0:
		file = open(filename,"w")
		file.write('')
		file.close()

def write_command(filename,meshnode,objfile,prefix,pngfile,proj_ocs,frame,exitAfter):
	
	#Set the unit factor
	unitFactor = {
		0:0.001,
		1:0.01,
		2:0.1,
		3:1,
		4:10,
		5:100,
		6:1000,
		7:0.0254,
		8:0.3048,
		9:0.9144,
		10:201.168,
		11:1609.344               
	}[octaneNativeUnitSize.val]

	camera_param = ''
	light_param=''
	axes = ['x','y','z']
	
	if octaneExportCamera.val:
		#camera = Scene.GetCurrent().getCurrentCamera()
		camera = Blender.Object.Get(octaneActiveCamera.val)
		cameradata = camera.getData()
		matrix = camera.mat
		
		position = rotate90x(matrix_vect(matrix,[0.0,0.0,0.0,1.0]))
		target = rotate90x(matrix_vect(matrix,[0.0,0.0,-1.0,1.0]))
		up = rotate90x(matrix_vect(matrix,[0.0,1.0,0.0,0.0]))
		
		for i in range(3):
			camera_param += " --cam-pos-%s %f" % (axes[i],position[i]*unitFactor)
		for i in range(3):
			camera_param += " --cam-target-%s %f" % (axes[i],target[i]*unitFactor)
		for i in range(3):
			camera_param += " --cam-up-%s %f" % (axes[i],up[i]*unitFactor)
	
		camera_param += " --cam-fov %f" % cameradata.angle
	
		if (octaneCameraMotion.val==1):
			if octaneInterpolateFrame==0:#If interpolate on next frame
				Blender.Set('curframe',frame+1)
			elif frame>1:#Interpolate on previous frame
				Blender.Set('curframe',frame-1)

			cameradata = camera.getData()
			matrix = camera.mat
			
			position = rotate90x(matrix_vect(matrix,[0.0,0.0,0.0,1.0]))
			target = rotate90x(matrix_vect(matrix,[0.0,0.0,-1.0,1.0]))
			up = rotate90x(matrix_vect(matrix,[0.0,1.0,0.0,0.0]))
	
			for i in range(3):
				camera_param += " --cam-motion-pos-%s %f" % (axes[i],position[i]*unitFactor)
			for i in range(3):
				camera_param += " --cam-motion-target-%s %f" % (axes[i],target[i]*unitFactor)
			for i in range(3):
				camera_param += " --cam-motion-up-%s %f" % (axes[i],up[i]*unitFactor)
	
	#Set the daylight option
	if octaneExportSunDirection.val:
		light = Blender.Object.Get(octaneActiveLightSource.val)
		#lightdata = light.getData()
		matrix = Mathutils.Matrix(light.getInverseMatrix())
		matrix = rotate90x(matrix)
		
		axes = ['x','y','z']
		for i in range(3):
			light_param += " --daylight-sundir-%s %f" % (axes[i],matrix[i][2]*unitFactor)
		
	octanePath=octaneRenderBinary.val
	octanePath='\"'+octanePath+'\"'
	objPath=os.path.join(octaneProjectPath.val,objfile).replace("\\", "/")

	projectFileAlreadyExists=False
	if os.path.exists(proj_ocs):
		projectFileAlreadyExists=True

	#If linux env add quotes in file names to allow spaces 
	if ostype == "linux2" or ostype == "darwin":
		objPath='\"'+objPath+'\"'
		objfile='\"'+objfile+'\"'
		proj_ocs='\"'+proj_ocs+'\"'
		pngfile='\"'+pngfile+'\"'
	
	#Set the exit after rendering flag (for animation)
	#Also set the system flag to force blender to wait Octane has finished the rendering or to immediately
	#render the control to blender (for single frame rendering)
	exitFlag=''
	commandFlag=''
	if exitAfter:
		exitFlag=' -e -q'
		#exitFlag=' -e'

		if ostype == "win32":
			commandFlag=' /wait /normal \"\" '
		elif ostype == "linux2" or ostype == "darwin":
			commandFlag = "(nice -n %d %s)"
	else:
		if ostype == "win32":
			commandFlag=' /b /normal \"\" '
			
		elif ostype == "linux2" or ostype == "darwin":
			commandFlag = "(nice -n %d %s)&"
		
	#Set the resolution option
	resolution=''
	if  octaneResolution.val:
		resSize = {
		  0: 1,
		  1: 0.75,
		  2: 0.5,
		  3: 0.25
		}[octanePercentSize.val]
		
		resolution=' --film-width %i --film-height %i' % (octaneResolutionWidth.val*resSize,octaneResolutionHeight.val*resSize)
		
	#Set the GPUs option
	useGPU=''
	if octaneGPUSelector.val:
		for val in octaneGPUUseList.val.split(' '):
			useGPU+=' -g '+val
	
			
	command =  octanePath+exitFlag+resolution+useGPU
	
	#Use an existing octane ocs file
	if projectFileAlreadyExists and not octaneReplaceProject.val:
		if exitAfter:
# 			command+=' -m %s.obj -r %s %s --output-png %s %s %s %s' % (meshnode,objfile,prefix,pngfile,camera_param,light_param,proj_ocs)
			command+=' -m %s.obj %s --output-png %s %s %s %s' % (meshnode,prefix,pngfile,camera_param,light_param,proj_ocs)
		else:
# 			command+=' -m %s.obj -r %s %s %s %s %s' % (meshnode,objfile,prefix,camera_param,light_param,proj_ocs)
			command+=' -m %s.obj %s %s %s %s' % (meshnode,prefix,camera_param,light_param,proj_ocs)
		
	#Force creation of the octane ocs file if it doesn't exist	
	else:
		if exitAfter:
			command+=' -n %s -m %s.obj -l %s %s --output-png %s %s %s' % (proj_ocs,meshnode,objPath,prefix,pngfile,camera_param,light_param)
		else:
			command+=' -n %s -m %s.obj -l %s %s %s %s' % (proj_ocs,meshnode,objPath,prefix,camera_param,light_param)
			
		#Reset the replace project flag to avoid accidental replacement
		octaneReplaceProject.val=0

	 
	#If a batch file should be created
	if octaneWriteBatch.val:
		file = open(filename,"a")
		file.write(command + '\n')
		file.close()

	#If no batch file should be created -> start octane immediately 
	else:
		if ostype == "win32":
			command='start ' + commandFlag + command                                                                                                                                                                  
		 	print command
			os.system(command)
			
		elif ostype == "linux2" or ostype == "darwin":
			if exitAfter:
				command=commandFlag%(0, command)
				print command
				subprocess.call(command,shell=True)
			else:
				command=commandFlag%(0, command)
				print command
				os.system(command)
			
	

# A Dict of Materials
# (material.name, image.name):matname_imagename # matname_imagename has gaps removed.
MTL_DICT = {}

def write_mtl(filename):

	world = Blender.World.GetCurrent()
	if world:
		worldAmb = world.getAmb()
	else:
		worldAmb = (0,0,0) # Default value

	file = open(filename, "w")
	file.write('# Blender3D MTL File: %s\n' % Blender.Get('filename').split('\\')[-1].split('/')[-1])
	file.write('# Material Count: %i\n' % len(MTL_DICT))
	
	tex32bits=[]
	tex8bits=[]
	
	# Write material/image combinations we have used.
	for key, (mtl_mat_name, mat, img) in MTL_DICT.iteritems():

		# Get the Blender data for the material and the image.
		# Having an image named None will make a bug, dont do it :)

		file.write('newmtl %s\n' % mtl_mat_name) # Define a new material: matname_imgname
		#file.write('newmtl %s\n' % mat.getName()) # Define a new material: matname_imgname

		if mat:
			#file.write('Ns %.6f\n' % ((mat.getHardness()-1) * 1.9607843137254901) ) # Hardness, convert blenders 1-511 to MTL's
			file.write('Ns %.6f\n' % (mat.getHardness()*10) ) # Hardness, convert blenders 1-511 to MTL's
			
			file.write('Ka %.6f %.6f %.6f\n' %  tuple([c*mat.amb for c in worldAmb])  ) # Ambient, uses mirror colour,
			
			#file.write('Kd %.6f %.6f %.6f\n' % tuple([c*mat.ref for c in mat.rgbCol]) ) # Diffuse
			file.write('Kd %.6f %.6f %.6f\n' % tuple([c for c in mat.rgbCol]) ) # Diffuse
			
			if (mat.mode & Material.Modes.RAYTRANSP):
				file.write('Ks %.6f %.6f %.6f\n' % tuple([(c) for c in mat.specCol]) ) # Specular
			else:
				file.write('Ks %.6f %.6f %.6f\n' % tuple([(c*mat.spec/10) for c in mat.specCol]) ) # Specular
			
			#file.write('Ks %.6f %.6f %.6f\n' % tuple([c*mat.spec for c in mat.specCol]) ) # Specular
			file.write('Ni %.6f\n' % mat.IOR) # Refraction index
			file.write('d %.6f\n' % mat.alpha) # Alpha (obj uses 'd' for dissolve)

			# 0 to disable lighting, 1 for ambient & diffuse only (specular color set to black), 2 for full lighting.
			if mat.getMode() & Blender.Material.Modes['SHADELESS']:
				file.write('illum 0\n') # ignore lighting
			elif mat.getSpec() == 0:
				file.write('illum 1\n') # no specular.
			else:
				file.write('illum 2\n') # light normaly

		else:
			#write a dummy material here?
			file.write('Ns 0\n')
			file.write('Ka %.6f %.6f %.6f\n' %  tuple([c for c in worldAmb])  ) # Ambient, uses mirror colour,
			file.write('Kd 0.8 0.8 0.8\n')
			file.write('Ks 0.8 0.8 0.8\n')
			file.write('d 1\n') # No alpha
			file.write('illum 2\n') # light normaly

		# Write images!
		#if img:  # We have an image on the face!
			#file.write('map_Kd %s\n' % img.filename.split('\\')[-1].split('/')[-1]) # Diffuse mapping image

		if mat: # No face image. if we havea material search for MTex image.
			enabledTextures=mat.enabledTextures
			textures=mat.getTextures()
			for mtex_index in enabledTextures:
				mtex=textures[mtex_index]
				if mtex and mtex.tex.type == Blender.Texture.Types.IMAGE:
					try:
						filename = mtex.tex.image.filename.split('\\')[-1].split('/')[-1]

						if mtex.mapto & Blender.Texture.MapTo['COL']:
							if filename not in tex32bits:
								if len(tex32bits)>63:
									print "32 bits textures limit reached : ",filename
									continue
								tex32bits.append(filename)
							file.write('map_Kd %s\n' % filename) # Diffuse mapping image
						
						if filename not in tex8bits:
							if len(tex8bits)>31:
								print "8 bits textures limit reached : ",filename
								continue
							tex8bits.append(filename)

						if mtex.mapto & Blender.Texture.MapTo['NOR']:
							file.write('map_bump %s\n' % filename) # Bump mapping image
						
						if mtex.mapto & Blender.Texture.MapTo['SPEC']:
							file.write('map_Ks %s\n' % filename) # Diffuse mapping image
						
						if mtex.mapto & Blender.Texture.MapTo['ALPHA']:
							file.write('map_d %s\n' % filename) # Alpha mapping image
						
						if mtex.mapto & Blender.Texture.MapTo['CMIR']:
							file.write('map_Ka %s\n' % filename) # Mirror mapping image
					except:
						# Texture has no image though its an image type, best ignore.
						print "No image"
						#pass

		file.write('\n\n')

	file.close()
	
	print len(tex32bits),tex32bits
	print
	print len(tex8bits),tex8bits

def copy_file(source, dest):
	file = open(source, 'rb')
	data = file.read()
	file.close()

	file = open(dest, 'wb')
	file.write(data)
	file.close()


def copy_images(dest_dir):
	if dest_dir[-1] != sys.sep:
		dest_dir += sys.sep

	# Get unique image names
	uniqueImages = {}
	for matname, mat, image in MTL_DICT.itervalues(): # Only use image name
		# Get Texface images
		if image:
			uniqueImages[image] = image # Should use sets here. wait until Python 2.4 is default.

		# Get MTex images
		if mat:
			for mtex in mat.getTextures():
				if mtex and mtex.tex.type == Blender.Texture.Types.IMAGE:
					image_tex = mtex.tex.image
					if image_tex:
						try:
							uniqueImages[image_tex] = image_tex
						except:
							pass

	# Now copy images
	copyCount = 0

	for bImage in uniqueImages.itervalues():
		image_path = sys.expandpath(bImage.filename)
		if sys.exists(image_path):
			# Make a name for the target path.
			dest_image_path = os.path.join(dest_dir,image_path.split('\\')[-1].split('/')[-1]).replace("\\", "/")
			if not sys.exists(dest_image_path): # Image isnt alredy there
				print '\tCopying "%s" > "%s"' % (image_path, dest_image_path)
				copy_file(image_path, dest_image_path)
				copyCount+=1
	print '\tCopied %d images' % copyCount


def test_nurbs_compat(ob):
	if ob.type != 'Curve':
		return False

	for nu in ob.data:
		if (not nu.knotsV) and nu.type != 1: # not a surface and not bezier
			return True

	return False

def write_nurb(file, ob, ob_mat,unitFactor):
	tot_verts = 0
	cu = ob.data

	# use negative indices
	Vector = Blender.Mathutils.Vector
	for nu in cu:

		if nu.type==0:		DEG_ORDER_U = 1
		else:				DEG_ORDER_U = nu.orderU-1  # Tested to be correct

		if nu.type==1:
			print "\tWarning, bezier curve:", ob.name, "only poly and nurbs curves supported"
			continue

		if nu.knotsV:
			print "\tWarning, surface:", ob.name, "only poly and nurbs curves supported"
			continue

		if len(nu) <= DEG_ORDER_U:
			print "\tWarning, orderU is lower then vert count, skipping:", ob.name
			continue

		pt_num = 0
		do_closed = (nu.flagU & 1)
		do_endpoints = (do_closed==0) and (nu.flagU & 2)

		for pt in nu:
			pt = Vector(pt[0], pt[1], pt[2]) * ob_mat * unitFactor
			file.write('v %.6f %.6f %.6f\n' % (pt[0], pt[1], pt[2]))
			pt_num += 1
		tot_verts += pt_num

		file.write('g %s\n' % (fixName(ob.name))) # fixName(ob.getData(1)) could use the data name too
		file.write('cstype bspline\n') # not ideal, hard coded
		file.write('deg %d\n' % DEG_ORDER_U) # not used for curves but most files have it still

		curve_ls = [-(i+1) for i in xrange(pt_num)]

		# 'curv' keyword
		if do_closed:
			if DEG_ORDER_U == 1:
				pt_num += 1
				curve_ls.append(-1)
			else:
				pt_num += DEG_ORDER_U
				curve_ls = curve_ls + curve_ls[0:DEG_ORDER_U]

		file.write('curv 0.0 1.0 %s\n' % (' '.join( [str(i) for i in curve_ls] ))) # Blender has no U and V values for the curve

		# 'parm' keyword
		tot_parm = (DEG_ORDER_U + 1) + pt_num
		tot_parm_div = float(tot_parm-1)
		parm_ls = [(i/tot_parm_div) for i in xrange(tot_parm)]

		if do_endpoints: # end points, force param
			for i in xrange(DEG_ORDER_U+1):
				parm_ls[i] = 0.0
				parm_ls[-(1+i)] = 1.0

		file.write('parm u %s\n' % ' '.join( [str(i) for i in parm_ls] ))

		file.write('end\n')

	return tot_verts

	
	def write(frame, context_name , objects, animate,\
EXPORT_TRI=False,  EXPORT_EDGES=False,  EXPORT_NORMALS=False,  EXPORT_NORMALS_HQ=False,\
EXPORT_UV=True,  EXPORT_MTL=True, REPLACE_MTL=True,  EXPORT_CAM=True,  EXPORT_COPY_IMAGES=False,\
EXPORT_APPLY_MODIFIERS=True, EXPORT_ROTX90=True, EXPORT_BLEN_OBS=True,\
EXPORT_GROUP_BY_OB=False,  EXPORT_GROUP_BY_MAT=False, EXPORT_KEEP_VERT_ORDER=False,\
EXPORT_POLYGROUPS=False, EXPORT_CURVE_AS_NURBS=True,octaneRender=False,exitAfter=False):
	'''
	Basic write function. The context and options must be alredy set
	This can be accessed externaly
	eg.
	write( 'c:\\test\\foobar.obj', Blender.Object.GetSelected() ) # Using default options.
	'''
	
	if octaneWriteBatch.val:
		if animate and EXPORT_NOTHING.val==0:
			objFileName = context_name[0]+context_name[1]+context_name[2]+'_anim'+'.obj'
			mtlFileName = context_name[0]+context_name[1]+context_name[2]+'_anim'+'.mtl'
		else:
			objFileName = context_name[0]+context_name[1]+context_name[2]+'.obj'
			mtlFileName = context_name[0]+context_name[1]+context_name[2]+'.mtl'
			
		camFileName = context_name[0]+context_name[1]+context_name[2]+'.cam'
	else:
		if animate and EXPORT_NOTHING.val==0:
			objFileName=context_name[0]+'_anim'+'.obj'
			mtlFileName=context_name[0]+'_anim'+'.mtl'
		else:
			objFileName=context_name[0]+'.obj'
			mtlFileName=context_name[0]+'.mtl'
			
		camFileName=context_name[0]+'.cam'

	pngFileName,ext=splitExt(os.path.split(octaneImageOutput.val)[1])
	pngFileName=os.path.join(os.path.split(octaneImageOutput.val)[0],pngFileName+context_name[1]+context_name[2]+ext).replace("\\", "/")

	#Set the unit factor
	unitFactor = {
		0:0.001,
		1:0.01,
		2:0.1,
		3:1,
		4:10,
		5:100,
		6:1000,
		7:0.0254,
		8:0.3048,
		9:0.9144,
		10:201.168,
		11:1609.344               
	}[octaneNativeUnitSize.val]


	def veckey3d(v):
		return round(v.x, 6), round(v.y, 6), round(v.z, 6)

	def veckey2d(v):
		return round(v.x, 6), round(v.y, 6)

	def findVertexGroupName(face, vWeightMap):
		"""
		Searches the vertexDict to see what groups is assigned to a given face.
		We use a frequency system in order to sort out the name because a given vetex can
		belong to two or more groups at the same time. To find the right name for the face
		we list all the possible vertex group names with their frequency and then sort by
		frequency in descend order. The top element is the one shared by the highest number
		of vertices is the face's group
		"""
		weightDict = {}
		for vert in face:
			vWeights = vWeightMap[vert.index]
			for vGroupName, weight in vWeights:
				weightDict[vGroupName] = weightDict.get(vGroupName, 0) + weight

		if weightDict:
			alist = [(weight,vGroupName) for vGroupName, weight in weightDict.iteritems()] # sort least to greatest amount of weight
			alist.sort()
			return(alist[-1][1]) # highest value last
		else:
			return '(null)'


	print 'OBJ Export path: "%s"' % objFileName
	temp_mesh_name = '~tmp-mesh'

	time1 = sys.time()
	scn = Scene.GetCurrent()

	if EXPORT_NOTHING.val==0:
	
		file = open(objFileName, "w")
	
		# Write Header
		file.write('# Blender3D v%s OBJ File: %s\n' % (Blender.Get('version'), Blender.Get('filename').split('/')[-1].split('\\')[-1] ))
		file.write('# www.blender3d.org\n')
	
		# Tell the obj file what material file to use.
		if EXPORT_MTL:
			file.write('mtllib %s\n' % ( mtlFileName.split('\\')[-1].split('/')[-1] ))
		
		# Get the container mesh. - used for applying modifiers and non mesh objects.
		containerMesh = meshName = tempMesh = None
		for meshName in Blender.NMesh.GetNames():
			if meshName.startswith(temp_mesh_name):
				tempMesh = Mesh.Get(meshName)
				if not tempMesh.users:
					containerMesh = tempMesh
		if not containerMesh:
			containerMesh = Mesh.New(temp_mesh_name)
	
		if EXPORT_ROTX90:
			mat_xrot90= Blender.Mathutils.RotationMatrix(-90, 4, 'x')
	
		del meshName
		del tempMesh
	
		# Initialize totals, these are updated each object
		totverts = totuvco = totno = 1
	
		face_vert_index = 1
	
		globalNormals = {}
	
		# Get all meshes
		for ob_main in objects:
			for ob, ob_mat in BPyObject.getDerivedObjects(ob_main):
			
				#Object is hidden or object should not be rendered -> skip it
				if not (ob.Layers & scn.Layers) or (ob.restrictDisplay and EXPORT_REMOVE_HIDDEN.val):
					continue
	
				# Nurbs curve support
				if EXPORT_CURVE_AS_NURBS and test_nurbs_compat(ob):
					if EXPORT_ROTX90:
						ob_mat = ob_mat * mat_xrot90
	
					#If unit <> meters
					if octaneNativeUnitSize.val<>3:
						totverts += write_nurb(file, ob, ob_mat,unitFactor)
					else:
						totverts += write_nurb(file, ob, ob_mat)
					
					continue
				# end nurbs
	
				# Will work for non meshes now! :)
				# getMeshFromObject(ob, container_mesh=None, apply_modifiers=True, vgroups=True, scn=None)
				me= BPyMesh.getMeshFromObject(ob, containerMesh, EXPORT_APPLY_MODIFIERS, EXPORT_POLYGROUPS, scn)
				if not me:
					continue
	
				if EXPORT_UV:
					faceuv= me.faceUV
				else:
					faceuv = False
	
				# We have a valid mesh
				if EXPORT_TRI and me.faces:
					# Add a dummy object to it.
					has_quads = False
					for f in me.faces:
						if len(f) == 4:
							has_quads = True
							break
	
					if has_quads:
						oldmode = Mesh.Mode()
						Mesh.Mode(Mesh.SelectModes['FACE'])
	
						me.sel = True
						tempob = scn.objects.new(me)
						me.quadToTriangle(0) # more=0 shortest length
						oldmode = Mesh.Mode(oldmode)
						scn.objects.unlink(tempob)
	
						Mesh.Mode(oldmode)
	
				# Make our own list so it can be sorted to reduce context switching
				faces = [ f for f in me.faces ]
	
				if EXPORT_EDGES:
					edges = me.edges
				else:
					edges = []
	
				if not (len(faces)+len(edges)+len(me.verts)): # Make sure there is somthing to write
					continue # dont bother with this mesh.
	
				if EXPORT_ROTX90:
					me.transform(ob_mat*mat_xrot90)
				else:
					me.transform(ob_mat)
	
				# High Quality Normals
				if EXPORT_NORMALS and faces:
					if EXPORT_NORMALS_HQ:
						BPyMesh.meshCalcNormals(me)
					else:
						# transforming normals is incorrect
						# when the matrix is scaled,
						# better to recalculate them
						me.calcNormals()
	
				# # Crash Blender
				#materials = me.getMaterials(1) # 1 == will return None in the list.
				if ob.getType() == "Text" or ob.getType() == "Curve":
					obCurve=Blender.Curve.Get(ob.getData().getName())
					materials = obCurve.materials
				else:
					materials = me.materials
					
				materialNames = []
				materialItems = materials[:]
				if materials:
					for mat in materials:
						if mat: # !=None
							materialNames.append(mat.name)
						else:
							materialNames.append(None)
					# Cant use LC because some materials are None.
					# materialNames = map(lambda mat: mat.name, materials) # Bug Blender, dosent account for null materials, still broken.
	
				# Possible there null materials, will mess up indicies
				# but at least it will export, wait until Blender gets fixed.
				materialNames.extend((16-len(materialNames)) * [None])
				materialItems.extend((16-len(materialItems)) * [None])
	
				# Sort by Material, then images
				# so we dont over context switch in the obj file.
				if EXPORT_KEEP_VERT_ORDER:
					pass
				elif faceuv:
					try:	faces.sort(key = lambda a: (a.mat, a.image, a.smooth))
					except:	faces.sort(lambda a,b: cmp((a.mat, a.image, a.smooth), (b.mat, b.image, b.smooth)))
				elif len(materials) > 1:
					try:	faces.sort(key = lambda a: (a.mat, a.smooth))
					except:	faces.sort(lambda a,b: cmp((a.mat, a.smooth), (b.mat, b.smooth)))
				else:
					# no materials
					try:	faces.sort(key = lambda a: a.smooth)
					except:	faces.sort(lambda a,b: cmp(a.smooth, b.smooth))
	
				# Set the default mat to no material and no image.
				contextMat = (0, 0) # Can never be this, so we will label a new material teh first chance we get.
				contextSmooth = None # Will either be true or false,  set bad to force initialization switch.
	
				if EXPORT_BLEN_OBS or EXPORT_GROUP_BY_OB:
					name1 = ob.name
					name2 = ob.getData(1)
					if name1 == name2:
						obnamestring = fixName(name1)
					else:
						obnamestring = '%s_%s' % (fixName(name1), fixName(name2))
	
					if EXPORT_BLEN_OBS:
						file.write('o %s\n' % obnamestring) # Write Object name
					else: # if EXPORT_GROUP_BY_OB:
						file.write('g %s\n' % obnamestring)
	
	
				# Vert
				for v in me.verts:
					file.write('v %.6f %.6f %.6f\n' % tuple(v.co*unitFactor))
	
				# UV
				if faceuv:
					uv_face_mapping = [[0,0,0,0] for f in faces] # a bit of a waste for tri's :/
	
					uv_dict = {} # could use a set() here
					for f_index, f in enumerate(faces):
	
						for uv_index, uv in enumerate(f.uv):
							uvkey = veckey2d(uv)
							try:
								uv_face_mapping[f_index][uv_index] = uv_dict[uvkey]
							except:
								uv_face_mapping[f_index][uv_index] = uv_dict[uvkey] = len(uv_dict)
								file.write('vt %.6f %.6f\n' % tuple(uv))
	
					uv_unique_count = len(uv_dict)
					del uv, uvkey, uv_dict, f_index, uv_index
					# Only need uv_unique_count and uv_face_mapping
	
				# NORMAL, Smooth/Non smoothed.
				if EXPORT_NORMALS:
					for f in faces:
						if f.smooth:
							for v in f:
								noKey = veckey3d(v.no)
								if not globalNormals.has_key( noKey ):
									globalNormals[noKey] = totno
									totno +=1
									file.write('vn %.6f %.6f %.6f\n' % noKey)
						else:
							# Hard, 1 normal from the face.
							noKey = veckey3d(f.no)
							if not globalNormals.has_key( noKey ):
								globalNormals[noKey] = totno
								totno +=1
								file.write('vn %.6f %.6f %.6f\n' % noKey)
	
				if not faceuv:
					f_image = None
	
				if EXPORT_POLYGROUPS:
					# Retrieve the list of vertex groups
					vertGroupNames = me.getVertGroupNames()
	
					currentVGroup = ''
					# Create a dictionary keyed by face id and listing, for each vertex, the vertex groups it belongs to
					vgroupsMap = [[] for _i in xrange(len(me.verts))]
					for vertexGroupName in vertGroupNames:
						for vIdx, vWeight in me.getVertsFromGroup(vertexGroupName, 1):
							vgroupsMap[vIdx].append((vertexGroupName, vWeight))
	
				for f_index, f in enumerate(faces):
					f_v= f.v
					f_smooth= f.smooth
					f_mat = min(f.mat, len(materialNames)-1)
					if faceuv:
						f_image = f.image
						f_uv= f.uv
	
					# MAKE KEY
#ECE 20100822 
# 					if faceuv and f_image: # Object is always true.
# 						key = materialNames[f_mat],  f_image.name
# 					else:
# 						key = materialNames[f_mat],  None # No image, use None instead.

					key = materialNames[f_mat],  None # No image, use None instead.
					try:
						if Blender.Material.Get(key[0]).properties['notExported']:
							print "Skiping material:",key[0]
							continue
					except:
						pass
	
					# Write the vertex group
					if EXPORT_POLYGROUPS:
						if vertGroupNames:
							# find what vertext group the face belongs to
							theVGroup = findVertexGroupName(f,vgroupsMap)
							if	theVGroup != currentVGroup:
								currentVGroup = theVGroup
								file.write('g %s\n' % theVGroup)
	
					# CHECK FOR CONTEXT SWITCH
					if key == contextMat:
						pass # Context alredy switched, dont do anything
					else:
						if key[0] == None and key[1] == None:
							# Write a null material, since we know the context has changed.
							if EXPORT_GROUP_BY_MAT:
								file.write('g %s_%s\n' % (fixName(ob.name), fixName(ob.getData(1))) ) # can be mat_image or (null)
							file.write('usemtl (null)\n') # mat, image
	
						else:
							mat_data= MTL_DICT.get(key)
							if not mat_data:
								# First add to global dict so we can export to mtl
								# Then write mtl
	
								# Make a new names from the mat and image name,
								# converting any spaces to underscores with fixName.
	
								# If none image dont bother adding it to the name
								mat_data = MTL_DICT[key] = ('%s'%fixName(key[0])), materialItems[f_mat], f_image

#ECE 20100822 
# 								if key[1] == None:
# 									mat_data = MTL_DICT[key] = ('%s'%fixName(key[0])), materialItems[f_mat], f_image
# 								else:
# 									mat_data = MTL_DICT[key] = ('%s_%s' % (fixName(key[0]), fixName(key[1]))), materialItems[f_mat], f_image
	
							if EXPORT_GROUP_BY_MAT:
								file.write('g %s_%s_%s\n' % (fixName(ob.name), fixName(ob.getData(1)), mat_data[0]) ) # can be mat_image or (null)
	
							file.write('usemtl %s\n' % mat_data[0]) # can be mat_image or (null)
	
					contextMat = key
					if f_smooth != contextSmooth:
						if f_smooth: # on now off
							file.write('s 1\n')
							contextSmooth = f_smooth
						else: # was off now on
							file.write('s off\n')
							contextSmooth = f_smooth
	
					file.write('f')
					if faceuv:
						if EXPORT_NORMALS:
							if f_smooth: # Smoothed, use vertex normals
								for vi, v in enumerate(f_v):
									file.write( ' %d/%d/%d' % (\
									  v.index+totverts,\
									  totuvco + uv_face_mapping[f_index][vi],\
									  globalNormals[ veckey3d(v.no) ])) # vert, uv, normal
	
							else: # No smoothing, face normals
								no = globalNormals[ veckey3d(f.no) ]
								for vi, v in enumerate(f_v):
									file.write( ' %d/%d/%d' % (\
									  v.index+totverts,\
									  totuvco + uv_face_mapping[f_index][vi],\
									  no)) # vert, uv, normal
	
						else: # No Normals
							for vi, v in enumerate(f_v):
								file.write( ' %d/%d' % (\
								  v.index+totverts,\
								  totuvco + uv_face_mapping[f_index][vi])) # vert, uv
	
						face_vert_index += len(f_v)
	
					else: # No UV's
						if EXPORT_NORMALS:
							if f_smooth: # Smoothed, use vertex normals
								for v in f_v:
									file.write( ' %d//%d' % (\
									  v.index+totverts,\
									  globalNormals[ veckey3d(v.no) ]))
							else: # No smoothing, face normals
								no = globalNormals[ veckey3d(f.no) ]
								for v in f_v:
									file.write( ' %d//%d' % (\
									  v.index+totverts,\
									  no))
						else: # No Normals
							for v in f_v:
								file.write( ' %d' % (\
								  v.index+totverts))
	
					file.write('\n')
	
				# Write edges.
				if EXPORT_EDGES:
					LOOSE= Mesh.EdgeFlags.LOOSE
					for ed in edges:
						if ed.flag & LOOSE:
							file.write('f %d %d\n' % (ed.v1.index+totverts, ed.v2.index+totverts))
	
				# Make the indicies global rather then per mesh
				totverts += len(me.verts)
				if faceuv:
					totuvco += uv_unique_count
				me.verts= None
		file.close()
	
	
		# Now we have all our materials, save them
		if EXPORT_MTL:
			write_mtl(mtlFileName)
		
		if EXPORT_COPY_IMAGES:
			dest_dir = os.path.split(objFileName)[0]
			if dest_dir:
				copy_images(dest_dir)
			else:
				print '\tError: "%s" could not be used as a base for an image path.' % objFileName

	#if EXPORT_CAM or octaneRender:
	if octaneRender:
		
		if octaneActiveCamera.val<>'':

			camObj=Blender.Camera.Get(octaneActiveCamera.val)

			lensAperture = ''
			if octaneLensAperture.val:
				lensApertureValue=octaneLensApertureValue.val
			
				if octaneLensApertureCurve.val<>0:
					camIpo=camObj.getIpo()
					ipoCurve=camIpo[Ipo.CA_APERT]
					lensApertureValue=ipoCurve[frame]*100
	
				lensAperture=' --cam-aperture '+str(lensApertureValue)
	
			focalDepth = ''
			if octaneFocalDepth.val: 
				focalDepthValue=octaneFocalDepthValue.val
				
				if octaneFocalDepthCurve.val<>0:
					camIpo=camObj.getIpo()
					ipoCurve=camIpo[Ipo.CA_FDIST]
					focalDepthValue=ipoCurve[frame]
		
				focalDepth=' --cam-focaldepth '+str(focalDepthValue)
		
		samplesPerImage=''
		if exitAfter:
			samplesPerImage='-s '+str(octaneExportSamplesPerImage.val)
#		write_cam(camFileName)
		ocsFile=os.path.join(octaneProjectPath.val,extractBase(context_name[0])+'.ocs').replace("\\", "/")
		objFile=objFileName
		meshName=octaneProjectName.val
		outImage=pngFileName
		
		write_command(context_name[0]+batch_ext, meshName,objFile,samplesPerImage+lensAperture+focalDepth,outImage,ocsFile,frame,exitAfter)
			
	print "OBJ Export time: %.2f" % (sys.time() - time1)

def saveValues():
	#Save the Octane and obj export values in the scene properties
# 	scene.properties['Octane']['octaneRenderBinary']=octaneRenderBinary.val
	scene.properties['Octane']['octaneProjectPath']=octaneProjectPath.val
	scene.properties['Octane']['octaneProjectName']=octaneProjectName.val
	scene.properties['Octane']['octaneExportSamplesPerImage'] = octaneExportSamplesPerImage.val
	scene.properties['Octane']['octaneCameraMotion']=octaneCameraMotion.val
	scene.properties['Octane']['octaneNativeUnitSize']=octaneNativeUnitSize.val
	scene.properties['Octane']['octaneResolution']=octaneResolution.val
	scene.properties['Octane']['octaneResolutionWidth']=octaneResolutionWidth.val
	scene.properties['Octane']['octaneResolutionHeight']=octaneResolutionHeight.val
	scene.properties['Octane']['octanePercentSize']=octanePercentSize.val
	scene.properties['Octane']['octaneExportCamera']=octaneExportCamera.val
	scene.properties['Octane']['octaneActiveCamera']=octaneActiveCamera.val
	scene.properties['Octane']['octaneLensAperture']=octaneLensAperture.val
	scene.properties['Octane']['octaneLensApertureValue']=octaneLensApertureValue.val
	scene.properties['Octane']['octaneLensApertureCurve']=octaneLensApertureCurve.val
	scene.properties['Octane']['octaneFocalDepth']=octaneFocalDepth.val
	scene.properties['Octane']['octaneFocalDepthValue']=octaneFocalDepthValue.val
	scene.properties['Octane']['octaneFocalDepthCurve']=octaneFocalDepthCurve.val
	scene.properties['Octane']['octaneInterpolateFrame']=octaneInterpolateFrame.val
	scene.properties['Octane']['octaneExportSunDirection']=octaneExportSunDirection.val
	scene.properties['Octane']['octaneGPUSelector']=octaneGPUSelector.val
	scene.properties['Octane']['octaneGPUUseList']=octaneGPUUseList.val
	scene.properties['Octane']['octaneActiveLightSource']=octaneActiveLightSource.val
	scene.properties['Octane']['octaneImageOutput']=octaneImageOutput.val
	scene.properties['Octane']['octaneAnimationStart']=octaneAnimationStart.val
	scene.properties['Octane']['octaneAnimationEnd']=octaneAnimationEnd.val
	scene.properties['Octane']['octaneAnimationStep']=octaneAnimationStep.val

	scene.properties['Octane']['EXPORT_APPLY_MODIFIERS']=EXPORT_APPLY_MODIFIERS.val
	scene.properties['Octane']['EXPORT_ROTX90']=EXPORT_ROTX90.val
	scene.properties['Octane']['EXPORT_TRI']=EXPORT_TRI.val
	scene.properties['Octane']['EXPORT_EDGES']=EXPORT_EDGES.val
	scene.properties['Octane']['EXPORT_NORMALS']=EXPORT_NORMALS.val
	scene.properties['Octane']['EXPORT_NORMALS_HQ']=EXPORT_NORMALS_HQ.val
	scene.properties['Octane']['EXPORT_UV']=EXPORT_UV.val
	scene.properties['Octane']['EXPORT_MTL']=EXPORT_MTL.val
	scene.properties['Octane']['REPLACE_MTL']=REPLACE_MTL.val
	scene.properties['Octane']['EXPORT_SEL_ONLY']=EXPORT_SEL_ONLY.val
	scene.properties['Octane']['EXPORT_REMOVE_HIDDEN']=EXPORT_REMOVE_HIDDEN.val
	scene.properties['Octane']['EXPORT_NOTRENDER']=EXPORT_NOTRENDER.val
	scene.properties['Octane']['EXPORT_ALL_SCENES']=EXPORT_ALL_SCENES.val
	scene.properties['Octane']['EXPORT_ANIMATION']=EXPORT_ANIMATION.val
	scene.properties['Octane']['EXPORT_COPY_IMAGES']=EXPORT_COPY_IMAGES.val
	scene.properties['Octane']['EXPORT_BLEN_OBS']=EXPORT_BLEN_OBS.val
	scene.properties['Octane']['EXPORT_GROUP_BY_OB']=EXPORT_GROUP_BY_OB.val
	scene.properties['Octane']['EXPORT_GROUP_BY_MAT']=EXPORT_GROUP_BY_MAT.val
	scene.properties['Octane']['EXPORT_KEEP_VERT_ORDER']=EXPORT_KEEP_VERT_ORDER.val
	scene.properties['Octane']['EXPORT_POLYGROUPS']=EXPORT_POLYGROUPS.val
	scene.properties['Octane']['EXPORT_CURVE_AS_NURBS']=EXPORT_CURVE_AS_NURBS.val

	scene.properties['Octane']['octaneWriteBatch']=octaneWriteBatch.val

def fileSelect(name,filename):
	if name=='octaneBinary':
		octaneRenderBinary.val = filename.replace("\\", "/")
		saveValues()
		saveRegVals()
		
	elif name=='projectName':
		octaneProjectPath.val = os.path.split(filename)[0].replace("\\", "/")
		octaneProjectName.val,ext =splitExt(os.path.split(filename)[1]) 
		saveValues()
		saveRegVals()
		
	elif name=='projectPath':
		octaneProjectPath.val = os.path.split(filename)[0].replace("\\", "/")
		saveValues()
		
	elif name=='imageOutput':
		octaneImageOutput.val = os.path.join(os.path.split(filename)[0],octaneProjectName.val+'.png').replace("\\", "/")
		saveValues()

def restoreFromScene():
	#Restore Octane and obj export values saved in the scene properties
	if 'Octane' in scene.properties:
# 		try:octaneRenderBinary.val=scene.properties['Octane']['octaneRenderBinary']
# 		except:pass
		try:octaneProjectPath.val=scene.properties['Octane']['octaneProjectPath']
		except:pass
		try:octaneProjectName.val=scene.properties['Octane']['octaneProjectName']
		except:pass
		try:octaneExportSamplesPerImage.val=scene.properties['Octane']['octaneExportSamplesPerImage'] 
		except:pass
		try:octaneCameraMotion.val=scene.properties['Octane']['octaneCameraMotion']
		except:pass
		try:octaneNativeUnitSize.val=scene.properties['Octane']['octaneNativeUnitSize']
		except:pass
		try:octaneResolution.val=scene.properties['Octane']['octaneResolution']
		except:pass
		try:octaneResolutionWidth.val=scene.properties['Octane']['octaneResolutionWidth']
		except:pass
		try:octaneResolutionHeight.val=scene.properties['Octane']['octaneResolutionHeight']
		except:pass
		try:octanePercentSize.val=scene.properties['Octane']['octanePercentSize']
		except:pass
		try:octaneExportCamera.val=scene.properties['Octane']['octaneExportCamera']
		except:pass
		try:octaneActiveCamera.val=scene.properties['Octane']['octaneActiveCamera']
		except:pass
		try:octaneLensAperture.val=scene.properties['Octane']['octaneLensAperture']
		except:pass
		try:octaneLensApertureValue.val=scene.properties['Octane']['octaneLensApertureValue']
		except:pass
		try:octaneLensApertureCurve.val=scene.properties['Octane']['octaneLensApertureCurve']
		except:pass
		try:octaneFocalDepth.val=scene.properties['Octane']['octaneFocalDepth']
		except:pass
		try:octaneFocalDepthValue.val=scene.properties['Octane']['octaneFocalDepthValue']
		except:pass
		try:octaneFocalDepthCurve.val=scene.properties['Octane']['octaneFocalDepthCurve']
		except:pass
		try:octaneInterpolateFrame.val=scene.properties['Octane']['octaneInterpolateFrame']
		except:pass
		try:octaneExportSunDirection.val=scene.properties['Octane']['octaneExportSunDirection']
		except:pass
		try:octaneGPUSelector.val=scene.properties['Octane']['octaneGPUSelector']
		except:pass
		try:octaneGPUUseList.val=scene.properties['Octane']['octaneGPUUseList']
		except:pass
		try:octaneActiveLightSource.val=scene.properties['Octane']['octaneActiveLightSource']
		except:pass
		try:octaneImageOutput.val=scene.properties['Octane']['octaneImageOutput']
		except:pass
		try:octaneAnimationStart.val=scene.properties['Octane']['octaneAnimationStart']
		except:pass
		try:octaneAnimationEnd.val=scene.properties['Octane']['octaneAnimationEnd']
		except:pass
		try:octaneAnimationStep.val=scene.properties['Octane']['octaneAnimationStep']
		except:pass

		try:EXPORT_APPLY_MODIFIERS.val=scene.properties['Octane']['EXPORT_APPLY_MODIFIERS']
		except:pass
		try:EXPORT_ROTX90.val=scene.properties['Octane']['EXPORT_ROTX90']
		except:pass
		try:EXPORT_TRI.val=scene.properties['Octane']['EXPORT_TRI']
		except:pass
		try:EXPORT_EDGES.val=scene.properties['Octane']['EXPORT_EDGES']
		except:pass
		try:EXPORT_NORMALS.val=scene.properties['Octane']['EXPORT_NORMALS']
		except:pass
		try:EXPORT_NORMALS_HQ.val=scene.properties['Octane']['EXPORT_NORMALS_HQ']
		except:pass
		try:EXPORT_UV.val=scene.properties['Octane']['EXPORT_UV']
		except:pass
		try:EXPORT_MTL.val=scene.properties['Octane']['EXPORT_MTL']
		except:pass
		try:REPLACE_MTL.val=scene.properties['Octane']['REPLACE_MTL']
		except:pass
		try:EXPORT_SEL_ONLY.val=scene.properties['Octane']['EXPORT_SEL_ONLY']
		except:pass
		try:EXPORT_REMOVE_HIDDEN.val=scene.properties['Octane']['EXPORT_REMOVE_HIDDEN']
		except:pass
		try:EXPORT_NOTRENDER.val=scene.properties['Octane']['EXPORT_NOTRENDER']
		except:pass
		try:EXPORT_ALL_SCENES.val=scene.properties['Octane']['EXPORT_ALL_SCENES']
		except:pass
		try:EXPORT_ANIMATION.val=scene.properties['Octane']['EXPORT_ANIMATION']
		except:pass
		try:EXPORT_COPY_IMAGES.val=scene.properties['Octane']['EXPORT_COPY_IMAGES']
		except:pass
		try:EXPORT_BLEN_OBS.val=scene.properties['Octane']['EXPORT_BLEN_OBS']
		except:pass
		try:EXPORT_GROUP_BY_OB.val=scene.properties['Octane']['EXPORT_GROUP_BY_OB']
		except:pass
		try:EXPORT_GROUP_BY_MAT.val=scene.properties['Octane']['EXPORT_GROUP_BY_MAT']
		except:pass
		try:EXPORT_KEEP_VERT_ORDER.val=scene.properties['Octane']['EXPORT_KEEP_VERT_ORDER']
		except:pass
		try:EXPORT_POLYGROUPS.val=scene.properties['Octane']['EXPORT_POLYGROUPS']
		except:pass
		try:EXPORT_CURVE_AS_NURBS.val=scene.properties['Octane']['EXPORT_CURVE_AS_NURBS']
		except:pass

		try:octaneWriteBatch.val=scene.properties['Octane']['octaneWriteBatch']
		except:pass
	else:
		scene.properties['Octane']={}

	#Initialise fields with Blender values if they don't existe yet
	if 'octaneProjectPath' not in scene.properties['Octane'] and octaneProjectPath.val=='':octaneProjectPath.val=defaultDir
	if 'octaneProjectName' not in scene.properties['Octane']:octaneProjectName.val=blendFileName.replace(" ", "_")
	
	cam=Scene.GetCurrent().getCurrentCamera()
	if 'octaneActiveCamera' not in scene.properties['Octane']:octaneActiveCamera.val=cam.getName()
# 	if 'octaneLensApertureValue' not in scene.properties['Octane']:octaneLensApertureValue.val=cam.data.getLens()
# 	if 'octaneFocalDepthValue' not in scene.properties['Octane']:octaneFocalDepthValue.val=cam.data.dofDist

	if 'octaneActiveLightSource' not in scene.properties['Octane']:
		for obj in Blender.Object.Get():
			if obj.getType()=="Lamp":
				if obj.data.getType() == 1:
					octaneActiveLightSource.val=obj.getName()
					break

	if 'octaneResolutionWidth' not in scene.properties['Octane']:octaneResolutionWidth.val=Scene.GetCurrent().getRenderingContext().imageSizeX()
	if 'octaneResolutionHeight' not in scene.properties['Octane']:octaneResolutionHeight.val=Scene.GetCurrent().getRenderingContext().imageSizeY()

	if 'octanePercentSize' not in scene.properties['Octane']:octanePercentSize.val=abs(4-Blender.Scene.GetCurrent().getRenderingContext().getRenderWinSize()/25)	

	if 'octaneImageOutput' not in scene.properties['Octane']:octaneImageOutput.val=os.path.join(octaneProjectPath.val,octaneProjectName.val+'.png').replace("\\", "/")

	context = Scene.GetCurrent().getRenderingContext()
	if 'octaneAnimationStart' not in scene.properties['Octane']:octaneAnimationStart.val=context.startFrame()
	if 'octaneAnimationEnd' not in scene.properties['Octane']:octaneAnimationEnd.val=context.endFrame()
	
	
def write_ui():
	GLOBALS['EVENT'] = EVENT_REDRAW

	def obj_ui_set_event(e,v):
		GLOBALS['EVENT'] = e

	def do_split(e,v):
		global EXPORT_BLEN_OBS, EXPORT_GROUP_BY_OB, EXPORT_GROUP_BY_MAT, EXPORT_APPLY_MODIFIERS, KEEP_VERT_ORDER, EXPORT_POLYGROUPS
		if EXPORT_BLEN_OBS.val or EXPORT_GROUP_BY_OB.val or EXPORT_GROUP_BY_MAT.val or EXPORT_APPLY_MODIFIERS.val:
			EXPORT_KEEP_VERT_ORDER.val = 0
		else:
			EXPORT_KEEP_VERT_ORDER.val = 1

	def do_vertorder(e,v):
		global EXPORT_BLEN_OBS, EXPORT_GROUP_BY_OB, EXPORT_GROUP_BY_MAT, EXPORT_APPLY_MODIFIERS, KEEP_VERT_ORDER
		if EXPORT_KEEP_VERT_ORDER.val:
			EXPORT_BLEN_OBS.val = EXPORT_GROUP_BY_OB.val = EXPORT_GROUP_BY_MAT.val = EXPORT_APPLY_MODIFIERS.val = 0
		else:
			if not (EXPORT_BLEN_OBS.val or EXPORT_GROUP_BY_OB.val or EXPORT_GROUP_BY_MAT.val or EXPORT_APPLY_MODIFIERS.val):
				EXPORT_KEEP_VERT_ORDER.val = 1


	def do_help(e,v):
		url = __url__[0]
		print 'Trying to open web browser with documentation at this address...'
		print '\t' + url

		try:
			import webbrowser
			webbrowser.open(url)
		except:
			print '...could not open a browser window.'

	#-------------------------------------------------------------------------------------------------------------------
	#UI Variables
	global startGuiPos,ypos
	
	(width, height)= Window.GetAreaSize()
	startGuiPos=620
	menuSize=74
	menuPos=9

	# Center based on overall pup size
	ui_x=10
	ypos=startGuiPos-40
	
	def octane_ui():
		global ypos
		global octaneRenderBinary,octaneExportSamplesPerImage, octaneExportSamplesPerImagePresets, octaneCameraMotion, octaneProjectPath,octaneProjectName,octaneReplaceProject, octaneNativeUnitSize
		global octaneResolution,octaneResolutionWidth,octaneResolutionHeight,octanePercentSize, octaneExportCamera, octaneActiveCamera
		global octaneLensAperture, octaneLensApertureValue, octaneLensApertureCurve, octaneFocalDepth,octaneFocalDepthValue,octaneFocalDepthCurve, octaneCameraMotion,octaneInterpolateFrame
		global octaneExportSunDirection,octaneActiveLightSource,octaneImageOutput,octaneAnimationStart,octaneAnimationEnd,octaneAnimationStep
		global octaneGPUSelector,octaneGPUUseList  
		
		(width, height)= Window.GetAreaSize()
		glColor3f(1,1,1)
		glRectf(ui_x,ypos,width,ypos+1)

		glRasterPos2i(ui_x,ypos+7)
		Draw.Text("Project Configuration")

		ypos-=30
		Draw.Label('Octane Render Binary: ', ui_x, ypos, 220, 20)
		octaneRenderBinary = Draw.String("", EVENT_NONE, ui_x+140, ypos, 240, 20, octaneRenderBinary.val,200,"Path to the Octane Render Binary")
		Draw.Button("browse", EVENT_NONE, ui_x+384, ypos, 60 ,20,"open file selector",lambda e,v:Window.FileSelector(lambda val: fileSelect("octaneBinary", val), "Select Octane Binary Path"))

		ypos-=25
		Draw.Label('Octane Project Path: ', ui_x, ypos, 220, 20)
		octaneProjectPath = Draw.String("", EVENT_NONE, ui_x+140, ypos, 240, 20, octaneProjectPath.val,200,"Path to the Octane project")
		Draw.Button("browse", EVENT_NONE, ui_x+384, ypos, 60 ,20,"open file selector",lambda e,v:Window.FileSelector(lambda val: fileSelect("projectPath", val), "Select project path"))

		ypos-=25
		Draw.Label('Octane Project Name: ', ui_x, ypos, 220, 20)
		octaneProjectName = Draw.String("", EVENT_NONE, ui_x+140, ypos, 160, 20, octaneProjectName.val,200,"Octane project Name")
		Draw.Button("Use existing project", EVENT_NONE, ui_x+304, ypos, 120 ,20,"open file selector",lambda e,v:Window.FileSelector(lambda val: fileSelect("projectName", val), "Select existing project name"))
		octaneReplaceProject = Draw.Toggle('R', EVENT_REDRAW, ui_x+424, ypos, 20, 20, octaneReplaceProject.val, 'Replace the existing project (OCS file)')

		ypos-=25
		Draw.Label('Native unit size: ', ui_x, ypos, 220, 20)
		menustr = "Miles %x11|Furlongs %x10|Yards %x9|Feets %x8|Inches %x7|Kilometers %x6|Hectometers %x5|Decameters %x4|Meters %x3|Decimeters %x2|Centimeters %x1|Millimeters %x0|Native Unit Size:%t"
		octaneNativeUnitSize = Draw.Menu(menustr,EVENT_NONE,ui_x+140,ypos,304,20,octaneNativeUnitSize.val,"Native unit size")

		ypos-=30
		glRasterPos2i(ui_x,ypos+7)
		Draw.Text('Export Configuration')
		glRectf(ui_x,ypos,width,ypos+1)

		glRasterPos2i(width-35,ypos+7)
		Draw.Text('Film')

		ypos-=25
		octaneResolution = Draw.Toggle('Resolution', EVENT_REDRAW, ui_x, ypos, 100, 20, octaneResolution.val, 'Use personal resolution')
		if octaneResolution.val:
			octaneResolutionWidth = Draw.Slider("Width ", EVENT_NONE, ui_x+105, ypos, 135, 20, octaneResolutionWidth.val, 1, 4096, 0, "Width")
			octaneResolutionHeight = Draw.Slider("Height ", EVENT_NONE, ui_x+245, ypos, 135, 20, octaneResolutionHeight.val, 1, 4096, 0, "Height")
			menustr = "25% %x3|50% %x2|75% %x1|100% %x0|Size: %t"
			octanePercentSize = Draw.Menu(menustr,EVENT_REDRAW,ui_x+385,ypos,60,20,octanePercentSize.val,"Size")


		ypos-=25
		Draw.Label('Camera', ui_x, ypos, 220, 20)
		octaneExportCamera = Draw.Toggle('Export Camera', EVENT_REDRAW, ui_x, ypos, 100, 20, octaneExportCamera.val, 'Export Camera')
		if octaneExportCamera.val:
			Draw.Label('Active Camera', ui_x+105, ypos, 220, 20)
			octaneActiveCamera = Draw.String("", EVENT_NONE, ui_x+200, ypos, 180, 20, octaneActiveCamera.val,200,"Active camera")
			Draw.Button("Select", eventSelectActiveCamera, ui_x+384, ypos, 60 ,20,"Select active camera")
		

		ypos-=25
		octaneLensAperture = Draw.Toggle('Lens Aperture', EVENT_REDRAW, ui_x, ypos, 100, 20, octaneLensAperture.val, 'Lens aperture')
		if octaneLensAperture.val:
			octaneLensApertureValue = Draw.Slider("Value: ", EVENT_NONE, ui_x+105, ypos, 235, 20, octaneLensApertureValue.val, -1.0, 100.0, 0, "Value")		

			menustr = "None %x0|IpoCurve: %t"
			try:
				camObj=Blender.Camera.Get(octaneActiveCamera.val)
				camIpo=camObj.getIpo()
				print camIpo.name
				if camIpo[Ipo.CA_APERT]:
					menustr = camIpo.name +" %x1|" + menustr
			except:
				pass				
			#octaneLensApertureCurve = Draw.Toggle("A", EVENT_NONE, ui_x+384, ypos, 60, 20, octaneLensApertureCurve.val, "Curve - Not implemented yet")
			octaneLensApertureCurve = Draw.Menu(menustr,EVENT_REDRAW,ui_x+344,ypos,100,20,octaneLensApertureCurve.val,"Curve")
					
		ypos-=25
		octaneFocalDepth = Draw.Toggle('Focal Depth', EVENT_REDRAW, ui_x, ypos, 100, 20, octaneFocalDepth.val, 'Focal depth')
		if octaneFocalDepth.val:
			octaneFocalDepthValue = Draw.Slider("Value: ", EVENT_NONE, ui_x+105, ypos, 235, 20, octaneFocalDepthValue.val, -1.0, 100.0, 0, "Value")		
			menustr = "None %x0|IpoCurve: %t"
			try:
				camObj=Blender.Camera.Get(octaneActiveCamera.val)
				camIpo=camObj.getIpo()
				print camIpo.name
				if camIpo[Ipo.CA_FDIST]:
					menustr = camIpo.name +" %x1|" + menustr
			except:
				pass				
			#octaneFocalDepthCurve = Draw.Toggle("A", EVENT_NONE, ui_x+384, ypos, 60, 20, octaneFocalDepthCurve.val, "Curve - Not implemented yet")		
			octaneFocalDepthCurve = Draw.Menu(menustr,EVENT_REDRAW,ui_x+344,ypos,100,20,octaneFocalDepthCurve.val,"Curve")
		
		ypos-=25
		octaneCameraMotion = Draw.Toggle('Camera motion', EVENT_REDRAW, ui_x, ypos, 100, 20, octaneCameraMotion.val, 'Use camera motion for animation')
		if octaneCameraMotion.val:
			Draw.Label('Interpolate', ui_x+125, ypos, 220, 20)
			menustr = "Previous %x1|Next %x0|Frame: %t"
			octaneInterpolateFrame = Draw.Menu(menustr,EVENT_REDRAW,ui_x+200,ypos,180,20,octaneInterpolateFrame.val,"Interpolate frame")

		ypos-=30
		glRasterPos2i(width-135,ypos+7)
		Draw.Text('Daylight Environment')
		glRectf(ui_x,ypos,width,ypos+1)

		ypos-=25
		octaneExportSunDirection = Draw.Toggle('Export Sun Dir', EVENT_REDRAW, ui_x, ypos, 100, 20, octaneExportSunDirection.val, 'Export sun direction')
		if octaneExportSunDirection.val:
			Draw.Label('Light Source', ui_x+105, ypos, 220, 20)
			octaneActiveLightSource = Draw.String("", EVENT_NONE, ui_x+200, ypos, 180, 20, octaneActiveLightSource.val,200,"Active light source")
			Draw.Button("Select", eventSelectActiveLightSource, ui_x+384, ypos, 60 ,20,"Select active light source")
			
		ypos-=30
		glRasterPos2i(ui_x,ypos+7)
		Draw.Text('GPU Devices')
		glRectf(ui_x,ypos,width,ypos+1)

		ypos-=25
		octaneGPUSelector = Draw.Toggle("GPU Devices to use", EVENT_NONE, ui_x, ypos, 145, 20, octaneGPUSelector.val, "Specify GPU devices to use")		
		octaneGPUUseList = Draw.String("", EVENT_NONE, ui_x+150, ypos, 295, 20, octaneGPUUseList.val,200,"GPUs to use (ex: 0 1 2)")

		ypos-=30
		glRasterPos2i(ui_x,ypos+7)
		Draw.Text('Export')
		glRectf(ui_x,ypos,width,ypos+1)

		glRasterPos2i(width-50,ypos+7)
		Draw.Text('Frame')

		ypos-=25
		Draw.Label('Frame', ui_x, ypos, 220, 20)
		Draw.Button("Eport OBJ/MTL Only", eventExportOBJOnly, ui_x, ypos, 220 ,20,"Only export OBJ/MTL")
		Draw.Button("Render", eventFrameRender, ui_x+225, ypos, 220 ,20,"Export OBJ/MTL, create OCS if it doesn't exist and render")


		ypos-=30
		glRasterPos2i(width-70,ypos+7)
		Draw.Text('Animation')
		glRectf(ui_x,ypos,width,ypos+1)

		ypos-=25
		Draw.Label('Image Output: ', ui_x, ypos, 220, 20)
		octaneImageOutput = Draw.String("", EVENT_NONE, ui_x+150, ypos, 230, 20, octaneImageOutput.val,200,"Image output path and name")
		Draw.Button("browse", EVENT_NONE, ui_x+384, ypos, 60 ,20,"open file selector",lambda e,v:Window.FileSelector(lambda val: fileSelect("imageOutput", val), "Select image output path"))

		ypos-=25
		octaneAnimationStart = Draw.Slider("Start ", EVENT_NONE, ui_x, ypos, 145, 20, octaneAnimationStart.val, 1, 20000, 0, "Start frame")
		octaneAnimationEnd = Draw.Slider("End ", EVENT_NONE, ui_x+150, ypos, 145, 20, octaneAnimationEnd.val, 1, 20000, 0, "End frame")
		octaneAnimationStep = Draw.Slider("Step ", EVENT_NONE, ui_x+300, ypos, 145, 20, octaneAnimationStep.val, 1, 100, 0, "Step")

		ypos-=25
		octaneExportSamplesPerImage = Draw.Number("Samples:", EVENT_REDRAW, ui_x, ypos, 145, 20, octaneExportSamplesPerImage.val, 4, 64000)
		menustr = "Very High (4096 s/px) %x5|High (1024 s/px) %x4|Medium/High (512 s/px) %x3|Medium (256 s/px) %x2|Low (32 s/px) %x1|Very Low (8 s/px) %x0|Pixelsamples: %t"
		octaneExportSamplesPerImagePresets = Draw.Menu(menustr,eventExportSamplesPerImagePresets,ui_x+150,ypos,145,20,octaneExportSamplesPerImagePresets.val,"Interpolate frame")
		Draw.Button("Render Animation", eventAnimationRender, ui_x+300, ypos, 145 ,20,"Export OBJ/MTL and render")

	def obj_ui():
		global ypos
		global EXPORT_APPLY_MODIFIERS, EXPORT_ROTX90, EXPORT_TRI, EXPORT_EDGES,\
			EXPORT_NORMALS, EXPORT_NORMALS_HQ, EXPORT_UV,\
			EXPORT_MTL, REPLACE_MTL, EXPORT_CAM, EXPORT_SEL_ONLY, EXPORT_REMOVE_HIDDEN, EXPORT_NOTRENDER, EXPORT_ALL_SCENES,\
			EXPORT_ANIMATION, EXPORT_COPY_IMAGES, EXPORT_BLEN_OBS,\
			EXPORT_GROUP_BY_OB, EXPORT_GROUP_BY_MAT, EXPORT_KEEP_VERT_ORDER,\
			EXPORT_POLYGROUPS, EXPORT_CURVE_AS_NURBS, octaneWriteBatch, EXPORT_NOTHING

		glRasterPos2i(ui_x,ypos+7)
		Draw.Text('Context ...')
		glRectf(ui_x,ypos,width,ypos+1)

		ypos-=30
#		Draw.BeginAlign()
		if EXPORT_NOTHING.val==0:
			EXPORT_SEL_ONLY = Draw.Toggle('Selection Only', EVENT_NONE, ui_x, ypos, 115, 20, EXPORT_SEL_ONLY.val, 'Only export objects in visible selection. Else export whole scene.')
			if EXPORT_SEL_ONLY.val==0:
				EXPORT_REMOVE_HIDDEN = Draw.Toggle('Remove Hidden', EVENT_NONE, ui_x+115, ypos, 115, 20, EXPORT_REMOVE_HIDDEN.val, 'Remove hidden objects from export result')
	# 			EXPORT_NOTRENDER = Draw.Toggle('Not Rendered', EVENT_NONE, ui_x+229, ypos, 110, 20, EXPORT_NOTRENDER.val, 'Export objects marked as not rendered')
	# 		EXPORT_ALL_SCENES = Draw.Toggle('All Scenes', EVENT_NONE, ui_x+119, ypos, 110, 20, EXPORT_ALL_SCENES.val, 'Each scene as a separate OBJ file.')
	# 		EXPORT_ANIMATION = Draw.Toggle('Animation', EVENT_NONE, ui_x+229, ypos, 110, 20, EXPORT_ANIMATION.val, 'Each frame as a numbered OBJ file.')
		EXPORT_NOTHING = Draw.Toggle('Nothing', EVENT_NONE, ui_x+229, ypos, 110, 20, EXPORT_NOTHING.val, 'Do not export the obj file, assuming it already exists.')
#		Draw.EndAlign()
		
		ypos-=30

		glRasterPos2i(ui_x,ypos+7)
		Draw.Text('Output Options ...')
		glRectf(ui_x,ypos,width,ypos+1)

		ypos-=30
		Draw.BeginAlign()
		EXPORT_APPLY_MODIFIERS = Draw.Toggle('Apply Modifiers', EVENT_REDRAW, ui_x, ypos, 110, 20, EXPORT_APPLY_MODIFIERS.val, 'Use transformed mesh data from each object. May break vert order for morph targets.', do_split)
		EXPORT_ROTX90 = Draw.Toggle('Rotate X90', EVENT_NONE, ui_x+119, ypos, 110, 20, EXPORT_ROTX90.val, 'Rotate on export so Blenders UP is translated into OBJs UP')
		EXPORT_COPY_IMAGES = Draw.Toggle('Copy Images', EVENT_NONE, ui_x+229, ypos, 110, 20, EXPORT_COPY_IMAGES.val, 'Copy image files to the export directory, never overwrite.')
		Draw.EndAlign()

		ypos-=30

		glRasterPos2i(ui_x,ypos+7)
		Draw.Text('Export ...')
		glRectf(ui_x,ypos,width,ypos+1)

		ypos-=30
		Draw.BeginAlign()
		EXPORT_EDGES = Draw.Toggle('Edges', EVENT_NONE, ui_x, ypos, 50, 20, EXPORT_EDGES.val, 'Edges not connected to faces.')
		EXPORT_TRI = Draw.Toggle('Triangulate', EVENT_NONE, ui_x+59, ypos, 70, 20, EXPORT_TRI.val, 'Triangulate quads.')
		Draw.EndAlign()
		
		Draw.BeginAlign()
		EXPORT_MTL = Draw.Toggle('Materials', EVENT_NONE, ui_x+129, ypos, 70, 20, EXPORT_MTL.val, 'Write a separate MTL file with the OBJ.')
# 		if EXPORT_MTL.val:
# 			REPLACE_MTL = Draw.Toggle('R', EVENT_NONE, ui_x+199, ypos, 20, 20, REPLACE_MTL.val, 'Replace MTL file')
		EXPORT_UV = Draw.Toggle('UVs', EVENT_NONE, ui_x+219, ypos, 31, 20, EXPORT_UV.val, 'Export texface UV coords.')
		Draw.EndAlign()
		Draw.BeginAlign()
		EXPORT_NORMALS = Draw.Toggle('Normals', EVENT_NONE, ui_x+250, ypos, 59, 20, EXPORT_NORMALS.val, 'Export vertex normal data (Ignored on import).')
		EXPORT_NORMALS_HQ = Draw.Toggle('HQ', EVENT_NONE, ui_x+309, ypos, 31, 20, EXPORT_NORMALS_HQ.val, 'Calculate high quality normals for rendering.')
		Draw.EndAlign()
		
		ypos-=25
		EXPORT_POLYGROUPS = Draw.Toggle('Polygroups', EVENT_REDRAW, ui_x, ypos, 120, 20, EXPORT_POLYGROUPS.val, 'Export vertex groups as OBJ groups (one group per face approximation).')

		EXPORT_CURVE_AS_NURBS = Draw.Toggle('Nurbs', EVENT_NONE, ui_x+139, ypos, 100, 20, EXPORT_CURVE_AS_NURBS.val, 'Export 3D nurbs curves and polylines as OBJ curves, (bezier not supported).')

# 		ypos-=30
# 
# 		glRasterPos2i(ui_x,ypos+7)
# 		Draw.Text('Blender Objects as OBJ:')
# 		glRectf(ui_x,ypos,width,ypos+1)
# 
# 		ypos-=30
# 		Draw.BeginAlign()
# 		EXPORT_BLEN_OBS = Draw.Toggle('Objects', EVENT_REDRAW, ui_x, ypos, 60, 20, EXPORT_BLEN_OBS.val, 'Export blender objects as "OBJ objects".', do_split)
# 		EXPORT_GROUP_BY_OB = Draw.Toggle('Groups', EVENT_REDRAW, ui_x+69, ypos, 60, 20, EXPORT_GROUP_BY_OB.val, 'Export blender objects as "OBJ Groups".', do_split)
# 		EXPORT_GROUP_BY_MAT = Draw.Toggle('Material Groups', EVENT_REDRAW, ui_x+129, ypos, 100, 20, EXPORT_GROUP_BY_MAT.val, 'Group by materials.', do_split)
# 		EXPORT_KEEP_VERT_ORDER = Draw.Toggle('Keep Vert Order', EVENT_REDRAW, ui_x+239, ypos, 100, 20, EXPORT_KEEP_VERT_ORDER.val, 'Keep vert and face order, disables some other options. Use for morph targets.', do_vertorder)
# 		Draw.EndAlign()

# 		ypos-=30
# 
#  		glRasterPos2i(ui_x,ypos+7)
# 		Draw.Text('Other ...')
# 		glRectf(ui_x,ypos,width,ypos+1)
# 
# 		ypos-=25
# 		octaneWriteBatch = Draw.Toggle('Write Batch', EVENT_REDRAW, ui_x, ypos, 100, 20, octaneWriteBatch.val, 'Write a batch file')


	#Draw the gui interface
	#------------------------------------------------------------------------
	def s(name, value):
		
		GLOBALS[name]= value
	
	def g(name):
	
		try:
			value= GLOBALS[name]
		except:
			value= 0
			s(name, value)
	
		return value
	
	def drawLine(x, y):
	
		glColor3f(1,1,1)
		glRectf(x, y+1,       x+menuSize, y+3) # _ Top
	
	# Background
	glColor3f(0.6,0.6,0.6)
	glRectf(0,0,width,height)

	Draw.BeginAlign()
	Draw.Button("Octane",	EVENT_REDRAW,  menuPos,			startGuiPos,menuSize, 16, "",lambda e,v: s("guiTab", 0))
	Draw.Button("Advanced",EVENT_REDRAW,  menuPos+menuSize,	startGuiPos,menuSize, 16, "",lambda e,v: s("guiTab", 1))

	glColor3f(0.7,0.8,1)
	glRasterPos2i(width-250,startGuiPos+3)
	Draw.Text('Octane/OBJ Export Version 2.2','large')
	Draw.EndAlign()
	
	# Underline	
	if(g("guiTab") == 0):
		drawLine(menuPos, startGuiPos-5)
		octane_ui()
	elif(g("guiTab") == 1):
		drawLine(menuPos+menuSize, startGuiPos-5)
		obj_ui()
	else:
		s("guiTab", 0)
		drawLine(menuPos, startGuiPos-5)
		octane_ui()
	#Draw.UIBlock(obj_ui, 0)

	ypos=5
	Draw.BeginAlign()
	Draw.PushButton('Cancel', EVENT_EXIT, ui_x, ypos, 110, 20, '', obj_ui_set_event)
	#Draw.PushButton('Export', EVENT_EXPORT, ui_x+110, ypos, 110, 20, 'Export with these settings', obj_ui_set_event)
	#Draw.PushButton('Online Help', EVENT_REDRAW, ui_x+220, ypos, 110, 20, 'Load the wiki page for this script', do_help)
	Draw.EndAlign()

	ypos+=25
	glRectf(ui_x,ypos,width,ypos+1)
	
	glColor3f(1,0,0)
	glRasterPos2i(130,10)
	Draw.Text(GLOBALS['message'])

	GLOBALS['message']=''	

#Save registry
def saveRegVals():
	regVals = {}
	regVals['octaneBinary']=octaneRenderBinary.val
	regVals['octaneProjectPath']=octaneProjectPath.val
	Blender.Registry.SetKey('Octane', regVals, True)

regVals=Blender.Registry.GetKey('Octane', True)
#print regVals
try:octaneRenderBinary.val=regVals['octaneBinary']
except:pass
try:octaneProjectPath.val=regVals['octaneProjectPath']
except:pass
	
def event(evt, val):
  if (0):
	print

def buttonEvent(evt):
	if evt==EVENT_EXIT:
		Draw.Exit()
		return

	if octaneProjectName.val.find(' ')<>-1:
		octaneProjectName.val=fixName(octaneProjectName.val)
		GLOBALS['message']='Octane project name not correct, it has been fixed'
		errorCheck=True		
	
	elif evt==eventExportSamplesPerImagePresets:
		octaneExportSamplesPerImage.val = {
		  0: 8,
		  1: 32,
		  2: 256,
		  3: 512,
		  4: 1024,
		  5: 4096
		}[octaneExportSamplesPerImagePresets.val]
		
	#Start obj export / frame or animation rendering
	elif evt==eventAnimationRender or evt==eventFrameRender or evt==eventExportOBJOnly:
	
		#Check for errors
		errorCheck=False
		
		if octaneProjectPath.val.find(' ')<>-1:
			GLOBALS['message']='Space in Octane project path !'
			errorCheck=True

		elif not os.path.exists(octaneProjectPath.val):
			GLOBALS['message']='Octane project path not correct'
			errorCheck=True 

		elif octaneProjectName.val=='':
			GLOBALS['message']='Octane project name not correct'
			errorCheck=True		

		elif evt<>eventExportOBJOnly:
			if not os.path.exists(octaneRenderBinary.val):
				GLOBALS['message']='Octane binary file does not exist'
				errorCheck=True
				
# 			elif octaneRenderBinary.val.find(' ')<>-1:
# 				GLOBALS['message']='Space in Octane binary path !'
# 				errorCheck=True
				
			if not errorCheck and octaneExportCamera.val:
				try:obj=Blender.Object.Get(octaneActiveCamera.val)
				except:
					GLOBALS['message']='Camera not valid'
					errorCheck=True
					
			if not errorCheck and octaneExportSunDirection.val:
				try:obj=Blender.Object.Get(octaneActiveLightSource.val)
				except:
					GLOBALS['message']='Light source not valid'
					errorCheck=True
					
			if not errorCheck and evt==eventAnimationRender:
				if octaneImageOutput.val.find(' ')<>-1:
					GLOBALS['message']='Space in image output file !'
					errorCheck=True

				elif not os.path.exists(os.path.split(octaneImageOutput.val)[0]):
					GLOBALS['message']='Image output path not correct'
					errorCheck=True 

		if errorCheck:
			Blender.Redraw(1)
			return
	
		base_name=filename=os.path.join(octaneProjectPath.val,octaneProjectName.val).replace("\\", "/")

		if not filename.lower().endswith('.obj'):
			filename += '.obj'

		ext = '.obj'

		if evt<>eventAnimationRender and not BPyMessages.Warning_SaveOver(filename):
			return		

		if EXPORT_KEEP_VERT_ORDER.val:
			EXPORT_BLEN_OBS.val = False
			EXPORT_GROUP_BY_OB.val = False
			EXPORT_GROUP_BY_MAT.val = False
			EXPORT_APPLY_MODIFIERS.val = True
	
		Window.EditMode(0)
		Window.WaitCursor(1)	
	
		context_name = [base_name, '', '', ext] # basename, scene_name, framenumber, extension
			
		if evt<>eventExportOBJOnly and octaneWriteBatch.val:
			init_command(base_name+batch_ext)
	
		# Use the options to export the data using write()
		# def write(filename, objects, EXPORT_EDGES=False, EXPORT_NORMALS=False, EXPORT_MTL=True, EXPORT_COPY_IMAGES=False, EXPORT_APPLY_MODIFIERS=True):
		orig_scene = Scene.GetCurrent()
		if EXPORT_ALL_SCENES.val:
			export_scenes = Scene.Get()
		else:
			export_scenes = [orig_scene]
	
		# Export all scenes.
		animate=False
		for scn in export_scenes:
			scn.makeCurrent() # If alredy current, this is not slow.
			context = scn.getRenderingContext()
			orig_frame = Blender.Get('curframe')
	
			if EXPORT_ALL_SCENES.val: # Add scene name into the context_name
				context_name[1] = '_%s' % BPySys.cleanName(scn.name) # WARNING, its possible that this could cause a collision. we could fix if were feeling parranoied.
	
			# Export an animation?
			if evt==eventAnimationRender: 
				animate=True                                     
				scene_frames = xrange(octaneAnimationStart.val, octaneAnimationEnd.val+1,octaneAnimationStep.val) # up to and including the end frame.
				exitAfter=True
			else:
				scene_frames = [orig_frame] # Dont export an animation.
				exitAfter=False
					
			# Loop through all frames in the scene and export.
			for frame in scene_frames:
			
				GLOBALS['message']='Exporting/Rendering ...'
				Blender.Redraw(1)
				
				if animate: # Add frame to the filename.
					context_name[2] = '_%.6d' % frame
	
				Blender.Set('curframe', frame)
				if EXPORT_SEL_ONLY.val:
					export_objects = scn.objects.context
				else:
					export_objects = scn.objects
		
				# erm... bit of a problem here, this can overwrite files when exporting frames. not too bad.
				# EXPORT THE FILE.
				write(frame, context_name, export_objects,animate,\
				EXPORT_TRI.val, EXPORT_EDGES.val, EXPORT_NORMALS.val,\
				EXPORT_NORMALS_HQ.val, EXPORT_UV.val, EXPORT_MTL.val, REPLACE_MTL.val, octaneExportCamera.val,\
				EXPORT_COPY_IMAGES.val, EXPORT_APPLY_MODIFIERS.val,\
				EXPORT_ROTX90.val, EXPORT_BLEN_OBS.val,\
				EXPORT_GROUP_BY_OB.val, EXPORT_GROUP_BY_MAT.val, EXPORT_KEEP_VERT_ORDER.val,\
				EXPORT_POLYGROUPS.val, EXPORT_CURVE_AS_NURBS.val,evt<>eventExportOBJOnly,exitAfter)
	
			Blender.Set('curframe', orig_frame)
	
		# Restore old active scene.
		orig_scene.makeCurrent()
		Window.WaitCursor(0)
			
		GLOBALS['message']='End of Exporting/Rendering'
		Draw.Redraw()

	elif evt==eventSelectActiveCamera:
		#octaneActiveCamera.val=Scene.GetCurrent().getCurrentCamera().getName()
		obj=Scene.GetCurrent().objects.active
		if obj.getType() == "Camera":
			
			octaneActiveCamera.val=obj.getData(True)
			#octaneActiveCamera.val=obj.getName()
			#octaneLensApertureValue.val=obj.data.getLens()
			octaneFocalDepthValue.val=obj.data.dofDist
		
	elif evt==eventSelectActiveLightSource:
		obj=Scene.GetCurrent().objects.active
		if obj.getType() == "Lamp":
			octaneActiveLightSource.val=obj.getName()	

	saveValues()
	saveRegVals()

# 	restoreFromScene()
# 	print "couco"

	Blender.Redraw(1)


if __name__ == '__main__':

	#Get the blend file folder and filename
	defaultDir=os.path.split(Blender.Get('filename'))[0].replace("\\", "/")
	blendFileName,ext=splitExt(os.path.split(Blender.Get('filename'))[1])
		
	restoreFromScene()	

	GLOBALS['message']=''
    
	Draw.Register(write_ui, event, buttonEvent)
