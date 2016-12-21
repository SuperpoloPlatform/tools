import bpy
import os
def setmesh():
    for im in bpy.data.meshs:
        print(im.name)
#set maps
def setmaps():
    dmapnum = 0
    nmapnum = 0
    hmapnum = 0
    smapnum = 0
    for obj in bpy.data.objects:
        print(obj.name)
        print(obj.type)
        print(obj.data.name)
        print(obj.data)
        if(obj.type == "MESH"):
            obj.name = obj.data.name
        for mat in obj.material_slots:
            print(mat.name)
            print(mat.material.name)
            for tex in mat.material.texture_slots:
                if (tex != None) and (tex.texture != None) :
                    print(tex.name)
                    print(tex.use_map_alpha)
                    print(tex.texture.name)
                    print(tex.texture.type)
                    if tex.texture.type == "IMAGE" :
                        dmapnum = dmapnum + 1
                        print(tex.texture.image)
                        print(tex.texture.image.name)
                        print(tex.texture.image.name.split('.')[1])
                        if(tex.texture.image.name.split('.')[1] == "png"):
                            tex.use_map_alpha = True
                            tex.alpha_factor = 1.0
                        texpath = ""
                        for i in range(0,len(tex.texture.image.filepath.split('\\'))-2):
                            texpath = texpath + tex.texture.image.filepath.split('\\')[i] + "\\"
                        print(texpath)
                        norpath = texpath + "normalmap\\n" + tex.texture.image.name
                        hitpath = texpath + "heightmap\\h" + tex.texture.image.name
                        spqpath = texpath + "specularmap\\s" +tex.texture.image.name
                        print(norpath)
                        print(hitpath)
                        print(spqpath)
                        if os.path.isfile(norpath) :
                            print("normalmap")
                            print(mat.material.texture_slots.find("n" +tex.texture.image.name))
                            if mat.material.texture_slots.find("n" +tex.texture.image.name) <= 0 :
                                if bpy.data.textures.find("n" +tex.texture.image.name) > 0 :
                                    ntex = bpy.data.textures["n" +tex.texture.image.name]   
                                else:
                                    ntex = bpy.data.textures.new("n" +tex.texture.image.name, type = 'IMAGE')
                                    ntex.name = "n" +tex.texture.image.name
                                    nimg = bpy.data.images.load(norpath)
                                    ntex.image = nimg
                                print(ntex.name)
                                print(ntex.type)
                                #ntex.image.open(norpath)
                                #ntex.use_flip_axis = 'HORIZONTAL'
                                mtex = mat.material.texture_slots.add()
                                #mtex.name = "n" +tex.texture.image.name
                                mtex.texture = ntex
                                mtex.texture_coords = 'STRAND'
                                mtex.use_map_color_diffuse = False 
                                mtex.texture.use_normal_map = True
                                mtex.use_map_normal = True
                                mtex.texture_coords = "UV"
                                nmapnum = nmapnum + 1
                            else:
                                print("exists normalmap!!!")
                        if os.path.isfile(hitpath) :
                            print("heightmap")
                            print(mat.material.texture_slots.find("h" +tex.texture.image.name))
                            if mat.material.texture_slots.find("h" +tex.texture.image.name) <= 0 :
                                if bpy.data.textures.find("h" +tex.texture.image.name) > 0 :
                                    htex = bpy.data.textures["h" +tex.texture.image.name]   
                                else:
                                    htex = bpy.data.textures.new("h" +tex.texture.image.name, type = 'IMAGE')
                                    htex.name = "h" +tex.texture.image.name
                                    himg = bpy.data.images.load(hitpath)
                                    htex.image = himg
                                print(htex.name)
                                print(htex.type)
                                mtex = mat.material.texture_slots.add()
                                mtex.texture = htex
                                mtex.use_map_color_diffuse = False
                                mtex.use_map_displacement = True
                                mtex.texture_coords = "UV"
                                hmapnum = hmapnum + 1
                            else:
                                print("exists specularmap!!!")
                        if os.path.isfile(spqpath) :
                            print("specularmap")
                            print(mat.material.texture_slots.find("s" +tex.texture.image.name))
                            if mat.material.texture_slots.find("s" +tex.texture.image.name) <= 0 :
                                if bpy.data.textures.find("s" +tex.texture.image.name) > 0 :
                                    stex = bpy.data.textures["s" +tex.texture.image.name]   
                                else:
                                    stex = bpy.data.textures.new("s" +tex.texture.image.name, type = 'IMAGE')
                                    stex.name = "s" +tex.texture.image.name
                                    simg = bpy.data.images.load(spqpath)
                                    stex.image = simg
                                print(stex.name)
                                print(stex.type)
                                mtex = mat.material.texture_slots.add()
                                mtex.texture = stex
                                mtex.use_map_color_diffuse = False
                                mtex.use_map_specular = True
                                mtex.texture_coords = "UV"
                                smapnum = smapnum + 1
                            else:
                                print("exists specularmap!!!")
                        print("\n")
    print(dmapnum) 
    print(nmapnum)
    print(hmapnum)
    print(smapnum)
setmaps()