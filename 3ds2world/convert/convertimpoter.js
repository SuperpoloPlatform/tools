try{
	
	Plugin.Load("spp.loader.3d");
	
	//创建解析器
	importer=new Importer();
	//检查输入文件是否存在
	if(!VFS.Exists(filename))
	{
		alert("can not find the input file");
	}
	else
	{
		//解析输入3ds文件
		scene = importer.ReadFile(filename, (importer.TargetRealtime_MaxQuality | importer.FlipUVs | importer.ConvertToLeftHanded | importer.JoinIdenticalVertices)& !importer.JoinIdenticalVertices);		//alert(scene);
		//法线处理
		scene.GenFaceNormal();
		scene.GenVertexNormal("0.8");
		
		//将factory的引用信息写入到world文件当中
		for(var jr=0;jr<scene.rootNode.numChildren;jr++)
		{
			var ainode = scene.rootNode.GetChildren(jr)
			if(ainode.GetMeshIndex() == undefined)
			{
				continue;
			}
			for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
			{
				//alert(jr);
				//alert(scene.rootNode.GetChildren(jr).GetMeshIndex());
				//修改其中的library信息
				mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
				if(CheckLibrary(tworld,usepath+"/"+"factories/"+meshnamef+"_"+"mesh_"+ mesh.GetName() + ".xml"))
				{
					continue;
				}
				libraryw = tworld.CreateChild(tworldxml.NODE_ELEMENT);
				libraryw.value = "library";
				tln = libraryw.CreateChild(tworldxml.NODE_TEXT);
				tln.value = usepath+"/"+"factories/"+meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci)+ ".xml";
			}
		}
		
		//创建sector节点
		var sectorw = tworld.CreateChild(tworldxml.NODE_ELEMENT);
		sectorw.value = "sector";
		sectorw.SetAttribute("name","Scene");

		
		//根据调减判断
		for(var jr=0;jr<scene.rootNode.numChildren;jr++)
		{
			pscene(scene.rootNode.GetChildren(jr),tworld);
		}
		
		var lightn = sectorw.CreateChild(tworldxml.NODE_ELEMENT);
		wlight = scene.GetLights(0);
		if(callbacks.onLightAdd(lightn,wlight))
		{
			
		}
		
		
		
		startw = tworld.CreateChild(tworldxml.NODE_ELEMENT);
		wcamera = scene.GetCameras(0);
		
		if(callbacks.onCameraAdd(startw,wcamera))
		{
			
		}

	}
	
	
	
	function CheckLibrary(tworld,Libraryename)
	{
		var Librarys = tworld.GetChildren();
		for(;Librarys.HasNext();)
		{
			var librarychild = Librarys.Next();
			if(librarychild.GetChildren(0).value == Libraryename)
			{
				return true;
			}
		}
		return false;
	}
	
	
	//将信息写入到factory中，并在world中添加相应信息	
	function pscene(ainode,world)
	{	
		if(ainode.GetMeshIndex() != undefined)
		{
			for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
			{
				mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
				if(mesh == undefined)
				{
					alert("error mesh");
					continue;
				}
				//alert(ainode.GetMeshIndex());
				//alert(mesh.numFaces);
				//alert(mesh.GetTextureCoords(0));
				//alert(mesh.GetName());
					xmlt=new xmlDocument();
					xmlrt=xmlt.CreateRoot();
					library = xmlrt.CreateChild(xmlt.NODE_ELEMENT);
					library.value="library";
					meshfact = library.CreateChild(xmlt.NODE_ELEMENT);
					meshfact.value="meshfact";
					meshfact.SetAttribute("name",meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci));
					plugin = meshfact.CreateChild(xmlt.NODE_ELEMENT);
					plugin.value="plugin";
					genmeshfact = plugin.CreateChild(xmlt.NODE_TEXT);
					genmeshfact.value="genmeshfact";
					zuse = meshfact.CreateChild(xmlt.NODE_ELEMENT);
					zuse.value="zuse";
					params = meshfact.CreateChild(xmlt.NODE_ELEMENT);
					params.value="params";
					materialn = params.CreateChild(xmlt.NODE_ELEMENT);
					//获取当前mesh的material
					material = scene.GetMaterials(mesh.materialIndex);
					//将material信息写入factory
					materialn.value="material";
					materialv = materialn.CreateChild(xmlt.NODE_TEXT);
					materialv.value="Material_"+material.GetPropertyName(0)+"_"+meshnamef;
					
					//获取world中的textures节点
					textures = world.GetChild("textures");
					//修改world文件中的textures信息
					if(callbacks.onTextureAdd(textures,material))
					{
					
					}
					
					//修改world文件中的materials信息
					materials = world.GetChild("materials");

					if(callbacks.onMaterialAdd(materials,material))
					{
						
					}
					
					//修改world文件中的sector信息
					sector = world.GetChild("sector");
					meshobj = sector.CreateChild(tworldxml.NODE_ELEMENT);
					meshobj.value = "meshobj";
					meshobj.SetAttribute("name",meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci) + ".xml");
					plugin = meshobj.CreateChild(tworldxml.NODE_ELEMENT);
					plugin.value = "plugin";
					tplg = plugin.CreateChild(tworldxml.NODE_TEXT);
					tplg.value = "genmesh";
					paramsw = meshobj.CreateChild(tworldxml.NODE_ELEMENT);
					paramsw.value = "params";
					factory = paramsw.CreateChild(tworldxml.NODE_ELEMENT);
					factory.value = "factory";
					tfan = factory.CreateChild(tworldxml.NODE_TEXT);
					tfan.value =meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci);
					movew = meshobj.CreateChild(tworldxml.NODE_ELEMENT);
					movew.value = "move";
					movecv = movew.CreateChild(tworldxml.NODE_ELEMENT);
					movecv.value = "v";
					movecv.SetAttribute("x",ainode.matrix[0][3]);
					movecv.SetAttribute("y",-ainode.matrix[2][3]);
					movecv.SetAttribute("z",ainode.matrix[1][3]);
					
					//将mesh的信息写入factory中
					vim=new Array(mesh.numVertices);
					for(var i=0;i<mesh.numFaces;i++)
					{
						face = mesh.GetFaces(i);
						if(face == undefined)
						{
							alert("error face");
							continue;
						}
						var setAttr = function(xc,vert,uv,norm){
							if(vert!=undefined)
							{
								xc.SetAttribute("x",Math.round(vert[0]*10000)/10000);
								xc.SetAttribute("y",-Math.round(vert[2]*10000)/10000);
								xc.SetAttribute("z",Math.round(vert[1]*10000)/10000);
							}
							if(uv!=undefined)
							{
								xc.SetAttribute("u",Math.round(uv[0][0]*10000)/10000);
								xc.SetAttribute("v",Math.round(uv[0][1]*10000)/10000);
							}
							if(norm!=undefined)
							{
								xc.SetAttribute("nx",Math.round(norm[0]*10000)/10000);
								xc.SetAttribute("ny",-Math.round(norm[2]*10000)/10000);
								xc.SetAttribute("nz",Math.round(norm[1]*10000)/10000);
							}
						}
						for(idx =0; idx <= 2;idx++)
						{
							//alert(idx + ":" +face[idx]);
							if(vim[face[idx]] != 1)
							{
								xc = params.CreateChild(xmlt.NODE_ELEMENT);
								xc.value="v";
								vert = mesh.GetVertices(face[idx]);
								//alert(vert);
								uv = mesh.GetTextureCoords(face[idx]);
								norm = mesh.GetNormals(face[idx]);
								setAttr(xc,vert,uv,norm);
								vim[face[idx]]=1;
							}
						}

						xc = params.CreateChild(xmlt.NODE_ELEMENT);
						xc.value="t";
						xc.SetAttribute("v1",face[0]);                
						xc.SetAttribute("v2",face[1]);
						xc.SetAttribute("v3",face[2]);
					}
					//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
					var fl=VFS.Open("outputpath/factories/"+meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci) + ".xml",VFS.WRITE);
					xmlt.Write(fl);
					for(var j=0;j<ainode.numChildren;j++)
					{
						//alert(ainode.numChildren);
						pscene(ainode.GetChildren(j),world);
					}
			}
		}
	}
		
		
}catch(e){
    alert('error:',e);
}

System.Quit();