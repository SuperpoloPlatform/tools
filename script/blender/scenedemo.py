import os
import time
import bpy
import mathutils
import platform

SYS = platform.system()

CurrentMat=''


def GenMapName(name):
    name=name.split('.')[0]
    if len(name) > 16:
        name=name.replace('a','').replace('e','').replace('i','').replace('o','').replace('u','')
        name=name.replace('A','').replace('E','').replace('I','').replace('O','').replace('U','')
        name=name.replace('_0','').replace('_','').replace('00','0').replace('00','0').replace('00','0')

    if len(name) > 16:
        v=0
        s=''
        for a in name:
            try:
                v+=int(float(a))
            except: 
                s+=a
                
        s=s.replace('B','b').replace('C','c').replace('D','d').replace('F','f').replace('G','g')
        s=s.replace('H','h').replace('L','l').replace('M','m').replace('N','n').replace('P','p')        
        s=s.replace('Q','q').replace('R','r').replace('S','s').replace('T','t').replace('V','v').replace('Z','z') 
                
        s=s.replace('bb','b').replace('cc','c').replace('dd','d').replace('ff','f').replace('gg','g')
        s=s.replace('hh','h').replace('ll','l').replace('mm','m').replace('nn','n').replace('pp','p')        
        s=s.replace('qq','q').replace('rr','r').replace('ss','s').replace('tt','t').replace('vv','v').replace('zz','z')                  
        
        name="N%sV%sS%s" % (len(name),v,s)
            
    return name



def DelObj(obj):
    bpy.ops.object.select_name(name=obj.name)
    bpy.context.scene.objects.active = obj
    bpy.ops.object.delete()



def stripFile(path):
    lastSlash= max(path.rfind('\\'), path.rfind('/'))
    if lastSlash != -1:
        path= path[:lastSlash]
    return '%s%s' % (path, os.sep)



def rn(v):
    return "%.1f" % v

def crob(obj):
    sw=True
    for ob in bpy.context.scene.objects:
        if ob.name == obj:
          sw=False
    return sw


def stripPath(path):
    return path.split('/')[-1].split('\\')[-1]

def stripExt(name): 
    index= name.rfind('.')
    if index != -1:
        return name[ : index ]
    else:
        return name

def unpack_list(list_of_tuples):
    l = []
    for t in list_of_tuples:
        l.extend(t)
    return l

def unpack_face_list(list_of_tuples):
    l = []
    for t in list_of_tuples:
        face = [i for i in t]
        if len(face) != 3 and len(face) != 4:
            raise RuntimeError("{0} vertices in face.".format(len(face)))
        if len(face) == 4 and face[3] == 0:
            face = [face[3], face[0], face[1], face[2]]
        if len(face) == 3:
            face.append(0)
        l.extend(face)
    return l


def line_value(line_split):
    length= len(line_split)
    if length == 1:
        return None
    elif length == 2:
        return line_split[1]
    elif length > 2:
        return ' '.join( line_split[1:] )
		
		




def strip_slash(line_split):
    if line_split[-1][-1]== '\\':
        if len(line_split[-1])==1:
            line_split.pop()
        else:
            line_split[-1]= line_split[-1][:-1]
        return True
    return False

def get_float_func(filepath):
    print(filepath)
    file= open(filepath, 'rU')
    for line in file: 
        line = line.lstrip()
        if line.startswith('v'): 
            if ',' in line:
                return lambda f: float(f.replace(',', '.'))
            elif '.' in line:
                return float
    return float 



def load_image(imagepath, dirname):

    if os.path.exists(imagepath):
        return bpy.data.images.load(imagepath)

    variants = [os.path.join(dirname, imagepath), os.path.join(dirname, os.path.basename(imagepath))]

    for path in variants:
        if os.path.exists(path):
            return bpy.data.images.load(path)
        else:
            print(path, "doesn't exist")
    return None





def obj_image_load(imagepath, DIR, use_image_search):
    if b'_' in imagepath:
        image = load_image(imagepath.replace(b'_', b' '), DIR)
        if image:
            return image

    image = load_image(imagepath, DIR)
    if image:
        return image

    print("failed to load %r doesn't exist" % imagepath)
    return None




def fixCollada(namefile):
    scene = bpy.context.scene
    SCL = scene.SCL 
    fin= open(namefile, 'r')
    f= open(namefile.replace('.dae','_FIXED.dae'), 'w')
    sw=1
    sws=0
    swY=False
    for line in fin:
        if '<up_axis>Y_UP</up_axis>' in line:
            line=line.replace('Y_UP','Z_UP')
            swY=True
        if '<rotate sid="jointOrientX">' in line: line='\t<rotate sid="jointOrientX">1 0 0 0.000</rotate>'
        if '<texture texture=' in line  : sw=0
        if '</texture>'in line  : 
            line=''
            sw=1
        if '<camera id=' in line  : sw=0
        if '</camera>'in line  : 
            line=''
            sw=1
        if '<light id=' in line  : sw=0
        if '</light>'in line  : 
            line=''
            sw=1
        if '</float_array>' in line : sws=0
        if sws==1:
            x=float(line.split()[0]) *SCL
            y=float(line.split()[1]) *SCL
            z=float(line.split()[2]) *SCL
            line="%s %s %s\n" % (x,y,z) 
        if 'Position-array' in line  and 'float_array' in line : sws=1
        if '<translate sid' in line:
            xyz=line.split('">')[1].split('</')[0]
            if swY:
                print('SWAP Z Y  -- Z-UP')
                x=float(xyz.split()[0]) *SCL
                y=float(xyz.split()[2]) *SCL
                z=float(xyz.split()[1]) *SCL
                y=y-y*2
            else:
                print('AXIS Z-UP')
                x=float(xyz.split()[0]) *SCL
                y=float(xyz.split()[1]) *SCL
                z=float(xyz.split()[2]) *SCL                
            line='\t<translate sid="translate">%s %s %s</translate>\n' % (x,y,z)
        if sw==1: f.write(line)
    f.close()
    fin.close()

	
	
	
def create_materials(filepath,context_material):
    print(' INFO: Start Make Mapping '+ context_material.name)
    DIR= stripFile(filepath)
    material_libs= []
    unique_materials= {}
    unique_material_images= {}

    def setMap(mapping,slot):
        if '|' in mapping:
            map = mapping.split('|')[1]
            map=map.split(' ')
    
            if len(map)>0:
                if map[0] == '1':
                    slot.extension = 'CLIP'
                slot.use_mirror_x = int(float(map[1]))
                slot.use_mirror_y = int(float(map[2]))
                slot.repeat_x = int(float(map[5]))
                slot.repeat_y = int(float(map[6]))
                slot.use_flip_axis = int(float(map[7]))
                slot.use_alpha = int(float(map[9]))
                slot.invert_alpha = int(float(map[10]))



    def load_material_image(blender_material, context_material_name, imagepath, type, mapping,DIR):

        import platform
        SYS = platform.system()
        Nt=True
        path=imagepath.split('|')[0]
        has_data = False
        
        textNameType=GenMapName(path)
        
        textNameType=type+'_'+textNameType
        
        
        #### TROVAMI MAP
        sw=True
        for t in blender_material.texture_slots:
            if t and t.texture.type == 'IMAGE' : 
                if textNameType==t.name.split('.')[0]:
                    print(' INFO: Start Textures Find '+t.name.split('.')[0])
                    try:
                        texture=t
                        has_data = t.texture.image.has_data
                        image=t.texture.image
                        texture=t.texture
                        mtex=t
                        sw=False
                    except: pass


        if sw:
            texture = bpy.data.textures.new(name=textNameType, type='IMAGE')
            image = load_image(path, DIR.replace('Materials','Textures'))
    


            print(DIR.replace('Materials','Textures')+path)
            
            if image and os.path.isfile(DIR.replace('Materials','Textures')+path):
                texture.image = image
                has_data = image.has_data



        if type == 'Kd':
            if has_data and image.depth == 32:
                if sw: mtex = blender_material.texture_slots.add()
                mtex.texture = texture
                mtex.texture_coords = 'UV'
                mtex.use_map_color_diffuse = True
                mtex.use_map_alpha = True

                texture.use_mipmap = True
                texture.use_interpolation = True
                texture.use_alpha = True
                #blender_material.use_transparency = True
                blender_material.alpha = 0.0
            else:
                if sw: 
                    mtex = blender_material.texture_slots.add()
                    mtex.texture = texture
                mtex.texture_coords = 'UV'
                mtex.use_map_color_diffuse = True

                setMap(mapping,mtex.texture)

            if image: unique_material_images[context_material_name] = image, has_data 

        elif type == 'Ka':
            if sw: mtex = blender_material.texture_slots.add()
            mtex.use_map_color_diffuse = False

            mtex.texture = texture
            mtex.texture_coords = 'UV'
            mtex.use_map_ambient = True

        elif type == 'Ks':
            if sw: mtex = blender_material.texture_slots.add()
            mtex.use_map_color_diffuse = False

            mtex.texture = texture
            mtex.texture_coords = 'UV'
            mtex.use_map_specular = True
            setMap(mapping,mtex.texture)

        elif type == 'Bump':
            if sw: mtex = blender_material.texture_slots.add()
            mtex.use_map_color_diffuse = False

            mtex.texture = texture
            mtex.texture_coords = 'UV'
            mtex.use_map_normal = True
            setMap(mapping,mtex.texture)

        elif type == 'D':
            if sw: mtex = blender_material.texture_slots.add()
            mtex.use_map_color_diffuse = False

            mtex.texture = texture
            mtex.texture_coords = 'UV'
            mtex.use_map_alpha = True
            #blender_material.use_transparency = True
            #blender_material.transparency_method = 'Z_TRANSPARENCY'
            blender_material.alpha = 0.0
            setMap(mapping,mtex.texture)

        elif type == 'refl':
            if sw: mtex = blender_material.texture_slots.add()
            mtex.use_map_color_diffuse = False

            mtex.texture = texture
            mtex.texture_coords = 'UV'
            mtex.use_map_reflect = True
            setMap(mapping,mtex.texture)

        else:
            raise Exception("invalid type %r" % type)


            try:
                
                map = mapping.split('|')[1]
                map=map.split(' ')
                if len(map)>0:
                    print('>>>>>>>>>>>>>>>>SUPERFLUO<<<<<<<<<<<<<')
                    if map[0] == '1':
                       texture.extension = 'clip'
                    print(texture.extension)
                    texture.mirror_x = map[1]
                    texture.mirror_y = map[2]
                    texture.repeat_x = map[3]
                    texture.repeat_y = map[4]
                    mapping_sX = map[5]
                    mapping_sY = map[6]
                    mapping_flipXY = map[7]
                    img_h = map[8]
                    img_alpha = map[9]
                    img_alpha_neg = map[10]
                    texture
                    
            except:print("---------TEXTURE ERROR--------------")



    mtl= open(filepath, 'r')
    
    for line in mtl:
        if line.startswith('newmtl'):
            matName = line_value(line.split())
            #print(matName+'    '+ context_material.name)  
            context_material_name=context_material.name  
               
        #if context_material_name==matName : pass
    

                
        line_split= line.split()
        line_lower= (line.lower().lstrip()).replace('\t','')
        if line_lower.startswith('ka'):
            try:
                context_material.mirror_color=(float(line_split[1]),float(line_split[2]),float(line_split[3]))
            except:()
        elif line_lower.startswith('kd'):
            try:
                context_material.diffuse_color=(float(line_split[1]),float(line_split[2]),float(line_split[3]))

            except:()
        elif line_lower.startswith('ks'):
            try:
                context_material.specular_color=(float(line_split[1]),float(line_split[2]),float(line_split[3]))
            except:()
        elif line_lower.startswith('ns'):
            context_material.specular_hardness = int((float(line_split[1])*0.51))
        elif line_lower.startswith('ray_reflect'):
    
            if float(line_split[1]) > 0.001: 
                context_material.raytrace_mirror.use=True
            context_material.raytrace_mirror.reflect_factor  = float(line_split[1])
        elif line_lower.startswith('reflect_blur'):
            
            context_material.raytrace_mirror.gloss_factor = float(line_split[1])

        elif line_lower.startswith('reflect_samples'):
            context_material.raytrace_mirror.gloss_samples = integer(float(line_split[1]))
        elif line_lower.startswith('reflect_depth'):
            context_material.raytrace_mirror.depth  = integer(float(line_split[1]))
        elif line_lower.startswith('reflect_maxdist'):
            context_material.raytrace_mirror.distance  = integer(float(line_split[1]))
        elif line_lower.startswith('reflect_anisotropic'):
            context_material.raytrace_mirror.anisotropic  = float(line_split[1])
        elif line_lower.startswith('ray_refract'):
            ray_refract=float(line_split[1])
            if ray_refract > 0.001: 
                context_material.use_transparency=True

                context_material.transparency_method == 'RAYTRACE'
                
                context_material.alpha=  1 -   ray_refract
                context_material.specular_alpha=  1 -   ray_refract #  (ray_refract-(ray_refract *2))+1
                context_material.alpha=context_material.specular_alpha
                context_material.raytrace_transparency.fresnel=ray_refract*5
                context_material.raytrace_transparency.fresnel_factor=(ray_refract*4)+1
            context_material.raytrace_transparency.fresnel_factor  = float(line_split[1])
        elif line_lower.startswith('ni'):
            context_material.raytrace_transparency.ior = max(1, min(float(line_split[1]), 3))
        elif line_lower.startswith('refract_blur'):
            context_material.raytrace_transparency.gloss_factor  = float(line_split[1])
        elif line_lower.startswith('refract_samples'):
            context_material.raytrace_transparency.gloss_samples  = integer(float(line_split[1]))
        elif line_lower.startswith('refract_depth'):
            context_material.raytrace_transparency.depth  = integer(float(line_split[1]))
        elif line_lower.startswith('refract_limit'):
            context_material.raytrace_transparency.limit  = integer(float(line_split[1]))
        elif line_lower.startswith('translucency'):
            context_material.translucency  =  float(line_split[1])
        elif line_lower.startswith('emit'):
            context_material.emit  =  float(line_split[1])
        elif line_lower.startswith('sss_scale'):
            context_material.subsurface_scattering.scale.scale  =  float(line_split[1])
        elif line_lower.startswith('sss_color'):
            context_material.subsurface_scattering.color=(float(line_split[1]),float(line_split[2]),float(line_split[3]))
        elif line_lower.startswith('shader'):
            context_material.diffuse_shader  =  line_split[1]
        elif line_lower.startswith('roughness'):
            context_material.roughness  =  line_split[1]
        ### texture
        elif line_lower.startswith('d') or line_lower.startswith('tr'):
            context_material.alpha = float(line_split[1])
        elif line_lower.startswith('map_ka'):
            img_filepath= line_value(line.split())

            if img_filepath.split('|')[0]:
                load_material_image(context_material,context_material_name,img_filepath,'Ka',line_lower,DIR)
        elif line_lower.startswith('map_ks'):
            img_filepath= line_value(line.split())
            if img_filepath:
                load_material_image(context_material,context_material_name,img_filepath,'Ks',line_lower,DIR)
        elif line_lower.startswith('map_kd'):
            img_filepath=  line_value(line.split())
            if img_filepath.split('|')[0]:

                load_material_image(context_material,context_material_name,img_filepath,'Kd',line_lower,DIR)
        elif line_lower.startswith('map_bump'):
            img_filepath= line_value(line.split())
            
            if img_filepath.split('|')[0]:
                load_material_image(context_material,context_material_name,img_filepath,'Bump',line_lower,DIR)
        elif line_lower.startswith('map_displ'):
            img_filepath= line_value(line.split())
            if img_filepath.split('|')[0]:
                
                load_material_image(context_material,context_material_name,img_filepath,'Disp',line_lower,DIR)
        elif line_lower.startswith('map_d') or line_lower.startswith('map_tr'): 
            img_filepath= line_value(line.split())
            
            if img_filepath.split('|')[0]:
                load_material_image(context_material,context_material_name,img_filepath,'D',line_lower,DIR)
        elif line_lower.startswith('refl'):
            img_filepath= line_value(line.split())
            if img_filepath:
                load_material_image(context_material,context_material_name,img_filepath,'refl',line_lower,DIR)
    mtl.close()
	
	


	
	
def load_Scn(filepath):
    print(' INFO: Start Interchange ')
    from math import pi
    scene = bpy.context.scene
    SCL = scene.SCL #/ 10
    makeNew=False
    makeCamNew=False
    l_from=None
    l_type=None
    l_rot=None
    l_color=None
    l_power=None
    l_name=None
    context_lamp=None
    mtl= open(filepath, 'r')


    
    

    def load_light_image(lamp,imagepath,sname):
        print(" INFO: fiind texture Light")
        DIR= stripFile(filepath)
        Nt=True
        ies=False
        for t in bpy.data.textures:
            if t:
                try:
                    if t.name.split('.')[0] == sname : Nt=False
                    texture=t
                except:
                    Nt=False

        if Nt:
    

            if str(imagepath) != '1': 
                imagepath=imagepath.replace('//','\\')
            path=DIR+imagepath
            path=path.replace('\\\\','\\')
            
            if SYS=='Windows':
                path=path.replace('/','\\')
            else:
                path=path.replace('\\','/')
                path=path.replace('//','/').replace('//','/')


            
            #image = bpy.data.add_image(path)
            image = load_image(path, DIR)
            texture = bpy.data.textures.new(sname)
            texture.type = 'IMAGE' 
            texture = texture.recast_type()
            texture.image = image



    for line in mtl:
        ##print( "INFO :" + line)

        line_split= line.split()
        line_lower= (line.lower().lstrip()).replace('\t','')
        

        if line_lower.startswith('from'):
            l_from = (float(line_split[1])*SCL,float(line_split[2])*SCL,float(line_split[3])*SCL)
    
        elif line_lower.startswith('rot'):
            l_rot = (float(line_split[1]),float(line_split[2]),float(line_split[3]))
        elif line_lower.startswith('lensm'):
            l_lens = float(line_split[1])



        if scene.IMPORT_LIGHT:

            if line.startswith('newlight'):
                print(" INFO: Making New Light" )
                l_from=None
                l_type=None
                l_rot=None
                l_name= line_value(line.split())
                makeNew=True
                               
            if makeNew and l_from and l_rot and l_type  and l_name:
    
                if crob(l_name):
                    if l_type == 'IES':
                        l_type='SPOT'
                        ies=True
                    l=bpy.ops.object.lamp_add(type=l_type, view_align=False, location=l_from, rotation=(0,0,0)) 
                    ob = bpy.context.scene.objects.active
                    lamp = ob.data
                    ob.name=l_name
                    lamp.name=l_name
                    makeNew=False
                    ob.rotation_euler[0]=l_rot[0] * pi / 180
                    ob.rotation_euler[1]=l_rot[1] * pi / 180
                    ob.rotation_euler[2]=l_rot[2] * pi / 180
                    lamp.shadow_method='RAY_SHADOW'
                    try:
                        lamp.shadow_ray_samples=8
                    except:pass
                    
            try:
                if line_lower.startswith('type') :
                    l_type = line_split[1]
        
                elif line_lower.startswith('power') :
                    lamp.energy = float(line_split[1])
        
                elif line_lower.startswith('areax') :
                    lamp.size = float(line_split[1])*SCL
                    lamp.shadow_method='RAY_SHADOW'
                    lamp.shadow_ray_samples_x=8
                    lamp.distance=3
        
                elif line_lower.startswith('areay') :
                    lamp.shape='RECTANGLE'
                    lamp.size_y = float(line_split[1])*SCL
                    lamp.shadow_ray_samples_y=8
    
        
                elif line_lower.startswith('color') :
                    lamp.color = (float(line_split[1]),float(line_split[2]),float(line_split[3]))
                    
                elif line_lower.startswith('texture') :
                    #YAFARAY IES
                    lamp.ies_file=line_split[1]
                    lamp.lamp_type='ies'
                    pass                    
                    
        
                elif line_lower.startswith('samples') :
                    try: lamp.shadow_ray_samples = int(float(line_split[1]))
                    except:()   
                    try: lamp.shadow_ray_samples_x=int(float(line_split[1]))
                    except:()
                    try: lamp.shadow_ray_samples_y=int(float(line_split[1]))
                    except:()
    
                       
                elif line_lower.startswith('texture') and  makeNew:
                    img_filepath= line_value(line.split())
                    if img_filepath:
        
                        load_light_image(lamp, img_filepath,"Lamp_"+stripExt(stripPath(img_filepath)))
            except:()   

        if scene.IMPORT_CAMERA:
            if line.startswith('newcam'):
                #print(' INFO: Making New Cam')

                l_from=None
                l_type=None
                l_rot=None
                l_lens=None
                l_name= line_value(line.split())
                makeCamNew=True
                
                  
            if makeCamNew and l_from and l_rot and l_name and l_lens:
                print(' INFO: Make Cam %s ' % l_name)
                if crob(l_name):
                    
                    bpy.ops.object.camera_add(view_align=False, enter_editmode=False, location=(0.0, 0.0, 0.0), rotation=(0.0, 0.0, 0.0))
                    
                    ob = bpy.context.scene.objects.active
                    cam = ob.data
                    ob.name=l_name
                    cam.name=l_name
                    ob.location=l_from
                    ob.rotation_euler[0] = pi * l_rot[0]/180
                    ob.rotation_euler[1] = pi * l_rot[1]/180
                    ob.rotation_euler[2] = pi * l_rot[2]/180
                    ob.data.clip_end = 5000
                    ob.data.clip_start=0.0001
                    makeCamNew=False  
                    cam.lens = l_lens
                    print(' INFO: Make Cam %s DONE ' % l_name)
                else:
                    print(' INFO: Cam %s FAIL (EXISTING)' % l_name)
    
              
            elif line_lower.startswith('lensm') and makeCamNew==False:
                l_lens = float(line_split[1])
                

        
 
           
        
    mtl.close()
	
	


def load_obj_mot(path):
    print(' INFO: Start Objects  animation ') 
    from math import pi 
    SC = bpy.context.scene
    SCR = SC.render
    SCL = SC.SCL      
    FrameRate = float(SCR.fps)
    objects=bpy.context.scene.objects
    for ObjMot in objects:
        filename=path+'Motion/'+( stripExt((ObjMot.name.split('~'))[0]) )+'.mot'
        

        

        
        
        if os.path.isfile(filename):
            File = open (filename, 'rU')
            CurChannel = -1
            ScaleFlag = 0
            LocX=None
            LocY=None   
            LocZ=None
            RotX=None
            RotY=None
            RotZ=None
            ScaleX=None
            ScaleY=None
            ScaleZ=None
            SC.frame_current=1
            cf=0
            for Line in File:
                line=Line.split (' ')

                if len(line) > 1:
                    ObjMot.keyframe_insert("location")
                    ObjMot.keyframe_insert("rotation_euler")
                    ObjMot.keyframe_insert("scale")  
                    SC.frame_current=int(float(line[0]))
                    ObjMot.location[0]=float(line[1]) * SCL
                    ObjMot.location[1]=float(line[2]) * SCL
                    ObjMot.location[2]=float(line[3]) * SCL
    

                    rx=ObjMot.rotation_euler[0]
                    ry=ObjMot.rotation_euler[1]
                    rz=ObjMot.rotation_euler[2]  
                    #print('---------------------------')
                    #print(' x=%s y=%s z=%s' % (rx,ry,rz))
                    
                    
                                      
                    try: ObjMot.rotation_euler[0] = (pi * (float(line[4])) /180) 
                    except: ObjMot.rotation_euler[0] = 0
                    try: ObjMot.rotation_euler[1] = (pi * float(line[5]) /180)
                    except: ObjMot.rotation_euler[1] = 0
                    try: ObjMot.rotation_euler[2] = (pi * float(line[6]) /180)
                    except: ObjMot.rotation_euler[2] = 0
    
                    ObjMot.scale[0]=float(line[7])
                    ObjMot.scale[2]=float(line[8])
                    ObjMot.scale[1]=float(line[9])
                    ObjMot.keyframe_insert("location")
                    ObjMot.keyframe_insert("rotation_euler")
                    ObjMot.keyframe_insert("scale")
            File.close()




def load_cam_mot(path):
    print(' INFO: Start Cam animation ') 
    from math import pi 

    SC = bpy.context.scene
    SCR = SC.render
    SCL = SC.SCL
    FrameRate = float(SCR.fps)
    objects=bpy.context.scene.objects
    for ob in objects:
        filename=path+'Motion/'+ob.name+'.cam'
        if os.path.isfile(filename):
                    
                    Fc = open(filename, 'r');
                    l = 1;
                    readVerts = False;
                    readCam = False;
                    numFrames = 0;

                    bpy.ops.anim.keyingset_button_add(all=True)
                    bpy.ops.anim.driver_button_add(all=True)
                    for curLine in Fc.readlines():
                        if (l==1) and ('cRio ' not in curLine):
                            file.close();
                            break;
                        if l > 1:
                            lp = curLine.split()
                            location = (float(eval(lp[1]) * SCL),float(eval(lp[2]) * SCL),float(eval(lp[3]) * SCL))
                            SC.frame_current=(int(float(lp[0])))
                            ob.location=location
                            ob.rotation_euler[0] = pi * (float(lp[4]))/180
                            ob.rotation_euler[1] = pi * (float(lp[5]))/180
                            ob.rotation_euler[2] = pi * (float(lp[6]))/180
                            ob.data.lens = float(lp[7])
                            ob.keyframe_insert("location")
                            ob.keyframe_insert("rotation_euler")
                            ob.data.keyframe_insert('lens')

        
                        l += 1;
                    Fc.close
                    
                    try:
                        bpy.ops.object.select_name(name=ob.name)
                        bpy.ops.view3d.object_as_camera()

                    except:
                        pass            




def load_lamp_mot(path):
    print(' INFO: Start Lamp animation ') 
    from math import pi 
    SC = bpy.context.scene
    SCR = SC.render
    SCL = SC.SCL
    FrameRate = float(SCR.fps)
    objects=bpy.context.scene.objects
    for ObjMot in objects:
        filename=path+'Motion/'+(ObjMot.name.split('~'))[0]+'.lmp'
        if os.path.isfile(filename):

            File = open (filename, 'rU')
            CurChannel = -1
            ScaleFlag = 0
            LocX=None
            LocY=None   
            LocZ=None
            RotX=None
            RotY=None
            RotZ=None
            ScaleX=None
            ScaleY=None
            ScaleZ=None

            SC.frame_current=1

            cf=0
            for Line in File:
                line=Line.split (' ')

                if len(line) > 1:
                    ObjMot.keyframe_insert("location")
                    ObjMot.keyframe_insert("rotation_euler")
                    ObjMot.keyframe_insert("scale")  
                    SC.frame_current=int(float(line[0]))
                    ObjMot.location[0]=float(line[1]) * SCL
                    ObjMot.location[1]=float(line[2]) * SCL
                    ObjMot.location[2]=float(line[3]) * SCL
    
                    try: ObjMot.rotation_euler[0] = pi * float(line[4]) /180                
                    except: ObjMot.rotation_euler[0] = 0
                    try: ObjMot.rotation_euler[1] = pi * float(line[5]) /180 
                    except: ObjMot.rotation_euler[1] = 0
                    try: ObjMot.rotation_euler[2] = pi * float(line[6]) /180 
                    except: ObjMot.rotation_euler[2] = 0
    
                    ObjMot.scale[0]=float(line[7])
                    ObjMot.scale[1]=float(line[8])
                    ObjMot.scale[2]=float(line[9])
                    ObjMot.keyframe_insert("location")
                    ObjMot.keyframe_insert("rotation_euler")
                    ObjMot.keyframe_insert("scale")
            File.close()

DEBUG= True
DEBUG= False

from bpy.props import *
Scene = bpy.types.Scene
Scene.SCL = FloatProperty(attr="SCL",name="Clamp Scale", description="Clamp the size to this maximum (Zero to Disable)", min=0.000, max=1000.0, soft_min=0.001, soft_max=1000.0, default=1.00)
Scene.IMPORT_GEOMETRY = BoolProperty(attr="IMPORT_GEOMETRY",default= True)
Scene.IMPORT_GEOMETRY_PIVOT = BoolProperty(attr="IMPORT_GEOMETRY_ANIMATION",default= True)
Scene.IMPORT_GEOMETRY_ANIMATION = BoolProperty(attr="IMPORT_GEOMETRY_ANIMATION",default= True)
Scene.IMPORT_CAMERA = BoolProperty(attr="IMPORT_CAMERA",default= True)
Scene.IMPORT_LIGHT = BoolProperty(attr="IMPORT_LIGHT",default= True)
Scene.IMPORT_MATERIAL= BoolProperty(attr="IMPORT_MATERIAL",default= True)
Scene.IMPORT_CAMERA_ANIMATION = BoolProperty(attr="IMPORT_CAMERA_ANIMATION",default= True)
Scene.IMPORT_LIGHT_ANIMATION = BoolProperty(attr="IMPORT_LIGTH_ANIMATION",default= True)


class SCENE_PT_importScene(bpy.types.Panel):
    bl_label = "Import Scene"
    bl_space_type = "PROPERTIES"
    bl_region_type = "WINDOW"
    bl_context = "scene"
    
    def draw(self, context):
        layout = self.layout
        scene = context.scene
        row = layout.row()
        row = layout.row()
        row.prop(scene,"IMPORT_MATERIAL", text='Material + Texture', icon='MATERIAL_DATA')
        
        
        row = layout.row()
        row = row.split(percentage=0.7)
        row.prop(scene,"IMPORT_GEOMETRY", text='Geometry Dae', icon='OBJECT_DATA')
        row = row.split(percentage=0.01)
        row.label(text=' ') 

        row.prop(scene,"IMPORT_GEOMETRY_ANIMATION", text='', icon='ANIM_DATA')

        row = layout.row()
        row = row.split(percentage=0.7)
        row.prop(scene,"IMPORT_CAMERA", text='Camera', icon='CAMERA_DATA')
        row = row.split(percentage=0.01)
        row.label(text=' ')
        row.prop(scene,"IMPORT_CAMERA_ANIMATION", text='', icon='ANIM_DATA')
        row = layout.row()
        row = row.split(percentage=0.7)
        row.prop(scene,"IMPORT_LIGHT", text='Light', icon='LAMP_DATA')
        row = row.split(percentage=0.01)
        row.label(text=' ')
        row.prop(scene,"IMPORT_LIGHT_ANIMATION", text='', icon='ANIM_DATA')

        row = layout.row()
        row = row.split(percentage=0.7)

        row = layout.row()
        row = layout.row()
        row = layout.row()
        row = layout.row()
        row.prop(scene,"SCL" , text="Scale")
        row = layout.row()
        row = layout.row()
        row.operator("object.custom_path" , text="Import Scene")
        row = layout.row()
        row = layout.row()
        row = layout.row()
        row = layout.row()
        row.label(text='Scene interchange: 1.2 beta') 
        row = layout.row()
        row.label(text='wavefront(.OBJ) support  ')
        layout.label(text='3DS Max, Lightwave, Maya') 
        row = layout.row()
        row = layout.row()
        row = layout.row()
        row = layout.row()
        row = layout.row()
        row = layout.row()
        row = layout.row()
        layout.label(text='Copyright (C) 11-set-2011  Silvio Falcinelli')
        row = layout.row()
        layout.label(text='GNU license')
        row = layout.row()
        row = layout.row()

import bpy
from bpy.props import *


Scene.path= StringProperty(name="file path",
    attr="path", 
    description="simple file path",
    maxlen= 1024,
    default= "")

class OBJECT_OT_CustomPath(bpy.types.Operator):
    bl_idname = "object.custom_path"
    bl_label = "Scene Path"
    __doc__ = ""

    filepath = StringProperty(name="File Path", description="getting file path", maxlen= 1024, default= "")

    def execute(self, context):
        scene = context.scene
        scene.path = self.properties.filepath
        namefile=stripExt(self.properties.filepath)
        print(namefile)
        bpy.data.scenes['Scene'].frame_current = 1 
        bpy.context.scene.frame_set(1) 
        
        namefile=namefile.replace('_FIXED','')   # nel caso venga selezionato un file processato
        
        if scene.IMPORT_GEOMETRY:
            fixCollada(namefile+'.dae')
            bpy.ops.wm.collada_import(filepath=namefile+'_FIXED.dae')   

            print('CLEAR COLLADA PARENT LINK')
            bpy.ops.object.select_all(action='SELECT')
            bpy.ops.object.parent_clear()
    
  
            
            ### fix name ob for wavefront(obj) import
            for ob in bpy.context.scene.objects:
         
                try: 
                    ob.name = stripExt(ob.data.name)
                except:
                    try:
                        ob.name = ob.data.name  ## fix obj
                    except:  pass  
    
                try: 
                    ob.name = stripExt(ob.name).replace('Mesh','') #fix collada
    
                except: pass
            
          
                if not ob.data:
                    try:
                        ###  bpy.ops.object.select_name()  in DelObj ### 2.6.2 problem
                    
                        DelObj(ob)  # in blender 2.5.9 is OK
                    except:

                        ob.name="z_trash"  ## patch  for 2.6.2
   


            
                bpy.context.scene.frame_set(1)  
        
                for cM in bpy.data.materials:
                   MatName='<'+cM.name
                   cM.name=(MatName.replace('<_','')).replace('<','')
        
                scene.frame_current=1
                bpy.context.scene.frame_set(1)            
            
    
            
        print('INFO general check')              
        load_Scn(namefile+'.scn')
                
        

        if scene.IMPORT_MATERIAL:
            print('INFO start material upgrade')            
            for context_material in bpy.data.materials:
                
                nameFileMtl='<'+context_material.name
                context_material.name=(nameFileMtl.replace('<_','')).replace('<','')   ### collada fix name
                nameFileMtl=stripFile(namefile)+"Materials/"+context_material.name.split('.')[0]+".mtl"
                
                if os.path.isfile(nameFileMtl):
                    print(context_material.name)
                    create_materials(nameFileMtl ,context_material)   
                
        
        
        #if scene.IMPORT_MATERIAL: create_materials(namefile) 
        if scene.IMPORT_GEOMETRY_ANIMATION: load_obj_mot(stripFile(namefile)) #load_obj(namefile+'.obj', context)
        if scene.IMPORT_LIGHT_ANIMATION: load_lamp_mot(stripFile(namefile)) 
        if scene.IMPORT_CAMERA_ANIMATION: load_cam_mot(stripFile(namefile)) 
        print(' INFO: Scene  Done ')  
        return {'FINISHED'}
    def invoke(self, context, event):
        wm = context.window_manager
        wm.fileselect_add(self)
        context.scene.path = context.scene.path
        return {'RUNNING_MODAL'}

def menu_func_import(self, context):
    pass

def register():
    bpy.utils.register_module(__name__)
    bpy.types.INFO_MT_file_import.append(menu_func_import)

def unregister():
    bpy.utils.unregister_module(__name__)
    bpy.types.INFO_MT_file_import.remove(menu_func_import)

if __name__ == "__main__":
    register()