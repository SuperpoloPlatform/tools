/**************************************************************************
 *
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd. 
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/  sales@spolo.org uge-support@spolo.org
 *
**************************************************************************/

/*
ticket:1272#comment:9
支持有人去refine下这个代码，独立的，经过严格测试再予以使用。

ps: 按照如下过程来refine,

    合并函数（大量函数可以合并的)
    重新规划类 (确保不偷窥其它类的成员，换言之，类的public方法/属性更少)
    整理类的文件分布，使得处理过程容易理解——一句话可以描述清晰。 

这个其实考验的是代码映射的功力了。
*/


// 依赖库，包含必要的全局对象。
require("console.js");
require("importer/importer.js");


	var global_errorno = 0;	
	var global_materialid = 0;
	//是否导入场景中的灯光。缺省不导入灯光，使用--importlight标志来允许灯光处理。灯光处理请使用script/max/lightexport.mc.
	var flag_importLight = false;
	var callbacks = {
		first : true,
		Choice:{"effectTree":false,"mergexmls":false},//控制是否加载特殊材质处理，以及选择哪处理
	
		onTextureAdd:function(textures,material)        //此material为aimaterial类型，以后名字再改
		{
			//根据aiMaterial的相关设定，为parentNode(texture节点)添加透明相关属性。
			var AddTransparentFromMat = function(parentNode,textRealName){
			
			
				var expandedname = textRealName.substr(textRealName.length-3,textRealName.length);
				if(expandedname.toLowerCase() == "png")
				{
						var alpha = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);    //创建alpha标签
						alpha.value = "alpha";
						var binary = alpha.CreateChild(xmlDocument.NODE_ELEMENT);      //创建binary标签
						binary.value = "binary";	
				}
			    //先将裁剪贴图处理改为用贴图文件类型判断
				// var opacity = 1 - aiMaterial.GetProperty("$mat.opacity");
				// if(opacity == 0.0)
				// {//binary mode.
					// var alpha = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);    //创建alpha标签
					// alpha.value = "alpha";
					// var binary = alpha.CreateChild(xmlDocument.NODE_ELEMENT);      //创建binary标签
					// binary.value = "binary";
				// }else if(opacity == 1.0)
				// {
					// var keycolor = aiMaterial.GetProperty("$clr.ambient");
					// if(typeof keycolor == "Array" && keycolor.length >= 3)
					// {
						// var transparent = parentNode.CreateChild(xmlDocument.NODE_ELEMENT);
						// transparent.value = "transparent";
						// transparent.SetAttribute("r",keycolor[0]);    //设置颜色值
						// transparent.SetAttribute("g",keycolor[1]);
						// transparent.SetAttribute("b",keycolor[2]);
					// }
				// }
				// else
				// {
					// // 通过和liuyingtao沟通，以后还是需要支持透明的，
					// // 所以这块需要注释掉，而不是给出exit code
					// // ref revision:2285
					// //System.exitcode = 10;
					// //alert("Error Code 10 : opacity value error, ",
					// //	"ArtBuild only support [0] and [1], ",
					// //	"but you give me [" + opacity + "]",
					// //	iReporter.DEBUG/* 4 */, "");
					// //exit();
				// }
				
			};
			
			for(it = 0;it < material.GetTextureCount();it++)       //遍历aimaterial所有的texture节点
			{
				texture = material.GetTexture(material.DIFFUSE,it);      //获取它的diffuse贴图
				if(texture == undefined)            //如果没有diffuse
				{
				     System.exitcode = 35;
					//alert(filename+" "+material.GetPropertyName(0)+"hasn't texture");
				}
				else      //diffuse贴图存在
				{
                    //如果虚拟路径上不存在此贴图
					if(!VFS.Exists(texture.path))
					{
						System.exitcode = 36;
						alert("Error Code 36 : ",
							"Can not found the texture "+ texture.path + 
							" of material : " + filename + " " + 
							material.GetPropertyName(0));
						exit();
					} 
					
					var textRealName = importer.FindRealName(allfilenames,texture.path);
					
					
					// 检测xml文件中是否已经存在该贴图了。
					if(importer.CheckTexture(textures,textRealName))
					{	
						continue;
					}
					
					if(ifeffect == 'N')   //如果没有效果
					{
						if(VFS.Exists(textRealName))
						{//存在diffuse贴图。
							var texturen = importer.addTextureNode(textures,
							     textRealName);
							AddTransparentFromMat(texturen, textRealName);
						}
					}
					else if(ifeffect == 'Y')    //有效果
					{
						if(VFS.Exists(textRealName))   //diffuse贴图的名字存在
						{
							var texturen = importer.addTextureNode(textures,
                                textRealName);
							AddTransparentFromMat(texturen, textRealName);
						}
				
						if(VFS.Exists("n"+textRealName))
						{
							importer.addTextureNode(textures,
                                "n" + textRealName);
						}
						
						if(VFS.Exists("s"+textRealName))
						{
							importer.addTextureNode(textures,
                                "s" + textRealName);
						}
						
						if(VFS.Exists("h"+textRealName))
						{
							importer.addTextureNode(textures,
                                "h" + textRealName);
						}
					}
					
				}
			}
			return true;
		},
		onMaterialAdd:function(materials,material,meshname)   //materials为iDocumentNode对象，material为aiMaterial对象
		{
			// 检测传入的aiMaterial节点是否合法
			importer.aiMaterialValidation(material);
			
			//jigaihui
			var isCheckmat = true,isaddeffect = false;
			 if(this.Choice["mergexmls"]){
				if(mg.isopenxml == true)
				{
					var strname = material.GetPropertyName(0);
					//alert("mesh名字 : "+meshname+ "材质:"+strname);
					if(mg.IsMesh(meshname))
					{
						//alert("mg.meshindexs等于 : "+mg.meshindex);
						
						var meshnode = mg.listmeshnode[mg.meshindex];
						//alert("meshnode : "+meshnode);
						//mg.getmatlist(meshnode);
						isaddeffect = mg.IsMat(meshnode,material);
						//alert("检查: "+mg.listmesh[mg.meshindex]+mg.meshindex+":"+mg.listmat[mg.matindex]);
						//alert(isCheckmat);
						isCheckmat = false;
						//mg.addeffect(material,materialnode);
					}
				}
			}
			//var mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
				//alert(" mesh name : "+ mesh.GetName())
			//alert(" mesh name : "+ meshname)
			if(isCheckmat)
			{
				var matname = importer.CheckMaterial(materials,material);
				if(matname != false)
				{
					return matname;
				}
				//alert("check");
			}
			
			// ticket:1272 保证在同一个3ds文件中，材质名称不重复
			// 如果3ds文件名称是box.3ds，材质名称为m_012，id号为001
			// 那么拼装成的材质名称为“box_m_012_001”
			matname = function(materialnodes, aimaterial) {
				var _3dsFileName = importer.GetFileName(Ctx.inputfile);
				var name = importer.GetOnlyFileName(_3dsFileName) + "_" +
					aimaterial.GetPropertyName(0) + "_" + global_materialid;
				global_materialid++;
				return name;
			}(materials, material);
			
			if(ifeffect == 'N')      //如果没有效果
			{
			    var materialnode = materials.CreateChild(xmlDocument.NODE_ELEMENT);
				materialnode.value="material";
				materialnode.SetAttribute("name",matname);
				for(it = 0;it < material.GetTextureCount();it++)    //扫描此节点下所有的texture节点
				{
					texture = material.GetTexture(material.DIFFUSE,it);
					if(texture == undefined)
					{
					   
	                     System.exitcode = 11;
							
					}
					else      //如果有texture节点
					{
					    var textRealName = importer.FindRealName(allfilenames,texture.path);
						if(VFS.Exists(textRealName))
						{
							texturenode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
							texturenode.value="texture";
							tpn = texturenode.CreateChild(xmlDocument.NODE_TEXT);
							tpn.value = textRealName;
						}
					}
				}
				if(!material.GetTextureCount())
				{
					//texture = material.GetTexture(material.DIFFUSE,it);
					//texturenode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
					//texturenode.value="texture";
					//tpn = texturenode.CreateChild(xmlDocument.NODE_TEXT);
					//tpn.value = "no";
				}
			}
			else     //其他情况
			{
			
				if(ifeffect=="Y")     //有效果贴图
				{
					if(ifmaterialDef == true)
					{
						var materialnt = importer.FindMaterial(
							mtldefmaterials, matname);
						
						if(materialnt != undefined)
						{
							if(!importer.CopyNode(materialn,materialnt))
							{
							    System.exitcode = 12;
								//alert("Material Node copy error!");
							}
						}
						else   //如果没有找到此material子节点，那么去创建它
						{
							materialn.value="material";
							materialn.SetAttribute("name",matname);
							
							for(it = 0;it < material.GetTextureCount();it++)     //遍历所有aimaterial的texture子节点
							{
								texture = material.GetTexture(material.DIFFUSE,it);
								if(texture == undefined)
								{
								    System.exitcode = 13;
									continue ;
									//alert(filename+" "+mesh.GetName()+" "+matname+"hasn't texture");
								}
								
								var textRealName = importer.FindRealName(allfilenames,texture.path);
								
								if(VFS.Exists(textRealName))   //若此贴图存在
								{
									texturenode = materialn.CreateChild(xmlDocument.NODE_ELEMENT);
									texturenode.value="texture";
									tpn = texturenode.CreateChild(xmlDocument.NODE_TEXT);
									tpn.value = textRealName;
								}
							}
							
							if(!material.GetTextureCount())
							{
								//texture = material.GetTexture(material.DIFFUSE,it);
								//texturenode = materialn.CreateChild(xmlDocument.NODE_ELEMENT);
								//texturenode.value="texture";
								//tpn = texturenode.CreateChild(xmlDocument.NODE_TEXT);
								//tpn.value = "no";
							}
							
							
							
							if(texture == undefined)     //如果创建失败
							{
							  
							    System.exitcode = 14;
								//alert(filename+" "+mesh.GetName()+" "+matname+"hasn't texture");
							}
							else     //创建texture节点成功后，来创建shader子节点
							{
								shadernode = materialn.CreateChild(xmlDocument.NODE_ELEMENT);
								shadernode.value="shader";
								shadernode.SetAttribute("type","diffuse");
								tsn = shadernode.CreateChild(xmlDocument.NODE_TEXT);
								tsn.value = "parallaxAtt";
								
								
								//<shadervar type="texture" name="tex normal">nb_0001.jpg</shadervar>
								
								
								if(VFS.Exists("n"+textRealName))
								{
									shadervarnode = materialn.CreateChild(xmlDocument.NODE_ELEMENT);
									shadervarnode.value="shadervar";
									shadervarnode.SetAttribute("type","texture");
									shadervarnode.SetAttribute("name","tex normal");
									tsn = shadervarnode.CreateChild(xmlDocument.NODE_TEXT);
									tsn.value = "n"+textRealName;
								}
								
								if(VFS.Exists("s"+textRealName))
								{
									shadervarnode = materialn.CreateChild(xmlDocument.NODE_ELEMENT);
									shadervarnode.value="shadervar";
									shadervarnode.SetAttribute("type","texture");
									shadervarnode.SetAttribute("name","tex specular");
									tsn = shadervarnode.CreateChild(xmlDocument.NODE_TEXT);
									tsn.value = "s"+textRealName;
								}
								
								
								
								//<shadervar type="texture" name="tex height">tb_0001.jpg</shadervar>
								if(VFS.Exists("h"+textRealName))
								{
									shadervarnode = materialn.CreateChild(xmlDocument.NODE_ELEMENT);
									shadervarnode.value="shadervar";
									shadervarnode.SetAttribute("type","texture");
									shadervarnode.SetAttribute("name","tex height");
									tsn = shadervarnode.CreateChild(xmlDocument.NODE_TEXT);
									tsn.value = "h"+textRealName;
									
									
								}
							}
						}
					}
					else    // ifmaterialDef == false 或没有赋值    这部分会执行
					{
			
						//materialpronode.SetAttribute("name",matname);
						for(it = 0;it < material.GetTextureCount();it++)   //扫描aimaterial下所有的texture
						{
							texture = material.GetTexture(material.DIFFUSE,it);    //获取到diffuse贴图
							if(texture == undefined)
							{
							   System.exitcode = 15;
							   continue ;
								//alert(filename+" "+mesh.GetName()+" "+matname+"hasn't texture");
							}
							
							var textRealName = importer.FindRealName(allfilenames,texture.path);
							
							if(VFS.Exists(textRealName))   //贴图存在,开始创建相关节点
							{
							    var materialnode = materials.CreateChild(xmlDocument.NODE_ELEMENT);
							    materialnode.value="material";
						        materialnode.SetAttribute("name",matname);
								texturenode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
								texturenode.value="texture";
								tpn = texturenode.CreateChild(xmlDocument.NODE_TEXT);
								tpn.value = textRealName;
								
								//jigaihui isCheckmat
								 if(isaddeffect)
									{
										mg.addeffect(materialnode);
									}
							var expandedname = textRealName.substr(textRealName.length-3,textRealName.length);
				            if(expandedname.toLowerCase() == "png")
							{
						    shadernode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
							shadernode.value="shader";
							shadernode.SetAttribute("type","ambient");
							tsn = shadernode.CreateChild(xmlDocument.NODE_TEXT);
							tsn.value = "ambient";
							}
							//<shadervar type="texture" name="tex normal">nb_0001.jpg</shadervar>
							
							if(VFS.Exists("n"+textRealName))
							{
								shadervarnode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex normal");
								tsn = shadervarnode.CreateChild(xmlDocument.NODE_TEXT);
								tsn.value = "n"+textRealName;
							}	
							
							//<shadervar type="texture" name="tex specular">sg_0001.jpg</shadervar>
							
							
							if(VFS.Exists("s"+textRealName))
							{
								shadervarnode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex specular");
								tsn = shadervarnode.CreateChild(xmlDocument.NODE_TEXT);
								tsn.value = "s"+textRealName;
								
							}
							
							
							
							//<shadervar type="texture" name="tex height">tb_0001.jpg</shadervar>
							if(VFS.Exists("h"+textRealName))
							{
								shadervarnode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
								shadervarnode.value="shadervar";
								shadervarnode.SetAttribute("type","texture");
								shadervarnode.SetAttribute("name","tex height");
								tsn = shadervarnode.CreateChild(xmlDocument.NODE_TEXT);
								tsn.value = "h"+textRealName;
							}
							}
						}
						/* if(!material.GetTextureCount())
						{
							//texture = material.GetTexture(material.DIFFUSE,it);
							//texturenode = materialnode.CreateChild(xmlDocument.NODE_ELEMENT);
							//texturenode.value="texture";
							//tpn = texturenode.CreateChild(xmlDocument.NODE_TEXT);
							//tpn.value = "no";
						} */
					
					/* 	if(texture == undefined)
						{   
						    System.exitcode = 16;
							//alert(filename+" "+mesh.GetName()+" "+matname+"hasn't texture");
						}
						else
						{
						
							
						} */
					}
				}
				else
				{
				    System.exitcode = 17;
					//alert("ifeffect error!");
				}
			}
			return matname;
		},
		onCameraAdd:function(startw,wcamera)   //startw为world.xml中start节点
		{
			startw.value = "start";
			startw.SetAttribute("name","Camera");
			sectors = startw.CreateChild(xmlDocument.NODE_ELEMENT);
			sectors.value = "sector";
			scenes = sectors.CreateChild(xmlDocument.NODE_TEXT);
			scenes.value = "Scene";				
			if(wcamera == undefined)
			{
				position = startw.CreateChild(xmlDocument.NODE_ELEMENT);
				position.value = "position";
				position.SetAttribute("x","8.6592");          
				position.SetAttribute("y","5.1716");
				position.SetAttribute("z","-4.595");
				up = startw.CreateChild(xmlDocument.NODE_ELEMENT);
				up.value = "up";
				up.SetAttribute("x","-0.3307");          
				up.SetAttribute("y","0.8953");
				up.SetAttribute("z","0.2984");
				forward = startw.CreateChild(xmlDocument.NODE_ELEMENT);
				forward.value = "forward";
				forward.SetAttribute("x","-0.6549");
				forward.SetAttribute("y","-0.4452");
				forward.SetAttribute("z","0.6107");
			}
			else
			{
				position = startw.CreateChild(xmlDocument.NODE_ELEMENT);
				position.value = "position";
				position.SetAttribute("x",wcamera.position[0]);          
				position.SetAttribute("y",wcamera.position[1]);
				position.SetAttribute("z",wcamera.position[2]);
				up = startw.CreateChild(xmlDocument.NODE_ELEMENT);
				up.value = "up";
				up.SetAttribute("x",wcamera.up[0]);          
				up.SetAttribute("y",wcamera.up[1]);
				up.SetAttribute("z",wcamera.up[2]);
				forward = startw.CreateChild(xmlDocument.NODE_ELEMENT);
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
				var lnoshaow_ctx = lnoshaow.CreateChild(xmlDocument.NODE_TEXT);
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
					var lattenuation_Content = lattenuation.CreateChild(xmlDocument.NODE_TEXT);
					lattenuation_Content.value = "clq"
					break
				case attenuationType_realistic:
					var lattenuation_Content = lattenuation.CreateChild(xmlDocument.NODE_TEXT);
					lattenuation_Content.value = "realistic"
					break
				case attenuationType_inverse:
					var lattenuation_Content = lattenuation.CreateChild(xmlDocument.NODE_TEXT);
					lattenuation_Content.value = "inverse"
					break
				case attenuationType_linear:
					var lattenuation_Content = lattenuation.CreateChild(xmlDocument.NODE_TEXT);
					lattenuation_Content.value = "linear"
					break
				case attenuationType_none:
					var lattenuation_Content = lattenuation.CreateChild(xmlDocument.NODE_TEXT);
					lattenuation_Content.value = "none"
					break
				default:
				    System.exitcode = 18;
					//alert("灯光中指定的衰减方式无效，值为:",attenuationType);
				}
			}
			
			{//本代码块设置灯光类型。
				var ltype = light.CreateChild(xmlDocument.NODE_ELEMENT);
				ltype.value = "type";
				var ltypev = ltype.CreateChild(xmlDocument.NODE_TEXT);
				//参考源代码，为Spot,Point,Directional.
				if(wlight.type == "Spot")
				{//如果为聚光灯。设置灯光的inner以及outer.
					ltypev.value = "spotlight";
					var lspotlightfalloff = light.CreateChild(xmlDocument.NODE_ELEMENT);
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
					    System.exitcode = 19;
						//alert("未指定灯光方向");
					}else{
						var rotate = new Math3.Quaternion();
						rotate.SetAxisAngle(axis,Math.sqrt(0.5 * Math.abs(1.0 + dot_var)) );
						
						//输出rotate.
						var move = light.CreateChild(xmlDocument.NODE_ELEMENT);
						move.value = "move";
						var matrix = move.CreateChild(xmlDocument.NODE_ELEMENT);
						matrix.value = "matrix";
						
						var rotx = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
						rotx.value = "rotx";
						var rotx_ctx =  rotx.CreateChild(xmlDocument.NODE_TEXT);
						rotx_ctx.value = Math.round(rotate.GetEulerAngles()[0]*10000)/10000;
						
						var roty = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
						roty.value = "roty";
						var roty_ctx =  roty.CreateChild(xmlDocument.NODE_TEXT);
						roty_ctx.value = Math.round(ainode.GetEulerAngles()[2]*10000)/10000;;
						
						var rotz = matrix.CreateChild(xmlDocument.NODE_ELEMENT);
						rotz.value = "rotz";
						var rotz_ctx =  rotz.CreateChild(xmlDocument.NODE_TEXT);
						rotz_ctx.value = Math.round(ainode.GetEulerAngles()[1]*10000)/10000;;
					}
				}
			}
			
			if(radius > 1)
			{//radius
				var lradius = light.CreateChild(xmlDocument.NODE_ELEMENT);
				lradius.value = "radius";
				//lradius.SetAttribute("brightness",  "1.0"); 
				lradiusv = lradius.CreateChild(xmlDocument.NODE_TEXT);
				lradiusv.value = radius;
			}
			if(influenceradius > 1)
			{//输出influenceradius
				var lradius = light.CreateChild(xmlDocument.NODE_ELEMENT);
				lradius.value = "influenceradius";
				lradiusv = lradius.CreateChild(xmlDocument.NODE_TEXT);
				lradiusv.value = influenceradius;
			}
		}
		//PorcNormalHeight(mat);
		//ProcShader();
		//ProcExternalChange(xml):
		//ProcSpecular(mat);
		//....
		//self code.
		,
		effectTree : null,
		onModifyMaterial:function(materials,meshobj,matname,textures){
			if(!this.Choice["effectTree"]){
				return 
			}
			

			if(this.first)
			{
				sourePath="/data/effectextures/";
				targetPath="/outputpath/textures/";			
				//获取Tree的fread参数，加载effect.xml
				fread =VFS.Open("effect.xml",VFS.READ);
				if(!fread){
					return false;
				}
				if(!VFS.Exists(sourePath)||!VFS.Exists(targetPath)){
					return false;
				}
				targetPath=targetPath+"effectextures/"
				this.effectTree=new Tree();
				this.effectTree.initByMesh(fread,sourePath,targetPath);
				this.effectTree.copyTextureAll();
				this.effectTree.addTextureNodeAll(textures);
				this.first = false;
			}
			this.effectTree.copyTextureAll();
			this.effectTree.addTextureNodeAll(textures);
			flag=this.effectTree.modifyMaterialOfOutSidebyMesh(materials,meshobj,matname);
			if(!flag){
				
				return false;
			}
			return true;
				
		},
		onIsEffect: function(meshobjname){
			if(!this.Choice["effectTree"]){
				return 
			}
			if(this.first)
			{
			    
				sourePath="/data/effectextures/";
				targetPath="/outputpath/textures/";
				//获取Tree的fread参数，加载effect.xml
				fread =VFS.Open("effect.xml",VFS.READ);
				if(!fread){
					return false;
				}
				if(!VFS.Exists(sourePath)){
					return false;
				}
				targetPath=targetPath+"effectextures/"
				this.effectTree=new Tree();
				this.effectTree.initByMesh(fread,sourePath,targetPath);
				this.first = false;
			}
			
			isflag=this.effectTree.isMeshobj(meshobjname);
			return isflag;
		}
	 }
	
	// 初始化context
	Ctx.totalFaceNum = 0;
	Ctx.totalVertexNum = 0;
	
	//参数获取部分
	var inputfile = CmdLine.GetOption("input");   //输入文件路径
	Ctx.inputfile = inputfile;
	var outputpath = CmdLine.GetOption("output");    //输出文件路径
	var usepath = CmdLine.GetOption("usepath");
	var ifeffect = CmdLine.GetOption("effect");   //是否有效果， Y or N
	var materialDef = CmdLine.GetOption("materialDef");   //应用路径 target生成的路经？
	var convertmode = CmdLine.GetOption("convertmode");   //转换模式，factory or sence
	var tmpworldpath = CmdLine.GetOption("tmpworldpath");  
	if(CmdLine.GetOption("importlight"))     //是否有灯光
		flag_importLight = true;
	//参数处理部分

	AssertTrue(load("/tools/effect.js"),"failed to load `effect.js` ","OR script run error.");
	
	
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
		     System.exitcode = 20;
			//alert("can not open the materialDef file");
		}
		mtldefxml.Parse(mtldeffile);
		mtldefworld = mtldefxml.root.GetChild("world");
		mtldefmaterials = mtldefworld.GetChild("materials");		
	}
	
	//初始化获取的参数
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
	VFS.Mount("/",inputpath+"effect\\");		
	VFS.Mount("/data/effectextures/",System.InstallPath()+"\\data\\effectextures\\");
	//jigaihui add
/* 	AssertTrue(load("/importer/mergexmls.js"),
		"failed to load `mergexml.js` ",
		"OR script run error.");  */ 
	require("importer/mergexmls.js");
		
	//获取输入路径下所有文件名称
	var allfilenames = VFS.FindFiles("/");
	
	//打开并解析“模板”world文件
	var tworldxml = new xmlDocument();   //world.xml的xmlDocument
	var tWorldSectorXml = new xmlDocument();   //world.xml的xmlDocument
	var factorylib = new xmlDocument();    //factorylib.xml的xmlDocument
	var factorylibN = new xmlDocument();    //factorylibN.xml的xmlDocument，N是数字
	if(convertmode == "factory") 
	{
		var tworldfile;
		matxml = new xmlDocument();      //materials.xml的xmlDocument
		if(VFS.Exists("outputpath/materials.xml"))
		{
	
			var matfile = VFS.Open("outputpath/materials.xml");
			matxml.Parse(matfile);
			matrt = matxml.root;
			matlibrarys = matrt.GetChild("library");
		}
		else    //outputpath/materials.xml不存在，则创建一个模板
		{
			matrt=matxml.CreateRoot();
			matlibrarys = matrt.CreateChild(xmlDocument.NODE_ELEMENT);
			matlibrarys.value="library";
			textures = matlibrarys.CreateChild(xmlDocument.NODE_ELEMENT);
			textures.value="textures";
			materials = matlibrarys.CreateChild(xmlDocument.NODE_ELEMENT);
			materials.value="materials";
		}
		facproxml = new xmlDocument();
		if(VFS.Exists("outputpath/facpro.xml"))
		{
	
			var profile = VFS.Open("outputpath/facpro.xml");
			facproxml.Parse(profile);
			facprort = facproxml.root.GetChild("root");
		}
		else   //outputpath/facpro.xml不存在，创建一个模板
		{
			facprort=facproxml.CreateRoot();
			facprort=facprort.CreateChild(xmlDocument.NODE_ELEMENT);
			facprort.value = "root";
			
			// 初始化统计数据。
			facprort.SetAttribute("total_tris", 0);
			facprort.SetAttribute("total_verts", 0);
		}
	}
	else if(convertmode == "uv_lightmap")
	{
	
		matxml = new xmlDocument();      //materials.xml的xmlDocument
		if(VFS.Exists("outputpath/materials.xml"))
		{
	
			var matfile = VFS.Open("outputpath/materials.xml");
			matxml.Parse(matfile);
			matrt = matxml.root;
			matlibrarys = matrt.GetChild("library");
		}
		else
		{
			System.exitcode = 21;
			//alert("can not open the world file");
			System.Quit();
		}
		if(VFS.Exists("outputpath/world.xml"))
		{
			var tworldfile = VFS.Open("outputpath/world.xml");
			tworldxml.Parse(tworldfile);
			tworld = tworldxml.root.GetChild("world");
		}
	    else
		{
			System.exitcode = 21;
			//alert("can not open the world file");
			System.Quit();
		}
	}
	else  //convertmode !="factory"
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
			librarys = factorylibrt.CreateChild(xmlDocument.NODE_ELEMENT);
			librarys.value="library";
		}
		
		///@fixme 和`factorylib.xml`重复了，等该问题稳定之后，就不再需要`factorylib.xml`了。
		// 每个scene有一个对应的factorylibN.xml文件。（场景拆分使用）
		factorylibrtN = factorylibN.CreateRoot();
		librarysN = factorylibrtN.CreateChild(xmlDocument.NODE_ELEMENT);
		librarysN.value = "library";
		
		if(!VFS.Exists("outputpath/world.xml"))
		{
			var tworldfile = VFS.Open("tmpworldpath/world.xml");
			if(tworldfile == undefined)
			{
			    System.exitcode = 21;
				//alert("can not open the world file");
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
		
		// 仅仅包含sector的world文件。
		if(!VFS.Exists("outputpath/world.sector.xml"))
		{
			var tWorldSectorFile = VFS.Open("tmpworldpath/world.sector.xml");
			if(tWorldSectorFile == undefined)
			{
			    System.exitcode = 21;
				//alert("can not open the world.sector file");
				System.Quit();
			}
			tWorldSectorXml.Parse(tWorldSectorFile);
			tWorldSector = tWorldSectorXml.root.GetChild("world");
		}
	    else
		{
			var tWorldSectorFile = VFS.Open("outputpath/world.sector.xml");
			tWorldSectorXml.Parse(tWorldSectorFile);
			tWorldSector = tWorldSectorXml.root.GetChild("world");
		}
	}
	var sectorw;
	
	AssertTrue(load("/tools/convertimpoter.js"),
		"failed to load `convertimpoter.js` ",
		"OR script run error.");
	
	// 处理结束，写入统计信息。
	
	if(convertmode == "factory")
	{
		facprort.SetAttribute("total_tris", Number(
			facprort.GetAttributeValue("total_tris")) + Ctx.totalFaceNum);
		facprort.SetAttribute("total_verts", Number(
			facprort.GetAttributeValue("total_verts")) + Ctx.totalVertexNum);
	}
	
	// 处理结束，开始写入文件。
	
	if(convertmode == "scene")
	{
		// 准备拆分world的环境。
		prepareEnv();
		
		if(VFS.Exists("outputpath/shaderlib.xml"))
		{
			//先留空，以后需要添加东西的话会方便一些
		}
		else
		{
			VFS.Copy("/tools/shaderlib.xml","outputpath/shaderlib.xml");
		}
		
		//将修改后的xml文件写到目标路径下的factorylib.xml文件中	
		faclibfile = VFS.Open("outputpath/factorylib.xml",1);
		factorylib.WritetoFile(faclibfile);
		//将修改后的xml文件写到目标路径下的world.xml文件中
		wfile = VFS.Open("outputpath/world.xml",1);
		tworldxml.WritetoFile(wfile);
		
		wfile = VFS.Open("outputpath/world.sector.xml",1);
		tWorldSectorXml.WritetoFile(wfile);
		
		//将修改后的xml文件写到目标路径下的factorylibN.xml文件中
		var sceneIndex = importer.getSceneNumber(importer.GetOnlyFileName(importer.GetFileName(Ctx.inputfile)));
		faclibfileN = VFS.Open("outputpath/factorylib" + sceneIndex + ".xml", 1);
		factorylibN.WritetoFile(faclibfileN);
	}
	else if(convertmode == "factory")
	{
		 matfile = VFS.Open("outputpath/materials.xml",1);
		 matxml.WritetoFile(matfile);
		 
		 profile = VFS.Open("outputpath/facpro.xml",1);
		 facproxml.WritetoFile(profile);
	}
	else if(convertmode == "uv_lightmap")
	{
		 matfile = VFS.Open("outputpath/materials.xml",1);
		 matxml.WritetoFile(matfile);
	
		 wfile = VFS.Open("outputpath/world.xml",1);
		 tworldxml.WritetoFile(wfile);
	}
	else
	{
		System.exitcode = 43;
		alert("Error Code 43 : Convert mode is not support.\n",
			"Convert mode : " + convertmode + "\n");
		exit();
	}
	
// END