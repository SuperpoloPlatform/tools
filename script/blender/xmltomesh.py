from xml.dom.minidom import parse
from xml.dom.minidom import Node
import bpy
def createmeshfac:
	domData = parse("E:\\treew\\art\\factories\\dx0133.xml")

	verts = domData.getElementsByTagName("v")
	varr = [[0]*3]*verts.length
	vi = 0
	for i in verts:
		tv = [0]*3
		x = i.getAttribute("x")
		y = i.getAttribute("y")
		z = i.getAttribute("z")
		tv[0] = float(x)
		tv[2] = float(y)
		tv[1] = float(z)
		varr[vi] = tv
		vi = vi +1
		

	ts = domData.getElementsByTagName("t")
	tarr = [[0]*3]*ts.length
	ti = 0
	for it in ts:
		tt=[0]*3
		v1 = it.getAttribute("v1")
		v2 = it.getAttribute("v2")
		v3 = it.getAttribute("v3")
		tt[0] = int(v1)
		tt[1] = int(v2)
		tt[2] = int(v3)
		tarr[ti] = tt
		ti = ti +1
	return [varr,tarr]


def create_mesh_object(context, verts, edges, faces, name):
    # Create new mesh
    mesh = bpy.data.meshes.new(name)
    # Make a mesh from a list of verts/edges/faces.
    mesh.from_pydata(verts, edges, faces)
    # Update mesh geometry after adding stuff.
    mesh.update()
    from bpy_extras import object_utils
    return object_utils.object_data_add(context, mesh, operator=None)
    
create_mesh_object(bpy.context,varr,[],tarr,"asdf")