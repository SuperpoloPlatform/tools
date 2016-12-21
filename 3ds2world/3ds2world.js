//this is a test.

try {
    Plugin.Load("spp.loader.3d");
	//VFS.Mount("/factories","D:\\test\\factories\\");
	//alert(VFS.Exists("factories/mesh_Cylinder_0.xml"));
	inputfile = CmdLine.GetOption("input");
	outputpath = CmdLine.GetOption("output");
	usepath = CmdLine.GetOption("usepath");
	ifeffect = CmdLine.GetOption("ifeffect");
	if(usepath==undefined || usepath==true)
	{
		usepath="";
	}
	
	if(ifeffect==undefined || ifeffect==true)
	{
		ifeffect="N";
	}
	VFS.Mount("outputpath",outputpath);
	alert("start");


	/*var fl=inputfile.indexOf("\\");
	alert(fl);
	var title=inputfile.substring(fl+1,inputfile.length-1);
	alert(title);*/
	fl = inputfile.length;
	for(;fl>=0;fl--)
	{
		if(inputfile[fl] == '\\')
		{
			break;
		}
	}
	var filename = inputfile.substr(fl+1,inputfile.length);
	var meshnamef = filename.substr(0,filename.length-4);
	var inputpath = inputfile.substr(0,fl+1);
	VFS.Mount("/",inputpath);
	VFS.Mount("/",inputpath+"new\\");
	VFS.Mount("/",inputpath+"normal\\");
	VFS.Mount("/",inputpath+"height\\");
	var allfilenames = VFS.FindFiles("/");
	//alert(outputpath);
	//alert(allfilenames);
	function FindRealName(afn,fn)
	{
		for(var fni = 0;fni<afn.length;fni++)
		{
			if(afn[fni] == undefined)
			{
				continue;
			}
			
			afnn = afn[fni].substr(1,afn[fni].length);
			if(afnn.toLocaleLowerCase() == fn.toLocaleLowerCase())
			{
				return afnn;
			}
		}
		return "null";
	}
	
	function pscenen(ainode,world)
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
			materialn.value="material";
			materialv = materialn.CreateChild(xmlt.NODE_TEXT);
			material = scene.GetMaterials(mesh.materialIndex);
			materialv.value="Material_"+material.GetPropertyName(0)+"_"+meshnamef;
			//获取贴图信息，并将图片复制到目标路径下
			material = scene.GetMaterials(mesh.materialIndex);
			for(it = 0;it < material.GetTextureCount();it++)
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				if(texture == undefined)
				{
					alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
				}
				else
				{
					//alert(VFS.GetRealPath(FindRealName(allfilenames,texture.path)));
					VFS.Copy(FindRealName(allfilenames,texture.path),"outputpath/textures/"+FindRealName(allfilenames,texture.path));
					//修改其中的textures信息
					textures = world.GetChild("textures");
					texturen = textures.CreateChild(wxml.NODE_ELEMENT);
					texturen.value="texture";
					texturen.SetAttribute("name",FindRealName(allfilenames,texture.path));
					texturef = texturen.CreateChild(wxml.NODE_ELEMENT);
					texturef.value="file";
					tfn = texturef.CreateChild(wxml.NODE_TEXT);
					tfn.value = usepath+"/textures/"+FindRealName(allfilenames,texture.path);
				}
			}
			//修改world文件中的materials信息
			materials = world.GetChild("materials");
			materialn = materials.CreateChild(wxml.NODE_ELEMENT);
			materialn.value="material";
			materialn.SetAttribute("name","Material_"+material.GetPropertyName(0)+"_"+meshnamef);
			for(it = 0;it < material.GetTextureCount();it++)
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				if(texture == undefined)
				{
					alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
					texturenode = materialn.CreateChild(wxml.NODE_ELEMENT);
					texturenode.value="texture";
					tpn = texturenode.CreateChild(wxml.NODE_TEXT);
					tpn.value = "no";
				}
				else
				{
					texturenode = materialn.CreateChild(wxml.NODE_ELEMENT);
					texturenode.value="texture";
					tpn = texturenode.CreateChild(wxml.NODE_TEXT);
					tpn.value = FindRealName(allfilenames,texture.path);
				}
			}
			if(!material.GetTextureCount())
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				texturenode = materialn.CreateChild(wxml.NODE_ELEMENT);
				texturenode.value="texture";
				tpn = texturenode.CreateChild(wxml.NODE_TEXT);
				tpn.value = "no";
			}
			//修改其中的sector信息
			sector = world.GetChild("sector");
			meshobj = sector.CreateChild(wxml.NODE_ELEMENT);
			meshobj.value = "meshobj";
			meshobj.SetAttribute("name",meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci) + ".xml");
			plugin = meshobj.CreateChild(wxml.NODE_ELEMENT);
			plugin.value = "plugin";
			tplg = plugin.CreateChild(wxml.NODE_TEXT);
			tplg.value = "genmesh";
			paramsw = meshobj.CreateChild(wxml.NODE_ELEMENT);
			paramsw.value = "params";
			factory = paramsw.CreateChild(wxml.NODE_ELEMENT);
			factory.value = "factory";
			tfan = factory.CreateChild(wxml.NODE_TEXT);
			tfan.value = meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci);
			movew = meshobj.CreateChild(wxml.NODE_ELEMENT);
			movew.value = "move";
			movecv = movew.CreateChild(wxml.NODE_ELEMENT);
			movecv.value = "v";
			movecv.SetAttribute("x",ainode.matrix[0][3]);
			movecv.SetAttribute("y",-ainode.matrix[2][3]);
			movecv.SetAttribute("z",ainode.matrix[1][3]);
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
			var fl=VFS.Open("outputpath/factories/"+meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci) +".xml",VFS.WRITE);
			xmlt.Write(fl);
			for(var j=0;j<ainode.numChildren;j++)
			{
				//alert(ainode.numChildren);
				pscenen(ainode.GetChildren(j),world);
			}
			}
		}
	}
	
	
	function psceney(ainode,world)
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
			materialn.value="material";
			materialv = materialn.CreateChild(xmlt.NODE_TEXT);
			material = scene.GetMaterials(mesh.materialIndex);
			materialv.value="Material_"+material.GetPropertyName(0)+"_"+meshnamef;
			//获取贴图信息，并将图片复制到目标路径下
			for(it = 0;it < material.GetTextureCount();it++)
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				//alert(VFS.GetRealPath(FindRealName(allfilenames,texture.path)));
				if(texture == undefined)
				{
					alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
				}
				else
				{
					VFS.Copy(FindRealName(allfilenames,texture.path),"outputpath/textures/"+FindRealName(allfilenames,texture.path));
					
					/*VFS.Copy("n"+FindRealName(allfilenames,texture.path),"outputpath/textures/"+"n"+FindRealName(allfilenames,texture.path));
					VFS.Copy("h"+FindRealName(allfilenames,texture.path),"outputpath/textures/"+"h"+FindRealName(allfilenames,texture.path));*/
					//修改其中的textures信息
					textures = world.GetChild("textures");
					texturen = textures.CreateChild(wxml.NODE_ELEMENT);
					texturen.value="texture";
					texturen.SetAttribute("name",FindRealName(allfilenames,texture.path));
					texturef = texturen.CreateChild(wxml.NODE_ELEMENT);
					texturef.value="file";
					tfn = texturef.CreateChild(wxml.NODE_TEXT);
					tfn.value = usepath+"/textures/"+FindRealName(allfilenames,texture.path);
					
					texturen = textures.CreateChild(wxml.NODE_ELEMENT);
					texturen.value="texture";
					texturen.SetAttribute("name","n"+FindRealName(allfilenames,texture.path));
					texturef = texturen.CreateChild(wxml.NODE_ELEMENT);
					texturef.value="file";
					tfn = texturef.CreateChild(wxml.NODE_TEXT);
					tfn.value = usepath+"/textures/"+"n"+FindRealName(allfilenames,texture.path);
					
					texturen = textures.CreateChild(wxml.NODE_ELEMENT);
					texturen.value="texture";
					texturen.SetAttribute("name","h"+FindRealName(allfilenames,texture.path));
					texturef = texturen.CreateChild(wxml.NODE_ELEMENT);
					texturef.value="file";
					tfn = texturef.CreateChild(wxml.NODE_TEXT);
					tfn.value = usepath+"/textures/"+"h"+FindRealName(allfilenames,texture.path);
				}
			}
			//修改world文件中的materials信息
			materials = world.GetChild("materials");
			materialn = materials.CreateChild(wxml.NODE_ELEMENT);
			materialn.value="material";
			materialn.SetAttribute("name","Material_"+material.GetPropertyName(0));
			for(it = 0;it < material.GetTextureCount();it++)
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				if(texture == undefined)
				{
					alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
				}
				texturenode = materialn.CreateChild(wxml.NODE_ELEMENT);
				texturenode.value="texture";
				tpn = texturenode.CreateChild(wxml.NODE_TEXT);
				tpn.value = FindRealName(allfilenames,texture.path);
			}
			if(!material.GetTextureCount())
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				texturenode = materialn.CreateChild(wxml.NODE_ELEMENT);
				texturenode.value="texture";
				tpn = texturenode.CreateChild(wxml.NODE_TEXT);
				tpn.value = "no";
			}
			
			
			
			if(texture == undefined)
			{
				alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
			}
			else
			{
				shadernode = materialn.CreateChild(wxml.NODE_ELEMENT);
				shadernode.value="shader";
				shadernode.SetAttribute("type","diffuse");
				tsn = shadernode.CreateChild(wxml.NODE_TEXT);
				tsn.value = "parallaxAtt";
				
				
				//<shadervar type="texture" name="tex normal">nb_0001.jpg</shadervar>
				
				
				shadervarnode = materialn.CreateChild(wxml.NODE_ELEMENT);
				shadervarnode.value="shadervar";
				shadervarnode.SetAttribute("type","texture");
				shadervarnode.SetAttribute("name","tex normal");
				tsn = shadervarnode.CreateChild(wxml.NODE_TEXT);
				tsn.value = "n"+FindRealName(allfilenames,texture.path);
				
				
				//<shadervar type="vector4" name="specular">0.69,0.69,0.69,1.0</shadervar>
				
				shadervarnode = materialn.CreateChild(wxml.NODE_ELEMENT);
				shadervarnode.value="shadervar";
				shadervarnode.SetAttribute("type","vector4");
				shadervarnode.SetAttribute("name","specular");
				tsn = shadervarnode.CreateChild(wxml.NODE_TEXT);
				tsn.value = "0.69,0.69,0.69,1.0";
				
				
				
				//<shadervar type="texture" name="tex height">tb_0001.jpg</shadervar>
				
				shadervarnode = materialn.CreateChild(wxml.NODE_ELEMENT);
				shadervarnode.value="shadervar";
				shadervarnode.SetAttribute("type","texture");
				shadervarnode.SetAttribute("name","tex height");
				tsn = shadervarnode.CreateChild(wxml.NODE_TEXT);
				tsn.value = "h"+FindRealName(allfilenames,texture.path);
			}
			
			//修改其中的sector信息
			sector = world.GetChild("sector");
			meshobj = sector.CreateChild(wxml.NODE_ELEMENT);
			meshobj.value = "meshobj";
			meshobj.SetAttribute("name",meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci) + ".xml");
			plugin = meshobj.CreateChild(wxml.NODE_ELEMENT);
			plugin.value = "plugin";
			tplg = plugin.CreateChild(wxml.NODE_TEXT);
			tplg.value = "genmesh";
			paramsw = meshobj.CreateChild(wxml.NODE_ELEMENT);
			paramsw.value = "params";
			factory = paramsw.CreateChild(wxml.NODE_ELEMENT);
			factory.value = "factory";
			tfan = factory.CreateChild(wxml.NODE_TEXT);
			tfan.value =meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci);
			movew = meshobj.CreateChild(wxml.NODE_ELEMENT);
			movew.value = "move";
			movecv = movew.CreateChild(wxml.NODE_ELEMENT);
			movecv.value = "v";
			movecv.SetAttribute("x",ainode.matrix[0][3]);
			movecv.SetAttribute("y",-ainode.matrix[2][3]);
			movecv.SetAttribute("z",ainode.matrix[1][3]);
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
			var fl=VFS.Open("outputpath/factories/"+meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci) +".xml",VFS.WRITE);
			xmlt.Write(fl);
			for(var j=0;j<ainode.numChildren;j++)
			{
				//alert(ainode.numChildren);
				psceney(ainode.GetChildren(j),world);
			}
			}
		}
	}
	
	//function TransformVertices(tmesh)
	//{
	//	var vim=new Array(mesh.numVertices);
	//	for(var i=0;i<mesh.numFaces;i++)
	//	{
	//		face = mesh.GetFaces(i);
	//		for(idx =0; idx <= 2;idx++)
	//		{
	//			if(vim[face[idx]] != 1)
	//			{
	//				vert = mesh.GetVertices(face[idx]);
	//				vim[face[idx]]=1;
	//				var vtmp = vert[1];
	//				vert[1] = -vert[2];
	//				vert[2] = vtmp;
	//			}
	//		}
	//	}
	//	scene.GenFaceNormal();
	//}
    importer=new Importer();
	//alert(import.JoinIdenticalVertices);
	//alert(import.FixInfacingNormals);
	//alert(import.ConvertToLeftHanded | import.TargetRealtime_MaxQuality | import.GenSmoothNormals | import.JoinIdenticalVertices);
	if(!VFS.Exists(filename))
	{
		alert("can not find the input file");
	}
	else
	{
		//alert(filename);
		//alert(inputfile);
		//alert(VFS.GetRealPath(filename));
		scene = importer.ReadFile(filename, (importer.TargetRealtime_MaxQuality | importer.FlipUVs | importer.ConvertToLeftHanded | importer.JoinIdenticalVertices));// & !importer.JoinIdenticalVertices);		//alert(scene);
		scene.GenFaceNormal();
		scene.GenVertexNormal("0.5");
		//mesh = scene.GetMeshes(0);
		//alert(mesh.GetName());
		//alert(scene.rootNode.parent == scene);
		//alert(scene.rootNode.matrix instanceof Array);
		//alert(scene.rootNode.matrix);
		//scene.FlipNormals();

		//打开并解析“模板”world文件
		wxml = new xmlDocument();
		wfile = VFS.Open("world");
		if(!wfile)
		{
			alert("can not open the world file");
		}
		else
		{
			wxml.Parse(wfile);
			world = wxml.root.GetChild("world");
			//alert(scene.rootNode.numChildren);
			//alert(scene.numMeshes);
			/*for(var im = 0;im < scene.numMeshes;im++)
			{
				//alert(im);
				mesh = scene.GetMeshes(im);
				//mesh = scene.GetMeshes(ainode.GetMeshIndex());
				//alert(mesh.numFaces);
				//alert(mesh.GetTextureCoords(0));
				//alert(mesh.GetName());
				xmlt=new xmlDocument();
				xmlrt=xmlt.CreateRoot();
				library = xmlrt.CreateChild(xmlt.NODE_ELEMENT);
				library.value="library";
				meshfact = library.CreateChild(xmlt.NODE_ELEMENT);
				meshfact.value="meshfact";
				meshfact.SetAttribute("name","mesh_"+ im);
				plugin = meshfact.CreateChild(xmlt.NODE_ELEMENT);
				plugin.value="plugin";
				genmeshfact = plugin.CreateChild(xmlt.NODE_TEXT);
				genmeshfact.value="genmeshfact";
				zuse = meshfact.CreateChild(xmlt.NODE_ELEMENT);
				zuse.value="zuse";
				params = meshfact.CreateChild(xmlt.NODE_ELEMENT);
				params.value="params";
				material = params.CreateChild(xmlt.NODE_ELEMENT);
				material.value="material";
				materialv = material.CreateChild(xmlt.NODE_TEXT);
				materialv.value="Material_"+mesh.materialIndex;
				//获取贴图信息，并将图片复制到目标路径下
				material = scene.GetMaterials(mesh.materialIndex);
				for(it = 0;it < material.GetTextureCount();it++)
				{
					texture = material.GetTexture(material.DIFFUSE,it);
					VFS.Copy(FindRealName(allfilenames,texture.path),"outputpath/textures/"+FindRealName(allfilenames,texture.path));
					//修改其中的textures信息
					textures = world.GetChild("textures");
					texturen = textures.CreateChild(wxml.NODE_ELEMENT);
					texturen.value="texture";
					texturen.SetAttribute("name",FindRealName(allfilenames,texture.path));
					texturef = texturen.CreateChild(wxml.NODE_ELEMENT);
					texturef.value="file";
					tfn = texturef.CreateChild(wxml.NODE_TEXT);
					tfn.value = "textures/"+FindRealName(allfilenames,texture.path);
				}
				//修改world文件中的materials信息
				materials = world.GetChild("materials");
				materialn = materials.CreateChild(wxml.NODE_ELEMENT);
				materialn.value="material";
				materialn.SetAttribute("name","Material_"+mesh.materialIndex);
				for(it = 0;it < material.GetTextureCount();it++)
				{
					texture = material.GetTexture(material.DIFFUSE,it);
					texturenode = materialn.CreateChild(wxml.NODE_ELEMENT);
					texturenode.value="texture";
					tpn = texturenode.CreateChild(wxml.NODE_TEXT);
					tpn.value = FindRealName(allfilenames,texture.path);
				}
				//修改其中的library信息
				libraryw = world.CreateChild(wxml.NODE_ELEMENT);
				libraryw.value = "library";
				tln = libraryw.CreateChild(wxml.NODE_TEXT);
				tln.value = "factories/"+"mesh_"+ im + ".xml";
				//修改其中的sector信息
				sector = world.GetChild("sector");
				meshobj = sector.CreateChild(wxml.NODE_ELEMENT);
				meshobj.value = "meshobj";
				meshobj.SetAttribute("name","mesh_"+ im + ".xml");
				plugin = meshobj.CreateChild(wxml.NODE_ELEMENT);
				plugin.value = "plugin";
				tplg = plugin.CreateChild(wxml.NODE_TEXT);
				tplg.value = "genmesh";
				paramsw = meshobj.CreateChild(wxml.NODE_ELEMENT);
				paramsw.value = "params";
				factory = paramsw.CreateChild(wxml.NODE_ELEMENT);
				factory.value = "factory";
				tfan = factory.CreateChild(wxml.NODE_TEXT);
				tfan.value = "mesh_"+ im;
				vim=new Array(mesh.numVertices);
				for(var i=0;i<mesh.numFaces;i++)
				{
					face = mesh.GetFaces(i);
					var setAttr = function(xc,vert,uv,norm){
						xc.SetAttribute("x",Math.round(vert[0]*10000)/10000);
						xc.SetAttribute("y",-Math.round(vert[2]*10000)/10000);
						xc.SetAttribute("z",Math.round(vert[1]*10000)/10000);
						if(uv!=undefined && uv!="")
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
						if(vim[face[idx]] != 1)
						{
							xc = params.CreateChild(xmlt.NODE_ELEMENT);
							xc.value="v";
							var vert = mesh.GetVertices(face[idx]);
							var uv = mesh.GetTextureCoords(face[idx]);
							var norm = mesh.GetNormals(face[idx]);
							setAttr(xc,vert,uv,norm);
							vim[face[idx]]=1;
						}
					}
					if(face.length>3)
					{
						alert("error");
					}
					xc = params.CreateChild(xmlt.NODE_ELEMENT);
					xc.value="t";
					xc.SetAttribute("v1",face[0]);                
					xc.SetAttribute("v2",face[1]);
					xc.SetAttribute("v3",face[2]);
				}
				//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
				var fl=VFS.Open("outputpath/factories/"+"mesh_"+ im + ".xml",VFS.WRITE);
				xmlt.Write(fl);
			}*/
			//alert("start");
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
					libraryw = world.CreateChild(wxml.NODE_ELEMENT);
					libraryw.value = "library";
					tln = libraryw.CreateChild(wxml.NODE_TEXT);
					tln.value = usepath+"factories/"+meshnamef+"_"+"mesh_"+ mesh.GetName() + ainode.GetMeshIndex(mci) + ".xml";
				}
			}
			sectorw = world.CreateChild(wxml.NODE_ELEMENT);
			sectorw.value = "sector";
			sectorw.SetAttribute("name","Scene");
			
			/*cullerpw = sectorw.CreateChild(wxml.NODE_ELEMENT);
			cullerpw.value = "cullerpw";
			cullerpw.SetAttribute("plugin","crystalspace.culling.frustvis");
			
			light = sectorw.CreateChild(wxml.NODE_ELEMENT);
			light.value = "light";
			light.SetAttribute("name","Lamp");
			lcenter = light.CreateChild(wxml.NODE_ELEMENT);
			lcenter.value = "center";
			lcenter.SetAttribute("x","4.0762");          
			lcenter.SetAttribute("y","5.9039");
			lcenter.SetAttribute("z","1.0055");
			
			lcolor = light.CreateChild(wxml.NODE_ELEMENT);
			lcolor.value = "color";
			lcolor.SetAttribute("red",  "1.0");          
			lcolor.SetAttribute("green","1.0");
			lcolor.SetAttribute("blue", "1.0");
			
			lradius = light.CreateChild(wxml.NODE_ELEMENT);
			lradius.value = "radius";
			lradius.SetAttribute("brightness",  "1.0"); 
			lradiusv = lradius.CreateChild(wxml.NODE_TEXT);
			lradiusv.value = "29.9999828339";*/
			
			if(ifeffect=="Y")
			{
				for(var jr=0;jr<scene.rootNode.numChildren;jr++)
				{
					//alert(jr);
					//alert(scene.rootNode.GetChildren(jr).GetMeshIndex());
					psceney(scene.rootNode.GetChildren(jr),world);
				}
			}
			else{
				if(ifeffect=="N")
				{
					for(var jr=0;jr<scene.rootNode.numChildren;jr++)
					{
						//alert(jr);
						//alert(scene.rootNode.GetChildren(jr).GetMeshIndex());
						pscenen(scene.rootNode.GetChildren(jr),world);
					}
				}
				else
				{
					alert("ifeffect error!");
				}
			}
			cullerpw = sectorw.CreateChild(wxml.NODE_ELEMENT);
			cullerpw.value = "cullerp";
			cullerpw.SetAttribute("plugin","crystalspace.culling.frustvis");
			//alert("light");
			//alert(scene.GetLights());
			light = sectorw.CreateChild(wxml.NODE_ELEMENT);
			light.value = "light";
			light.SetAttribute("name","Lamp");
			wlight = scene.GetLights(0);
			if(wlight != undefined)
			{
				lcenter = light.CreateChild(wxml.NODE_ELEMENT);
				lcenter.value = "center";
				lcenter.SetAttribute("x","4.0762");          
				lcenter.SetAttribute("y","5.9039");
				lcenter.SetAttribute("z","1.0055");
				
				lcolor = light.CreateChild(wxml.NODE_ELEMENT);
				lcolor.value = "color";
				lcolor.SetAttribute("red",  "1.0");          
				lcolor.SetAttribute("green","1.0");
				lcolor.SetAttribute("blue", "1.0");
				
				lradius = light.CreateChild(wxml.NODE_ELEMENT);
				lradius.value = "radius";
				lradius.SetAttribute("brightness",  "1.0"); 
				lradiusv = lradius.CreateChild(wxml.NODE_TEXT);
				lradiusv.value = "29.9999828339";
			}
			else
			{
				lcenter = light.CreateChild(wxml.NODE_ELEMENT);
				lcenter.value = "center";
				//lcenter.SetAttribute("x",wlight.);          
				//lcenter.SetAttribute("y",wlight.);
				//lcenter.SetAttribute("z",wlight.);
				
				lcolor = light.CreateChild(wxml.NODE_ELEMENT);
				lcolor.value = "color";
				lcolor.SetAttribute("red",  "1.0");          
				lcolor.SetAttribute("green","1.0");
				lcolor.SetAttribute("blue", "1.0");
				
				lradius = light.CreateChild(wxml.NODE_ELEMENT);
				lradius.value = "radius";
				lradius.SetAttribute("brightness",  "1.0"); 
				lradiusv = lradius.CreateChild(wxml.NODE_TEXT);
				lradiusv.value = "29.9999828339";
			}
			/*for(var j=0;j<ainode.numChildren;j++)
			{
					alert(ainode.numChildren);
					pscene(ainode.GetChildren(j),world);
			}
			pscene(scene.rootNode,world);*/
			startw = world.CreateChild(wxml.NODE_ELEMENT);
			startw.value = "start";
			startw.SetAttribute("name","Camera");
			sectors = startw.CreateChild(wxml.NODE_ELEMENT);
			sectors.value = "sector";
			scenes = sectors.CreateChild(wxml.NODE_TEXT);
			scenes.value = "Scene";
			wcamera = scene.GetCameras(0);
			
			if(wcamera == undefined)
			{
				position = startw.CreateChild(wxml.NODE_ELEMENT);
				position.value = "position";
				position.SetAttribute("x","8.6592");          
				position.SetAttribute("y","5.1716");
				position.SetAttribute("z","-4.595");
				up = startw.CreateChild(wxml.NODE_ELEMENT);
				up.value = "up";
				up.SetAttribute("x","-0.3307");          
				up.SetAttribute("y","0.8953");
				up.SetAttribute("z","0.2984");
				forward = startw.CreateChild(wxml.NODE_ELEMENT);
				forward.value = "forward";
				forward.SetAttribute("x","-0.6549");
				forward.SetAttribute("y","-0.4452");
				forward.SetAttribute("z","0.6107");
			}
			else
			{
				position = startw.CreateChild(wxml.NODE_ELEMENT);
				position.value = "position";
				position.SetAttribute("x",wcamera.position[0]);          
				position.SetAttribute("y",wcamera.position[1]);
				position.SetAttribute("z",wcamera.position[2]);
				up = startw.CreateChild(wxml.NODE_ELEMENT);
				up.value = "up";
				up.SetAttribute("x",wcamera.up[0]);          
				up.SetAttribute("y",wcamera.up[1]);
				up.SetAttribute("z",wcamera.up[2]);
				forward = startw.CreateChild(wxml.NODE_ELEMENT);
				forward.value = "forward";
				forward.SetAttribute("x",wcamera.lookAt[0]);
				forward.SetAttribute("y",wcamera.lookAt[1]);
				forward.SetAttribute("z",wcamera.lookAt[2]);
			}
			//将修改后的xml文件写到目标路径下的world文件中	
			wfile = VFS.Open("outputpath/world.xml",1);
			wxml.Write(wfile);
			//alert(scene.rootNode.numMeshes);
			//alert(scene.rootNode.numChildren);
			//alert(scene.rootNode.GetName());
			//mesh = scene.GetMeshes(0);
			//alert(mesh);
			//alert(mesh.numFaces);
			//alert(VFS.ChDir("factories"));
			//alert(scene.numMeshes);
			/*alert(scene.HasAnimations());
			alert(scene.flags);
			alert(scene.numCameras);
			alert(scene.numTextures);
			alert(scene.numMeshes);
			alert(scene.rootNode.GetName());
			alert(scene.rootNode.numMeshes);
			alert(scene.rootNode.numChildren);
			alert(scene.rootNode.GetChildren(0).numMeshes);
			alert(scene.rootNode.GetChildren(0).GetMeshIndex(0));
			mesh = scene.rootNode.GetChildren(0).GetMeshIndex(0);
			alert(mesh.GetName());
			for(i=0;i<scene.numMeshes;i++)
			{
			mesh = scene.GetMeshes(i);
			alert("name:"+mesh.GetTangents(1));
			}
			alert(scene.numTextures);
			alert(scene.numMaterials);
			mesh = scene.GetMeshes(0);
			alert(mesh.GetNormals().length);
			alert(mesh.GetVertices().length);
			alert(mesh.GetFaces());
			alert(mesh.GetFaces().length);
			alert(mesh.GetColors());
			alert(mesh.GetColors().length);*/
			//alert(mesh.GetTextureCoords());
			//alert(scene.numMeshes);
			/*for(tp in scene)
			{
				alert(tp+" :  "+scene[tp]);
			}*/
			//material = scene.GetMaterials(0);
			/*for(tp in material)
			{
				alert(tp + " : " + material[tp]);
			}*/
			//alert(material);
			//alert("TextureCount : "+material.GetTextureCount());
			//texture = material.GetTexture(material.DIFFUSE,0);
			//alert(FindRealName(allfilenames,texture.path));
			//alert(texture.mapmode);
			//alert(texture.mapping);
			/*for(tp in texture)
			{
				alert(tp + " : " + texture[tp]);
			}*/
			//alert("start");
			//alert(mesh.GetNormals());
			/*alert("scene.numMaterials : "+scene.numMaterials);
			alert(scene.GetMaterials(0).GetProperty(0));
			//alert("Colors:"+mesh.GetColors());
			camera = scene.GetCameras(0);
			alert("camera "+camera);
			lights = scene.GetLights(0);
			alert("lights "+lights);
			alert("lights name "+lights.name);
			for(tp in lights)
			{
				alert(tp);
				alert(lights[tp]);
			}
			alert(mesh.GetVertices(0));
			alert(mesh.numFaces);
			alert(mesh.GetFaces(0));*/
			alert("Successed");
		}
	}
}catch(e){
    alert('error:',e);
}

System.Quit();