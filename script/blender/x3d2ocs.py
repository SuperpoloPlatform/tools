import sys,os,bpy
import urllib
from urllib import *
import urllib.request
from xml.etree import ElementTree 

print("run start")

render_url = "http://192.168.3.78:8088/content/test/monkey"

x3d_url = "http://192.168.3.78:8088/content/test/monkey.x3d"

x3d_scene_name = "monkey"

def dowload_x3d(x3d_url):
    print("start download...")
    urllib.request.urlretrieve(x3d_url,("C:/rendertmp/" + x3d_scene_name + ".x3d"))
    print("download end...")
 
def setmeshname():
    for obj in bpy.data.objects:
        if(obj.type == "MESH"):
             obj.data.name = obj.name


def load_x3d(): 
    bpy.ops.import_scene.x3d(filepath="C:\\rendertmp\\" + x3d_scene_name + ".x3d")
    bpy.ops.export_scene.obj(filepath="C:\\rendertmp\\" + x3d_scene_name + ".obj")
# if __name__=="__main__":
    # main(sys.argv[1:])
    
def load_objnode(ocsnodes):
    meshtxml = ElementTree.parse(r"c:\\mesht.xml")
    
    ocsmeshnode = meshtxml.getiterator("Node")[0]  
    
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
        tmpmatxml = ElementTree.parse(r"c:\rendertmp\\"+ matname +".ocm")
        tmpmatnode = tmpmatxml.getiterator("OCS_1_0_23_Macro")[0].getiterator("Node")[0]
        tmpmatnode.getiterator("name")[0].text = imat.name
        #set id
        if tmpmatnode.getiterator("typename")[0].text == "material macro":
            tmpmatnode.getiterator("id")[0].text = ("%s" % (matindex + 4))
            matindex = matindex + 1
        ocsnodes.append(tmpmatnode)
    ocsmeshnode.getiterator("name")[0].text = x3d_scene_name + ".obj"
    ocsmeshnode.getiterator("linkedfilename")[0].text = x3d_scene_name + ".obj"
        
    ocsnodes.append(ocsmeshnode)   

    
    
def export_ocs():

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
            
            load_objnode(NodeGraphnodes)
            
            # #get camera pos node
            
            # for inode in NodeGraphnodes.getiterator("Node") :
                # inodename = inode.getiterator("name")[0].text
                
                # #get Preview Configuration node 
                # if inodename == "Preview Configuration":
                    # pvcnodes = inode.getiterator("Node")
                    # for ipnode in pvcnodes :
                        # ipnodename = ipnode.getiterator("name")[0].text
                        # #print(ipnodename)
                        # #get Mesh Preview Camera node 
                        # if ipnodename == "Mesh Preview Camera" :
                            # nodepins = ipnode.getiterator("NodePin")
                            # for inp in nodepins :
                                # inpname = inp.getiterator("typename")[0].text
                                # if inpname == "pos" :
                                    # #print(inp.getiterator("valuexyz")[0].text) 
                                    # #set cam pos
                                    # campos = cameranode.getiterator("position")[0].attrib["x"] + " " + cameranode.getiterator("position")[0].attrib["y"] + " " + cameranode.getiterator("position")[0].attrib["z"]
                                    # #print(campos)
                                    # inp.getiterator("valuexyz")[0].text = campos
                                
                                # if inpname == "target" :
                                    # camfocus = cameranode.getiterator("focus")[0].attrib["x"] + " " + cameranode.getiterator("focus")[0].attrib["y"] + " " + cameranode.getiterator("focus")[0].attrib["z"]
                                    # #print(campos)
                                    # inp.getiterator("valuexyz")[0].text = camfocus
                                    
                                    
                                # if inpname == "autofocus" :
                                    # inp.getiterator("value")[0].text = "true"
                                    
                        # if ipnodename == "Mesh Preview Resolution" :
                            # valuexy = ipnode.getiterator("valuexy")[0]
                            # #print(ipnode.getiterator("typename")[0].text)
                            # valuexy.text = cameranode.getiterator("width")[0].attrib["value"] + " " + cameranode.getiterator("height")[0].attrib["value"]
            
            # loadobj(NodeGraphnodes)

            # #NodeGraphnodes.appendChild(addnode)
            
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
    



    ocsxml.write(r"c:\\rendertmp\\t1t.ocs","utf-8")
dowload_x3d(x3d_url)
load_x3d()
export_ocs()
print("run end")