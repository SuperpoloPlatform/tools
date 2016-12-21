import bpy, mathutils, io, operator, functools

class AddTeapot(bpy.types.Operator):
	"""Add a teapot mesh"""
	bl_idname = "mesh.primitive_teapot_add"
	bl_label = "Add Teapot"
	bl_options = {"REGISTER", "UNDO"}

	resolution = bpy.props.IntProperty(name="Resolution",
		description="Resolution of the Teapot",
		default=5, min=2, max=15)

	objecttype = bpy.props.IntProperty(name="Object Type",
		description="Type of Bezier Object",
		default=1, min=1, max=2)

	def execute(self, context):
		verts, faces = make_teapot(self.objecttype,
								   self.resolution)
		# Actually create the mesh object from this geometry data.
		obj = create_mesh_object(context, verts, [], faces, "Teapot")
		return {'FINISHED'}

def menu_func(self, context):
	self.layout.operator(AddTeapot.bl_idname, text="Teapot+", icon="MESH_CUBE")

def register():
	bpy.utils.register_module(__name__)
	bpy.types.INFO_MT_mesh_add.append(menu_func)

def unregister():
	bpy.utils.unregister_module(__name__)
	bpy.types.INFO_MT_mesh_add.remove(menu_func)

if __name__ == "__main__":
	register()

def create_mesh_object(context, verts, edges, faces, name):
    # Create new mesh
    mesh = bpy.data.meshes.new(name)
    # Make a mesh from a list of verts/edges/faces.
    mesh.from_pydata(verts, edges, faces)
    # Update mesh geometry after adding stuff.
    mesh.update()
    from bpy_extras import object_utils
    return object_utils.object_data_add(context, mesh, operator=None)

# ==========================
# === Bezier patch Block ===
# ==========================
def read_indexed_patch_file(filename):
	file = io.StringIO(filename)
	rawpatches = []
	patches = []
	numpatches = int(file.readline())
	for i in range(numpatches):
		line = file.readline()
		a,b,c,d, e,f,g,h, i,j,k,l, m,n,o,p = map(int, line.split(","))
		patches.append([[a,b,c,d], [e,f,g,h], [i,j,k,l], [m,n,o,p]])
		rawpatches.append([[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]])
	verts = []
	numverts = int(file.readline())
	for i in range(numverts):
		line = file.readline()
		v1,v2,v3 = map(float, line.split(","))
		verts.append((v1,v2,v3))
	for i in range(len(patches)):
		for j in range(4):	#len(patches[i])):
			for k in range(4):	#len(patches[i][j])):
				index = patches[i][j][k] - 1
				rawpatches[i][j][k] = verts[index]
	return rawpatches

def patches_to_raw(patches, resolution):
	raw = []
	for patch in patches:
		verts = make_verts(patch, resolution)
		faces = make_faces(resolution)
		rawquads = indexed_to_rawquads(verts, faces)
		raw.append(rawquads)
	raw = functools.reduce(operator.add, raw)  # flatten the list
	return raw

def make_bezier(ctrlpnts, resolution):
	b1 = lambda t: t*t*t
	b2 = lambda t: 3*t * t * (1-t)
	b3 = lambda t: 3*t * (1-t) * (1-t)
	b4 = lambda t: (1-t) * (1-t) * (1-t)
	makevec = lambda v: mathutils.Vector(v)
	p1,p2,p3,p4 = map(makevec, ctrlpnts)
	curveverts = []
	for i in range(resolution+1):
		t = i/resolution
		x,y,z = b1(t)*p1 + b2(t)*p2 + b3(t)*p3 + b4(t)*p4
		curveverts.append((x,y,z))
	return curveverts

def make_bezier(ctrlpnts, resolution):
	b1 = lambda t: t*t*t
	b2 = lambda t: 3*t * t * (1-t)
	b3 = lambda t: 3*t * (1-t) * (1-t)
	b4 = lambda t: (1-t) * (1-t) * (1-t)
	p1,p2,p3,p4 = map(mathutils.Vector, ctrlpnts)
	def makevert(t):
		x,y,z = b1(t)*p1 + b2(t)*p2 + b3(t)*p3 + b4(t)*p4
		return (x,y,z)
	curveverts = [makevert(i/resolution) for i in range(resolution+1)]
	return curveverts

def make_verts(a, resolution):
	s = []
	for i in a:
		c = make_bezier(i, resolution)
		s.append(c)
	b = transpose(s)
	s = []
	for i in b:
		c = make_bezier(i, resolution)
		s.append(c)
	verts = s
	verts = functools.reduce(operator.add, verts)  # flatten the list
	return verts

def make_faces(resolution):
	n = resolution+1
	faces = []
	for i in range(n-1):
		for j in range(n-1):
			v1 = (i+1)*n+j
			v2 = (i+1)*n+j+1
			v3 = i*n+j+1
			v4 = i*n+j
			faces.append([v1,v2,v3,v4])
	return faces

def indexed_to_rawquads(verts, faces):
	rows = len(faces)
	cols = len(faces[0])	# or 4
	rawquads = [[None]*cols for i in range(rows)]
	for i in range(rows):
		for j in range(cols):
			index = faces[i][j]
			rawquads[i][j] = verts[index]
	return rawquads

def raw_to_indexed(rawfaces): # Generate verts and faces lists, without dups
	verts = []
	coords = {}
	index = 0
	for i in range(len(rawfaces)):
		for j in range(len(rawfaces[i])):
			vertex = rawfaces[i][j]
			if vertex not in coords:
				coords[vertex] = index
				index += 1
				verts.append(vertex)
			rawfaces[i][j] = coords[vertex]
	return verts, rawfaces

def transpose(rowsbycols):
	rows = len(rowsbycols)
	cols = len(rowsbycols[0])
	colsbyrows = [[None]*rows for i in range(cols)]
	for i in range(cols):
		for j in range(rows):
			colsbyrows[i][j] = rowsbycols[j][i]
	return colsbyrows

def make_teapot(filename, resolution):
	filenames = [None, teapot, teaspoon]
	filename = filenames[filename]
	patches = read_indexed_patch_file(filename)
	raw = patches_to_raw(patches, resolution)
	verts, faces = raw_to_indexed(raw)
	return (verts, faces)
ef createFaces(vertIdx1, vertIdx2, closed=False, flipped=False):
    faces = []

    if not vertIdx1 or not vertIdx2:
        return None

    if len(vertIdx1) < 2 and len(vertIdx2) < 2:
        return None

    fan = False
    if (len(vertIdx1) != len(vertIdx2)):
        if (len(vertIdx1) == 1 and len(vertIdx2) > 1):
            fan = True
        else:
            return None

    total = len(vertIdx2)

    if closed:
        # Bridge the start with the end.
        if flipped:
            face = [
                vertIdx1[0],
                vertIdx2[0],
                vertIdx2[total - 1]]
            if not fan:
                face.append(vertIdx1[total - 1])
            faces.append(face)

        else:
            face = [vertIdx2[0], vertIdx1[0]]
            if not fan:
                face.append(vertIdx1[total - 1])
            face.append(vertIdx2[total - 1])
            faces.append(face)

    # Bridge the rest of the faces.
    for num in range(total - 1):
        if flipped:
            if fan:
                face = [vertIdx2[num], vertIdx1[0], vertIdx2[num + 1]]
            else:
                face = [vertIdx2[num], vertIdx1[num],
                    vertIdx1[num + 1], vertIdx2[num + 1]]
            faces.append(face)
        else:
            if fan:
                face = [vertIdx1[0], vertIdx2[num], vertIdx2[num + 1]]
            else:
                face = [vertIdx1[num], vertIdx2[num],
                    vertIdx2[num + 1], vertIdx1[num + 1]]
            faces.append(face)

    return faces


# @todo Clean up vertex&face creation process a bit.
def add_sqorus(hole_size, subdivide):
    verts = []
    faces = []

    size = 2.0

    thickness = (size - hole_size) / 2.0
    distances = [
        -size / 2.0,
        -size / 2.0 + thickness,
        size / 2.0 - thickness,
        size / 2.0]

    if subdivide:
        for i in range(4):
            y = distances[i]

            for j in range(4):
                x = distances[j]

                verts.append(Vector((x, y, size / 2.0)))
                verts.append(Vector((x, y, -size / 2.0)))

        # Top outer loop (vertex indices)
        vIdx_out_up = [0, 2, 4, 6, 14, 22, 30, 28, 26, 24, 16, 8]
        # Lower outer loop (vertex indices)
        vIdx_out_low = [i + 1 for i in vIdx_out_up]

        faces_outside = createFaces(vIdx_out_up, vIdx_out_low, closed=True)
        faces.extend(faces_outside)

        # Top inner loop (vertex indices)
        vIdx_inner_up = [10, 12, 20, 18]

        # Lower inner loop (vertex indices)
        vIdx_inner_low = [i + 1 for i in vIdx_inner_up]

        faces_inside = createFaces(vIdx_inner_up, vIdx_inner_low,
            closed=True, flipped=True)
        faces.extend(faces_inside)

        row1_top = [0, 8, 16, 24]
        row2_top = [i + 2 for i in row1_top]
        row3_top = [i + 2 for i in row2_top]
        row4_top = [i + 2 for i in row3_top]

        faces_top1 = createFaces(row1_top, row2_top)
        faces.extend(faces_top1)
        faces_top2_side1 = createFaces(row2_top[:2], row3_top[:2])
        faces.extend(faces_top2_side1)
        faces_top2_side2 = createFaces(row2_top[2:], row3_top[2:])
        faces.extend(faces_top2_side2)
        faces_top3 = createFaces(row3_top, row4_top)
        faces.extend(faces_top3)

        row1_bot = [1, 9, 17, 25]
        row2_bot = [i + 2 for i in row1_bot]
        row3_bot = [i + 2 for i in row2_bot]
        row4_bot = [i + 2 for i in row3_bot]

        faces_bot1 = createFaces(row1_bot, row2_bot, flipped=True)
        faces.extend(faces_bot1)
        faces_bot2_side1 = createFaces(row2_bot[:2], row3_bot[:2],
            flipped=True)
        faces.extend(faces_bot2_side1)
        faces_bot2_side2 = createFaces(row2_bot[2:], row3_bot[2:],
            flipped=True)
        faces.extend(faces_bot2_side2)
        faces_bot3 = createFaces(row3_bot, row4_bot, flipped=True)
        faces.extend(faces_bot3)

    else:
        # Do not subdivde outer faces

        vIdx_out_up = []
        vIdx_out_low = []
        vIdx_in_up = []
        vIdx_in_low = []

        for i in range(4):
            y = distances[i]

            for j in range(4):
                x = distances[j]

                append = False
                inner = False
                # Outer
                if (i in [0, 3] and j in [0, 3]):
                    append = True

                # Inner
                if (i in [1, 2] and j in [1, 2]):
                    append = True
                    inner = True

                if append:
                    vert_up = len(verts)
                    verts.append(Vector((x, y, size / 2.0)))
                    vert_low = len(verts)
                    verts.append(Vector((x, y, -size / 2.0)))

                    if inner:
                        vIdx_in_up.append(vert_up)
                        vIdx_in_low.append(vert_low)

                    else:
                        vIdx_out_up.append(vert_up)
                        vIdx_out_low.append(vert_low)

        # Flip last two vertices
        vIdx_out_up = vIdx_out_up[:2] + list(reversed(vIdx_out_up[2:]))
        vIdx_out_low = vIdx_out_low[:2] + list(reversed(vIdx_out_low[2:]))
        vIdx_in_up = vIdx_in_up[:2] + list(reversed(vIdx_in_up[2:]))
        vIdx_in_low = vIdx_in_low[:2] + list(reversed(vIdx_in_low[2:]))

        # Create faces
        faces_top = createFaces(vIdx_in_up, vIdx_out_up, closed=True)
        faces.extend(faces_top)
        faces_bottom = createFaces(vIdx_out_low, vIdx_in_low, closed=True)
        faces.extend(faces_bottom)
        faces_inside = createFaces(vIdx_in_low, vIdx_in_up, closed=True)
        faces.extend(faces_inside)
        faces_outside = createFaces(vIdx_out_up, vIdx_out_low, closed=True)
        faces.extend(faces_outside)

    return verts, faces


def add_wedge(size_x, size_y, size_z):
    verts = []
    faces = []

    size_x /= 2.0
    size_y /= 2.0
    size_z /= 2.0

    vIdx_top = []
    vIdx_bot = []

    vIdx_top.append(len(verts))
    verts.append(Vector((-size_x, -size_y, size_z)))
    vIdx_bot.append(len(verts))
    verts.append(Vector((-size_x, -size_y, -size_z)))

    vIdx_top.append(len(verts))
    verts.append(Vector((size_x, -size_y, size_z)))
    vIdx_bot.append(len(verts))
    verts.append(Vector((size_x, -size_y, -size_z)))

    vIdx_top.append(len(verts))
    verts.append(Vector((-size_x, size_y, size_z)))
    vIdx_bot.append(len(verts))
    verts.append(Vector((-size_x, size_y, -size_z)))

    faces.append(vIdx_top)
    faces.append(vIdx_bot)
    faces_outside = createFaces(vIdx_top, vIdx_bot, closed=True)
    faces.extend(faces_outside)

    return verts, faces

def add_star(points, outer_radius, inner_radius, height):
    PI_2 = pi * 2
    z_axis = (0, 0, 1)

    verts = []
    faces = []

    segments = points * 2

    half_height = height / 2.0

    vert_idx_top = len(verts)
    verts.append(Vector((0.0, 0.0, half_height)))

    vert_idx_bottom = len(verts)
    verts.append(Vector((0.0, 0.0, -half_height)))

    edgeloop_top = []
    edgeloop_bottom = []

    for index in range(segments):
        quat = Quaternion(z_axis, (index / segments) * PI_2)

        if index % 2:
            # Uneven
            radius = outer_radius
        else:
            # Even
            radius = inner_radius

        edgeloop_top.append(len(verts))
        vec = quat * Vector((radius, 0, half_height))
        verts.append(vec)

        edgeloop_bottom.append(len(verts))
        vec = quat * Vector((radius, 0, -half_height))
        verts.append(vec)



    faces_top = createFaces([vert_idx_top], edgeloop_top, closed=True)
    faces_outside = createFaces(edgeloop_top, edgeloop_bottom, closed=True)
    faces_bottom = createFaces([vert_idx_bottom], edgeloop_bottom,
        flipped=True, closed=True)

    faces.extend(faces_top)
    faces.extend(faces_outside)
    faces.extend(faces_bottom)

    return verts, faces

def trapezohedron(s,r,h):
    """
    s = segments
    r = base radius
    h = tip height
    """
    
    # calculate constants
    a = 2*pi/(2*s)          # angle between points along the equator
    l = r*cos(a)            # helper for  e
    e = h*(r-l)/(l+r)       # the z offset for each vector along the equator so faces are planar

    # rotation for the points
    quat = Quaternion((0,0,1),a)
    
    # first 3 vectors, every next one is calculated from the last, and the z-value is negated
    verts = [Vector(i) for i in [(0,0,h),(0,0,-h),(r,0,e)]]
    for i in range(2*s-1):
        verts.append(quat*verts[-1])    # rotate further "a" radians around the z-axis
        verts[-1].z *= -1               # negate last z-value to account for the zigzag 
    
    faces = []
    for i in range(2,2+2*s,2):
        n = [i+1,i+2,i+3]               # vertices in current section
        for j in range(3):              # check whether the numbers dont go over len(verts)
            if n[j]>=2*s+2: n[j]-=2*s   # if so, subtract len(verts)-2
        
        # add faces of current section
        faces.append([0,i]+n[:2])
        faces.append([1,n[2],n[1],n[0]])
    
    return verts,faces

class AddSqorus(bpy.types.Operator):
    """Add a sqorus mesh"""
    bl_idname = "mesh.primitive_sqorus_add"
    bl_label = "Add Sqorus"
    bl_options = {'REGISTER', 'UNDO', 'PRESET'}

    hole_size = FloatProperty(name="Hole Size",
        description="Size of the Hole",
        min=0.01,
        max=1.99,
        default=2.0 / 3.0)
    subdivide = BoolProperty(name="Subdivide Outside",
        description="Enable to subdivide the faces on the outside " \
                    "(this results in equally spaced vertices)",
        default=True)

    def execute(self, context):

        # Create mesh geometry
        verts, faces = add_sqorus(
            self.hole_size,
            self.subdivide)

        # Create mesh object (and meshdata)
        obj = create_mesh_object(context, verts, [], faces, "Sqorus")

        return {'FINISHED'}


class AddWedge(bpy.types.Operator):
    """Add a wedge mesh"""
    bl_idname = "mesh.primitive_wedge_add"
    bl_label = "Add Wedge"
    bl_options = {'REGISTER', 'UNDO', 'PRESET'}

    size_x = FloatProperty(name="Size X",
        description="Size along the X axis",
        min=0.01,
        max=9999.0,
        default=2.0)
    size_y = FloatProperty(name="Size Y",
        description="Size along the Y axis",
        min=0.01,
        max=9999.0,
        default=2.0)
    size_z = FloatProperty(name="Size Z",
        description="Size along the Z axis",
        min=0.01,
        max=9999.0,
        default=2.00)

    def execute(self, context):

        verts, faces = add_wedge(
            self.size_x,
            self.size_y,
            self.size_z)

        obj = create_mesh_object(context, verts, [], faces, "Wedge")

        return {'FINISHED'}


class AddStar(bpy.types.Operator):
    """Add a star mesh"""
    bl_idname = "mesh.primitive_star_add"
    bl_label = "Add Star"
    bl_options = {'REGISTER', 'UNDO', 'PRESET'}

    points = IntProperty(name="Points",
        description="Number of points for the star",
        min=2,
        max=256,
        default=5)
    outer_radius = FloatProperty(name="Outer Radius",
        description="Outer radius of the star",
        min=0.01,
        max=9999.0,
        default=1.0)
    innter_radius = FloatProperty(name="Inner Radius",
        description="Inner radius of the star",
        min=0.01,
        max=9999.0,
        default=0.5)
    height = FloatProperty(name="Height",
        description="Height of the star",
        min=0.01,
        max=9999.0,
        default=0.5)

    def execute(self, context):

        verts, faces = add_star(
            self.points,
            self.outer_radius,
            self.innter_radius,
            self.height)

        obj = create_mesh_object(context, verts, [], faces, "Star")

        return {'FINISHED'}


class AddTrapezohedron(bpy.types.Operator):
    """Add a trapezohedron"""
    bl_idname = "mesh.primitive_trapezohedron_add"
    bl_label = "Add trapezohedron"
    bl_description = "Create one of the regular solids"
    bl_options = {'REGISTER', 'UNDO', 'PRESET'}

    segments = IntProperty(name = "Segments",
                description = "Number of repeated segments",
                default = 4, min = 2, max = 256)
    radius = FloatProperty(name = "Base radius",
                description = "Radius of the middle",
                default = 1.0, min = 0.01, max = 100.0)
    height = FloatProperty(name = "Tip height",
                description = "Height of the tip",
                default = 1, min = 0.01, max = 100.0)

    def execute(self,context):
        # generate mesh
        verts,faces = trapezohedron(self.segments,
                                    self.radius,
                                    self.height)
        
        obj = create_mesh_object(context, verts, [], faces, "Trapazohedron")

        return {'FINISHED'}
		
		
def createFaces(vertIdx1, vertIdx2, closed=False, flipped=False):
    faces = []

    if not vertIdx1 or not vertIdx2:
        return None

    if len(vertIdx1) < 2 and len(vertIdx2) < 2:
        return None

    fan = False
    if (len(vertIdx1) != len(vertIdx2)):
        if (len(vertIdx1) == 1 and len(vertIdx2) > 1):
            fan = True
        else:
            return None

    total = len(vertIdx2)

    if closed:
        # Bridge the start with the end.
        if flipped:
            face = [
                vertIdx1[0],
                vertIdx2[0],
                vertIdx2[total - 1]]
            if not fan:
                face.append(vertIdx1[total - 1])
            faces.append(face)

        else:
            face = [vertIdx2[0], vertIdx1[0]]
            if not fan:
                face.append(vertIdx1[total - 1])
            face.append(vertIdx2[total - 1])
            faces.append(face)

    # Bridge the rest of the faces.
    for num in range(total - 1):
        if flipped:
            if fan:
                face = [vertIdx2[num], vertIdx1[0], vertIdx2[num + 1]]
            else:
                face = [vertIdx2[num], vertIdx1[num],
                    vertIdx1[num + 1], vertIdx2[num + 1]]
            faces.append(face)
        else:
            if fan:
                face = [vertIdx1[0], vertIdx2[num], vertIdx2[num + 1]]
            else:
                face = [vertIdx1[num], vertIdx2[num],
                    vertIdx2[num + 1], vertIdx1[num + 1]]
            faces.append(face)

    return faces


# @todo Clean up vertex&face creation process a bit.
def add_gem(r1, r2, seg, h1, h2):
    """
    r1 = pavilion radius
    r2 = crown radius
    seg = number of segments
    h1 = pavilion height
    h2 = crown height
    Generates the vertices and faces of the gem
    """

    verts = []

    a = 2.0 * pi / seg             # Angle between segments
    offset = a / 2.0               # Middle between segments

    r3 = ((r1 + r2) / 2.0) / cos(offset)  # Middle of crown
    r4 = (r1 / 2.0) / cos(offset)  # Middle of pavilion
    h3 = h2 / 2.0                  # Middle of crown height
    h4 = -h1 / 2.0                 # Middle of pavilion height

    # Tip
    vert_tip = len(verts)
    verts.append(Vector((0.0, 0.0, -h1)))

    # Middle vertex of the flat side (crown)
    vert_flat = len(verts)
    verts.append(Vector((0.0, 0.0, h2)))

    edgeloop_flat = []
    for i in range(seg):
        s1 = sin(i * a)
        s2 = sin(offset + i * a)
        c1 = cos(i * a)
        c2 = cos(offset + i * a)

        verts.append((r4 * s1, r4 * c1, h4))    # Middle of pavilion
        verts.append((r1 * s2, r1 * c2, 0.0))   # Pavilion
        verts.append((r3 * s1, r3 * c1, h3))    # Middle crown
        edgeloop_flat.append(len(verts))
        verts.append((r2 * s2, r2 * c2, h2))    # Crown

    faces = []

    for index in range(seg):
        i = index * 4
        j = ((index + 1) % seg) * 4

        faces.append([j + 2, vert_tip, i + 2, i + 3])  # Tip -> Middle of pav
        faces.append([j + 2, i + 3, j + 3])            # Middle of pav -> pav
        faces.append([j + 3, i + 3, j + 4])            # Pav -> Middle crown
        faces.append([j + 4, i + 3, i + 4, i + 5])     # Crown quads
        faces.append([j + 4, i + 5, j + 5])            # Middle crown -> crown

    faces_flat = createFaces([vert_flat], edgeloop_flat, closed=True)
    faces.extend(faces_flat)

    return verts, faces


def add_diamond(segments, girdle_radius, table_radius,
    crown_height, pavilion_height):

    PI_2 = pi * 2.0
    z_axis = (0.0, 0.0, -1.0)

    verts = []
    faces = []

    height_flat = crown_height
    height_middle = 0.0
    height_tip = -pavilion_height

    # Middle vertex of the flat side (crown)
    vert_flat = len(verts)
    verts.append(Vector((0.0, 0.0, height_flat)))

    # Tip
    vert_tip = len(verts)
    verts.append(Vector((0.0, 0.0, height_tip)))

    verts_flat = []
    verts_girdle = []

    for index in range(segments):
        quat = Quaternion(z_axis, (index / segments) * PI_2)

        # angle = PI_2 * index / segments  # UNUSED

        # Row for flat side
        verts_flat.append(len(verts))
        vec = quat * Vector((table_radius, 0.0, height_flat))
        verts.append(vec)

        # Row for the middle/girdle
        verts_girdle.append(len(verts))
        vec = quat * Vector((girdle_radius, 0.0, height_middle))
        verts.append(vec)

    # Flat face
    faces_flat = createFaces([vert_flat], verts_flat, closed=True,
        flipped=True)
    # Side face
    faces_side = createFaces(verts_girdle, verts_flat, closed=True)
    # Tip faces
    faces_tip = createFaces([vert_tip], verts_girdle, closed=True)

    faces.extend(faces_tip)
    faces.extend(faces_side)
    faces.extend(faces_flat)

    return verts, faces


class AddDiamond(bpy.types.Operator):
    """Add a diamond mesh"""
    bl_idname = "mesh.primitive_diamond_add"
    bl_label = "Add Diamond"
    bl_options = {'REGISTER', 'UNDO', 'PRESET'}

    segments = IntProperty(name="Segments",
        description="Number of segments for the diamond",
        min=3,
        max=256,
        default=32)
    girdle_radius = FloatProperty(name="Girdle Radius",
        description="Girdle radius of the diamond",
        min=0.01,
        max=9999.0,
        default=1.0)
    table_radius = FloatProperty(name="Table Radius",
        description="Girdle radius of the diamond",
        min=0.01,
        max=9999.0,
        default=0.6)
    crown_height = FloatProperty(name="Crown Height",
        description="Crown height of the diamond",
        min=0.01,
        max=9999.0,
        default=0.35)
    pavilion_height = FloatProperty(name="Pavilion Height",
        description="Pavilion height of the diamond",
        min=0.01,
        max=9999.0,
        default=0.8)

    def execute(self, context):
        verts, faces = add_diamond(self.segments,
            self.girdle_radius,
            self.table_radius,
            self.crown_height,
            self.pavilion_height)

        obj = create_mesh_object(context, verts, [], faces, "Diamond")

        return {'FINISHED'}


class AddGem(bpy.types.Operator):
    """Add a diamond gem"""
    bl_idname = "mesh.primitive_gem_add"
    bl_label = "Add Gem"
    bl_description = "Create an offset faceted gem"
    bl_options = {'REGISTER', 'UNDO', 'PRESET'}

    segments = IntProperty(name="Segments",
        description="Longitudial segmentation",
        min=3,
        max=265,
        default=8,)
    pavilion_radius = FloatProperty(name="Radius",
       description="Radius of the gem",
       min=0.01,
       max=9999.0,
       default=1.0)
    crown_radius = FloatProperty(name="Table Radius",
       description="Radius of the table(top)",
       min=0.01,
       max=9999.0,
       default=0.6)
    crown_height = FloatProperty(name="Table height",
       description="Height of the top half",
       min=0.01,
       max=9999.0,
       default=0.35)
    pavilion_height = FloatProperty(name="Pavilion height",
       description="Height of bottom half",
       min=0.01,
       max=9999.0,
       default=0.8)

    def execute(self, context):

        # create mesh
        verts, faces = add_gem(
            self.pavilion_radius,
            self.crown_radius,
            self.segments,
            self.pavilion_height,
            self.crown_height)

        obj = create_mesh_object(context, verts, [], faces, "Gem")

        return {'FINISHED'}
		
class EdgeTune(bpy.types.Operator):
	bl_idname = "mesh.edgetune"
	bl_label = "Tune Edge"
	bl_description = "Tuning edgeloops by redrawing them manually, sliding verts"
	bl_options = {"REGISTER", "UNDO"}
	
	@classmethod
	def poll(cls, context):
		obj = context.active_object
		return (obj and obj.type == 'MESH' and context.mode == 'EDIT_MESH')

	def invoke(self, context, event):
		self.save_global_undo = bpy.context.user_preferences.edit.use_global_undo
		bpy.context.user_preferences.edit.use_global_undo = False
		
		do_edgetune(self)
		
		context.window_manager.modal_handler_add(self)
		self._handle2 = context.region.callback_add(adapt, (), 'PRE_VIEW')
		self._handle = context.region.callback_add(redraw, (), 'POST_PIXEL')
		
		return {'RUNNING_MODAL'}

	def modal(self, context, event):
		global matrix, viewwidth, viewheight
		global seledges, selverts, selcoords, vertd, singles, boxes, sverts
		global slideedges, slideverts, slidecoords
		global bm, bmundo, mesh
		global mbns, inter, viewchange, mouseover, highoff, bx1, bx2, by1, by2, mx, my, vertd
		global space, selobj
		global matrix, rotmat, mat_rotX, mat_rotY, mat_rotZ
		global undolist, undocolist
		global contedge, movedoff
		
		inter = 0
		if event.type == "LEFTMOUSE":
			if event.value == "PRESS":
				mbns = 1
			if event.value == "RELEASE":
				mbns = 0
				contedge = None
				movedoff = 1
		if event.type == "RIGHTMOUSE":
			# cancel operation, reset to bmumdo mesh
			context.region.callback_remove(self._handle2)
			context.region.callback_remove(self._handle)
			bpy.context.user_preferences.edit.use_global_undo = self.save_global_undo
			bm.free()
			bpy.ops.object.editmode_toggle()
			bmundo.to_mesh(mesh)
			bpy.ops.object.editmode_toggle()
			return {'CANCELLED'}
		elif event.type in ["MIDDLEMOUSE"]:
			# recalculate view parameters
			inter = 1
			return {"PASS_THROUGH"}
		elif event.type in ["WHEELDOWNMOUSE", "WHEELUPMOUSE"]:
			# recalculate view parameters
			inter = 1		
			return {"PASS_THROUGH"}
		elif event.type == "Z":
			if event.value == "PRESS":
				if event.ctrl:
					if undolist != []:
						# put one vert(last) back to undo coordinate, found in list
						undolist.pop(0)
						vert = bm.verts[undocolist[0][0].index]
						vert.co[0] = undocolist[0][1]
						vert.co[1] = undocolist[0][2]
						vert.co[2] = undocolist[0][3]
						undocolist.pop(0)
						mesh.update()
			return {'RUNNING_MODAL'}
		elif event.type == "RET":
			# Consolidate changes.
			# Free the bmesh.
			bm.free()
			bmundo.free()
			context.region.callback_remove(self._handle2)
			context.region.callback_remove(self._handle)
			bpy.context.user_preferences.edit.use_global_undo = self.save_global_undo
			bpy.ops.object.editmode_toggle()
			bpy.ops.object.editmode_toggle()
			return {'FINISHED'}
		elif event.type == "MOUSEMOVE":

			mx = event.mouse_region_x
			my = event.mouse_region_y
			hoveredge = None
	
			# First check mouse is in bounding box edge of which edges.
			testscrl = []
			for edge in slideedges:
				x1, y1, dummy = getscreencoords(edge.verts[0].co[:])
				x2, y2, dummy = getscreencoords(edge.verts[1].co[:])
				if x1 < x2:
					lwpx = x1 - 5
					uppx = x2 + 5
				else:
					lwpx = x2 - 5
					uppx = x1 + 5
				if y1 < y2:
					lwpy = y1 - 5
					uppy = y2 + 5
				else:
					lwpy = y2 - 5
					uppy = y1 + 5		
				if (((x1 < mx < x2) or (x2 < mx < x1)) and (lwpy < my < uppy)) or (((y1 < my < y2) or (y2 < my < y1)) and (lwpx < mx < uppx)):
					testscrl.append(edge)
				if contedge != None:
					testscrl.append(contedge)
	
			# Then check these edges to see if mouse is on one of them.
			allhoveredges = []
			hovering = 0
			zmin = 1e10
			if testscrl != []:
				for edge in testscrl:
					x1, y1, z1 = getscreencoords(edge.verts[0].co[:])
					x2, y2, z2 = getscreencoords(edge.verts[1].co[:])
	
					if x1 == x2 and y1 == y2:
						dist = math.sqrt((mx - x1)**2 + (my - y1)**2)
					else:
						dist = ((mx - x1)*(y2 - y1) - (my - y1)*(x2 - x1)) / math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
	
					if -5 < dist < 5:
						if movedoff == 1 or (movedoff == 0 and edge == contedge):
							allhoveredges.append(edge)
							if hoveredge != None and ((z1 + z2) / 2) > zmin:
								pass
							else:
								hovering = 1
								hoveredge = edge
								zmin = (z1 + z2) / 2
								mouseover = 1
								x1, y1, dummy = bx1, by1, dummy = getscreencoords(hoveredge.verts[0].co[:])
								x2, y2, dummy = bx2, by2, dummy = getscreencoords(hoveredge.verts[1].co[:])
								region.tag_redraw()
								break
								
			if hovering == 0:
				movedoff = 1
				if mouseover == 1:
					highoff = 1
					region.tag_redraw()
				mouseover = 0
				bx1, bx2, by1, by2 = -1, -1, -1, -1
			
	
	
			if hoveredge != None and mbns == 1:
				contedge = edge
				movedoff = 0
				# Find projection mouse perpend on edge.
				if x1 == x2:	x1 += 1e-6
				if y1 == y2:	y1 += 1e-6
				a = (x2 - x1) / (y2 - y1)
				x = ((x1 / a) + (mx * a) + my - y1) / ((1 / a) + a)
				y = ((mx - x) * a) + my
				# Calculate relative position on edge and adapt screencoords accoringly.
				div = (x - x1) / (x2 - x1)
				if hoveredge.verts[0] in sverts:
					vert = hoveredge.verts[0]
					vert2 = hoveredge.verts[1]
				else:
					vert = hoveredge.verts[1]
					vert2 = hoveredge.verts[0]
					
				# Update local undo info.
				if undolist == []:
					undolist.insert(0, hoveredge)
					undocolist.insert(0, [vert, vert.co[0], vert.co[1], vert.co[2]])
				if undolist[0] != hoveredge:
					undolist.insert(0, hoveredge)
					undocolist.insert(0, [vert, vert.co[0], vert.co[1], vert.co[2]])

				hx1, hy1, dummy = getscreencoords(hoveredge.verts[0].co[:])
				hx2, hy2, dummy = getscreencoords(hoveredge.verts[1].co[:])
				coords = [((hx2 - hx1) * div ) + hx1, ((hy2 - hy1) * div ) + hy1]
				for verts in selverts:
					if vert == verts[0]:
						selcoords[selverts.index(verts)][0] = coords
					elif vert == verts[1]:	
						selcoords[selverts.index(verts)][1] = coords
				if vert in singles:
					boxes[singles.index(vert)] = coords
				# Calculate new vert 3D coordinates.		
				vx1, vy1, vz1 = hoveredge.verts[0].co[:]
				vx2, vy2, vz2 = hoveredge.verts[1].co[:]
				vertd[vert] = [((vx2 - vx1) * div ) + vx1, ((vy2 - vy1) * div ) + vy1, ((vz2 - vz1) * div ) + vz1]
				vert = bm.verts[vert.index]
				vert.co[0] = ((vx2 - vx1) * div ) + vx1
				vert.co[1] = ((vy2 - vy1) * div ) + vy1
				vert.co[2] = ((vz2 - vz1) * div ) + vz1
				mesh.update()
				
		return {'RUNNING_MODAL'}
class VIEW3D_PT_tools_WettedMesh(bpy.types.Panel):
    """Wetted Mesh Tool Panel"""
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'TOOLS'
    bl_label = 'Wetted Mesh'
    bl_context = 'objectmode'

    def draw(self, context):
        layout = self.layout
        col = layout.column(align=True)
        slcnt = len(context.selected_objects)

        if slcnt != 2:
            col.label(text = 'Select two mesh objects')
            col.label(text = 'to generate separated')
            col.label(text = 'fluid, dry and wetted')
            col.label(text = 'meshes.')
        else:
            (solid, fluid) = getSelectedPair(context)
            col.label(text = 'solid = '+solid.name)
            col.label(text = 'fluid = '+fluid.name)
            col.operator('mesh.primitive_wetted_mesh_add', text='Generate Meshes')

### Operator ###
class AddWettedMesh(bpy.types.Operator):
    """Add wetted mesh for selected mesh pair"""
    bl_idname = "mesh.primitive_wetted_mesh_add"
    bl_label = "Add Wetted Mesh"
    bl_options = {'REGISTER', 'UNDO'}
    statusMessage = ''

    def draw(self, context):
        layout = self.layout
        col = layout.column(align=True)
        col.label(text = self.statusMessage)

    def execute(self, context):
        # make sure a pair of objects is selected
        if len(context.selected_objects) != 2:
            # should not happen if called from tool panel
            self.report({'WARNING'}, "no mesh pair selected, operation cancelled")
            return {'CANCELLED'}

        print("add_wetted_mesh begin")
        
        # super-selected object is solid, other object is fluid
        (solid, fluid) = getSelectedPair(context)
        print("   solid = "+solid.name)
        print("   fluid = "+fluid.name)
            
        # make a copy of fluid object, convert to mesh if required
        print("   copy fluid")
        bpy.ops.object.select_all(action='DESELECT')
        fluid.select = True
        context.scene.objects.active = fluid
        bpy.ops.object.duplicate()
        bpy.ops.object.convert(target='MESH', keep_original=False)
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        fluidCopy = context.object
        
        # substract solid from fluidCopy
        print("   bool: fluidCopy DIFFERENCE solid")
        bpy.ops.object.modifier_add(type='BOOLEAN')
        bop = fluidCopy.modifiers.items()[0]
        bop[1].operation = 'DIFFERENCE'
        bop[1].object = solid
        bpy.ops.object.modifier_apply(apply_as='DATA', modifier=bop[0])
        fluidMinusSolid = fluidCopy
        fluidMinusSolid.name = "fluidMinusSolid"
        
        # make a second copy of fluid object
        print("   copy fluid")
        bpy.ops.object.select_all(action='DESELECT')
        fluid.select = True
        context.scene.objects.active = fluid
        bpy.ops.object.duplicate()
        bpy.ops.object.convert(target='MESH', keep_original=False)
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        fluidCopy = context.object
        
        # make union from fluidCopy and solid
        print("   bool: fluidCopy UNION solid")
        bpy.ops.object.modifier_add(type='BOOLEAN')
        bop = fluidCopy.modifiers.items()[0]
        bop[1].operation = 'UNION'
        bop[1].object = solid
        bpy.ops.object.modifier_apply(apply_as='DATA', modifier=bop[0])
        fluidUnionSolid = fluidCopy
        fluidUnionSolid.name = "fluidUnionSolid"
        
        # index meshes
        print("   KDTree index fluidMinusSolid")
        fluidMinusSolidKDT = KDTree(3, fluidMinusSolid.data.vertices)
        print("   KDTree index fluidUnionSolid")
        fluidUnionSolidKDT = KDTree(3, fluidUnionSolid.data.vertices)
        kdtrees = (fluidMinusSolidKDT, fluidUnionSolidKDT)
        
        # build mesh face sets
        faceDict = { }
        vertDict = { }
        
        print("   processing fluidMinusSolid faces")
        cacheDict = { }
        setFMSfaces = set()
        numFaces = len(fluidUnionSolid.data.faces)
        i = 0
        for f in fluidMinusSolid.data.faces:
            if i % 500 == 0:
                print("      ", i, " / ", numFaces)
            i += 1
            fuid = unifiedFaceId(kdtrees, f, fluidMinusSolid.data.vertices, \
                                 faceDict, vertDict, cacheDict)
            setFMSfaces.add(fuid)
        
        print("   processing fluidUnionSolid faces")
        cacheDict = { }
        setFUSfaces = set()
        numFaces = len(fluidUnionSolid.data.faces)
        i = 0
        for f in fluidUnionSolid.data.faces:
            if i % 500 == 0:
                print("      ", i, " / ", numFaces)
            i += 1
            fuid = unifiedFaceId(kdtrees, f, fluidUnionSolid.data.vertices, \
                                 faceDict, vertDict, cacheDict)
            setFUSfaces.add(fuid)
        
        # remove boolean helpers
        print("   delete helper objects")
        bpy.ops.object.select_all(action='DESELECT')
        fluidUnionSolid.select = True
        fluidMinusSolid.select = True
        bpy.ops.object.delete()

        # wetted = FMS - FUS
        print("   set operation FMS diff FUS")
        setWetFaces = setFMSfaces.difference(setFUSfaces)
        print("   build wetted mesh")
        verts, faces = buildMesh(setWetFaces, faceDict, vertDict)
        print("   create wetted mesh")
        wetted = createMesh("Wetted", verts, faces)

        # fluid = FMS x FUS
        print("   set operation FMS intersect FUS")
        setFluidFaces = setFMSfaces.intersection(setFUSfaces)
        print("   build fluid mesh")
        verts, faces = buildMesh(setFluidFaces, faceDict, vertDict)
        print("   create fluid mesh")
        fluid = createMesh("Fluid", verts, faces)
        
        # solid = FUS - FMS
        print("   set operation FUS diff FMS")
        setSolidFaces = setFUSfaces.difference(setFMSfaces)
        print("   build solid mesh")
        verts, faces = buildMesh(setSolidFaces, faceDict, vertDict)
        print("   create solid mesh")
        solid = createMesh("Solid", verts, faces)
        
        # parent wetted mesh
        print("   parent mesh")
        bpy.ops.object.add(type='EMPTY')
        wettedMesh = context.object
        solid.select = True
        fluid.select = True
        wetted.select = True
        wettedMesh.select = True
        bpy.ops.object.parent_set(type='OBJECT')
        wettedMesh.name = 'WettedMesh'
        
        print("add_wetted_mesh done")
        self.statusMessage = 'created '+wettedMesh.name

        return {'FINISHED'}


### Registration ###
def register():
    bpy.utils.register_class(VIEW3D_PT_tools_WettedMesh)
    bpy.utils.register_class(AddWettedMesh)


def unregister():
    bpy.utils.unregister_class(VIEW3D_PT_tools_WettedMesh)
    bpy.utils.unregister_class(AddWettedMesh)

if __name__ == "__main__":
    register()


#
# KD tree (used to create a geometric index of mesh vertices)
#

def distance(a, b):
    return (a-b).length

Node = collections.namedtuple("Node", 'point axis label left right')

class KDTree(object):
    """A tree for nearest neighbor search in a k-dimensional space.

    For information about the implementation, see
    http://en.wikipedia.org/wiki/Kd-tree

    Usage:
    objects is an iterable of (co, index) tuples (so MeshVertex is useable)
    k is the number of dimensions (=3)
    
    t = KDTree(k, objects)
    point, label, distance = t.nearest_neighbor(destination)
    """

    def __init__(self, k, objects=[]):

        def build_tree(objects, axis=0):

            if not objects:
                return None

            objects.sort(key=lambda o: o.co[axis])
            median_idx = len(objects) // 2
            median_point = objects[median_idx].co
            median_label = objects[median_idx].index

            next_axis = (axis + 1) % k
            return Node(median_point, axis, median_label,
                        build_tree(objects[:median_idx], next_axis),
                        build_tree(objects[median_idx + 1:], next_axis))

        self.root = build_tree(list(objects))
        self.size = len(objects)


    def nearest_neighbor(self, destination):

        best = [None, None, float('inf')]
        # state of search: best point found, its label,
        # lowest distance

        def recursive_search(here):

            if here is None:
                return
            point, axis, label, left, right = here

            here_sd = distance(point, destination)
            if here_sd < best[2]:
                best[:] = point, label, here_sd

            diff = destination[axis] - point[axis]
            close, away = (left, right) if diff <= 0 else (right, left)

            recursive_search(close)
            if math.fabs(diff) < best[2]:
                recursive_search(away)

        recursive_search(self.root)
        return best[0], best[1], best[2]


#
# helper functions
#

# get super-selected object and other object from selected pair
def getSelectedPair(context):
    objA = context.object
    objB = context.selected_objects[0]
    if objA == objB:
        objB = context.selected_objects[1]
    return (objA, objB)

# get a unified vertex id for given coordinates
def unifiedVertexId(kdtrees, location, vertDict):
    eps = 0.0001
    offset = 0
    for t in kdtrees:
        co, index, d = t.nearest_neighbor(location)
        if d < eps:
            uvid = offset + index
            if uvid not in vertDict:
                vertDict[uvid] = co
            return uvid
        offset += t.size
    return -1

# get a unified face id tuple
#    Stores the ordered face id tuple in faceDict
#    and the used coordinates for vertex id in vertDict.
#    cacheDict caches the unified vertex id (lookup in kdtree is expensive).
#    For each mesh (where the face belongs to) a separate cacheDict is expected.
def unifiedFaceId(kdtrees, face, vertices, faceDict, vertDict, cacheDict):
    fids = [ ]
    for v in face.vertices:
        uvid = cacheDict.get(v)
        if uvid == None:
            uvid = unifiedVertexId(kdtrees, vertices[v].co, vertDict)
            cacheDict[v] = uvid
        fids.append(uvid)
    ofids = tuple(fids)
    fids.sort()
    fuid = tuple(fids)
    if fuid not in faceDict:
        faceDict[fuid] = ofids
    return fuid

# build vertex and face array from unified face sets
def buildMesh(unifiedFaceSet, faceDict, vertDict):
    verts = [ ]
    nextV = 0
    myV = { }
    faces = [ ]
    for uf in unifiedFaceSet:
        of = faceDict[uf]
        myf = [ ]
        for uV in of:
            v = myV.get(uV)
            if v == None:
                v = nextV
                myV[uV] = nextV
                verts.append(vertDict[uV])
                nextV += 1
            myf.append(v)
        faces.append(myf)
    return verts, faces

# create mesh object and link to scene
def createMesh(name, verts, faces):
    me = bpy.data.meshes.new(name+"Mesh")
    ob = bpy.data.objects.new(name, me)
    ob.show_name = True
    bpy.context.scene.objects.link(ob)
    me.from_pydata(verts, [], faces)
    me.update(calc_edges=True)
    return ob