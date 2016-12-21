from xml.dom.minidom import parse
from xml.dom.minidom import Node
import bpy


def createmeshfac(filename):
    meshfac = parse(filename)

    verts = meshfac.getElementsByTagName("v")
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
        

    ts = meshfac.getElementsByTagName("t")
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
    
    submeshsn = meshfac.getElementsByTagName("submesh")
    matname = "defined"
    if submeshsn.length == 0 :
        matname = meshfac.getElementsByTagName("material")[0].childNodes[0].data
    return [varr,tarr,matname]


def create_mesh_object(context, verts, edges, faces, name):
    # Create new mesh
    mesh = bpy.data.meshes.new(name)
    # Make a mesh from a list of verts/edges/faces.
    mesh.from_pydata(verts, edges, faces)
    # Update mesh geometry after adding stuff.
    mesh.update()
    from bpy_extras import object_utils
    return object_utils.object_data_add(context, mesh, operator=None)



def check_mat(matname):
    for im in bpy.data.materials :
        if im.name == matname :
            return im
    
    return False
    



worldxml = parse("E:\\treew\\art\\world.xml")
meshobjs = worldxml.getElementsByTagName("meshobj")
for obj in meshobjs:
    objname  = obj.getAttribute("name")
    print(objname + "\n")
    mvnode = obj.getElementsByTagName("v")
    mx = mvnode[0].getAttribute("x")
    my = mvnode[0].getAttribute("z")
    mz = mvnode[0].getAttribute("y")
    move = [float(mx),float(my),float(mz)]
    # print(move)
    rotx =  obj.getElementsByTagName("rotx")
    roty =  obj.getElementsByTagName("rotz")
    rotz =  obj.getElementsByTagName("roty")
    rx = rotx[0].childNodes[0].data
    ry = roty[0].childNodes[0].data
    rz = rotz[0].childNodes[0].data
    rot = [-float(rx),-float(ry),-float(rz)]
    # print(rot)
    iscale = obj.getElementsByTagName("scale")
    sx = iscale[0].getAttribute("x")
    sy = iscale[0].getAttribute("z")
    sz = iscale[0].getAttribute("y")
    scale = [1/float(sx),1/float(sy),1/float(sz)]
    fac = obj.getElementsByTagName("factory")
    facname = fac[0].childNodes[0].data
    factory = createmeshfac("E:\\treew\\art\\factories\\" + facname + ".xml")
    tmpmesh = create_mesh_object(bpy.context,factory[0],[],factory[1],objname)
    bpy.context.active_object.location.xyz = move
    bpy.context.active_object.rotation_euler = rot
    bpy.context.active_object.scale.xyz = scale
    
    mat = check_mat(factory[2])
    if mat == False:
        mat =  bpy.data.materials.new(factory[2])
    
    bpy.context.active_object.data.materials.append(mat)
   
