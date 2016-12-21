#---------------------------------------------------
# File particle.py
#---------------------------------------------------
import bpy, mathutils, math
from mathutils import Vector, Matrix
from math import pi
 
def run(origo):
    # Add emitter mesh
    origin = Vector(origo)
    bpy.ops.mesh.primitive_plane_add(location=origin)
    emitter = bpy.context.object
 
    # --- Particle system 1: Falling and blowing drops ---
 
    # Add first particle system
    bpy.ops.object.particle_system_add()    
    psys1 = emitter.particle_systems[-1]
    psys1.name = 'Drops'
 
    # Emission    
    pset1 = psys1.settings
    pset1.name = 'DropSettings'
    pset1.frame_start = 40
    pset1.frame_end = 200
    pset1.lifetime = 50
    pset1.lifetime_random = 0.4
    pset1.emit_from = 'FACE'
    pset1.use_render_emitter = True
    pset1.object_align_factor = (0,0,1)
 
    # Physics
    pset1.physics_type = 'NEWTON'
    pset1.mass = 2.5
    pset1.particle_size = 0.3
    pset1.use_multiply_size_mass = True
 
    # Effector weights
    ew = pset1.effector_weights
    ew.gravity = 1.0
    ew.wind = 1.0
 
    # Children
    pset1.child_nbr = 10
    pset1.rendered_child_count = 10
    pset1.child_type = 'SIMPLE'
 
    # Display and render
    pset1.draw_percentage = 100
    pset1.draw_method = 'CROSS'
    pset1.material = 1
    pset1.particle_size = 0.1    
    pset1.render_type = 'HALO'
    pset1.render_step = 3
 
    # ------------ Wind effector -----
 
    # Add wind effector
    bpy.ops.object.effector_add(
        type='WIND',
        enter_editmode=False, 
        location = origin - Vector((0,3,0)), 
        rotation = (-pi/2, 0, 0))
    wind = bpy.context.object
 
    # Field settings
    fld = wind.field
    fld.strength = 2.3
    fld.noise = 3.2
    fld.flow = 0.3    
 
    # --- Particle system 2: Monkeys in the wind ----
 
    # Add monkey to be used as dupli object
    # Hide the monkey on layer 2
    layers = 20*[False]
    layers[1] = True
    bpy.ops.mesh.primitive_monkey_add(
        location=origin+Vector((0,5,0)), 
        rotation = (pi/2, 0, 0),
        layers = layers)
    monkey = bpy.context.object
 
    #Add second particle system
    bpy.context.scene.objects.active = emitter
    bpy.ops.object.particle_system_add()    
    psys2 = emitter.particle_systems[-1]
    psys2.name = 'Monkeys'
    pset2 = psys2.settings
    pset2.name = 'MonkeySettings'
 
    # Emission
    pset2.count = 4
    pset2.frame_start = 1
    pset2.frame_end = 50
    pset2.lifetime = 250
    pset2.emit_from = 'FACE'
    pset2.use_render_emitter = True
 
    # Velocity
    pset2.factor_random = 0.5
 
    # Physics
    pset2.physics_type = 'NEWTON'
    pset2.brownian_factor = 0.5
 
    # Effector weights
    ew = pset2.effector_weights
    ew.gravity = 0
    ew.wind = 0.2
 
    # Children
    pset2.child_nbr = 1
    pset2.rendered_child_count = 1
    pset2.child_size = 3
    pset2.child_type = 'SIMPLE'
 
    # Display and render
    pset2.draw_percentage = 1
    pset2.draw_method = 'RENDER'
    pset2.dupli_object = monkey
    pset2.material = 1
    pset2.particle_size = 0.1    
    pset2.render_type = 'OBJECT'
    pset2.render_step = 3
 
    return
 
if __name__ == "__main__":
    bpy.ops.object.select_by_type(type='MESH')
    bpy.ops.object.delete()
    run((0,0,0))
    bpy.ops.screen.animation_play(reverse=False, sync=False)
	
	
	
def createHead(origin):
    # Add emitter mesh
    bpy.ops.mesh.primitive_ico_sphere_add(location=origin)
    ob = bpy.context.object
    bpy.ops.object.shade_smooth()
 
    # Create scalp vertex group, and add verts and weights
    scalp = ob.vertex_groups.new('Scalp')
    for v in ob.data.vertices:
        z = v.co[2]
        y = v.co[1]
        if z > 0.3 or y > 0.3:
            w = 2*(z-0.3)
            if w > 1:
                w = 1
            scalp.add([v.index], w, 'REPLACE')
    return ob
 
def createMaterials(ob):
    # Some material for the skin
    skinmat = bpy.data.materials.new('Skin')
    skinmat.diffuse_color = (0.6,0.3,0)
 
    # Strand material for hair
    hairmat = bpy.data.materials.new('Strand')
    hairmat.diffuse_color = (0.2,0.04,0.0)
    hairmat.specular_intensity = 0
 
    # Transparency
    hairmat.use_transparency = True
    hairmat.transparency_method = 'Z_TRANSPARENCY'
    hairmat.alpha = 0
 
    # Strand. Must use Blender units before sizes are pset.
    strand = hairmat.strand
    strand.use_blender_units = True
    strand.root_size = 0.01
    strand.tip_size = 0.0025
    strand.size_min = 0.001
    #strand.use_surface_diffuse = True	# read-only
    strand.use_tangent_shading = True
 
    # Texture
    tex = bpy.data.textures.new('Blend', type = 'BLEND')
    tex.progression = 'LINEAR'
    tex.use_flip_axis = 'HORIZONTAL'
 
    # Create a color ramp for color and alpha
    tex.use_color_ramp = True
    tex.color_ramp.interpolation = 'B_SPLINE'
    # Points in color ramp: (pos, rgba)
    # Have not figured out how to add points to ramp
    rampTable = [
        (0.0, (0.23,0.07,0.03,0.75)),
        #(0.2, (0.4,0.4,0,0.5)),
        #(0.7, (0.6,0.6,0,0.5)),
        (1.0, (0.4,0.3,0.05,0))
    ]
    elts = tex.color_ramp.elements
    n = 0
    for (pos, rgba) in rampTable:
        elts[n].position = pos
        elts[n].color = rgba
        n += 1
 
    # Add blend texture to hairmat
    mtex = hairmat.texture_slots.add()
    mtex.texture = tex
    mtex.texture_coords = 'STRAND'
    mtex.use_map_color_diffuse = True 
    mtex.use_map_alpha = True 
 
    # Add materials to mesh    
    ob.data.materials.append(skinmat)    # Material 1 = Skin
    ob.data.materials.append(hairmat)    # Material 2 = Strand
    return    
 
def createHair(ob):    
    # Create hair particle system
    bpy.ops.object.particle_system_add()
    psys = ob.particle_systems.active
    psys.name = 'Hair'
    # psys.global_hair = True    
    psys.vertex_group_density = 'Scalp'
 
    pset = psys.settings
    pset.type = 'HAIR'
    pset.name = 'HairSettings'
 
    # Emission
    pset.count = 40
    pset.hair_step = 7
    pset.emit_from = 'FACE'
 
    # Render
    pset.material = 2
    pset.use_render_emitter = True
    pset.render_type = 'PATH'
    pset.use_strand_primitive = True
    pset.use_hair_bspline = True
 
    # Children
    pset.child_type = 'SIMPLE'
    pset.child_nbr = 10
    pset.rendered_child_count = 500
    pset.child_length = 1.0
    pset.child_length_threshold = 0.0
 
    pset.child_roundness = 0.4
    pset.clump_factor = 0.862
    pset.clump_shape = 0.999
 
    pset.roughness_endpoint = 0.0
    pset.roughness_end_shape = 1.0
    pset.roughness_1 = 0.0
    pset.roughness_1_size = 1.0
    pset.roughness_2 = 0.0
    pset.roughness_2_size = 1.0
    pset.roughness_2_threshold = 0.0
 
    pset.kink = 'CURL'
    pset.kink_amplitude = 0.2
    pset.kink_shape = 0.0
    pset.kink_frequency = 2.0
 
    return
 
def run(origin):
    ob = createHead(origin)
    createMaterials(ob)
    createHair(ob)
    return
 
if __name__ == "__main__":
    bpy.ops.object.select_by_type(type='MESH')
    bpy.ops.object.delete()
    run((0,0,0))
import bpy, mathutils, math
from mathutils import Vector, Matrix
from math import pi
 
def createEmitter(origin):
    bpy.ops.mesh.primitive_plane_add(location=origin)
    emitter = bpy.context.object
    bpy.ops.mesh.uv_texture_add()
    return emitter
 
def createFire(emitter):    
    # Add first particle system
    bpy.context.scene.objects.active = emitter
    bpy.ops.object.particle_system_add()    
    fire = emitter.particle_systems[-1]
    fire.name = 'Fire'
    fset = fire.settings
 
    # Emission    
    fset.name = 'FireSettings'
    fset.count = 100
    fset.frame_start = 1
    fset.frame_end = 200
    fset.lifetime = 70
    fset.lifetime_random = 0.2
    fset.emit_from = 'FACE'
    fset.use_render_emitter = False
    fset.distribution = 'RAND'
    fset.object_align_factor = (0,0,1)
 
    # Velocity
    fset.normal_factor = 0.55
    fset.factor_random = 0.5
 
    # Physics
    fset.physics_type = 'NEWTON'
    fset.mass = 1.0
    fset.particle_size = 10.0
    fset.use_multiply_size_mass = False
 
    # Effector weights
    ew = fset.effector_weights
    ew.gravity = 0.0
    ew.wind = 1.0
 
    # Display and render
    fset.draw_percentage = 100
    fset.draw_method = 'RENDER'
    fset.material = 1
    fset.particle_size = 0.3
    fset.render_type = 'BILLBOARD'
    fset.render_step = 3
 
    # Children
    fset.child_type = 'SIMPLE'
    fset.rendered_child_count = 50
    fset.child_radius = 1.1
    fset.child_roundness = 0.5
    return fire
 
def createSmoke(emitter):    
    # Add second particle system
    bpy.context.scene.objects.active = emitter
    bpy.ops.object.particle_system_add()    
    smoke = emitter.particle_systems[-1]
    smoke.name = 'Smoke'
    sset = smoke.settings
 
    # Emission    
    sset.name = 'FireSettings'
    sset.count = 100
    sset.frame_start = 1
    sset.frame_end = 100
    sset.lifetime = 70
    sset.lifetime_random = 0.2
    sset.emit_from = 'FACE'
    sset.use_render_emitter = False
    sset.distribution = 'RAND'
 
    # Velocity
    sset.normal_factor = 0.0
    sset.factor_random = 0.5
 
    # Physics
    sset.physics_type = 'NEWTON'
    sset.mass = 2.5
    sset.particle_size = 0.3
    sset.use_multiply_size_mass = True
 
    # Effector weights
    ew = sset.effector_weights
    ew.gravity = 0.0
    ew.wind = 1.0
 
    # Display and render
    sset.draw_percentage = 100
    sset.draw_method = 'RENDER'
    sset.material = 2
    sset.particle_size = 0.5    
    sset.render_type = 'BILLBOARD'
    sset.render_step = 3
 
    # Children
    sset.child_type = 'SIMPLE'
    sset.rendered_child_count = 50
    sset.child_radius = 1.6
    return smoke
 
def createWind(origin):    
    bpy.ops.object.effector_add(
        type='WIND',
        enter_editmode=False, 
        location = origin - Vector((0,3,0)), 
        rotation = (-pi/2, 0, 0))
    wind = bpy.context.object
 
    # Field settings
    fld = wind.field
    fld.strength = 2.3
    fld.noise = 3.2
    fld.flow = 0.3        
    return wind
 
def createColorRamp(tex, values):
    tex.use_color_ramp = True
    ramp = tex.color_ramp
    for n,value in enumerate(values):
        elt = ramp.elements[n]
        (pos, color) = value
        elt.position = pos
        elt.color = color
    return
 
def createFlameTexture():
    tex = bpy.data.textures.new('Flame', type = 'CLOUDS')
    createColorRamp(tex, [(0.2, (1,0.5,0.1,1)), (0.8, (0.5,0,0,0))])
    tex.noise_type = 'HARD_NOISE'
    tex.noise_scale = 0.7
    tex.noise_depth = 5
    return tex    
 
def createStencilTexture():
    tex = bpy.data.textures.new('Stencil', type = 'BLEND')
    tex.progression = 'SPHERICAL'
    createColorRamp(tex, [(0.0, (0,0,0,0)), (0.85, (1,1,1,0.6))])
    return tex    
 
def createEmitTexture():
    tex = bpy.data.textures.new('Emit', type = 'BLEND')
    tex.progression = 'LINEAR'
    createColorRamp(tex, [(0.1, (1,1,0,1)), (0.3, (1,0,0,1))])
    return tex    
 
def createSmokeTexture():
    tex = bpy.data.textures.new('Smoke', type = 'CLOUDS')
    createColorRamp(tex, [(0.2, (0,0,0,1)), (0.6, (1,1,1,1))])
    tex.noise_type = 'HARD_NOISE'
    tex.noise_scale = 1.05
    tex.noise_depth = 5
    return tex    
 
def createFireMaterial(textures, objects):
    (flame, stencil, emit) = textures
    (emitter, empty) = objects
 
    mat = bpy.data.materials.new('Fire')
    mat.specular_intensity = 0.0
    mat.use_transparency = True
    mat.transparency_method = 'Z_TRANSPARENCY'
    mat.alpha = 0.0
    mat.use_raytrace = False
    mat.use_face_texture = True
    mat.use_shadows = False
    mat.use_cast_buffer_shadows = True
 
    mtex = mat.texture_slots.add()
    mtex.texture = emit
    mtex.texture_coords = 'UV'
    mtex.use_map_color_diffuse = True
 
    mtex = mat.texture_slots.add()
    mtex.texture = stencil
    mtex.texture_coords = 'UV'
    mtex.use_map_color_diffuse = False
    mtex.use_map_emit = True
    mtex.use_stencil = True
 
    mtex = mat.texture_slots.add()
    mtex.texture = flame
    mtex.texture_coords = 'UV'
    mtex.use_map_color_diffuse = True
    mtex.use_map_alpha = True
    #mtex.object = empty
    return mat
 
def createSmokeMaterial(textures, objects):
    (smoke, stencil) = textures
    (emitter, empty) = objects
 
    mat = bpy.data.materials.new('Smoke')
    mat.specular_intensity = 0.0
    mat.use_transparency = True
    mat.transparency_method = 'Z_TRANSPARENCY'
    mat.alpha = 0.0
    mat.use_raytrace = False
    mat.use_face_texture = True
    mat.use_shadows = True
    mat.use_cast_buffer_shadows = True
 
    mtex = mat.texture_slots.add()
    mtex.texture = stencil
    mtex.texture_coords = 'UV'
    mtex.use_map_color_diffuse = False
    mtex.use_map_alpha = True
    mtex.use_stencil = True
 
    mtex = mat.texture_slots.add()
    mtex.texture = smoke
    mtex.texture_coords = 'OBJECT'
    mtex.object = empty
    return mat
 
def run(origin):
    emitter = createEmitter(origin)
    #wind = createWind()
    bpy.ops.object.add(type='EMPTY')
    empty = bpy.context.object
 
    fire = createFire(emitter)
    flameTex = createFlameTexture()
    stencilTex = createStencilTexture()
    emitTex = createEmitTexture()
    flameMat = createFireMaterial(
        (flameTex, stencilTex, emitTex), 
        (emitter, empty))
    emitter.data.materials.append(flameMat)
 
    smoke = createSmoke(emitter)
    smokeTex = createSmokeTexture()
    smokeMat = createSmokeMaterial(
        (smokeTex, stencilTex), (emitter, empty))
    emitter.data.materials.append(smokeMat)
    return    
 
if __name__ == "__main__":
    bpy.ops.object.select_by_type(type='MESH')
    bpy.ops.object.delete()
    run((0,0,0))
    bpy.ops.screen.animation_play(reverse=False, sync=False)