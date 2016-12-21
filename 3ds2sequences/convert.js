try{
	load("convertproc.js");
	require("convertproc.js");
	var callbacks = {
	
		onTextureAdd:function(textures,material)
		{
			for(it = 0;it < material.GetTextureCount();it++)
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				if(texture == undefined)
				{
					alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
				}
				else
				{
					if(ifeffect == 'N')
					{
						//alert(VFS.GetRealPath(FindRealName(allfilenames,texture.path)));
						//VFS.Copy(FindRealName(allfilenames,texture.path),"outputpath/textures/"+FindRealName(allfilenames,texture.path));
						//修改其中的textures信息
						texturen = textures.CreateChild(tworldxml.NODE_ELEMENT);
						texturen.value="texture";
						texturen.SetAttribute("name",FindRealName(allfilenames,texture.path));
						texturef = texturen.CreateChild(tworldxml.NODE_ELEMENT);
						texturef.value="file";
						tfn = texturef.CreateChild(tworldxml.NODE_TEXT);
						tfn.value = usepath+"/textures/"+FindRealName(allfilenames,texture.path);
					}
					else
					{
						if(ifeffect == 'Y')
						{
							//alert(VFS.GetRealPath(FindRealName(allfilenames,texture.path)));
							VFS.Copy(FindRealName(allfilenames,texture.path),"outputpath/textures/"+FindRealName(allfilenames,texture.path));
							//修改其中的textures信息
							texturen = textures.CreateChild(tworldxml.NODE_ELEMENT);
							texturen.value="texture";
							texturen.SetAttribute("name",FindRealName(allfilenames,texture.path));
							texturef = texturen.CreateChild(tworldxml.NODE_ELEMENT);
							texturef.value="file";
							tfn = texturef.CreateChild(tworldxml.NODE_TEXT);
							tfn.value = usepath+"/textures/"+FindRealName(allfilenames,texture.path);
							
							if(VFS.Exists("n"+FindRealName(allfilenames,texture.path)))
							{
								VFS.Copy("n"+FindRealName(allfilenames,texture.path),"outputpath/textures/"+"n"+FindRealName(allfilenames,texture.path));
								//修改其中的textures信息
								texturen = textures.CreateChild(tworldxml.NODE_ELEMENT);
								texturen.value="texture";
								texturen.SetAttribute("name",FindRealName(allfilenames,texture.path));
								texturef = texturen.CreateChild(tworldxml.NODE_ELEMENT);
								texturef.value="file";
								tfn = texturef.CreateChild(tworldxml.NODE_TEXT);
								tfn.value = usepath+"/textures/"+"n"+FindRealName(allfilenames,texture.path);
							}
							
							
							if(VFS.Exists("s"+FindRealName(allfilenames,texture.path)))
							{
								VFS.Copy("s"+FindRealName(allfilenames,texture.path),"outputpath/textures/"+"s"+FindRealName(allfilenames,texture.path));
								//修改其中的textures信息
								texturen = textures.CreateChild(tworldxml.NODE_ELEMENT);
								texturen.value="texture";
								texturen.SetAttribute("name","s"+FindRealName(allfilenames,texture.path));
								texturef = texturen.CreateChild(tworldxml.NODE_ELEMENT);
								texturef.value="file";
								tfn = texturef.CreateChild(tworldxml.NODE_TEXT);
								tfn.value = usepath+"/textures/"+"s"+FindRealName(allfilenames,texture.path);
							}
							
							if(VFS.Exists("h"+FindRealName(allfilenames,texture.path)))
							{
								VFS.Copy(FindRealName(allfilenames,texture.path),"outputpath/textures/"+"h"+FindRealName(allfilenames,texture.path));
								//修改其中的textures信息
								texturen = textures.CreateChild(tworldxml.NODE_ELEMENT);
								texturen.value="texture";
								texturen.SetAttribute("name",FindRealName(allfilenames,texture.path));
								texturef = texturen.CreateChild(tworldxml.NODE_ELEMENT);
								texturef.value="file";
								tfn = texturef.CreateChild(tworldxml.NODE_TEXT);
								tfn.value = usepath+"/textures/"+"h"+FindRealName(allfilenames,texture.path);
							}
						}
					}
				}
			}
		},
	    onMaterialAdd:function(materialnode,material)
		{
			if(ifeffect == 'N')
			{
				materialnode.value="material";
				materialnode.SetAttribute("name","Material_"+material.GetPropertyName(0)+"_"+meshnamef);
				for(it = 0;it < material.GetTextureCount();it++)
				{
					texture = material.GetTexture(material.DIFFUSE,it);
					if(texture == undefined)
					{
						alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
						texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
						texturenode.value="texture";
						tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
						tpn.value = "no";
					}
					else
					{
						texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
						texturenode.value="texture";
						tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
						tpn.value = FindRealName(allfilenames,texture.path);
					}
				}
				if(!material.GetTextureCount())
				{
					texture = material.GetTexture(material.DIFFUSE,it);
					texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
					texturenode.value="texture";
					tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
					tpn.value = "no";
				}
			}
			else
			{
			
				if(ifeffect=="Y")
				{
					if(ifmaterialDef == true)
					{
						var materialnt = FindMaterial(mtldefmaterials,"Material_"+material.GetPropertyName(0)+"_"+meshnamef);
						if(materialnt != undefined)
						{
							if(!CopyNode(materialn,materialnt))
							{
								alert("Material Node copy error!");
							}
						}
						else
						{
							materialn.value="material";
							materialn.SetAttribute("name","Material_"+material.GetPropertyName(0)+"_"+meshnamef);
							for(it = 0;it < material.GetTextureCount();it++)
							{
								texture = material.GetTexture(material.DIFFUSE,it);
								if(texture == undefined)
								{
									alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
								}
								texturenode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
								texturenode.value="texture";
								tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
								tpn.value = FindRealName(allfilenames,texture.path);
							}
							if(!material.GetTextureCount())
							{
								texture = material.GetTexture(material.DIFFUSE,it);
								texturenode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
								texturenode.value="texture";
								tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
								tpn.value = "no";
							}
							
							
							
							if(texture == undefined)
							{
								alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
							}
							else
							{
								shadernode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
								shadernode.value="shader";
								shadernode.SetAttribute("type","diffuse");
								tsn = shadernode.CreateChild(tworldxml.NODE_TEXT);
								tsn.value = "parallaxAtt";
								
								
								//<shadervar type="texture" name="tex normal">nb_0001.jpg</shadervar>
								
								
								if(VFS.Exists("n"+FindRealName(allfilenames,texture.path)))
								{
									shadervarnode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
									shadervarnode.value="shadervar";
									shadervarnode.SetAttribute("type","texture");
									shadervarnode.SetAttribute("name","tex normal");
									tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
									tsn.value = "n"+FindRealName(allfilenames,texture.path);
								}	
								
								//<shadervar type="texture" name="tex specular">sg_0001.jpg</shadervar>
								
								if(VFS.Exists("s"+FindRealName(allfilenames,texture.path)))
								{
									shadervarnode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
									shadervarnode.value="shadervar";
									shadervarnode.SetAttribute("type","texture");
									shadervarnode.SetAttribute("name","tex specular");
									tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
									tsn.value = "s"+FindRealName(allfilenames,texture.path);
								}
								
								
								
								//<shadervar type="texture" name="tex height">tb_0001.jpg</shadervar>
								if(VFS.Exists("h"+FindRealName(allfilenames,texture.path)))
								{
									shadervarnode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
									shadervarnode.value="shadervar";
									shadervarnode.SetAttribute("type","texture");
									shadervarnode.SetAttribute("name","tex height");
									tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
									tsn.value = "h"+FindRealName(allfilenames,texture.path);
								}
							}
						}
					}
					else
					{
						materialn.value="material";
						materialn.SetAttribute("name","Material_"+material.GetPropertyName(0)+"_"+meshnamef);
						for(it = 0;it < material.GetTextureCount();it++)
						{
							texture = material.GetTexture(material.DIFFUSE,it);
							if(texture == undefined)
							{
								alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
							}
							texturenode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
							texturenode.value="texture";
							tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
							tpn.value = FindRealName(allfilenames,texture.path);
						}
						if(!material.GetTextureCount())
						{
							texture = material.GetTexture(material.DIFFUSE,it);
							texturenode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
							texturenode.value="texture";
							tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
							tpn.value = "no";
						}
						
						
						
						if(texture == undefined)
						{
							alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
						}
						else
						{
							shadernode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
							shadernode.value="shader";
							shadernode.SetAttribute("type","diffuse");
							tsn = shadernode.CreateChild(tworldxml.NODE_TEXT);
							tsn.value = "parallaxAtt";
							
							
							//<shadervar type="texture" name="tex normal">nb_0001.jpg</shadervar>
							
							if(VFS.Exists("n"+FindRealName(allfilenames,texture.path)))
							{
								shadervarnode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex normal");
								tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
								tsn.value = "n"+FindRealName(allfilenames,texture.path);
							}	
							
							//<shadervar type="texture" name="tex specular">sg_0001.jpg</shadervar>
							
							
							if(VFS.Exists("s"+FindRealName(allfilenames,texture.path)))
							{
								shadervarnode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex specular");
								tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
								tsn.value = "s"+FindRealName(allfilenames,texture.path);
							}
							
							
							
							//<shadervar type="texture" name="tex height">tb_0001.jpg</shadervar>
							if(VFS.Exists("h"+FindRealName(allfilenames,texture.path)))
							{
								shadervarnode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex height");
								tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
								tsn.value = "h"+FindRealName(allfilenames,texture.path);
							}
						}
					}
				}
				else
				{
					alert("ifeffect error!");
				}
			}
		},
		onCameraAdd:function(startw,wcamera)
		{
			startw.value = "start";
			startw.SetAttribute("name","Camera");
			sectors = startw.CreateChild(tworldxml.NODE_ELEMENT);
			sectors.value = "sector";
			scenes = sectors.CreateChild(tworldxml.NODE_TEXT);
			scenes.value = "Scene";				
			if(wcamera == undefined)
			{
				position = startw.CreateChild(tworldxml.NODE_ELEMENT);
				position.value = "position";
				position.SetAttribute("x","8.6592");          
				position.SetAttribute("y","5.1716");
				position.SetAttribute("z","-4.595");
				up = startw.CreateChild(tworldxml.NODE_ELEMENT);
				up.value = "up";
				up.SetAttribute("x","-0.3307");          
				up.SetAttribute("y","0.8953");
				up.SetAttribute("z","0.2984");
				forward = startw.CreateChild(tworldxml.NODE_ELEMENT);
				forward.value = "forward";
				forward.SetAttribute("x","-0.6549");
				forward.SetAttribute("y","-0.4452");
				forward.SetAttribute("z","0.6107");
			}
			else
			{
				position = startw.CreateChild(tworldxml.NODE_ELEMENT);
				position.value = "position";
				position.SetAttribute("x",wcamera.position[0]);          
				position.SetAttribute("y",wcamera.position[1]);
				position.SetAttribute("z",wcamera.position[2]);
				up = startw.CreateChild(tworldxml.NODE_ELEMENT);
				up.value = "up";
				up.SetAttribute("x",wcamera.up[0]);          
				up.SetAttribute("y",wcamera.up[1]);
				up.SetAttribute("z",wcamera.up[2]);
				forward = startw.CreateChild(tworldxml.NODE_ELEMENT);
				forward.value = "forward";
				forward.SetAttribute("x",wcamera.lookAt[0]);
				forward.SetAttribute("y",wcamera.lookAt[1]);
				forward.SetAttribute("z",wcamera.lookAt[2]);
			}
		},
		onLightAdd:function(light,wlight)
		{
			light.value = "light";
			light.SetAttribute("name","Lamp");
			if(wlight != undefined)
			{
				lcenter = light.CreateChild(tworldxml.NODE_ELEMENT);
				lcenter.value = "center";
				lcenter.SetAttribute("x","4.0762");          
				lcenter.SetAttribute("y","5.9039");
				lcenter.SetAttribute("z","1.0055");
				
				lcolor = light.CreateChild(tworldxml.NODE_ELEMENT);
				lcolor.value = "color";
				lcolor.SetAttribute("red",  "1.0");          
				lcolor.SetAttribute("green","1.0");
				lcolor.SetAttribute("blue", "1.0");
				
				lradius = light.CreateChild(tworldxml.NODE_ELEMENT);
				lradius.value = "radius";
				lradius.SetAttribute("brightness",  "1.0"); 
				lradiusv = lradius.CreateChild(tworldxml.NODE_TEXT);
				lradiusv.value = "29.9999828339";
			}
			else
			{
				lcenter = light.CreateChild(tworldxml.NODE_ELEMENT);
				lcenter.value = "center";
				//lcenter.SetAttribute("x",wlight.);          
				//lcenter.SetAttribute("y",wlight.);
				//lcenter.SetAttribute("z",wlight.);
				
				lcolor = light.CreateChild(tworldxml.NODE_ELEMENT);
				lcolor.value = "color";
				lcolor.SetAttribute("red",  "1.0");          
				lcolor.SetAttribute("green","1.0");
				lcolor.SetAttribute("blue", "1.0");
				
				lradius = light.CreateChild(tworldxml.NODE_ELEMENT);
				lradius.value = "radius";
				lradius.SetAttribute("brightness",  "1.0"); 
				lradiusv = lradius.CreateChild(tworldxml.NODE_TEXT);
				lradiusv.value = "29.9999828339";
			}
		}
		//PorcNormalHeight(mat);
		//ProcShader();
		//ProcExternalChange(xml):
		//ProcSpecular(mat);
		//....
		//self code.
	 }
	 
	//参数获取部分
	var inputfile = CmdLine.GetOption("input");
	var outputpath = CmdLine.GetOption("output");
	var usepath = CmdLine.GetOption("usepath");
	var ifeffect = CmdLine.GetOption("effect");
	var materialDef = CmdLine.GetOption("materialDef");
	
	//参数处理部分
	
	//materialDef路径
	var ifmaterialDef=false;
	var mtldefmaterials;
	if(materialDef != undefined)
	{
		ifmaterialDef = true;
		var fl = materialDef.length;
		for(;fl>=0;fl--)
		{
			if(materialDef[fl] == '\\')
			{
				break;
			}
		}
		mtldefpath = materialDef.substr(0,fl+1);
		mtldefname = materialDef.substr(fl+1,materialDef.length);
		VFS.Mount("/",mtldefpath);
		
		mtldefxml = new xmlDocument();
		mtldeffile = VFS.Open(mtldefname);
		if(!mtldeffile)
		{
			alert("can not open the materialDef file");
		}
		mtldefxml.Parse(mtldeffile);
		mtldefworld = mtldefxml.root.GetChild("world");
		mtldefmaterials = mtldefworld.GetChild("materials");		
	}
	//应用路径
	if(usepath==undefined || usepath==true)
	{
		usepath="";
	}
	//效果部分
	if(ifeffect==undefined || ifeffect==true)
	{
		ifeffect="N";
	}
	//输入文件路径处理
	var  fl = inputfile.length;
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
	//相应路径挂载
	VFS.Mount("/",inputpath);
	VFS.Mount("/",inputpath+"new\\");
	VFS.Mount("/",inputpath+"normal\\");
	VFS.Mount("/",inputpath+"height\\");
	VFS.Mount("/",inputpath+"specular\\");
	VFS.Mount("outputpath",outputpath);
	//获取输入路径下所有文件名称
	var allfilenames = VFS.FindFiles("/");
	
	//打开并解析“模板”world文件
	var tworldxml = new xmlDocument();
	var tworldfile = VFS.Open("world");
	if(tworldfile == undefined)
	{
		alert("can not open the world file");
		System.Quit();
	}
	tworldxml.Parse(tworldfile);
	tworld = tworldxml.root.GetChild("world");
	load("convertimpoter.js");
	require("convertimpoter.js");

	
	
}catch(e){
    alert('error:',e);
}

System.Quit();