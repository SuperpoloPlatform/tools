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
		scene = importer.ReadFile(filename, (importer.TargetRealtime_MaxQuality | importer.FlipUVs | importer.ConvertToLeftHanded | importer.JoinIdenticalVertices));//& !importer.JoinIdenticalVertices);		//alert(scene);
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
		
		// 这个数组保存所有mesh的index信息。
		// @fixme 但是保存这些index是做什么用呢？
		var mesharr = new Array();
		
		var iReporter = Registry.Get("iReporter");
		
		if(convertmode == "scene")
		{
			System.Report("Current convert mode is scene",
				iReporter.DEBUG/* 4 */, "");
			System.Report("Iterate every node of scene tree of 3ds file.",
				iReporter.DEBUG/* 4 */, "");
			
			//将factory的引用信息写入到world文件当中
			for(var jr = 0; jr < scene.rootNode.numChildren; jr++)
			{
				var ainode = scene.rootNode.GetChildren(jr)
				var aiNodeName = ainode.GetName();
				
				System.Report("the name of aiNode is " + aiNodeName,
					iReporter.DEBUG/* 4 */, "");
				
				if(ainode.GetMeshIndex() == undefined)
				{
					System.Report("`ainode.GetMeshIndex()` is undefined.",
						iReporter.DEBUG/* 4 */, "");
					continue;
				}
				
				for(var mci = 0; mci < ainode.GetMeshIndex().length; mci++)
				{
					var meshIndex = ainode.GetMeshIndex(mci);
					var mesh = scene.GetMeshes(meshIndex);
					var meshName = mesh.GetName();
					
					System.Report("mesh name : " + meshName +
						" mesh index : " + meshIndex,
						iReporter.DEBUG/* 4 */, "");
					
					//alert(jr);
					//alert(scene.rootNode.GetChildren(jr).GetMeshIndex());
					//修改其中的library信息
					if(Checkmesh(mesharr, meshIndex))
					{
					    // ref ticket:1152
                        // 现在存在一种bug，在雍和宫的项目中发现的，就是aiNode名称和mesh名称不一致。
                        // @fixme 这里虽然没有解决问题，但是需要给出alert提示，程序仍然往下执行
                        // 而且使用aiNode name作为本体名称。
                        if(importer.GetFactName(aiNodeName) !=
                            importer.GetFactName(meshName)
                        ) {
							//@fixme 一旦注释掉了这块代码，就有可能忽视这段错误。
							// 还是有必要去研究明白为什么ainode name和mesh name不同。
							//@ref ticket:1240
                           /*  alert("[Warning] please double check mesh [" + aiNodeName + "],\n",
                                "aiNode name is " + aiNodeName + "\n",
                                "mesh name is " + meshName + "\n",
                                "mailto:chenyang@masols.com if you cant fix this warning."); */
                            meshName = aiNodeName;
                        } else {
    						System.Report("mesh index already exist in array. " +
    							"Skip this mesh.",
    							iReporter.DEBUG/* 4 */, "");
    						continue;
    					}
					}
					
                        
					
					// 在整个3ds文件中寻找该mesh
					var marr = importer.FindMeshName(scene, meshName);
					// var pos = meshName.indexOf("#");
					// var factName = meshName.substring(0,pos);
					var factName = importer.GetFactName(meshName);
					for(var mari in marr)
					{
						mesharr.push(marr[mari]);
					}
					
					// 如果factorylib.xml文件中已经包含了该本体，则跳过。
					if(CheckLibrary(librarys, usepath+"/" + "factories/" + factName + ".xml"))
					{
						System.Report("there is already a [" +
							factName + ".xml] in factorylib.xml. " +
							"Skip this mesh.",
							iReporter.DEBUG/* 4 */, "");
						continue;
					}
					libraryw = librarys.CreateChild(xmlDocument.NODE_ELEMENT);
					libraryw.value = "library";
					tln = libraryw.CreateChild(xmlDocument.NODE_TEXT);
					tln.value = usepath+"/"+"factories/" + factName + ".xml";
					
					// 场景拆分之后的factorylibN.xml文件。
					var librarywN = librarysN.CreateChild(xmlDocument.NODE_ELEMENT);
					librarywN.value = "library";
					var tlnN = librarywN.CreateChild(xmlDocument.NODE_TEXT);
					tlnN.value = usepath + "/" + "factories/" + factName + ".xml";
				}
				
			}
			
			// debug的时候场景的地方停一下。
			if(CmdLine.GetOption('chenyang',0))
			{
				alert("pause to view debug info.");
			}
		}
		
		mesharr = [];
		//导出场景时添加所有meshobj
		if(convertmode == "scene")
		{
			var lights = scene.GetLights();
			var sector = tworld.GetChild("sector");
			var sectorSector = tWorldSector.GetChild("sector");
			if(lights != undefined)
			{
				for(var i=0;i<lights.length;i++)
				{
					callbacks.onLightAdd(sector, lights[i]);
					callbacks.onLightAdd(sectorSector, lights[i]);
				}
			}
			for(var jr=0;jr<scene.rootNode.numChildren;jr++)
			{
				if(scene.rootNode.GetChildren(jr).GetMeshIndex() != undefined)
				{
					cvscene(scene.rootNode.GetChildren(jr), tworld);
					cvscene(scene.rootNode.GetChildren(jr), tWorldSector);
				}
			}
		}

		else if(convertmode == "factory")
		{
			//根据条件判断
			for(var jr=0;jr<scene.rootNode.numChildren;jr++)
			{
				pscene(scene.rootNode.GetChildren(jr),matlibrarys);
			}
		}
		else if(convertmode == "uv_lightmap")
		{
			for(var jr=0;jr<scene.rootNode.numChildren;jr++)
			{
				cvlightmapuv(scene.rootNode.GetChildren(jr),tworld);
			}
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
	 * @param root -- <code>factorylib.xml</code>的<code><library></code>节点
	 * @param Libraryename -- 本体的文件路径，比如<code>/factories/box.xml</code>
	 */
	function CheckLibrary(root, Libraryename)
	{
		var Librarys = root.GetChildren();
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
	
	
	function CheckMeshObj(root, meshname)
	{
		var MeshObjs = root.GetChild("sector").GetChildren();
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
	
	
	function cvlightmapuv(ainode,world)
	{
		// alert(world);
		// alert(ainode.GetName());
		var sector = world.GetChild("sector");
		var meshobj = FindMeshObj(sector,ainode.GetName());
		// alert(meshobj);
		var params;
		if(meshobj != false)
		{
		
			//<shadervar name="tex lightmap" type="texture">lightmaps_art_0_png</shadervar>
			var shadervar = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
			shadervar.value="shadervar";
			shadervar.SetAttribute("name","tex lightmap");
			shadervar.SetAttribute("type","texture");
			var shadervartex = shadervar.CreateChild(xmlDocument.NODE_TEXT);
			shadervartex.value = ainode.GetName() + ".png"
			
			
			// <texture name="lightmaps_art_0_png">
			  // <class>lightmap</class>
			  // <file>/art/lightmaps/art_0.png</file>
			  // <mipmap>no</mipmap>
			// </texture>
			var texs = matlibrarys.GetChild("textures");
			var tex = texs.CreateChild(xmlDocument.NODE_ELEMENT);
			tex.value = "texture";
			tex.SetAttribute("name",ainode.GetName() + ".png");
			var texcalss = tex.CreateChild(xmlDocument.NODE_ELEMENT);
			texcalss.value = "class";
			var calssvalue = texcalss.CreateChild(xmlDocument.NODE_TEXT);
			calssvalue.value = "lightmap";
			var texfile = tex.CreateChild(xmlDocument.NODE_ELEMENT);
			texfile.value = "file";
			var filevalue = texfile.CreateChild(xmlDocument.NODE_TEXT);
			filevalue.value = usepath+ "/lightmaps/" + ainode.GetName() + ".png"
			var texmipmap = tex.CreateChild(xmlDocument.NODE_ELEMENT);
			texmipmap.value = "mipmap";
			var mipmapvalue = texmipmap.CreateChild(xmlDocument.NODE_TEXT);
			mipmapvalue.value = "no";
			
			var lightmap_src = "/lightmap/" + ainode.GetName() + ".png";
			if (!VFS.Exists(lightmap_src))
			{
				//找不到对应的lightmap
				alert("Error Code 44 : 找不到对应的lightmap\n",
				"lightmap file : ", lightmap_src);
				exit();
			}
			
			VFS.Copy(lightmap_src, "outputpath/lightmaps/" + ainode.GetName() + ".png");
			
		 //add renderbuffer
		 
			params = meshobj.GetChild("params");
		 	if(filename.substr(0,6) == "light_")
			{//处理lightmap的uv
				// alert(filename.length-4);
				// alert(filename.substr(6,filename.length-10));
				//<renderbuffer components="2" name="texture coordinate lightmap" type="float">
				renderbuffer = params.CreateChild(xmlDocument.NODE_ELEMENT);
				renderbuffer.value="renderbuffer";
				renderbuffer.SetAttribute("components",2);
				renderbuffer.SetAttribute("name","texture coordinate lightmap");
				renderbuffer.SetAttribute("type","float");
				
				
				if(ainode.GetMeshIndex() != undefined)
				{
					for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
					{
						if(Checkmesh(mesharr,ainode.GetMeshIndex(mci)))
						{
							continue;
						}
				
				
						mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
						var mar = importer.FindMeshName(scene,mesh.GetName());
						if(mar.length>1)
						{
							for(var meshi in mar)
							{
								var meshindex = mar[meshi];
								mesharr.push(meshi);
								var mesh = scene.GetMeshes(meshindex);

								//将mesh信息写入到xml中
								
								
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
											xc.SetAttribute("c0",Math.round(uv[0][0]*10000)/10000);
											xc.SetAttribute("c1",Math.round(uv[0][1]*10000)/10000);
											vim[face[idx]]=1;
										}
									}
								}
							}
						}
						else
						{
							vim=new Array(mesh.numVertices);
							for(var i=0;i<mesh.numFaces;i++)
							{
								face = mesh.GetFaces(i);
								if(face == undefined)
								{
									alert("error face");
									continue;
								}
								var setAttr = function(xc,uv){

									
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
										
										///@ticket:1243 模型有问题，获取不到UV信息。
										if(typeof(uv) == "undefined")
										{
											System.exitcode = 41;
											///@fixme 因为这个问题需要文案专员记录下来所有有问题的本体。
											///所以不再弹窗影响progress了。但是在SppBuild真个运行完之后，
											///会报错期间遇到的所有41号错误，这是在Python端处理的。
											//alert("Error Code 41 : Please check UV info.\n",
											//	"Current input file : " , Ctx.inputfile);
											exit();
										}
										
										
										if(uv!=undefined)
										{
											if(typeof(uv[0]) == "undefined")
											{
												// ticket:1239
												System.exitcode = 40;
												alert("Error Code 40 : check uv.\n",
													"Current input file : " , Ctx.inputfile);
												exit();
											}
											else
											{
												xc.SetAttribute("c0",Math.round(uv[0][0]*10000)/10000);
												xc.SetAttribute("c1",Math.round(uv[0][1]*10000)/10000);
											}
										}
										vim[face[idx]]=1;
									}
								}
							}
						}
						
					}
				}
			}
		}
		else
		{
		 //can not find the meshobj
		}
		
	}
	
	
	
	
	//导出场景函数
	function cvscene(ainode,world)
	{
		if(CheckMeshObj(world,ainode.GetName()))
		{
		    System.exitcode = 23;
			alert("Error Code 23 : meshobj with the name " + ainode.GetName() + " is exists!");
			exit();
		}
		var pos = ainode.GetName().indexOf("#");
		var factName = ainode.GetName().substring(0,pos);
		if(!VFS.Exists("outputpath/factories/"+factName+".xml"))
		{
			System.exitcode = 24;
			alert("Error Code 24 : can not find the factory file [",
				factName + ".xml]");
			exit();
		}
		else
		{
			sector = world.GetChild("sector");
			meshobj = sector.CreateChild(xmlDocument.NODE_ELEMENT);
			meshobj.value = "meshobj";
			meshobj.SetAttribute("name",ainode.GetName());
			plugin = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
			plugin.value = "plugin";
			tplg = plugin.CreateChild(xmlDocument.NODE_TEXT);
			//tplg.value = "crystalspace.mesh.loader.genmesh";
			//add effect判断mesh是否是hud效果,若是world.xml中meshobj要修改插件名称
			var issprtadd = false;
			if(callbacks.Choice["mergexmls"]){
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
			movew = meshobj.CreateChild(xmlDocument.NODE_ELEMENT);
			movew.value = "move";
			movecv = movew.CreateChild(xmlDocument.NODE_ELEMENT);
			movecv.value = "v";
			movecv.SetAttribute("x",ainode.matrix[0][3]);
			movecv.SetAttribute("y",-ainode.matrix[2][3]);
			movecv.SetAttribute("z",ainode.matrix[1][3]);
			
			matrix = movew.CreateChild(xmlDocument.NODE_ELEMENT);
			matrix.value = "matrix";
			
			scale = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
			scale.value = "scale";
			scale.SetAttribute("x",ainode.GetMatrix3().GetScale()[0]);
			scale.SetAttribute("y",ainode.GetMatrix3().GetScale()[2]);
			scale.SetAttribute("z",ainode.GetMatrix3().GetScale()[1]);
			
			rotx = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
			rotx.value = "rotx";
			rotxa =  rotx.CreateChild(xmlDocument.NODE_TEXT);
			rotxa.value = Math.round(ainode.GetEulerAngles()[0]*10000)/10000;
			roty = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
			roty.value = "roty";
			rotya =  roty.CreateChild(xmlDocument.NODE_TEXT);
			rotya.value = Math.round(ainode.GetEulerAngles()[2]*10000)/10000;;
			rotz = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
			rotz.value = "rotz";
			rotza =  rotz.CreateChild(xmlDocument.NODE_TEXT);
			rotza.value = Math.round(ainode.GetEulerAngles()[1]*10000)/10000;
		}
		for(var j=0;j<ainode.numChildren;j++)
		{
			//alert(ainode.numChildren);
			cvscene(ainode.GetChildren(j),world);
		}
	}
	
	
	
	//将信息写入到factory中，并在world中添加相应信息	
	function pscene(ainode,world)
	{	
		//根据aiMaterial的透明设置为mesh/submesh添加ZMODE/MIXMODE/PRIORITY/BACK2FRONT属性。
		var AddAlphaModeFromMat = function(parentNode,aiMaterial){
			var opacity = aiMaterial.GetProperty("$mat.opacity");
			if(opacity > 0.0 && opacity < 1.0)
			{//有透明通道。
				

				var mixmode = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				mixmode.value = "mixmode";
				var mixmode_ctx = mixmode.CreateChild(xmlDocument.NODE_ELEMENT);
				mixmode_ctx.value="alpha";
				var alpha_value = mixmode_ctx.CreateChild(xmlDocument.NODE_TEXT);
				alpha_value.value = 1-opacity;
				
				var zmode = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				zmode.value="ztest";

				var priority = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				priority.value = "priority";
				var priority_ctx = priority.CreateChild(xmlDocument.NODE_TEXT);
				priority_ctx.value = "alpha";

				// var back2front = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				// back2front.value = "back2front";
				// var back2front_ctx = back2front.CreateChild(xmlDocument.NODE_TEXT);
				// back2front_ctx.value = "true";
				
			}else{
			 //无透明。只设置ZMODE到zuse.
				var zmode = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				zmode.value="zuse";
			}
		};
		
		var AddAlphaNoSubMesh = function(parentNode,params,aiMaterial){
			var opacity = aiMaterial.GetProperty("$mat.opacity");
			if(opacity > 0.0 && opacity < 1.0)
			{//有透明通道。
				
				if(parentNode.value != "meshfact")
				{
				    System.exitcode = 25;
					//alert("error : the parentNode is not meshfact");
					return ;
				}
				//var params = parentNode.GetChild("params");
				
				var mixmode = params.CreateChild(xmlDocument.NODE_ELEMENT);
				mixmode.value = "mixmode";
				var mixmode_ctx = mixmode.CreateChild(xmlDocument.NODE_ELEMENT);
				mixmode_ctx.value="alpha";
				var alpha_value = mixmode_ctx.CreateChild(xmlDocument.NODE_TEXT);
				alpha_value.value = 1-opacity;
				
				var zmode = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				zmode.value="ztest";

				var priority = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				priority.value = "priority";
				var priority_ctx = priority.CreateChild(xmlDocument.NODE_TEXT);
				priority_ctx.value = "alpha";

				// var back2front = params.CreateChild(xmlDocument.NODE_ELEMENT);
				// back2front.value = "back2front";
				// var back2front_ctx = back2front.CreateChild(xmlDocument.NODE_TEXT);
				// back2front_ctx.value = "true";
				
			}else{
			 //无透明。只设置ZMODE到zuse.
				var zmode = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
				zmode.value="zuse";
			}
		};
		
		/*if(filename.substr(0,6) == "light_")
		{//处理lightmap的uv
			// alert(filename.length-4);
			// alert(filename.substr(6,filename.length-10));
			//<renderbuffer components="2" name="texture coordinate lightmap" type="float">
			xmlt=new xmlDocument();
			xmlrt=xmlt.CreateRoot();
			renderbuffer = xmlrt.CreateChild(xmlDocument.NODE_ELEMENT);
			renderbuffer.value="renderbuffer";
			renderbuffer.SetAttribute("components",2);
			renderbuffer.SetAttribute("name","texture coordinate lightmap");
			renderbuffer.SetAttribute("type","float");
			
			
			if(ainode.GetMeshIndex() != undefined)
			{
				for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
				{
					if(Checkmesh(mesharr,ainode.GetMeshIndex(mci)))
					{
						continue;
					}
			
			
					mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
					var mar = importer.FindMeshName(scene,mesh.GetName());
					if(mar.length>1)
					{
						for(var meshi in mar)
						{
							var meshindex = mar[meshi];
							mesharr.push(meshi);
							var mesh = scene.GetMeshes(meshindex);

							//将mesh信息写入到xml中
							
							
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
										xc.SetAttribute("c0",Math.round(uv[0][0]*10000)/10000);
										xc.SetAttribute("c1",Math.round(uv[0][1]*10000)/10000);
										vim[face[idx]]=1;
									}
								}
							}
						}
					}
					else
					{
						vim=new Array(mesh.numVertices);
						for(var i=0;i<mesh.numFaces;i++)
						{
							face = mesh.GetFaces(i);
							if(face == undefined)
							{
								alert("error face");
								continue;
							}
							var setAttr = function(xc,uv){

								
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
									
									///@ticket:1243 模型有问题，获取不到UV信息。
									if(typeof(uv) == "undefined")
									{
										System.exitcode = 41;
										///@fixme 因为这个问题需要文案专员记录下来所有有问题的本体。
										///所以不再弹窗影响progress了。但是在SppBuild真个运行完之后，
										///会报错期间遇到的所有41号错误，这是在Python端处理的。
										//alert("Error Code 41 : Please check UV info.\n",
										//	"Current input file : " , Ctx.inputfile);
										exit();
									}
									
									
									if(uv!=undefined)
									{
										if(typeof(uv[0]) == "undefined")
										{
											// ticket:1239
											System.exitcode = 40;
											alert("Error Code 40 : check uv.\n",
												"Current input file : " , Ctx.inputfile);
											exit();
										}
										else
										{
											xc.SetAttribute("c0",Math.round(uv[0][0]*10000)/10000);
											xc.SetAttribute("c1",Math.round(uv[0][1]*10000)/10000);
										}
									}
									vim[face[idx]]=1;
								}
							}
						}
					}
					var fl=VFS.Open("outputpath/factories/" + "light_" + mesh.GetName() + ".xml",VFS.WRITE);
					xmlt.WritetoFile(fl);
					
				}
			}
		}
		else
		{*/
		
		if(ainode.GetMeshIndex() != undefined)
		{
			for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
			{
				if(Checkmesh(mesharr,ainode.GetMeshIndex(mci)))
				{
					continue;
				}
				
				mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
				//alert(" mesh name : "+ mesh.GetName())
				// 在整个3ds文件中寻找该mesh
				var meshname = mesh.GetName();//jigaihui
				var mar = importer.FindMeshName(scene,mesh.GetName());
				//alert(mar.length);
				var meshfacnode = facprort.CreateChild(xmlDocument.NODE_ELEMENT);
				if(CheckMeshFac(facprort,mesh.GetName()))
				{
					alert("error : the mesh factory of " + mesh.GetName() + " has duplication of name by other mesh factory");
					var errornode = meshfacnode.CreateChild(xmlDocument.NODE_ELEMENT);
					errornode.value = "error";
					var errorv = errornode.CreateChild(xmlDocument.NODE_TEXT);
					errorv.value = "has duplication of name by other mesh factory";
					System.exitcode = 39 ;
					exit();
				}
				meshfacnode.value = "meshfactory";
				meshfacnode.SetAttribute("name",mesh.GetName());
				meshfacnode.SetAttribute("fromfile",inputfile);
				var numf = 0;
				var numv = 0;
				
				if(mar.length>1)
				{//同名mesh数量大于1,需要处理submesh.	
				
					if(callbacks.onIsEffect(mesh.GetName())){
						alert("不支持使用多维子材质Mesh:"+mesh.GetName()+"的水金属等特殊效果处理");
					}
					xmlt=new xmlDocument();
					xmlrt=xmlt.CreateRoot();
					library = xmlrt.CreateChild(xmlDocument.NODE_ELEMENT);
					library.value="library";
					meshfact = library.CreateChild(xmlDocument.NODE_ELEMENT);
					meshfact.value="meshfact";
					meshfact.SetAttribute("name",mesh.GetName());
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
					for(var meshi in mar)
					{
					
						var meshindex = mar[meshi];
						mesharr.push(meshi);
						var mesh = scene.GetMeshes(meshindex);
						
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
						
						if(meshi>0)
						{
							vca[meshi] = vca[meshi-1] + mesh.GetVertices().length;
						}
						else
						{
							vca[meshi] = mesh.GetVertices().length;
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

						var matname = callbacks.onMaterialAdd(materials,material,meshname);
						if(matname == null)
						{
							 System.exitcode = 41;
							exit();
							//report error and exit!!!.
						}
						
						
						materialNameMap[material.GetPropertyName(0)] = matname;
						
						///@fixme texture竟然是从callbacks.onMaterialAdd中获得的
						///不说还真不知道。
						importer.addMatetialPro(material,materialpronode,allfilenames, texture);
						
						//maxin
						//增加水 反射等特殊材质处理
						
						
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
							var setAttr = function(xc,vert,uv,norm)
							{
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
							if(meshi>0)
							{
								ec = vca[meshi-1];
							}

							xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
							xc.value="t";
							xc.SetAttribute("v1",face[0]+ec);                
							xc.SetAttribute("v2",face[1]+ec);
							xc.SetAttribute("v3",face[2]+ec);
							if(material.IsTwoSide())
							{
								var xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
								xc.value="t";
								xc.SetAttribute("v1",face[2]+ec);
								xc.SetAttribute("v2",face[1]+ec);
								xc.SetAttribute("v3",face[0]+ec);
							}
						}
					}
					
					
					
					
					for(var mari in mar)
					{
						var submesh = params.CreateChild(xmlDocument.NODE_ELEMENT);
						submesh.value="submesh";
						//<indexbuffer components="1" type="uint" indices="yes">
						var indexbuffer = submesh.CreateChild(xmlDocument.NODE_ELEMENT);
						indexbuffer.value = "indexbuffer";
						indexbuffer.SetAttribute("components",1);                
						indexbuffer.SetAttribute("type","uint");
						indexbuffer.SetAttribute("indices","yes");
						mesh = scene.GetMeshes(mar[mari]);
						
						//<material>parallaxAtt_wall-stone-parallaxwall-stone_2_d.jpg</material>
						
						
						var materialn = submesh.CreateChild(xmlDocument.NODE_ELEMENT);
						//获取当前mesh的material
						material = scene.GetMaterials(mesh.materialIndex);
						//将material信息写入factory
						materialn.value="material";
						materialv = materialn.CreateChild(xmlDocument.NODE_TEXT);
						materialv.value=materialNameMap[material.GetPropertyName(0)];
						
						//根据material为submesh添加关于透明处理的几个标签。
						AddAlphaModeFromMat(submesh,material);
						//写入submesh中引用的顶点
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
							if(mari>0)
							{
								ec = vca[mari-1];
							}
							for(var vi =0;vi < face.length; vi++)
							{
								var enode = indexbuffer.CreateChild(xmlDocument.NODE_ELEMENT);
								enode.value = "e";
								
								enode.SetAttribute("c0",face[vi]+ec);                
							}
							if(material.IsTwoSide())
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
					
					// 将该mesh（包含submesh）的面数和顶点数添加到统计中。
					Ctx.totalFaceNum = numf;
					Ctx.totalVertexNum = numv;
					
					meshfacnode.SetAttribute("numfaces", numf);
					meshfacnode.SetAttribute("numvertices", numv);
					meshfacnode.SetAttribute("numvsubmesh",mar.length);
					//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
					var fl=VFS.Open("outputpath/factories/" + mesh.GetName() + ".xml",VFS.WRITE);
					xmlt.WritetoFile(fl);
				}
				else
				{//同名mesh数量不大于1,不需要处理submesh.
					if(mesh == undefined)
					{
						System.exitcode = 29;
						//alert("error mesh");
						continue;
					}
					
					// 将该mesh（没有submesh）的面数和顶点数添加到统计中。
					Ctx.totalFaceNum = mesh.numFaces;
					Ctx.totalVertexNum = mesh.numVertices;
					
					//将当前mesh信息写入xml中
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
					meshfact.SetAttribute("name", mesh.GetName());
					plugin = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
					plugin.value="plugin";
					genmeshfact = plugin.CreateChild(xmlDocument.NODE_TEXT);
					//add effect判断是否是hud效果的mesh,若是修改meshfactory中插件
					var issprtadd = false;
					if(callbacks.Choice["mergexmls"]){
						 if(sprt.isopenxml == true)
						{
							issprtadd = sprt.IsSprt2dMesh(mesh.GetName()); 
						 }
					}
					if(issprtadd)
						genmeshfact.value="crystalspace.mesh.loader.factory.sprite.2d";//
					else
						genmeshfact.value="crystalspace.mesh.loader.factory.genmesh";
					//zuse = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
					//zuse.value="zuse";
					params = meshfact.CreateChild(xmlDocument.NODE_ELEMENT);
					params.value="params";
					materialn = params.CreateChild(xmlDocument.NODE_ELEMENT);
					//获取当前mesh的material
					material = scene.GetMaterials(mesh.materialIndex);
					//将material信息写入factory
					//修改xml文件中的materials信息
					materials = world.GetChild("materials");
					textures = world.GetChild("textures");//adjust order
					
					var matname = callbacks.onMaterialAdd(materials,material,meshname)
					//alert("STRNAME = "+ strname);//
					//alert("matname = "+matname);
					if(matname == null)
					{
						 System.exitcode = 41;
						 exit();
					}
					materialn.value="material";
					materialv = materialn.CreateChild(xmlDocument.NODE_TEXT);
					materialv.value=matname;
					
					
					
					//获取world中的textures节点
					//textures = world.GetChild("textures");
					//修改world文件中的textures信息
					if(!callbacks.onTextureAdd(textures,material))
					{
						return ;
					}
					
					
					//根据material为meshfact添加关于透明处理的几个标签。
					AddAlphaNoSubMesh(meshfact,params,material);
					
					///@fixme texture竟然是从callbacks.onMaterialAdd中获得的
					///不说还真不知道。
					importer.addMatetialPro(material, materialpronode, allfilenames, texture);
					
					
					// 增加水 发射特殊材质处理

					meshobjname=mesh.GetName();
					itextures=matlibrarys.GetChild("textures");
					callbacks.onModifyMaterial(materials,meshobjname,matname,itextures);
					////add effect判断是否是hud效果的mesh,若是修改mesh的vector位置,只留uv与xy四个即可
					var issprtadd = false;
					if(callbacks.Choice["mergexmls"]){
						 if(sprt.isopenxml == true)
						{
							issprtadd = sprt.IsSprt2dMesh(mesh.GetName()); 
						 }
					}
					if(issprtadd)
					{
						if(!VFS.Exists("outputpath/factories/" + mesh.GetName() + ".xml"))
						{
							var hudarr = new Array(4);
							for(var i=0;i<4;i++) hudarr[i]=new Array(4);
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
								for(idx =0; idx <= 2;idx++)
								{
									//alert(idx + ":" +face[idx]);
									if(vim[face[idx]] != 1)
									{
										vert = mesh.GetVertices(face[idx]);
										uv = mesh.GetTextureCoords(face[idx]);
										
										///@ticket:1243 模型有问题，获取不到UV信息。
										if(typeof(uv) == "undefined")
										{
											System.exitcode = 41;
											///@fixme 因为这个问题需要文案专员记录下来所有有问题的本体。
											///所以不再弹窗影响progress了。但是在SppBuild真个运行完之后，
											///会报错期间遇到的所有41号错误，这是在Python端处理的。
											//alert("Error Code 41 : Please check UV info.\n",
											//	"Current input file : " , Ctx.inputfile);
											exit();
										}
										else
										{
											var unum = Math.round(uv[0][0]*10000)/10000;//x
											var vnum = Math.round(uv[0][1]*10000)/10000;//y
											//<uv u='1' v='1'/>
											if(unum ==1 && vnum ==1)
											{
												hudarr[0][0] = Math.round(vert[0]*10000)/10000;
												hudarr[0][1] = -Math.round(vert[2]*10000)/10000;
												hudarr[0][2] = 1;
												hudarr[0][3] = 1;
											}
											//<uv u='0' v='1'/>
											else if(unum ==0 && vnum ==1)
											{
												hudarr[1][0] = Math.round(vert[0]*10000)/10000;
												hudarr[1][1] = -Math.round(vert[2]*10000)/10000;
												hudarr[1][2] =  0;
												hudarr[1][3] =  1;
											}
											//<uv u='0' v='0'/>
											else if(unum == 0 && vnum == 0)
											{
												hudarr[2][0] = Math.round(vert[0]*10000)/10000;
												hudarr[2][1] = -Math.round(vert[2]*10000)/10000;
												hudarr[2][2] =  0;
												hudarr[2][3] =  0;
											}
											//<uv u='1' v='0'/>
											else if(unum == 1 && vnum == 0)
											{
												hudarr[3][0] = Math.round(vert[0]*10000)/10000;
												hudarr[3][1] = -Math.round(vert[2]*10000)/10000;
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
							//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
							var fl=VFS.Open("outputpath/factories/" + mesh.GetName() + ".xml",VFS.WRITE);
							xmlt.WritetoFile(fl);
						}
				
					}
					else	//默认没有hud效果时mesh处理
					{
						if(!VFS.Exists("outputpath/factories/" + mesh.GetName() + ".xml"))
						{
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
										if(typeof(uv[0]) == "undefined")
										{
											// ticket:1239
											System.exitcode = 40;
											alert("Error Code 40 : check uv.\n",
												"Current input file : " , Ctx.inputfile);
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
										xc.SetAttribute("ny",-Math.round(norm[2]*10000)/10000);
										xc.SetAttribute("nz",Math.round(norm[1]*10000)/10000);
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
											///@fixme 因为这个问题需要文案专员记录下来所有有问题的本体。
											///所以不再弹窗影响progress了。但是在SppBuild真个运行完之后，
											///会报错期间遇到的所有41号错误，这是在Python端处理的。
											//alert("Error Code 41 : Please check UV info.\n",
											//	"Current input file : " , Ctx.inputfile);
											exit();
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
								if(material.IsTwoSide())
								{
									var xc = params.CreateChild(xmlDocument.NODE_ELEMENT);
									xc.value="t";
									xc.SetAttribute("v1",face[2]);                
									xc.SetAttribute("v2",face[1]);
									xc.SetAttribute("v3",face[0]);
								}
							}
							//VFS.WriteFile("mesh_"+ mesh.GetName() + "_" + j +".xml","",0);
							var fl=VFS.Open("outputpath/factories/" + mesh.GetName() + ".xml",VFS.WRITE);
							xmlt.WritetoFile(fl);
						}
					}
				}
			}
		}
		else
		{
			System.exitcode = 31;
			//alert("error");
		}
		
		for(var j=0;j<ainode.numChildren;j++)
		{
			//alert(ainode.numChildren);
			pscene(ainode.GetChildren(j),world);
		}
		//}
	}

/**
 * @brief 准备环境，包括
 * 1. plugins.xml
 * 2. shaders.xml
 */
function prepareEnv()
{
	///@fixme 可能使用VFS.Copy会更好一点。
	var copyXMLFile = function(fileName)
	{
		console.debug("Preparing : " + fileName);
		
		// 读取模板xml文件
		var doc = new xmlDocument();
		var srcFile = VFS.Open("tmpworldpath/" + fileName);
		if(srcFile == undefined)
		{
			System.exitcode = 21;
			alert("Error Code 21 : Can not open XML file : " + fileName);
			exit();
		}
		doc.Parse(srcFile);

		//将修改后的xml文件写到目标路径下的xml文件中
		var destFile = VFS.Open("outputpath/" + fileName, 1);
		doc.WritetoFile(destFile);
	};
	
	copyXMLFile("plugins.xml");
	copyXMLFile("shaders.xml");
}


//})();
