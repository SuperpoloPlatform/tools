import bpy, os
from xml.etree import ElementTree 

scenexml = ElementTree.parse(r"c:\\scene.xml")

meshnodes = scenexml.getiterator("mesh")

cameranode = scenexml.getiterator("camera")[0]
meshtxml = ElementTree.parse(r"c:\\mesht.xml")

ocsmeshnode = meshtxml.getiterator("Node")[0]

def setmeshname():
    for obj in bpy.data.objects:
        if(obj.type == "MESH"):
             obj.data.name = obj.name


def loadobj(ocsnodes):
    for imnode in meshnodes:
        meshname = imnode.attrib["name"]
        #print(meshname)
        facname = imnode.getiterator("factory")[0].attrib["name"]
        #print(bpy.ops.import_scene.obj)
        #objfile = open("c:\\obj\\2dianshiqiang.obj","r")
        bpy.ops.import_scene.obj(filepath="c:\\obj\\" + facname + ".obj")
        bpy.data.objects[len(bpy.data.objects) - 1].name = meshname
        setmeshname()
        
        
        posnode = imnode.getiterator("position")[0]
        objpos = [float(posnode.attrib["x"]),float(posnode.attrib["y"]),float(posnode.attrib["z"])]
        #print(objpos)
        bpy.data.objects[meshname].location = objpos
        
        rotnode = imnode.getiterator("rotation")[0]
        objrot = [float(rotnode.attrib["x"]),float(rotnode.attrib["y"]),float(rotnode.attrib["z"])]
        #print(objrot)
        bpy.data.objects[meshname].rotation_euler = objrot
        
        
        scalenode = imnode.getiterator("scale")[0]
        objscale = [float(scalenode.attrib["x"]),float(scalenode.attrib["y"]),float(scalenode.attrib["z"])]
        #print(objrot)
        bpy.data.objects[meshname].scale = objscale
        
        inputnodepins = ocsmeshnode.getiterator("inputnodepins")[0]
    matindex = 0    
    for imat in bpy.data.materials:
        NodePin = ElementTree.Element("NodePin")
        
        typename = ElementTree.Element("typename")
        typename.text = imat.name
        NodePin.append(typename)
        
        id = ElementTree.Element("id")
        #print(dir(imat))
        #print(imat.pass_index)
        id.text = ("%s" % matindex)
        matindex = matindex + 1
        NodePin.append(id)
        
        pintype = ElementTree.Element("pintype")
        pintype.text = "20005"
        NodePin.append(pintype)
        
        hasinternalnodegraph = ElementTree.Element("hasinternalnodegraph")
        hasinternalnodegraph.text = "false"
        NodePin.append(hasinternalnodegraph)
        
        inputnodepins.append(NodePin)
        
        
    matindex = 0    
    for imat in bpy.data.materials:
        #print(imat.name)
        matname = imat.name
        #print(matname.find('.'))
        if matname.find('.') > 0:
            matname = matname[0 : (matname.find('.'))]
        #print(matname)
        tmpmatxml = ElementTree.parse(r"c:\obj\\"+ matname +".ocm")
        tmpmatnode = tmpmatxml.getiterator("OCS_1_0_23_Macro")[0].getiterator("Node")[0]
        tmpmatnode.getiterator("name")[0].text = imat.name
        #set id
        if tmpmatnode.getiterator("typename")[0].text == "material macro":
            tmpmatnode.getiterator("id")[0].text = ("%s" % (matindex + 4))
            matindex = matindex + 1
        ocsnodes.append(tmpmatnode)
        
    
    bpy.ops.export_scene.obj(filepath="c:\\rendermesh.obj")    
    ocsmeshnode.getiterator("linkedfilename")[0].text = "rendermesh.obj"
        
    ocsnodes.append(ocsmeshnode)   

def exportocs():

    ocsxml = ElementTree.parse(r"c:\\t1.ocs")
    scenert = ocsxml.getiterator("OCS_1_0_23_Scene")
    #print(scenert[0].tag)
    #print(dir(ocsxml))

    #get scene node
    
    
    if scenert[0].tag == "OCS_1_0_23_Scene" :
        snode = scenert[0].getiterator("Node")
        #print(snode[0].tag)
        if snode[0].tag == "Node" :
            nname = snode[0].getiterator("name")
            #print(nname[0].tag)
            #print(nname[0].text)
            
            childgraph = snode[0].getiterator("childgraph")
            
            NodeGraph = childgraph[0].getiterator("NodeGraph")
            
            NodeGraphnodes = NodeGraph[0].getiterator("nodes")[0]
            
            
            
            #get camera pos node
            
            for inode in NodeGraphnodes.getiterator("Node") :
                inodename = inode.getiterator("name")[0].text
                
                #get Preview Configuration node 
                if inodename == "Preview Configuration":
                    pvcnodes = inode.getiterator("Node")
                    for ipnode in pvcnodes :
                        ipnodename = ipnode.getiterator("name")[0].text
                        #print(ipnodename)
                        #get Mesh Preview Camera node 
                        if ipnodename == "Mesh Preview Camera" :
                            nodepins = ipnode.getiterator("NodePin")
                            for inp in nodepins :
                                inpname = inp.getiterator("typename")[0].text
                                if inpname == "pos" :
                                    #print(inp.getiterator("valuexyz")[0].text) 
                                    #set cam pos
                                    campos = cameranode.getiterator("position")[0].attrib["x"] + " " + cameranode.getiterator("position")[0].attrib["y"] + " " + cameranode.getiterator("position")[0].attrib["z"]
                                    #print(campos)
                                    inp.getiterator("valuexyz")[0].text = campos
                                
                                if inpname == "target" :
                                    camfocus = cameranode.getiterator("focus")[0].attrib["x"] + " " + cameranode.getiterator("focus")[0].attrib["y"] + " " + cameranode.getiterator("focus")[0].attrib["z"]
                                    #print(campos)
                                    inp.getiterator("valuexyz")[0].text = camfocus
                                    
                                    
                                if inpname == "autofocus" :
                                    inp.getiterator("value")[0].text = "true"
                                    
                        if ipnodename == "Mesh Preview Resolution" :
                            valuexy = ipnode.getiterator("valuexy")[0]
                            #print(ipnode.getiterator("typename")[0].text)
                            valuexy.text = cameranode.getiterator("width")[0].attrib["value"] + " " + cameranode.getiterator("height")[0].attrib["value"]
            
            loadobj(NodeGraphnodes)

            #NodeGraphnodes.appendChild(addnode)
            
    #set line
            
    nodepinconnections = ocsxml.getiterator("nodepinconnections")[len(ocsxml.getiterator("nodepinconnections")) - 1]
            
    
    
    matindex = 0    
    for imat in bpy.data.materials:
        nodepinconnection = ElementTree.Element("nodepinconnection")
                 
        sourceid = ElementTree.Element("sourceid")
        sourceid.text = ("%s" % (matindex + 4))
        nodepinconnection.append(sourceid)
        
        sourcepinid = ElementTree.Element("sourcepinid")
        sourcepinid.text = "0"
        nodepinconnection.append(sourcepinid)
        
        destid = ElementTree.Element("destid")
        destid.text = "3"
        nodepinconnection.append(destid)
        
        
        destpinid = ElementTree.Element("destpinid")
        destpinid.text = ("%s" % (matindex))
        matindex = matindex + 1
        
        nodepinconnection.append(destpinid)
        
        
        
        nodepinconnections.append(nodepinconnection)
    



    ocsxml.write(r"c:\\t1t.ocs","utf-8")

exportocs()

octane_render_cmd ='blender' 
os.system(octane_render_cmd) 



#bpy.ops.wm.quit_blender()