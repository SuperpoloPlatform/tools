//this is a test.

try {
	var CONSOLE = Registry.Get("iConsole");
	//获得执行参数
	var trimeshOpt = false;
	trimeshOpt = CmdLine.GetOption("trimesh");
	CONSOLE.WriteLine(trimeshOpt);
	var nullmeshOpt = false;
	nullmeshOpt = CmdLine.GetOption("nullmesh");
	CONSOLE.WriteLine(nullmeshOpt);
	meshsize = new xmlDocument();
	world = new xmlDocument();
	yangxiuwu = new xmlDocument();
	yangroot = yangxiuwu.CreateRoot();
    meshsizeFile = VFS.Open("meshsize.xml");
	worldFile = VFS.Open("world.xml");
	var flagM = meshsize.Parse(meshsizeFile);
	CONSOLE.WriteLine(flagM);
	var flagW = world.Parse(worldFile);
	CONSOLE.WriteLine(flagM + "  " + flagW);
	if(!flagM || !flagW){
		alert("解析失败，请检查xml文件格式");
		return false;
	}
	//获取跟节点的名字为"section"的子节点
    // rc = meshsize.root.GetChild("section");
	rc = world.root.GetChild("world");
	ms = meshsize.root.GetChild("meshsize");
	//获取名称为"sector"的节点
    sectionXgmlSection = rc.GetChild("sector");
	//输出其父节点名称
    CONSOLE.WriteLine(sectionXgmlSection.parent.value);
	//sectionXgmlSection的属性name的值graph
    CONSOLE.WriteLine(sectionXgmlSection.GetAttribute("name").value);
    sectionXgmlChildren = sectionXgmlSection.GetChildren();
	//该值sectionXgmlChildrenCount应该是xgml文件中node和edge的个数和加3
	sectionXgmlChildrenCount = sectionXgmlChildren.GetEndPosition();
	var i = 0;
	CONSOLE.WriteLine("count = " + sectionXgmlChildrenCount);
	do
	{
		sectionXgmlChildrenCount--;
		sectionGraph = sectionXgmlChildren.Next();
		CONSOLE.WriteLine("sectionGraphValue = " + sectionGraph.value);
		if("meshobj" == sectionGraph.value){
			sectionGraphSection = sectionGraph.GetAttribute("name").value;
			// alert(sectionGraphSection)
			if(trimeshOpt)
			{
				meshName = ms.GetChild(sectionGraphSection);
				if(meshName)
				{
					diffx = meshName.GetAttribute("difX").value;
					diffy = meshName.GetAttribute("difY").value;
					diffz = meshName.GetAttribute("difZ").value;
				}
				trimesh = sectionGraph.GetChild("trimesh");
				if(!trimesh)
				{
					trimesh = sectionGraph.CreateChild(xmlDocument.NODE_ELEMENT);
					trimesh.value = "trimesh";
				}
				
				mesh = trimesh.CreateChild(xmlDocument.NODE_ELEMENT);
				mesh.value = "mesh";
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x",-diffx);
				v.SetAttribute("y",-diffy);
				v.SetAttribute("z","0");
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x",diffx);
				v.SetAttribute("y",-diffy);
				v.SetAttribute("z","0");
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x",diffx);
				v.SetAttribute("y",diffy);
				v.SetAttribute("z","0");
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x",-diffx);
				v.SetAttribute("y",diffy);
				v.SetAttribute("z","0");
				t = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				t.value = "t";
				t.SetAttribute("v1","0");
				t.SetAttribute("v2","1");
				t.SetAttribute("v3","2");
				t = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				t.value = "t";
				t.SetAttribute("v1","0");
				t.SetAttribute("v2","2");
				t.SetAttribute("v3","3");
					
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x","0");
				v.SetAttribute("y",-diffy);
				v.SetAttribute("z",-diffz);
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x","0");
				v.SetAttribute("y",-diffy);
				v.SetAttribute("z",diffz);
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x","0");
				v.SetAttribute("y",diffy);
				v.SetAttribute("z",diffz);
				v = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				v.value = "v";
				v.SetAttribute("x","0");
				v.SetAttribute("y",diffy);
				v.SetAttribute("z",-diffz);
				t = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				t.value = "t";
				t.SetAttribute("v1","4");
				t.SetAttribute("v2","5");
				t.SetAttribute("v3","6");
				t = mesh.CreateChild(xmlDocument.NODE_ELEMENT);
				t.value = "t";
				t.SetAttribute("v1","4");
				t.SetAttribute("v2","6");
				t.SetAttribute("v3","7");
				
				id = trimesh.CreateChild(xmlDocument.NODE_ELEMENT);
				id.value = "id";
				viscull = id.CreateChild(xmlDocument.NODE_TEXT);
				viscull.value = "viscull";
			}
			
			if(nullmeshOpt)
			{
				var flag = true;
				var children = sectionGraph.GetChildren();
				
				nullmeshDiff = ms.GetChild("meshdiff");
				
				// meshNameMax = ms.GetChild(sectionGraphSection + "max");
				// meshNameMin = ms.GetChild(sectionGraphSection + "min");
				
				nullmeshDiffx = nullmeshDiff.GetAttribute("difX").value;
				nullmeshDiffy = nullmeshDiff.GetAttribute("difY").value;
				nullmeshDiffz = nullmeshDiff.GetAttribute("difZ").value;
				
				// diffxMin = meshNameMin.GetAttribute("difX").value;
				// diffyMin = meshNameMin.GetAttribute("difY").value;
				// diffzMin = meshNameMin.GetAttribute("difZ").value;
				
				// nullmeshDiffx = ( diffxMax - diffxMin ) / 2 ;
				// nullmeshDiffy = ( diffyMax - diffyMin ) / 2 ;
				// nullmeshDiffz = ( diffzMax - diffzMin ) / 2 ;
				
				do
				{
					var child = children.Next();
				
					if(child)
					{
						if("nullmesh" == child.value)
						{
							meshMin = child.CreateChild(xmlDocument.NODE_ELEMENT);
							meshMin.value = "min";
							meshMin.SetAttribute( "x", -nullmeshDiffx );
							meshMin.SetAttribute( "y", -nullmeshDiffy );
							meshMin.SetAttribute( "z", -nullmeshDiffz );
							meshMax = child.CreateChild(xmlDocument.NODE_ELEMENT);
							meshMax.value = "max";
							meshMax.SetAttribute( "x", nullmeshDiffx );
							meshMax.SetAttribute( "y", nullmeshDiffy );
							meshMax.SetAttribute( "z", nullmeshDiffz );
						}
						
						
						if("meshobj" == child.value)
						{
							var nullmesh = child.GetChild("nullmesh");
							if(nullmesh)
							{
								meshMin = nullmesh.CreateChild(xmlDocument.NODE_ELEMENT);
								meshMin.value = "min";
								meshMin.SetAttribute( "x", -nullmeshDiffx );
								meshMin.SetAttribute( "y", -nullmeshDiffy );
								meshMin.SetAttribute( "z", -nullmeshDiffz );
								meshMax = nullmesh.CreateChild(xmlDocument.NODE_ELEMENT);
								meshMax.value = "max";
								meshMax.SetAttribute( "x", nullmeshDiffx );
								meshMax.SetAttribute( "y", nullmeshDiffy );
								meshMax.SetAttribute( "z", nullmeshDiffz );
								flag = false;
							}
							//alert(child.GetAttribute("name").value);
						}
					}
				}while(flag)
			}
		}
	}while(sectionXgmlChildrenCount > 0)
    worldFile=VFS.Open("world_nullmesh.xml",1);
	//将操作以后的xml写入文件"good.js"中
    world.WritetoFile(worldFile);
}catch(e){
    alert('error:',e);
}

System.Quit();