	if(!load("/tools/convertproc.js"))
	{
		load("convertproc.js")
	}
	//require("convertproc.js");

	var global_errorno = 0;	
	//是否导入场景中的灯光。缺省不导入灯光，使用--importlight标志来允许灯光处理。灯光处理请使用script/max/lightexport.mc.
	var flag_importLight = false;
	var callbacks = {
	
		onTextureAdd:function(textures,material)
		{
			//根据aiMaterial的相关设定，为parentNode(texture节点)添加透明相关属性。
			var AddTransparentFromMat = function(parentNode,aiMaterial){
				var opacity = aiMaterial.GetProperty("$mat.opacity");
				if(opacity == 0.0)
				{//binary mode.
					var alpha = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
					alpha.value = "alpha";
					var binary = alpha.CreateChild(xmlDocument.NODE_ELEMENT);
					binary.value = "binary";
				}else if(opacity == 1.0)
				{
					var keycolor = aiMaterial.GetProperty("$clr.ambient");
					if(typeof keycolor == "Array" && keycolor.length >= 3)
					{
						var transparent = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
						transparent.value = "transparent";
						transparent.SetAttribute("r",keycolor[0]);
						transparent.SetAttribute("g",keycolor[1]);
						transparent.SetAttribute("b",keycolor[2]);
					}
				}
			};
			
			for(it = 0;it < material.GetTextureCount();it++)
			{
				texture = material.GetTexture(material.DIFFUSE,it);
				if(texture == undefined)
				{
					alert(filename+" "+material.GetPropertyName(0)+"hasn't texture");
				}
				else
				{
					if(!VFS.Exists(texture.path))
					{
						alert("Can not found the texture "+ texture.path + " of material : " + filename+" "+material.GetPropertyName(0));
						return false;
					}
					if(CheckTexture(textures,FindRealName(allfilenames,texture.path)))
					{	
						continue;
					}
					if(ifeffect == 'N')
					{
						if(VFS.Exists(FindRealName(allfilenames,texture.path)))
						{//存在diffuse贴图。
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
							
							AddTransparentFromMat(texturen,material);
						}
					}
					else
					{
						if(ifeffect == 'Y')
						{
							if(VFS.Exists(FindRealName(allfilenames,texture.path)))
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
								
								AddTransparentFromMat(texturen,material);
							}
							
							if(VFS.Exists("n"+FindRealName(allfilenames,texture.path)))
							{
								VFS.Copy("n"+FindRealName(allfilenames,texture.path),"outputpath/textures/"+"n"+FindRealName(allfilenames,texture.path));
								//修改其中的textures信息
								texturen = textures.CreateChild(tworldxml.NODE_ELEMENT);
								texturen.value="texture";
								texturen.SetAttribute("name","n"+FindRealName(allfilenames,texture.path));
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
								texturen.SetAttribute("name","h"+FindRealName(allfilenames,texture.path));
								texturef = texturen.CreateChild(tworldxml.NODE_ELEMENT);
								texturef.value="file";
								tfn = texturef.CreateChild(tworldxml.NODE_TEXT);
								tfn.value = usepath+"/textures/"+"h"+FindRealName(allfilenames,texture.path);
							}
						}
					}
				}
			}
			return true;
		},
	    onMaterialAdd:function(materials,material)
		{
			if(CheckMaterial(materials,material.GetPropertyName(0)))
			{
				return true;
			}
			var materialnode = materials.CreateChild(tworldxml.NODE_ELEMENT);
			if(ifeffect == 'N')
			{
				materialnode.value="material";
				materialnode.SetAttribute("name",material.GetPropertyName(0));
				for(it = 0;it < material.GetTextureCount();it++)
				{
					texture = material.GetTexture(material.DIFFUSE,it);
					if(texture == undefined)
					{
						alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
						//texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
						//texturenode.value="texture";
						//tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
						//tpn.value = "no";
					}
					else
					{
						if(VFS.Exists(FindRealName(allfilenames,texture.path)))
						{
							texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
							texturenode.value="texture";
							tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
							tpn.value = FindRealName(allfilenames,texture.path);
						}
					}
				}
				if(!material.GetTextureCount())
				{
					//texture = material.GetTexture(material.DIFFUSE,it);
					//texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
					//texturenode.value="texture";
					//tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
					//tpn.value = "no";
				}
			}
			else
			{
			
				if(ifeffect=="Y")
				{
					if(ifmaterialDef == true)
					{
						var materialnt = FindMaterial(mtldefmaterials,material.GetPropertyName(0));
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
							materialn.SetAttribute("name",material.GetPropertyName(0));
							materialpronode.SetAttribute("name",material.GetPropertyName(0));
							for(it = 0;it < material.GetTextureCount();it++)
							{
								texture = material.GetTexture(material.DIFFUSE,it);
								if(texture == undefined)
								{
									alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
								}
								if(VFS.Exists(FindRealName(allfilenames,texture.path)))
								{
									texturenode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
									texturenode.value="texture";
									tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
									tpn.value = FindRealName(allfilenames,texture.path);
									
									texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
									texturepro.value="diffusetexture";
									tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
									tprof.value = usepath+"/textures/"+FindRealName(allfilenames,texture.path);
								}
							}
							if(!material.GetTextureCount())
							{
								//texture = material.GetTexture(material.DIFFUSE,it);
								//texturenode = materialn.CreateChild(tworldxml.NODE_ELEMENT);
								//texturenode.value="texture";
								//tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
								//tpn.value = "no";
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
									
									texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
									texturepro.value="normaltexture";
									tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
									tprof.value = usepath+"/textures/"+"n"+FindRealName(allfilenames,texture.path);
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
									
									texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
									texturepro.value="speculartexture";
									tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
									tprof.value = usepath+"/textures/"+"s"+FindRealName(allfilenames,texture.path);
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
									
									texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
									texturepro.value="heighttexture";
									tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
									tprof.value = usepath+"/textures/"+"h"+FindRealName(allfilenames,texture.path);
								}
							}
						}
					}
					else
					{
						materialnode.value="material";
						materialnode.SetAttribute("name",material.GetPropertyName(0));
						materialpronode.SetAttribute("name",material.GetPropertyName(0));
						for(it = 0;it < material.GetTextureCount();it++)
						{
							texture = material.GetTexture(material.DIFFUSE,it);
							if(texture == undefined)
							{
								alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
							}
							if(VFS.Exists(FindRealName(allfilenames,texture.path)))
							{
								texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
								texturenode.value="texture";
								tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
								tpn.value = FindRealName(allfilenames,texture.path);
								
								texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
								texturepro.value="diffusetexture";
								tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
								tprof.value = usepath+"/textures/"+FindRealName(allfilenames,texture.path);
							}
						}
						if(!material.GetTextureCount())
						{
							//texture = material.GetTexture(material.DIFFUSE,it);
							//texturenode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
							//texturenode.value="texture";
							//tpn = texturenode.CreateChild(tworldxml.NODE_TEXT);
							//tpn.value = "no";
						}
						
						
						
						if(texture == undefined)
						{
							alert(filename+" "+mesh.GetName()+" "+material.GetPropertyName(0)+"hasn't texture");
						}
						else
						{
							shadernode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
							shadernode.value="shader";
							shadernode.SetAttribute("type","diffuse");
							tsn = shadernode.CreateChild(tworldxml.NODE_TEXT);
							tsn.value = "parallaxAtt";
							
							
							//<shadervar type="texture" name="tex normal">nb_0001.jpg</shadervar>
							
							if(VFS.Exists("n"+FindRealName(allfilenames,texture.path)))
							{
								shadervarnode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex normal");
								tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
								tsn.value = "n"+FindRealName(allfilenames,texture.path);
								
								texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
								texturepro.value="normaltexture";
								tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
								tprof.value = usepath+"/textures/"+"n"+FindRealName(allfilenames,texture.path);
							}	
							
							//<shadervar type="texture" name="tex specular">sg_0001.jpg</shadervar>
							
							
							if(VFS.Exists("s"+FindRealName(allfilenames,texture.path)))
							{
								shadervarnode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex specular");
								tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
								tsn.value = "s"+FindRealName(allfilenames,texture.path);
								
								texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
								texturepro.value="speculartexture";
								tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
								tprof.value = usepath+"/textures/"+"s"+FindRealName(allfilenames,texture.path);
							}
							
							
							
							//<shadervar type="texture" name="tex height">tb_0001.jpg</shadervar>
							if(VFS.Exists("h"+FindRealName(allfilenames,texture.path)))
							{
								shadervarnode = materialnode.CreateChild(tworldxml.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex height");
								tsn = shadervarnode.CreateChild(tworldxml.NODE_TEXT);
								tsn.value = "h"+FindRealName(allfilenames,texture.path);
								
								texturepro = materialpronode.CreateChild(tworldxml.NODE_ELEMENT);
								texturepro.value="heighttexture";
								tprof = texturepro.CreateChild(tworldxml.NODE_TEXT);
								tprof.value = usepath+"/textures/"+"h"+FindRealName(allfilenames,texture.path);
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
		
		onLightAdd:function(light_parentNode,wlight)
		{
			//如果没有打开灯光处理，忽略灯光处理。
			if(!flag_importLight)
				return;
			var light = light_parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
			light.value = "light";
			light.SetAttribute("name",wlight.name);
			
			var lcenter = light.CreateChild(xmlDocument.NODE_ELEMENT);
			lcenter.value = "center";
			lcenter.SetAttribute("x",wlight.position[0]);          
			lcenter.SetAttribute("y",wlight.position[2]);
			lcenter.SetAttribute("z",wlight.position[1]);
			
			var lcolor = light.CreateChild(xmlDocument.NODE_ELEMENT);
			lcolor.value = "color";
			lcolor.SetAttribute("red",  wlight.colorDiffuse[0]);          
			lcolor.SetAttribute("green",wlight.colorDiffuse[1]);
			lcolor.SetAttribute("blue", wlight.colorDiffuse[2]);
			
			var lspecular = light.CreateChild(xmlDocument.NODE_ELEMENT);
			lspecular.value = "specular";
			lspecular.SetAttribute("red",  wlight.colorSpecular[0]);          
			lspecular.SetAttribute("green",wlight.colorSpecular[1]);
			lspecular.SetAttribute("blue", wlight.colorSpecular[2]);
			
			//FIXME: 如何获取dynamic标志？缺省设置为false. please ref ticket:671#comment:25
			var attenuationType = Math.round( wlight.colorAmbient[0] * 10);
			var isDynamic = Math.round( wlight.colorAmbient[0] * 100) - attenuationType * 10;
			var isNoshadow = Math.round( wlight.colorAmbient[0] * 1000) - isDynamic * 10  - attenuationType * 100;
			var radius = Math.round( wlight.colorAmbient[1] * 10000);
			var influenceradius = Math.round( wlight.colorAmbient[2] * 10000);
			if(isNoshadow > 0)
			{//本语句断根据isNoshadow设置灯光是否产生阴影。
				var lnoshaow = light.CreateChild(xmlDocument.NODE_ELEMENT);
				lnoshaow.value = "noshadows";
				var lnoshaow_ctx = lnoshaow.CreateChild(tworldxml.NODE_TEXT);
				lnoshaow_ctx.value = "true";
			}
			{//本语句段根据isDynamic设置灯光是否为dynamic.
				var ldynamic = light.CreateChild(xmlDocument.NODE_ELEMENT);
				ldynamic.value = "dynamic";
				var ldynamicf = ldynamic.CreateChild(xmlDocument.NODE_TEXT);
				ldynamicf.value = (isDynamic == 0 ? true : false);
			}
			{//本语句段根据attenuationType设置灯光衰减。
				var attenuationType_none = 0;
				var attenuationType_linear = 1;
				var attenuationType_inverse = 2;
				var attenuationType_realistic = 3;
				var attenuationType_clq = 4;
				
				var lattenuation = light.CreateChild(xmlDocument.NODE_ELEMENT);
				lattenuation.value = "attenuation";
				lattenuation.SetAttribute("c", wlight.attenuationConstant);
				lattenuation.SetAttribute("l", wlight.attenuationLinear);
				lattenuation.SetAttribute("q", wlight.attenuationQuadratic);

				switch(attenuationType)
				{
				case attenuationType_clq:
					var lattenuation_Content = lattenuation.CreateChild(tworldxml.NODE_TEXT);
					lattenuation_Content.value = "clq"
					break
				case attenuationType_realistic:
					var lattenuation_Content = lattenuation.CreateChild(tworldxml.NODE_TEXT);
					lattenuation_Content.value = "realistic"
					break
				case attenuationType_inverse:
					var lattenuation_Content = lattenuation.CreateChild(tworldxml.NODE_TEXT);
					lattenuation_Content.value = "inverse"
					break
				case attenuationType_linear:
					var lattenuation_Content = lattenuation.CreateChild(tworldxml.NODE_TEXT);
					lattenuation_Content.value = "linear"
					break
				case attenuationType_none:
					var lattenuation_Content = lattenuation.CreateChild(tworldxml.NODE_TEXT);
					lattenuation_Content.value = "none"
					break
				default:
					alert("灯光中指定的衰减方式无效，值为:",attenuationType);
				}
			}
			
			{//本代码块设置灯光类型。
				var ltype = light.CreateChild(tworldxml.NODE_ELEMENT);
				ltype.value = "type";
				var ltypev = ltype.CreateChild(tworldxml.NODE_TEXT);
				//参考源代码，为Spot,Point,Directional.
				if(wlight.type == "Spot")
				{//如果为聚光灯。设置灯光的inner以及outer.
					ltypev.value = "spotlight";
					var lspotlightfalloff = light.CreateChild(tworldxml.NODE_ELEMENT);
					lspotlightfalloff.value = "spotlightfalloff";
					lspotlightfalloff.SetAttribute("inner", wlight.angleInnerCone);
					lspotlightfalloff.SetAttribute("outer", wlight.angleOuterCone);
				}else if(wlight.type == "Point")
				{
					ltypev.value = "pointlight";
				}else{
					ltypev.value = "directional";
				}
				
				if(wlight.type != "Point")
				{//如果不是点光源，根据direction来计算矩阵。
					//FIXME: 请将次方法测试，并加入到Quaternion中。
					//我们计算从from旋转到to的matrix.
					var from = new Math3.Vector3(0,0,1);
					// for(var i in from)
					// {
						// alert(i);
					// }
					var to = new Math3.Vector3(wlight.direction);
					//换算为单位向量。
					// from.Normal();
					// to.Normal();
					var dot_var = from.Normal().Dot(to.Normal());
					var axis = from.Normal().Cross(to.Normal());
					if(axis.Length() == 0)
					{//两个平行线。
						alert("未指定灯光方向");
					}else{
						var rotate = new Math3.Quaternion();
						rotate.SetAxisAngle(axis,Math.sqrt(0.5 * Math.abs(1.0 + dot_var)) );
						
						//输出rotate.
						var move = light.CreateChild(tworldxml.NODE_ELEMENT);
						move.value = "move";
						var matrix = move.CreateChild(tworldxml.NODE_ELEMENT);
						matrix.value = "matrix";
						
						var rotx = matrix.CreateChild(tworldxml.NODE_ELEMENT);
						rotx.value = "rotx";
						var rotx_ctx =  rotx.CreateChild(tworldxml.NODE_TEXT);
						rotx_ctx.value = Math.round(rotate.GetEulerAngles()[0]*10000)/10000;
						
						var roty = matrix.CreateChild(tworldxml.NODE_ELEMENT);
						roty.value = "roty";
						var roty_ctx =  roty.CreateChild(tworldxml.NODE_TEXT);
						roty_ctx.value = Math.round(ainode.GetEulerAngles()[2]*10000)/10000;;
						
						var rotz = matrix.CreateChild(tworldxml.NODE_ELEMENT);
						rotz.value = "rotz";
						var rotz_ctx =  rotz.CreateChild(tworldxml.NODE_TEXT);
						rotz_ctx.value = Math.round(ainode.GetEulerAngles()[1]*10000)/10000;;
					}
				}
			}
			
			if(radius > 1)
			{//radius
				var lradius = light.CreateChild(tworldxml.NODE_ELEMENT);
				lradius.value = "radius";
				//lradius.SetAttribute("brightness",  "1.0"); 
				lradiusv = lradius.CreateChild(tworldxml.NODE_TEXT);
				lradiusv.value = radius;
			}
			if(influenceradius > 1)
			{//输出influenceradius
				var lradius = light.CreateChild(tworldxml.NODE_ELEMENT);
				lradius.value = "influenceradius";
				lradiusv = lradius.CreateChild(tworldxml.NODE_TEXT);
				lradiusv.value = influenceradius;
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
	var convertmode = CmdLine.GetOption("convertmode");
	var tmpworldpath = CmdLine.GetOption("tmpworldpath");
	if(CmdLine.GetOption("importlight"))
		flag_importLight = true;
	//参数处理部分
	
	//materialDef路径
	var ifmaterialDef=false;
	var mtldefmaterials;
	if(materialDef != undefined && materialDef != true)
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
	
	
	//world模板路径
	if(tmpworldpath==undefined || tmpworldpath==true)
	{
		tmpworldpath="/";
	}
	//应用路径
	if(usepath==undefined || usepath==true)
	{
		usepath="";
	}
	//效果部分
	if(ifeffect==undefined || ifeffect==true)
	{
		ifeffect="Y";
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
	VFS.Mount("/",inputpath+"diffuse\\");
	VFS.Mount("/",inputpath+"normal\\");
	VFS.Mount("/",inputpath+"height\\");
	VFS.Mount("/",inputpath+"specular\\");
	VFS.Mount("outputpath",outputpath);
	VFS.Mount("tmpworldpath",tmpworldpath);
	//获取输入路径下所有文件名称
	var allfilenames = VFS.FindFiles("/");
	
	//打开并解析“模板”world文件
	var tworldxml = new xmlDocument();
	var factorylib = new xmlDocument();
	if(convertmode == "factory")
	{
		var tworldfile;
		matxml = new xmlDocument();
		if(VFS.Exists("outputpath/materials.xml"))
		{
	
			var matfile = VFS.Open("outputpath/materials.xml");
			matxml.Parse(matfile);
			matrt = matxml.root;
			matlibrarys = matrt.GetChild("library");
		}
		else
		{
			matrt=matxml.CreateRoot();
			matlibrarys = matrt.CreateChild(matxml.NODE_ELEMENT);
			matlibrarys.value="library";
			textures = matlibrarys.CreateChild(matxml.NODE_ELEMENT);
			textures.value="textures";
			materials = matlibrarys.CreateChild(matxml.NODE_ELEMENT);
			materials.value="materials";
		}
		facproxml = new xmlDocument();
		if(VFS.Exists("outputpath/facpro.xml"))
		{
	
			var profile = VFS.Open("outputpath/facpro.xml");
			facproxml.Parse(profile);
			facprort = facproxml.root.GetChild("root");
		}
		else
		{
			facprort=facproxml.CreateRoot();
			facprort=facprort.CreateChild(xmlDocument.NODE_ELEMENT);
			facprort.value = "root";
		}
	}
	else
	{
		//faclibfile = new xmlDocument();
		if(VFS.Exists("outputpath/factorylib.xml"))
		{
			var faclibfile = VFS.Open("outputpath/factorylib.xml");
			factorylib.Parse(faclibfile);
			librarys = factorylib.root.GetChild("library");
		}
		else
		{
			factorylibrt=factorylib.CreateRoot();
			librarys = factorylibrt.CreateChild(factorylib.NODE_ELEMENT);
			librarys.value="library";
		}
		
		if(!VFS.Exists("outputpath/world.xml"))
		{
			var tworldfile = VFS.Open("tmpworldpath/world.xml");
			if(tworldfile == undefined)
			{
				alert("can not open the world file");
				System.Quit();
			}
			tworldxml.Parse(tworldfile);
			tworld = tworldxml.root.GetChild("world");
		}
	    else
		{
			var tworldfile = VFS.Open("outputpath/world.xml");
			tworldxml.Parse(tworldfile);
			tworld = tworldxml.root.GetChild("world");
		}
	}
	var sectorw;
	if(!load("/tools/convertimpoter.js"))
	{
		load("convertimpoter.js")
	}
	//require("convertimpoter.js");
	
	if(convertmode == "scene")
	{
		//将修改后的xml文件写到目标路径下的world文件中	
		faclibfile = VFS.Open("outputpath/factorylib.xml",1);
		factorylib.WritetoFile(faclibfile);
		
		wfile = VFS.Open("outputpath/world.xml",1);
		tworldxml.WritetoFile(wfile);
		
	}
	else
	{
		if(convertmode == "factory")
		{			
			 matfile = VFS.Open("outputpath/materials.xml",1);
			 matxml.WritetoFile(matfile);
			 
			 profile = VFS.Open("outputpath/facpro.xml",1);
			 facproxml.WritetoFile(profile);
		}
	}

