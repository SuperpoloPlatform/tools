#File Name:export_threejs.py

"""
Blender Exporter for Three.js JSON Format

"""
import bpy
import mathutils

import zipfile
import json
import shutil
import os
import os.path
import math
import operator
import random


COLORS = [0xeeeeee, 0xee0000, 0x00ee00, 0x0000ee, 0xeeee00, 0x00eeee, 0xee00ee]

image_name = [] # Preserve textures' name

# ####################################
# Mesh - Count Mesh Data
# ####################################

def count_mesh_vertices(mesh):
    return len(mesh.vertices)

def count_mesh_faces(mesh):
    return len(mesh.faces)

def count_mesh_normals(mesh):
    return len(mesh.vertices)

def count_mesh_colors(mesh):
    return len(mesh.vertex_colors)

def count_mesh_uvs(mesh):
    return len(mesh.uv_textures)

def count_mesh_materials(mesh):
    return len(mesh.materials)

# ####################################
# Mesh - Helper
# ####################################

def veckey2(x, y):
    return round(x, 6), round(y, 6)

def veckey2d(v):
    return veckey2(v[0], v[1])

def veckey3(x, y, z):
    return round(x, 6), round(y, 6), round(z, 6)

def veckey3d(v):
    return veckey3(v.x, v.y, v.z)

def hexcolor(c):
    return (int(c[0] * 255) << 16) + (int(c[1] * 255) << 8) + int(c[2] * 255)

# check the mesh if has some certain data
    
def has_uvs(mesh):
    if count_mesh_uvs(mesh):
        return True
    else:
        return False

def has_sticky(mesh):
    if len(mesh.sticky) > 0:
        return True
    else:
        return False
    
def has_vertex_colors(mesh):
    if count_mesh_colors(mesh):
        return True
    else:
        return False

def has_materials(mesh):
    if count_mesh_materials(mesh):
        return True
    else:
        return False

def is_Triangle(face):
    """check the face if is a triangle
    """
    if len(face.vertices) == 3:
        return True
    else:
        return False

def generate_color(i):
    """Generate hex color corresponding to integer.

    Colors should have well defined ordering.
    First N colors are hardcoded, then colors are random
    (must seed random number  generator with deterministic value
    before getting colors).
    """

    if i < len(COLORS):
        #return "0x%06x" % COLORS[i]
        return COLORS[i]
    else:
        #return "0x%06x" % int(0xffffff * random.random())
        return int(0xffffff * random.random())
    
# set face type mask

def setBit(value, position, on):
    if on:
        mask = 1 << position
        return (value | mask)
    else:
        mask = ~(1 << position)
        return (value & mask)
    
# ####################################
# Mesh - Alignment
# ####################################

def bbox(vertices):
    """Compute bounding box of vertex array.
    """

    if len(vertices)>0:
        minx = maxx = vertices[0].co.x
        miny = maxy = vertices[0].co.y
        minz = maxz = vertices[0].co.z

        for v in vertices[1:]:
            if v.co.x < minx:
                minx = v.co.x
            elif v.co.x > maxx:
                maxx = v.co.x

            if v.co.y < miny:
                miny = v.co.y
            elif v.co.y > maxy:
                maxy = v.co.y

            if v.co.z < minz:
                minz = v.co.z
            elif v.co.z > maxz:
                maxz = v.co.z

        return { 'x':[minx,maxx], 'y':[miny,maxy], 'z':[minz,maxz] }

    else:
        return { 'x':[0,0], 'y':[0,0], 'z':[0,0] }

def translate(vertices, t):
    """Translate array of vertices by vector t.
    """

    for i in range(len(vertices)):
        vertices[i].co.x += t[0]
        vertices[i].co.y += t[1]
        vertices[i].co.z += t[2]

def center(vertices):
    """Center model (middle of bounding box).
    """

    bb = bbox(vertices)

    cx = bb['x'][0] + (bb['x'][1] - bb['x'][0])/2.0
    cy = bb['y'][0] + (bb['y'][1] - bb['y'][0])/2.0
    cz = bb['z'][0] + (bb['z'][1] - bb['z'][0])/2.0

    translate(vertices, [-cx,-cy,-cz])

def top(vertices):
    """Align top of the model with the floor (Y-axis) and center it around X and Z.
    """

    bb = bbox(vertices)

    cx = bb['x'][0] + (bb['x'][1] - bb['x'][0])/2.0
    cy = bb['y'][1]
    cz = bb['z'][0] + (bb['z'][1] - bb['z'][0])/2.0

    translate(vertices, [-cx,-cy,-cz])

def bottom(vertices):
    """Align bottom of the model with the floor (Y-axis) and center it around X and Z.
    """

    bb = bbox(vertices)

    cx = bb['x'][0] + (bb['x'][1] - bb['x'][0])/2.0
    cy = bb['y'][0]
    cz = bb['z'][0] + (bb['z'][1] - bb['z'][0])/2.0

    translate(vertices, [-cx,-cy,-cz])

def set_align_model(align_model):
    if align_model == 1:
        center(vertices)
    elif align_model == 2:
        bottom(vertices)
    elif align_model == 3:
        top(vertices)
    else:
        pass
    
# ####################################
# Mesh - Extract Elements 
# ####################################

# Search each face to get the corresponding
# vertex normal

def extract_vertex_normals(mesh, index):
    normals = {}
    for f in mesh.faces:
        for v in f.vertices:
            normal = mesh.vertices[v].normal
            key = veckey3d(normal)

            if key not in normals:
                normals[key] = index
                index += 1
    return normals

def extract_vertex_colors(mesh, index):
    colors = {}
    color_layer = mesh.vertex_colors.active.data

    for face_index, face in enumerate(mesh.faces):
        face_colors = color_layer[face_index]
        face_colors = face_colors.color1, face_colors.color2, face_colors.color3, face_colors.color4

        for c in face_colors:
            key = hexcolor(c)
            if key not in colors:
                colors[key] = index
                index += 1
    return colors

def extract_uvs(mesh, index):
    uvs = {}
    uv_layer = mesh.uv_textures.active.data

    for face_index, face in enumerate(mesh.faces):
        for uv_index, uv in enumerate(uv_layer[face_index].uv):
            key = veckey2d(uv)

            if key not in uvs:
                uvs[key] = index
                index += 1

    return uvs

def extract_objects(sceneobjects):
    objects = []
    for obj in sceneobjects:
        objects.append(obj)

    for group in bpy.data.groups:
        for object in group.objects:
            objects.append(object)
    return objects

def extract_meshes(objects, scene, export_single_model, option_scale, option_flip_yz):

    meshes = []

    for object in objects:

        if object.type == "MESH" and object.THREE_exportGeometry:

            # collapse modifiers into mesh

            mesh = object.to_mesh(scene, True, 'RENDER')

            if not mesh:
                raise Exception("Error, could not get mesh data from object [%s]" % object.name)

            if export_single_model:
                if option_flip_yz:
                    # that's what Blender's native export_obj.py does
                    # to flip YZ
                    X_ROT = mathutils.Matrix.Rotation(-math.pi/2, 4, 'X')
                    mesh.transform(X_ROT * object.matrix_world)
                else:
                    mesh.transform(object.matrix_world)

            mesh.calc_normals()
            mesh.transform(mathutils.Matrix.Scale(option_scale, 4))
            meshes.append([mesh, object])

    return meshes

# tired to rewrite this part,so just modify
# it slightly and copy the major codes from
# the orignal :(

def extract_materials(mesh, scene, option_colors, draw_type, option_copy_textures, filepath, offset):

    random.seed(42)

    materials = get_mesh_materials(mesh, offset)

    mtl = get_dummy_materials(materials)

    mtl.update(extract_mesh_materials(mesh, scene, option_colors, option_copy_textures, filepath))

    return generate_materials(mtl, materials, draw_type)

def get_mesh_materials(mesh, offset):
    materials = {}
    for i, m in enumerate(mesh.materials):
        mat_id = i + offset
        if m:
            materials[m.name] = mat_id
        else:
            materials["undefined_dummy_%0d" % mat_id] = mat_id

    if not materials:
        materials = {'default' : 0}

    return materials

def get_dummy_materials(materials):
    mtl = {}
    for m in materials:
        index = materials[m]
        mtl[m] = {
            "DbgName" : m,
            "DbgIndex" : index,
            "DbgColor" : generate_color(index),
            "vertexColors" : False
            }
    return mtl

def extract_mesh_materials(mesh, scene, option_colors, option_copy_textures, filepath):
    
    world = scene.world
    materials = {}
    for m in mesh.materials:
        if m:
            materials[m.name] = {}
            material = materials[m.name]

            material['colorDiffuse'] = [m.diffuse_intensity * m.diffuse_color[0],
                                        m.diffuse_intensity * m.diffuse_color[1],
                                        m.diffuse_intensity * m.diffuse_color[2]]
            material['colorSpecular'] = [m.specular_intensity * m.specular_color[0],
                                         m.specular_intensity * m.specular_color[1],
                                         m.specular_intensity * m.specular_color[2]]
            if world:
                world_ambient_color = world.ambient_color

            material['colorAmbient'] = [m.ambient * world_ambient_color[0],
                                        m.ambient * world_ambient_color[1],
                                        m.ambient * world_ambient_color[2]]
            
            material['specularCoef'] = m.specular_hardness

            textures = get_material_textures(m)

            handle_texture('diffuse', textures, material, filepath, option_copy_textures)
            handle_texture('light', textures, material, filepath, option_copy_textures)
            handle_texture('normal', textures, material, filepath, option_copy_textures)
            handle_texture('specular', textures, material, filepath, option_copy_textures)

            material['vertexColors'] = m.THREE_useVertexColors and option_colors

            if textures['normal']:
                material['shading'] = "Phong"
            else:
                material['shading'] = m.THREE_materialType

            material['blending'] = m.THREE_blendingType
            material['depthWrite'] = m.THREE_depthWrite
            material['depthTest'] = m.THREE_depthTest
            material['transparent'] = m.use_transparency

    return materials

def get_material_textures(material):
    textures = {
        'diffuse' : None,
        'light'   : None,
        'normal'  : None,
        'specular': None
    }

    # just take first textures of each, for the moment three.js materials can't handle more
    # assume diffuse comes before lightmap, normalmap has checked flag

    for slot in material.texture_slots:
        if slot:
            texture = slot.texture
            if slot.use and texture and texture.type == 'IMAGE':
                if texture.use_normal_map:
                    textures['normal'] = {"texture" : texture, "slot": slot}
                elif slot.use_map_specular or slot.use_map_hardness:
                    textures['specular'] = {"texture" : texture, "slot": slot}
                else:
                    if not textures['diffuse']:
                        textures['diffuse'] = {"texture" : texture, "slot": slot}
                    else:
                        textures['light'] = {"texture" : texture, "slot": slot}
                if textures['diffuse'] and textures['normal'] and textures['light'] and textures['specular']:
                    break
            
    return textures

def handle_texture(id, textures, material, filepath, option_copy_textures):
    
    if textures[id]:
        texName     = 'map%s'       % id.capitalize()
        repeatName  = 'map%sRepeat' % id.capitalize()
        wrapName    = 'map%sWrap'   % id.capitalize()

        slot = textures[id]['slot']
        texture = textures[id]['texture']
        image = texture.image
        fname = extract_texture_filename(image)
        material[texName] = fname

        if option_copy_textures:
            save_image(image, fname, filepath)
            global image_name
            image_name.append(fname)

        if texture.repeat_x != 1 or texture.repeat_y != 1:
            material[repeatName] = [texture.repeat_x, texture.repeat_y]

        if texture.extension == "REPEAT":
            wrap_x = "repeat"
            wrap_y = "repeat"

            if texture.use_mirror_x:
                wrap_x = "mirror"
            if texture.use_mirror_y:
                wrap_y = "mirror"

            material[wrapName] = [wrap_x, wrap_y]

        if slot.use_map_normal:
            if slot.normal_factor != 1.0:
                material['mapNormalFactor'] = slot.normal_factor
                
def generate_materials(mtl, materials, draw_type):
    """Generate JS array of materials objects
    """

    mtl_array = []
    for m in mtl:
        index = materials[m]

        # add debug information
        #  materials should be sorted according to how
        #  they appeared in OBJ file (for the first time)
        #  this index is identifier used in face definitions
        mtl[m]['DbgName'] = m
        mtl[m]['DbgIndex'] = index
        mtl[m]['DbgColor'] = generate_color(index)

        if draw_type in [ "BOUNDS", "WIRE" ]:
            mtl[m]['wireframe'] = True
            mtl[m]['DbgColor'] = 0xff0000

    return mtl

# ####################################
# Mesh - Get Face Indices
# ####################################

def get_uv_indices(face_index, uvs, mesh):
    uv = []
    uv_layer = mesh.uv_textures.active.data
    for i in uv_layer[face_index].uv:
        key = veckey2d(i)
        uv.append(uvs[key])
    return uv

def get_normal_indices(v, normals, mesh):
    n = []
    mv = mesh.vertices
    for i in v:
        normal = mv[i].normal
        key = veckey3d(normal)
        n.append(normals[key])
    return n

def get_color_indices(face_index, colors, mesh):
    c = []
    color_layer = mesh.vertex_colors.active.data
    face_colors = color_layer[face_index]
    face_colors = face_colors.color1, face_colors.color2, face_colors.color3, face_colors.color4
    for i in face_colors:
        key = hexcolor(i)
        c.append(colors[key])
    return c

# ####################################
# Export - Get JSON Model
# ####################################

# get metadata #

def get_metadata(nvertex, nface, nnormal, ncolor, nuv, nmaterial, nmorphTarget):
    metadata = {}
    
    metadata["formatVersion"] = 3
    metadata["generatedBy"] = "Blender 2.62 Exporter"
    metadata["vertices"] = nvertex
    metadata["faces"] = nface
    metadata["normals"] = nnormal
    metadata["colors"] = ncolor
    metadata["uvs"] = nuv
    metadata["materials"] = nmaterial
    metadata["morphTargets"] = nmorphTarget

    return metadata

# get scale #

def get_scale(scale):

    return scale

# get materials #

def get_materials(materials, option_materials):
    chunks = []
    if option_materials:
        for m in materials.values():
            chunks.append(m)
    return chunks

# get vertices #

def get_vertices(vertices, option_vertices, option_vertices_truncate):
    chunks = []
    if option_vertices:
        for v in vertices:
            chunks.extend(get_vertex(v, option_vertices_truncate))
    return chunks

def get_vertex(v, option_vertices_truncate):
    if option_vertices_truncate:
        return [int(v.co.x), int(v.co.y), int(v.co.z)]
    else:
        return [v.co.x, v.co.y, v.co.z]

# get normals #

def get_normals(normals, option_normals):
    chunks = []
    if option_normals:
        for key, index in sorted(normals.items(), key=operator.itemgetter(1)):
            chunks.extend(get_vertex_normal(key))
    return chunks

def get_vertex_normal(n):
    return [n[0], n[1], n[2]]

# get colors #

def get_colors(colors, option_colors):
    chunks = []
    if option_colors:
        for key, index in sorted(colors.items(), key=operator.itemgetter(1)):
            chunks.extend(get_vertex_color(key))
    return chunks

def get_vertex_color(c):
    return [c]

# get uvs #

def get_uvs(uvs, option_uv_coords):
    chunks = []
    if option_uv_coords:
        for key, index in sorted(uvs.items(), key=operator.itemgetter(1)):
            chunks.extend(get_uv(key))
    return chunks

def get_uv(uv):
    return [uv[0], 1.0 - uv[1]]

# get faces #

def get_faces(meshes, normals, uvs, colors, option_faces, option_normals, option_colors, option_uv_coords, option_materials):
    chunks = []
    if option_faces:
        vertex_offset = 0
        material_offset = 0
        for mesh,object in meshes:
            option_colors = option_colors and has_vertex_colors(mesh)
            option_uv_coords = option_uv_coords and has_uvs(mesh)

            for i, f in enumerate(mesh.faces):
                face = get_face(i, f, mesh, normals, uvs, colors, option_normals, option_colors, option_uv_coords, option_materials, vertex_offset, material_offset)
                chunks.extend(face)

            vertex_offset += count_mesh_vertices(mesh)
            material_count = count_mesh_materials(mesh)
            if material_count == 0:
                material_count = 1
            material_offset += material_count
    return chunks

def get_face(face_index, face, mesh, normals, uvs, colors, option_normals, option_colors, option_uv_coords, option_materials, vertex_offset, material_offset):

    isTriangle = is_Triangle(face)
    if isTriangle:
        nVertices = 3
    else:
        nVertices = 4

    hasMaterial = option_materials
    hasFaceUvs = False
    hasFaceVertexUvs = option_uv_coords
    hasFaceNormals = False
    hasFaceVertexNormals = option_normals
    hasFaceColors = False
    hasFaceVertexColors = option_colors

    faceType = 0
    faceType = setBit(faceType, 0, not isTriangle)
    faceType = setBit(faceType, 1, hasMaterial)
    faceType = setBit(faceType, 2, hasFaceUvs)
    faceType = setBit(faceType, 3, hasFaceVertexUvs)
    faceType = setBit(faceType, 4, hasFaceNormals)
    faceType = setBit(faceType, 5, hasFaceVertexNormals)
    faceType = setBit(faceType, 6, hasFaceColors)
    faceType = setBit(faceType, 7, hasFaceVertexColors)

    faceData = []
    faceData.append(faceType)

    for i in range(nVertices):
        index = face.vertices[i] + vertex_offset
        faceData.append(index)

    if hasMaterial:
        index = face.material_index + material_offset
        faceData.append(index)

    if hasFaceVertexUvs:
        uv_index = get_uv_indices(face_index, uvs, mesh)
        faceData.extend(uv_index)
        
    if hasFaceVertexNormals:
        normal_index = get_normal_indices(face.vertices, normals, mesh)
        faceData.extend(normal_index)

    if hasFaceVertexColors:
        color_index = get_color_indices(face_index, colors, mesh)
        faceData.extend(color_index)
    return faceData

def get_json_model(meshes,
                   scene,
                   filepath,
                   option_vertices,
                   option_vertices_truncate,
                   option_faces,
                   option_normals,
                   option_uv_coords,
                   option_materials,
                   option_colors,
                   align_model,
                   option_scale,
                   option_copy_textures):

    # define json model format
    
    json_model = {
    "metadata"     : {},    
    "scale"        : 0,
    "materials"    : [],
    "vertices"     : [],
    "morphTargets" : [],
    "normals"      : [],
    "colors"       : [],
    "uvs"          : [],
    "faces"        : [],    
    }
    

    nvertex = 0
    nface = 0
    nnormal = 0
    ncolor = 0
    nuv = 0
    nmaterial = 0
    nmorphTarget = 0

    vertices = []
    normals = {}
    colors = {}
    uvs = {}
    materials = {}
    morphTarget = []

    for mesh, object in meshes:
        option_colors = option_colors and has_vertex_colors(mesh)
        option_uv_coords = option_uv_coords and has_uvs(mesh)

        if option_vertices or option_vertices_truncate:
            vertices.extend(mesh.vertices[:])
            nvertex += count_mesh_vertices(mesh)

        if option_normals:
            normals.update(extract_vertex_normals(mesh, nnormal))
            nnormal += count_mesh_normals(mesh)

        if option_colors:
            colors.update(extract_vertex_colors(mesh, ncolor))
            ncolor += count_mesh_colors(mesh)

        if option_uv_coords:
            uvs.update(extract_uvs(mesh, nuv))
            nuv += count_mesh_uvs(mesh)

        if option_materials:
            materials.update(extract_materials(mesh, scene, option_colors, object.draw_type, option_copy_textures, filepath, nmaterial))
            nmaterial += count_mesh_materials(mesh)
            
        if option_faces:
            nface += count_mesh_faces(mesh)

    set_align_model(align_model)

    json_model["metadata"] = get_metadata(nvertex, nface, nnormal, ncolor, nuv, nmaterial, nmorphTarget)
    json_model["scale"] = get_scale(option_scale)
    json_model["materials"] = get_materials(materials, option_materials)
    json_model["vertices"] = get_vertices(vertices, option_vertices, option_vertices_truncate)
    json_model["normals"] = get_normals(normals, option_normals)
    json_model["colors"] = get_colors(colors, option_colors)
    json_model["uvs"].append(get_uvs(uvs, option_uv_coords))
    json_model["faces"] = get_faces(meshes, normals, uvs, colors, option_faces, option_normals, option_colors, option_uv_coords, option_materials)

    return json_model


# ####################################
# Export Model
# ####################################

def export(operator,
           context,
           filepath = "",
           option_flip_yz = True,
           option_vertices = True,
           option_vertices_truncate = False,
           option_faces = True,
           option_normals = True,
           option_uv_coords = True,
           option_materials = True,
           option_colors = True,
           align_model = 0,
           option_scale = 1.0,
           option_copy_textures = False,
           option_all_meshes = True,
           option_zip = False):

    scene = context.scene

    if scene.objects.active:
        bpy.ops.object.mode_set(mode = 'OBJECT')

    if option_all_meshes:
        sceneobjects = scene.objects
    else:
        sceneobjects = context.selected_objects

    objects = []
    objects = extract_objects(sceneobjects)

    export_model(objects,
                 scene,
                 filepath,
                 option_flip_yz,
                 option_vertices,
                 option_vertices_truncate,
                 option_faces,
                 option_normals,
                 option_uv_coords,
                 option_materials,
                 option_colors,
                 align_model,
                 option_scale,
                 True,      #export_single_model
                 option_copy_textures)

    if option_zip:
        zip_file(filepath, option_copy_textures)

    return {'FINISHED'}

def export_model(objects,
                 scene,
                 filepath,
                 option_flip_yz,
                 option_vertices,
                 option_vertices_truncate,
                 option_faces,
                 option_normals,
                 option_uv_coords,
                 option_materials,
                 option_colors,
                 align_model,
                 option_scale,
                 export_single_model,
                 option_copy_textures):

    filepath = ensure_extension(filepath, '.js')

    meshes = extract_meshes(objects, scene, export_single_model, option_scale, option_flip_yz)

    json_model = get_json_model(meshes,
                                scene,
                                filepath,
                                option_vertices,
                                option_vertices_truncate,
                                option_faces,
                                option_normals,
                                option_uv_coords,
                                option_materials,
                                option_colors,
                                align_model,
                                option_scale,
                                option_copy_textures)
        
    data = json.dumps(json_model, separators=(',',':'))

    for mesh, object in meshes:
        bpy.data.meshes.remove(mesh)
        
    write_file(filepath, data)
# ####################################
# File Operate
# ####################################

def write_file(fname, content):
    out = open(fname, 'w')
    out.write(content)
    out.close()

def ensure_folder_exist(foldername):
    """Create folder (with whole path) if it doesn't exist yet."""

    if not os.access(foldername, os.R_OK|os.W_OK|os.X_OK):
        os.makedirs(foldername)

def ensure_extension(filepath, extension):
    if not filepath.lower().endswith(extension):
        filepath += extension
    return filepath

def save_image(img, name, fpath):
    dst_dir = os.path.dirname(fpath)
    dst_path = os.path.join(dst_dir, name)

    ensure_folder_exist(dst_dir)

    if img.packed_file:
        img.save_render(dst_path)

    else:
        src_path = bpy.path.abspath(img.filepath)
        shutil.copy(src_path, dst_dir)
        
def extract_texture_filename(image):
    fn = bpy.path.abspath(image.filepath)
    fn = os.path.normpath(fn)
    fn_strip = os.path.basename(fn)
    return fn_strip

def del_file(filepath):
    os.remove(filepath)
    
def zip_file(filepath, option_copy_textures):
    fdir = os.path.dirname(filepath)
    zname = os.path.splitext(os.path.basename(filepath))[0]
    zname = ensure_extension(zname, '.zip') # Get zip name
    zpath = os.path.join(fdir, zname) # Get zip path

    zfile = zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED)
    zfile.write(filepath)
    del_file(filepath)

    if option_copy_textures:
        global image_name #Declare global var
        for image in image_name:
            image_path = os.path.join(fdir, image)
            zfile.write(image_path)
            del_file(image_path)
            
    image_name = [] #Clear buffer after export done
    
    zfile.close()
