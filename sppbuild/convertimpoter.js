//(function(){
	
	//检查输入文件是否存在
	//var  procedMesh = [];
	if(!VFS.Exists(filename))
	{
		System.exitcode = 22;
		alert("Error Code 22 : can not find the input file.\n",
			"Current input file : " , Ctx.inputfile);
		exit();
	}
	else
	{

		//解析输入3ds文件
		scene = importer.ReadFile(filename, (importer.TargetRealtime_MaxQuality | importer.FlipUVs | importer.ConvertToLeftHanded | importer.JoinIdenticalVertices));//& !importer.JoinIdenticalVertices);
		//alert(scene);
		//法线处理
		if(!scene)
		{
			///ticket:1271
			System.exitcode = 42;
			alert("Error Code 42 : Fail to load 3ds file.\n",
				"Current input file : " , Ctx.inputfile);
			exit();
		}
		scene.GenFaceNormal();
		scene.GenVertexNormal("0.8");
		
		var errorcode_41 = "";
		
		// 这个数组保存所有mesh的index信息。
		// @fixme 但是保存这些index是做什么用呢？
		var mesharr = new Array();
		
		
		//导出场景时添加所有meshobj

		if(convertmode == "factory")
		{
			psen(scene.rootNode);
		}
		if(errorcode_41 != "")
		{
			System.exitcode = 41;
			var errfile_41 = VFS.Open("outputpath/errorcode_41.log",1);
			errfile_41.Write(errorcode_41,errorcode_41.length);
			alert("Error Code 41 please check the file /outputpath/errorcode_41.log");
			exit();
		}
	}
	
	/**
	 * @brief 检测数组中是否存在该mesh。数组中保存的都是mesh的index
	 * @param mesharr -- 保存mesh index的数组。
	 * @param meshindex -- 一个mesh的index
	 */
	function Checkmesh(mesharr, meshindex)
	{
		for(var mi in mesharr)
		{
			if(mesharr[mi] == meshindex)
			{
				return true;
			}
		}
		return false;
	}
	
	/**
	 * @brief 判断<code>factorylib.xml</code>中是否已经存在该本体了。
	 * @param tworld -- <code>factorylib.xml</code>的<code><library></code>节点
	 * @param Libraryename -- 本体的文件路径，比如<code>/factories/box.xml</code>
	 */
	function CheckLibrary(tworld, Libraryename)
	{
		var Librarys = tworld.GetChildren();
		for(;Librarys.HasNext();)
		{
			var librarychild = Librarys.Next();
			if(librarychild.GetChildren().Next().value == Libraryename)
			{
				return true;
			}
		}
		return false;
	}
	
	
	function CheckMeshObj(tworld,meshname)
	{
		var MeshObjs = tworld.GetChild("sector").GetChildren();
		for(;MeshObjs.HasNext();)
		{
			var meshobj = MeshObjs.Next();
			if(meshobj.GetAttribute("name") == null)
			{
				continue;
			}
			if(meshobj.GetAttribute("name").value == meshname)
			{
				return true;
			}
		}
		return false;
	}
	
	
	function FindMeshObj(sector,meshname)
	{
		var MeshObjs = sector.GetChildren();
		for(;MeshObjs.HasNext();)
		{
			var meshobj = MeshObjs.Next();
			// alert(meshobj.GetAttribute("name").value + " == " + meshname);
			// alert(meshobj.GetAttribute("name").value.length);
			// alert(meshname.length);
			if(meshobj.GetAttribute("name") == null)
			{
				continue;
			}
			if(meshobj.GetAttribute("name").value == meshname)
			{
				return meshobj;
			}
		}
		return false;
	}
	
	
	function CheckMeshFac(root,meshname)
	{
		var MeshFacs = root.GetChildren();
		for(;MeshFacs.HasNext();)
		{
			var meshfac = MeshFacs.Next();
			if(meshfac.GetAttribute("name") == null)
			{
				continue;
			}
			if(meshfac.GetAttribute("name").value == meshname)
			{
				
				return true;
			}
		}
		return false;
	}
	
	
	function matIsTwoSide(matname)
	{
		var mat;
		mat = matprort.GetChild(matname);
		if(mat == undefined)
		{
			alert(matname + " cannot found in matpro.xml");
			return false;
		}
		return (mat.GetAttribute("twoSided").value );
	}
	
	/**
	 * @brief 这是做什么的？
	 */
	function psen(ainode)
	{
		if(ainode.GetMeshIndex() != undefined)
		{
			if(CheckMeshObj(tworld,ainode.GetName().replace("_","#")))
			{
				System.exitcode = 23;
				//alert("meshobj with the name " + ainode.GetName() + " is exists!");
				return ;
			}
			
			var factName = importer.GetFactName(ainode.GetName(), "_")
			if(factName != false)
			{
				if(!VFS.Exists("outputpath/factories/"+factName+".xml"))
				{
				
					//alert("fac");
					pfac(ainode)
					
					libraryw = librarys.CreateChild(xmlDocument.NODE_ELEMENT);
					libraryw.value = "library";
					tln = libraryw.CreateChild(xmlDocument.NODE_TEXT);
					tln.value = usepath+"/"+"factories/" + factName + ".xml";
				}
			
			
				sector = tworld.GetChild("sector");
				meshobj = sector.CreateChild(xmlDocument.NODE_ELEMENT);
				meshobj.value = "meshobj";
				meshobj.SetAttribute("name",ainode.GetName().replace("_","#"));
				var yangxiuwu = false;
				if(yangxiuwu)
				{
					nullmeshUp = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
					nullmeshUp.value = "nullmesh";
					staticlod = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
					staticlod.value = "staticlod";
					distance = staticlod.CreateChild(xmlDocument.NODE_ELEMENT);
					distance.value = "distance";
					distance.SetAttribute("d0","200");
					
					//  lod一阶
					meshobj_lod2 = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
					meshobj_lod2.value = "meshobj";
					meshobj_lod2.SetAttribute("name","lod_01");
					lodlevel = meshobj_lod2.CreateChild(xmlDocument.NODE_ELEMENT);
					lodlevel.value = "lodlevel";
					lodlevelC = lodlevel.CreateChild(xmlDocument.NODE_TEXT);
					lodlevelC.value = "0";
					nullmeshDown = meshobj_lod2.CreateChild(xmlDocument.NODE_ELEMENT);
					nullmeshDown.value = "nullmesh";
					
					//  lod二阶
					meshobj_lod1 = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
					meshobj_lod1.value = "meshobj";
					meshobj_lod1.SetAttribute("name","lod_02");
					lodlevel = meshobj_lod1.CreateChild(xmlDocument.NODE_ELEMENT);
					lodlevel.value = "lodlevel";
					lodlevelC = lodlevel.CreateChild(xmlDocument.NODE_TEXT);
					lodlevelC.value = "1";
					priority = meshobj_lod1.CreateChild(xmlDocument.NODE_ELEMENT);
					priority.value = "priority";
					priorityC = priority.CreateChild(xmlDocument.NODE_TEXT);
					priorityC.value = "object";
					plugin = meshobj_lod1.CreateChild(xmlDocument.NODE_ELEMENT);
					plugin.value = "plugin";
					pluginC = plugin.CreateChild(xmlDocument.NODE_TEXT);
					//pluginC.value = "crystalspace.mesh.loader.genmesh";
					//add effect hud 判断meshobj是否是hud效果,若是world.xml中meshobj要修改插件名称
					var issprtadd = false;
					if(callbacks.Choice["mergexmls"]){
						 if(sprt.isopenxml == true)
						{
							issprtadd = sprt.IsSprt2dMesh(factName); 
						}
					}
					if(issprtadd)
						pluginC.value = "crystalspace.mesh.loader.sprite.2d";
					else
						pluginC.value = "crystalspace.mesh.loader.genmesh";

					paramsw = meshobj_lod1.CreateChild(xmlDocument.NODE_ELEMENT);
					paramsw.value = "params";
					factory = paramsw.CreateChild(xmlDocument.NODE_ELEMENT);
					factory.value = "factory";
					tfan = factory.CreateChild(xmlDocument.NODE_TEXT);
					tfan.value = factName;
				
				}
				//add lod effect
				var isaddmeshlod = false;
				/* if(callbacks.Choice["mergexmls"])
				{
					if(lod.isopenxml == true)
					{
						if(lod.isFact(factName))
						{
							var meshobjname = ainode.GetName().replace("_","#");
							isaddmeshlod = true;
							var factnode = lod.listfactnode[lod.factindex];
							var chdnode = factnode.GetChild("materialname");//得到matnode
							lod.getmatmeshobj(chdnode);
							lod.findMeshobj(meshobjname);				
							var meshobjnd = lod.listmeshobjnode[lod.meshobjindex];
							CopyNodes(meshobj, meshobjnd);
							//add effect hud 判断meshobj是否是hud效果,若是world.xml中meshobj要修改插件名称
							var issprtadd = false;
							var plgname;
							if(callbacks.Choice["mergexmls"]){
								 if(sprt.isopenxml == true)
								{
									issprtadd = sprt.IsSprt2dMesh(factName); 
								}
							}
							if(issprtadd)
								plgname = "crystalspace.mesh.loader.sprite.2d";
							else
								plgname = "crystalspace.mesh.loader.genmesh";
							var matname = lod.listNewMatname[lod.factindex];
							lod.AddMeshLod(meshobj, 0, plgname, factName, matname)	
							matname = "lod_" + lod.listNewMatname[lod.factindex];
							lod.AddMeshLod(meshobj, 1, plgname, factName, matname)	
						}
					}
				} */
				 
				if(!isaddmeshlod)
				{
					plugin = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
					plugin.value = "plugin";
					tplg = plugin.CreateChild(xmlDocument.NODE_TEXT);
					//tplg.value = "crystalspace.mesh.loader.genmesh";
					//add effect hud 判断meshobj是否是hud效果,若是world.xml中meshobj要修改插件名称
					var issprtadd = false;
					if(callbacks.Choice["mergexmls"])
					{
						 if(sprt.isopenxml == true)
						{
							issprtadd = sprt.IsSprt2dMesh(factName); 
						}
					}
					if(issprtadd)
						tplg.value = "crystalspace.mesh.loader.sprite.2d";
					else
						tplg.value = "crystalspace.mesh.loader.genmesh";
					paramsw = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
					paramsw.value = "params";
					factory = paramsw.CreateChild(xmlDocument.NODE_ELEMENT);
					factory.value = "factory";
					tfan = factory.CreateChild(xmlDocument.NODE_TEXT);
					tfan.value = factName;
				}
				movew = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
				movew.value = "move";
				movecv = movew.CreateChild(xmlDocument.NODE_ELEMENT);
				movecv.value = "v";
				movecv.SetAttribute("x",ainode.matrix[0][3]);
				movecv.SetAttribute("y",ainode.matrix[1][3]);
				movecv.SetAttribute("z",ainode.matrix[2][3]);
				
				matrix = movew.CreateChild(xmlDocument.NODE_ELEMENT);
				matrix.value = "matrix";
				
				scale = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
				scale.value = "scale";
				scale.SetAttribute("x",1/ainode.GetMatrix3().GetScale()[0]);
				scale.SetAttribute("y",1/ainode.GetMatrix3().GetScale()[1]);
				scale.SetAttribute("z",1/ainode.GetMatrix3().GetScale()[2]);
				
				rotx = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
				rotx.value = "rotx";
				rotxa =  rotx.CreateChild(xmlDocument.NODE_TEXT);
				rotxa.value = Math.round(ainode.GetEulerAngles()[0]*10000)/10000;
				roty = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
				roty.value = "roty";
				rotya =  roty.CreateChild(xmlDocument.NODE_TEXT);
				rotya.value = Math.round(ainode.GetEulerAngles()[1]*10000)/10000;;
				rotz = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
				rotz.value = "rotz";
				rotza =  rotz.CreateChild(xmlDocument.NODE_TEXT);
				rotza.value = Math.round(ainode.GetEulerAngles()[2]*10000)/10000;
				
				plightmap(ainode,meshobj);
			}
		}
		for(var j=0;j<ainode.numChildren;j++)
		{
			//alert(ainode.numChildren);
			psen(ainode.GetChildren(j));
		}
	}
	
	
	
	/**
	 * @brief 这是做什么的？
	 */
	function plightmap(ainode,meshobj)
	{
	
		var lightmn =  ainode.GetName() + ".jpg";
		//lightmn = lightmn.replace("_","#");
		// for(var i = 0; i < lightmn.length; i++)
		// {
			// alert(lightmn[i]);
			// if(lightmn[i] == '_')
			// {
				// lightmn[i] = '#';
				// alert(lightmn[i]);
			// }
		// }
		//alert(lightmn);
		
		if (!VFS.Exists("/"  + lightmn))
		{
			//alert(lightmn);
			//alert(lightmn);
		
			return 0;
		}
		for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
		{
			var meshindex = ainode.GetMeshIndex(mci);
			var mesh = scene.GetMeshes(meshindex);
			if(mesh.numUVWComponents[1] == 0)
			{
				//alert(lightmn);
				return 0;
			}
		}

		var shadervar = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
		shadervar.value="shadervar";
		shadervar.SetAttribute("name","tex lightmap");
		shadervar.SetAttribute("type","texture");
		var shadervartex = shadervar.CreateChild(xmlDocument.NODE_TEXT);
		shadervartex.value = lightmn
		
		
		// <texture name="lightmaps_art_0_png">
		  // <class>lightmap</class>
		  // <file>/art/lightmaps/art_0.png</file>
		  // <mipmap>no</mipmap>
		// </texture>
		var texs = matlibrarys.GetChild("textures");
		var tex = texs.CreateChild(xmlDocument.NODE_ELEMENT);
		tex.value = "texture";
		tex.SetAttribute("name",lightmn);
		var texcalss = tex.CreateChild(xmlDocument.NODE_ELEMENT);
		texcalss.value = "class";
		var calssvalue = texcalss.CreateChild(xmlDocument.NODE_TEXT);
		calssvalue.value = "lightmap";
		var texfile = tex.CreateChild(xmlDocument.NODE_ELEMENT);
		texfile.value = "file";
		var filevalue = texfile.CreateChild(xmlDocument.NODE_TEXT);
		filevalue.value = usepath+ "/lightmaps/" + lightmn
		var texmipmap = tex.CreateChild(xmlDocument.NODE_ELEMENT);
		texmipmap.value = "mipmap";
		var mipmapvalue = texmipmap.CreateChild(xmlDocument.NODE_TEXT);
		mipmapvalue.value = "no";
		
		if (VFS.Exists("/lightmap/"  + lightmn))
		{
		
			VFS.Copy("/lightmap/" + lightmn,"outputpath/lightmaps/" + lightmn);
		}
		else
		{
			//找不到对应的lightmap
			alert("找不到对应的lightmap");
			exit();
		}
			
		 //add renderbuffer
		 
		params = meshobj.GetChild("params");
		renderbuffer = params.CreateChild(xmlDocument.NODE_ELEMENT);
		renderbuffer.value="renderbuffer";
		renderbuffer.SetAttribute("components",2);
		renderbuffer.SetAttribute("name","texture coordinate lightmap");
		renderbuffer.SetAttribute("type","float");
		var uverr = 0;
		try{
			if(ainode.GetMeshIndex() != undefined)
			{
				if(ainode.GetMeshIndex().length > 1)
				{
					for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
					{
						var mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
						vim=new Array(mesh.numVertices);
						for(var i=0;i<mesh.numFaces;i++)
						{
							
							face = mesh.GetFaces(i);
							if(face == undefined)
							{
								System.exitcode = 27;
								//alert("error face");
								continue;
							}
							
							for(idx =0; idx <= 2;idx++)
							{
								//alert(idx + ":" +face[idx]);
								if(vim[face[idx]] != 1)
								{
									xc = renderbuffer.CreateChild(xmlDocument.NODE_ELEMENT);
									xc.value="e";
									
									//alert(vert);
									uv = mesh.GetTextureCoords(face[idx]);

									//setAttr(xc,vert,uv,norm);
									if(uv == undefined)
									{
										xc.SetAttribute("c0",0);
										xc.SetAttribute("c1",0);
										vim[face[idx]]=1;
										uverr = 1;
									}
									else
									{
										xc.SetAttribute("c0",Math.round(uv[1][0]*10000)/10000);
										xc.SetAttribute("c1",Math.round(uv[1][1]*10000)/10000);
										vim[face[idx]]=1;
									}
								}
							}
						}
					}
					
				}
				else
				{
					var mesh = scene.GetMeshes(ainode.GetMeshIndex(0));
					vim=new Array(mesh.numVertices);
					for(var i=0;i<mesh.numFaces;i++)
					{
						face = mesh.GetFaces(i);
						if(face == undefined)
						{
							alert("error face");
							continue;
						}
						for(idx =0; idx <= 2;idx++)
						{
							//alert(idx + ":" +face[idx]);
							if(vim[face[idx]] != 1)
							{
							
								//<e c0="0.640363" c1="0.427468"/>
								xc = renderbuffer.CreateChild(xmlDocument.NODE_ELEMENT);
								xc.value="e";
								
								uv = mesh.GetTextureCoords(face[idx]);
								
								
								
								if(uv!=undefined)
								{
									if(typeof(uv[1]) == "undefined")
									{
										xc.SetAttribute("c0",0);
										xc.SetAttribute("c1",0);
										uverr = 1;
									}
									else
									{
										xc.SetAttribute("c0",Math.round(uv[1][0]*10000)/10000);
										xc.SetAttribute("c1",Math.round(uv[1][1]*10000)/10000);
									}
								}
								else
								{
									xc.SetAttribute("c0",0);
									xc.SetAttribute("c1",0);
									uverr = 1;
								}
								vim[face[idx]]=1;
							}
						}
					}
				}
			}
		}catch(e)
		{
			alert("The fac " + ainode.GetName().replace("_","#") + "'s uv channel num is too many!");
			alert(e);
		}
		if(uverr == 1)
		{
			alert(ainode.GetName().replace("_","#") + "'s lightmap uv has error!please check it in viewscene!" );
		}
	}
	
	
	
	function pfac(ainode)
	{
		if(ainode.GetMeshIndex() == undefined)
		{
			alert("ainode.GetMeshIndex() == undefined ", "in function `pfac`");
			return false;
		}
		var factName = importer.GetFactName(ainode.GetName(), "_");
		var meshfacnode = facprort.CreateChild(xmlDocument.NODE_ELEMENT);
		meshfacnode.value = "meshfactory";
		meshfacnode.SetAttribute("name",factName);
		meshfacnode.SetAttribute("fromfile",inputfile);
		var numf = 0;
		var numv = 0;
		
		
		if(ainode.GetMeshIndex().length > 1)
		{
			try{
		
				//alert("facp");
				xmlt=new xmlDocument();
				xmlrt=xmlt.CreateRoot();
				library = xmlrt.CreateChild(xmlDocument.NODE_ELEMENT);
				library.value="library";
				meshfact = library.CreateChild(xmlDocument.NODE_ELEMENT);
				meshfact.value="meshfact";
				meshfact.SetAttribute("name",factName);
				plugin = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
				plugin.value="plugin";
				genmeshfact = plugin.CreateChild(xmlDocument.NODE_TEXT);
				genmeshfact.value="crystalspace.mesh.loader.factory.genmesh";
				//zuse = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
				//zuse.value="zuse";
				params = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
				params.value="params";
				var vca = [];
				var materialNameMap = {};
				
				
				var dataerr ="";
				for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
				{
					
	
					var meshindex = ainode.GetMeshIndex(mci);
					var mesh = scene.GetMeshes(meshindex);
					
					if(mesh.GetDataerr() != "")
					{
						dataerr = mesh.GetDataerr();
					}
					
					//将mesh信息写入到xml中
					var submeshnode = meshfacnode.CreateChild(xmlDocument.NODE_ELEMENT);
					submeshnode.value = "submesh";
					submeshnode.SetAttribute("name",mesh.GetName());
					submeshnode.SetAttribute("meshindex",meshindex);
					submeshnode.SetAttribute("numfaces", mesh.numFaces);
					submeshnode.SetAttribute("numvertices",mesh.numVertices);
					numf += mesh.numFaces;
					numv += mesh.numVertices;
					materialpronode = submeshnode.CreateChild(xmlDocument.NODE_ELEMENT);
					materialpronode.value = "material";
					
					if(mci>0)
					{
						vca[mci] = vca[mci-1] + mesh.GetVertices().length;
					}
					else
					{
						vca[mci] = mesh.GetVertices().length;
					}
					material = scene.GetMaterials(mesh.materialIndex);

					//获取world中的textures节点
					textures = matlibrarys.GetChild("textures");
					//修改world文件中的textures信息

					if(!callbacks.onTextureAdd(textures,material))
					{
						return ;
					}
					
					
					//修改world文件中的materials信息
					materials = matlibrarys.GetChild("materials");
					
					var matname = callbacks.onMaterialAdd(materials,material,factName);
							
					mesh.twoSide = matIsTwoSide(matname);
					if(matname == null)
					{
						System.exitcode = 45;
						exit();
						//report error and exit!!!.
					}
					
					
					materialNameMap[material.GetPropertyName(0)] = matname;
					
					///@fixme texture竟然是从callbacks.onMaterialAdd中获得的
					///不说还真不知道。
					importer.addMatetialPro(material,materialpronode,allfilenames, texture);

					vim=new Array(mesh.numVertices);
					if(mesh.twoSide)
					{
						for(var i=0;i<mesh.numFaces;i++)
						{
							face = mesh.GetFaces(i);
							if(face == undefined)
							{
								System.exitcode = 27;
								//alert("error face");
								continue;
							}
							var setAttr = function(xc,vert,uv,norm)
							{
								if(vert!=undefined)
								{
									xc.SetAttribute("x",Math.round(vert[0]*10000)/10000);
									xc.SetAttribute("y",Math.round(vert[1]*10000)/10000);
									xc.SetAttribute("z",Math.round(vert[2]*10000)/10000);
								}
								if(uv!=undefined)
								{
									xc.SetAttribute("u",Math.round(uv[0][0]*10000)/10000);
									xc.SetAttribute("v",Math.round(uv[0][1]*10000)/10000);
								}
								if(norm!=undefined)
								{
									xc.SetAttribute("nx",Math.round(norm[0]*10000)/10000);
									xc.SetAttribute("ny",Math.round(norm[1]*10000)/10000);
									xc.SetAttribute("nz",Math.round(norm[2]*10000)/10000);
								}
							}
							for(idx =0; idx <= 2;idx++)
							{
								//alert(idx + ":" +face[idx]);
								if(vim[face[idx]] != 1)
								{
									xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
									xc.value="v";
									vert = mesh.GetVertices(face[idx]);
									//alert(vert);
									uv = mesh.GetTextureCoords(face[idx]);
									norm = mesh.GetNormals(face[idx]);
									setAttr(xc,vert,uv,norm);
									vim[face[idx]]=1;
								}
							}
							
							
							var ec = 0;
							if(mci>0)
							{
								ec = vca[mci-1];
							}

							xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
							xc.value="t";
							xc.SetAttribute("v1",face[0]+ec);                
							xc.SetAttribute("v2",face[1]+ec);
							xc.SetAttribute("v3",face[2]+ec);
							//add twoside
							{
								var xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
								xc.value="t";
								xc.SetAttribute("v1",face[2]+ec);
								xc.SetAttribute("v2",face[1]+ec);
								xc.SetAttribute("v3",face[0]+ec);
							}
						}
					}
					else
					{
						for(var i=0;i<mesh.numFaces;i++)
						{
							face = mesh.GetFaces(i);
							if(face == undefined)
							{
								System.exitcode = 27;
								//alert("error face");
								continue;
							}
							var setAttr = function(xc,vert,uv,norm)
							{
								if(vert!=undefined)
								{
									xc.SetAttribute("x",Math.round(vert[0]*10000)/10000);
									xc.SetAttribute("y",Math.round(vert[1]*10000)/10000);
									xc.SetAttribute("z",Math.round(vert[2]*10000)/10000);
								}
								if(uv!=undefined)
								{
									xc.SetAttribute("u",Math.round(uv[0][0]*10000)/10000);
									xc.SetAttribute("v",Math.round(uv[0][1]*10000)/10000);
								}
								if(norm!=undefined)
								{
									xc.SetAttribute("nx",Math.round(norm[0]*10000)/10000);
									xc.SetAttribute("ny",Math.round(norm[1]*10000)/10000);
									xc.SetAttribute("nz",Math.round(norm[2]*10000)/10000);
								}
							}
							for(idx =0; idx <= 2;idx++)
							{
								//alert(idx + ":" +face[idx]);
								if(vim[face[idx]] != 1)
								{
									xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
									xc.value="v";
									vert = mesh.GetVertices(face[idx]);
									//alert(vert);
									uv = mesh.GetTextureCoords(face[idx]);
									norm = mesh.GetNormals(face[idx]);
									setAttr(xc,vert,uv,norm);
									vim[face[idx]]=1;
								}
							}
							
							
							var ec = 0;
							if(mci>0)
							{
								ec = vca[mci-1];
							}

							xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
							xc.value="t";
							xc.SetAttribute("v1",face[0]+ec);                
							xc.SetAttribute("v2",face[1]+ec);
							xc.SetAttribute("v3",face[2]+ec);
						}
					}
				}
				
				
				if(dataerr != "")
				{
					alert("The mesh " + factName +" has a " + dataerr + " pleale check it!");
				}
				for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
				{
					var submesh = params.CreateChild(xmlDocument.NODE_ELEMENT);
					submesh.value="submesh";
					//<indexbuffer components="1" type="uint" indices="yes">
					var indexbuffer = submesh.CreateChild(xmlDocument.NODE_ELEMENT);
					indexbuffer.value = "indexbuffer";
					indexbuffer.SetAttribute("components",1);                
					indexbuffer.SetAttribute("type","uint");
					indexbuffer.SetAttribute("indices","yes");
					mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
					
					//<material>parallaxAtt_wall-stone-parallaxwall-stone_2_d.jpg</material>
					
					
					var materialn = submesh.CreateChild(xmlDocument.NODE_ELEMENT);
					//获取当前mesh的material
					material = scene.GetMaterials(mesh.materialIndex);
					//将material信息写入factory
					materialn.value="material";
					materialv = materialn.CreateChild(xmlDocument.NODE_TEXT);
					materialv.value=materialNameMap[material.GetPropertyName(0)];
					mesh.twoSide = matIsTwoSide(materialNameMap[material.GetPropertyName(0)]);
					//根据material为submesh添加关于透明处理的几个标签。
					//AddAlphaModeFromMat(submesh,material);
					//写入submesh中引用的顶点
					if(mesh.twoSide)
					{
						for(var i=0;i<mesh.numFaces;i++)
						{
							face = mesh.GetFaces(i);
							if(face == undefined)
							{
								System.exitcode = 28;
								//alert("error face");
								continue;
							}
							//<e c0="2" />
							var ec = 0;
							if(mci>0)
							{
								ec = vca[mci-1];
							}
							for(var vi =0;vi < face.length; vi++)
							{
								var enode = indexbuffer.CreateChild(xmlDocument.NODE_ELEMENT);
								enode.value = "e";
								
								enode.SetAttribute("c0",face[vi]+ec);                
							}
							
							//add twoside
							{
								for(var vi = face.length;vi > 0; vi--)
								{
									var enode = indexbuffer.CreateChild(xmlDocument.NODE_ELEMENT);
									enode.value = "e";
									
									enode.SetAttribute("c0",face[vi-1]+ec);                
								}
							}
						}
					}
					else
					{
						for(var i=0;i<mesh.numFaces;i++)
						{
							face = mesh.GetFaces(i);
							if(face == undefined)
							{
								System.exitcode = 28;
								//alert("error face");
								continue;
							}
							//<e c0="2" />
							var ec = 0;
							if(mci>0)
							{
								ec = vca[mci-1];
							}
							for(var vi =0;vi < face.length; vi++)
							{
								var enode = indexbuffer.CreateChild(xmlDocument.NODE_ELEMENT);
								enode.value = "e";
								
								enode.SetAttribute("c0",face[vi]+ec);                
							}
						}
					}
				
				}
				// 将该mesh（包含submesh）的面数和顶点数添加到统计中。
				Ctx.totalFaceNum += numf;
				Ctx.totalVertexNum += numv;
				
				meshfacnode.SetAttribute("numfaces", numf);
				meshfacnode.SetAttribute("numvertices", numv);
				meshfacnode.SetAttribute("numvsubmesh",ainode.GetMeshIndex().length);
			
			
			}catch(e)
			{
				alert("The fac " + factName + "'s face num is too many!");
			}
			//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
			//alert("writefac");
			var fl=VFS.Open("outputpath/factories/" + factName + ".xml",VFS.WRITE);

			xmlt.WritetoFile(fl);
				
				
				
				
		}
		else
		{
			if(ainode.GetMeshIndex().length > 0)
			{
				var mesh = scene.GetMeshes(ainode.GetMeshIndex()[0]);
				if(mesh == undefined)
				{
					System.exitcode = 29;
					//alert("error mesh");
					return;
				}
				
				if(mesh.GetDataerr() != "")
				{
					alert("The mesh " + factName + "has a " + mesh.GetDataerr() + " pleale check it!");
				}
				
				// 将该mesh（没有submesh）的面数和顶点数添加到统计中。
				Ctx.totalFaceNum += mesh.numFaces;
				Ctx.totalVertexNum += mesh.numVertices;
				
				//将当前mesh信息写入xml中
				meshfacnode.SetAttribute("meshindex", ainode.GetMeshIndex()[0]);
				meshfacnode.SetAttribute("numfaces", mesh.numFaces);
				meshfacnode.SetAttribute("numvertices", mesh.numVertices);
				materialpronode = meshfacnode.CreateChild(xmlDocument.NODE_ELEMENT);
				materialpronode.value = "material";
				
				
				xmlt=new xmlDocument();
				xmlrt=xmlt.CreateRoot();
				library = xmlrt.CreateChild(xmlDocument.NODE_ELEMENT);
				library.value="library";
				meshfact = library.CreateChild(xmlDocument.NODE_ELEMENT);
				meshfact.value="meshfact";
				meshfact.SetAttribute("name", factName);
				plugin = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
				plugin.value="plugin";
				genmeshfact = plugin.CreateChild(xmlDocument.NODE_TEXT);
				//add effect hud 判断是否是hud效果的mesh,若是修改meshfactory中插件
				var issprtadd = false;
				if(callbacks.Choice["mergexmls"]){
					 if(sprt.isopenxml == true)
					{
						issprtadd = sprt.IsSprt2dMesh(factName); 
					 }
				}
				if(issprtadd)
					genmeshfact.value="crystalspace.mesh.loader.factory.sprite.2d";
				else
					genmeshfact.value="crystalspace.mesh.loader.factory.genmesh";
				
				//genmeshfact.value="crystalspace.mesh.loader.factory.genmesh";
				//zuse = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
				//zuse.value="zuse";
				params = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
				params.value="params";
				materialn = params.CreateChild(xmlDocument.NODE_ELEMENT);
				//获取当前mesh的material
				material = scene.GetMaterials(mesh.materialIndex);
				//将material信息写入factory
				//修改xml文件中的materials信息
				materials = matlibrarys.GetChild("materials");
				textures = matlibrarys.GetChild("textures");//adjust order
				var matname = callbacks.onMaterialAdd(materials,material,factName);
				
				//lod effect if is lod,add new lod material
				var isaddlod = false; 
				if(callbacks.Choice["mergexmls"])
				{
					if(lod.isopenxml == true)
					{
						if(lod.isFact(factName))
						{
							var factnode = lod.listfactnode[lod.factindex];
							isaddlod = lod.IsMat(factnode,material);
							if(isaddlod)
							{
								//lod.listNewMatname[lod.factindex] = matname;
								lod.addLodmat(materials, matname);
							} 
						} 
					}
				}				
				
				mesh.twoSide = matIsTwoSide(matname);
				if(matname == null)
				{
					 System.exitcode = 45;
					 exit();
				}
				materialn.value="material";
				materialv = materialn.CreateChild(xmlDocument.NODE_TEXT);
				materialv.value=matname;
				
				
				
				//获取world中的textures节点
				//textures = matlibrarys.GetChild("textures");
				//修改world文件中的textures信息
				if(!callbacks.onTextureAdd(textures,material))
				{
					return ;
				}
				
				
				//根据material为meshfact添加关于透明处理的几个标签。
				
				///@fixme texture竟然是从callbacks.onMaterialAdd中获得的
				///不说还真不知道。
				importer.addMatetialPro(material, materialpronode, allfilenames, texture);
				//add effect hud判断是否是hud效果的mesh,若是修改mesh的vector位置,只留uv与xy四个即可
				var issprtadd = false;
				if(callbacks.Choice["mergexmls"]){
					 if(sprt.isopenxml == true)
					{
						issprtadd = sprt.IsSprt2dMesh(factName); 
						//alert(factName+" : hud add");
					 }
				}
				if(issprtadd)
				{
					if(!VFS.Exists("outputpath/factories/" + factName + ".xml"))
					{
						var hudarr = new Array(4);
						for(var i=0;i<4;i++) hudarr[i]=new Array(4);
						//将mesh的信息写入factory中
						vim=new Array(mesh.numVertices);
						try{
							for(var i=0;i<mesh.numFaces;i++)
							{
								face = mesh.GetFaces(i);
								if(face == undefined)
								{
									alert("error face");
									continue;
								}
								for(idx =0; idx <= 2;idx++)
								{
									//alert(idx + ":" +face[idx]);
									if(vim[face[idx]] != 1)
									{
										//xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
										//xc.value="v";
										vert = mesh.GetVertices(face[idx]);
										//alert(vert);
										uv = mesh.GetTextureCoords(face[idx]);
										
										///@ticket:1243 模型有问题，获取不到UV信息。
										if(typeof(uv) == "undefined")
										{
											System.exitcode = 41;
											errorcode_41 += "Error Code 41 : Please check UV info for mesh" + ainode.GetName().replace("_","#") + "\n";
											return;
											// alert("Error Code 41 : Please check UV info for mesh" + ainode.GetName().replace("_","#"));
											// ///@fixme 因为这个问题需要文案专员记录下来所有有问题的本体。
											// ///所以不再弹窗影响progress了。但是在SppBuild真个运行完之后，
											// ///会报错期间遇到的所有41号错误，这是在Python端处理的。
											// //alert("Error Code 41 : Please check UV info.\n",
											// //	"Current input file : " , Ctx.inputfile);
											// exit();
										}
										else
										{
											var unum = Math.round(uv[0][0]*10000)/10000;//x
											var vnum = Math.round(uv[0][1]*10000)/10000;//y
											//<uv u='1' v='1'/>
											if(unum ==1 && vnum ==1)
											{
												hudarr[0][0] = Math.round(vert[0]*10000)/10000;
												hudarr[0][1] = Math.round(vert[1]*10000)/10000;
												hudarr[0][2] = 1;
												hudarr[0][3] = 1;
											}
											//<uv u='0' v='1'/>
											else if(unum ==0 && vnum ==1)
											{
												hudarr[1][0] = Math.round(vert[0]*10000)/10000;
												hudarr[1][1] = Math.round(vert[1]*10000)/10000;
												hudarr[1][2] =  0;
												hudarr[1][3] =  1;
											}
											//<uv u='0' v='0'/>
											else if(unum == 0 && vnum == 0)
											{
												hudarr[2][0] = Math.round(vert[0]*10000)/10000;
												hudarr[2][1] = Math.round(vert[1]*10000)/10000;
												hudarr[2][2] =  0;
												hudarr[2][3] =  0;
											}
											//<uv u='1' v='0'/>
											else if(unum == 1 && vnum == 0)
											{
												hudarr[3][0] = Math.round(vert[0]*10000)/10000;
												hudarr[3][1] = Math.round(vert[1]*10000)/10000;
												hudarr[3][2] =  1;
												hudarr[3][3] =  0;
											}	
										}
										vim[face[idx]]=1;
									}
								}	
							}
							for(var i = 0;i < 4;i++)
							{
								xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
								xc.value="v";
								xc.SetAttribute("x",hudarr[i][0]);
								xc.SetAttribute("y",hudarr[i][1]);
								xcuv = params.CreateChild(xmlDocument.NODE_ELEMENT);
								xcuv.value="uv";
								xcuv.SetAttribute("u",hudarr[i][2]);
								xcuv.SetAttribute("v",hudarr[i][3]);
							}
						}catch(e)
						{
							alert("The fac " + factName + "'s face num is too many!");
						}
						//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
						var fl=VFS.Open("outputpath/factories/" + factName + ".xml",VFS.WRITE);
						xmlt.WritetoFile(fl);
					}
			
				}
				else
				{
					if(!VFS.Exists("outputpath/factories/" + factName + ".xml"))
					{
						//将mesh的信息写入factory中
						vim=new Array(mesh.numVertices);
						try{
							if(mesh.twoSide)
							{
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
											xc.SetAttribute("y",Math.round(vert[1]*10000)/10000);
											xc.SetAttribute("z",Math.round(vert[2]*10000)/10000);
										}
										if(uv!=undefined)
										{
											if(typeof(uv[0]) == "undefined")
											{
												// ticket:1239
												System.exitcode = 40;
												alert("Error Code 40 : check uv.\n",
													"Current input file : " , Ctx.inputfile);
												alert("The uv error mesh name is : " + factName);
												exit();
											}
											else
											{
												xc.SetAttribute("u",Math.round(uv[0][0]*10000)/10000);
												xc.SetAttribute("v",Math.round(uv[0][1]*10000)/10000);
											}
										}
										if(norm!=undefined)
										{
											xc.SetAttribute("nx",Math.round(norm[0]*10000)/10000);
											xc.SetAttribute("ny",Math.round(norm[1]*10000)/10000);
											xc.SetAttribute("nz",Math.round(norm[2]*10000)/10000);
										}
									}
									for(idx =0; idx <= 2;idx++)
									{
										//alert(idx + ":" +face[idx]);
										if(vim[face[idx]] != 1)
										{
											xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
											xc.value="v";
											vert = mesh.GetVertices(face[idx]);
											//alert(vert);
											uv = mesh.GetTextureCoords(face[idx]);
											
											///@ticket:1243 模型有问题，获取不到UV信息。
											if(typeof(uv) == "undefined")
											{
												System.exitcode = 41;
												errorcode_41 += "Error Code 41 : Please check UV info for mesh" + ainode.GetName().replace("_","#") + "\n";
												return;
												// alert("Error Code 41 : Please check UV info for mesh" + ainode.GetName().replace("_","#"));
												// ///@fixme 因为这个问题需要文案专员记录下来所有有问题的本体。
												// ///所以不再弹窗影响progress了。但是在SppBuild真个运行完之后，
												// ///会报错期间遇到的所有41号错误，这是在Python端处理的。
												// //alert("Error Code 41 : Please check UV info.\n",
												// //	"Current input file : " , Ctx.inputfile);
												// exit();
											}
											
											norm = mesh.GetNormals(face[idx]);
											setAttr(xc,vert,uv,norm);
											vim[face[idx]]=1;
										}
									}

									xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
									xc.value="t";
									xc.SetAttribute("v1",face[0]);                
									xc.SetAttribute("v2",face[1]);
									xc.SetAttribute("v3",face[2]);
									//add twoside
									{
										var xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
										xc.value="t";
										xc.SetAttribute("v1",face[2]);                
										xc.SetAttribute("v2",face[1]);
										xc.SetAttribute("v3",face[0]);
									}
								}
							}
							else
							{
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
											xc.SetAttribute("y",Math.round(vert[1]*10000)/10000);
											xc.SetAttribute("z",Math.round(vert[2]*10000)/10000);
										}
										if(uv!=undefined)
										{
											if(typeof(uv[0]) == "undefined")
											{
												// ticket:1239
												System.exitcode = 40;
												alert("Error Code 40 : check uv.\n",
													"Current input file : " , Ctx.inputfile);
												alert("The uv error mesh name is : " + factName);
												exit();
											}
											else
											{
												xc.SetAttribute("u",Math.round(uv[0][0]*10000)/10000);
												xc.SetAttribute("v",Math.round(uv[0][1]*10000)/10000);
											}
										}
										if(norm!=undefined)
										{
											xc.SetAttribute("nx",Math.round(norm[0]*10000)/10000);
											xc.SetAttribute("ny",Math.round(norm[1]*10000)/10000);
											xc.SetAttribute("nz",Math.round(norm[2]*10000)/10000);
										}
									}
									for(idx =0; idx <= 2;idx++)
									{
										//alert(idx + ":" +face[idx]);
										if(vim[face[idx]] != 1)
										{
											xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
											xc.value="v";
											vert = mesh.GetVertices(face[idx]);
											//alert(vert);
											uv = mesh.GetTextureCoords(face[idx]);
											
											///@ticket:1243 模型有问题，获取不到UV信息。
											if(typeof(uv) == "undefined")
											{
												System.exitcode = 41;
												errorcode_41 += "Error Code 41 : Please check UV info for mesh" + ainode.GetName().replace("_","#") + "\n";
												return;
												// alert("Error Code 41 : Please check UV info for mesh" + ainode.GetName().replace("_","#"));
												// ///@fixme 因为这个问题需要文案专员记录下来所有有问题的本体。
												// ///所以不再弹窗影响progress了。但是在SppBuild真个运行完之后，
												// ///会报错期间遇到的所有41号错误，这是在Python端处理的。
												// //alert("Error Code 41 : Please check UV info.\n",
												// //	"Current input file : " , Ctx.inputfile);
												// exit();
											}
											
											norm = mesh.GetNormals(face[idx]);
											setAttr(xc,vert,uv,norm);
											vim[face[idx]]=1;
										}
									}

									xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
									xc.value="t";
									xc.SetAttribute("v1",face[0]);                
									xc.SetAttribute("v2",face[1]);
									xc.SetAttribute("v3",face[2]);
								}
							}
						}catch(e)
						{
							alert("The fac " + factName + "'s face num is too many!");
						}
						//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
						var fl=VFS.Open("outputpath/factories/" + factName + ".xml",VFS.WRITE);
						xmlt.WritetoFile(fl);
					}
				}
			}
		}
	} // end of `pfac` function
	
	
//})();
