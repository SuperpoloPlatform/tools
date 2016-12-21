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
		scene = importer.ReadFile(filename, (importer.TargetRealtime_MaxQuality | importer.FlipUVs | importer.ConvertToLeftHanded | importer.JoinIdenticalVertices) & !importer.JoinIdenticalVertices);		//alert(scene);
		if(scene.HasAnimations())
		animfun(scene);
		//法线处理
		//scene.GenFaceNormal();
		//scene.GenVertexNormal("0.8");
		function animfun(scene)
		{
			if(!scene.HasAnimations())
			{
				alert("This scene has not Animations!");
				return ;
			}
			var ani = scene.GetAnimations();
			
			var animxml = new xmlDocument();
			var animxmlrt = animxml.CreateRoot();
			
			var sequences = animxmlrt.CreateChild(animxml.NODE_ELEMENT);
			sequences.value = "sequences";
			for(var ai = 0;ai<ani.length;ai++)
			{
				// alert(ani[ai].GetName());
				// alert(ani[ai].GetDuration());
				// alert(ani[ai].GetTicksPerSecond());
				// alert(ani[ai].GetNumChannels());
				// alert(ani[ai].GetNumMeshChannels());
				var channels = ani[ai].GetChannels();
				var sequence  = sequences.CreateChild(animxml.NODE_ELEMENT);
				sequence .value = "sequence";
				sequence.SetAttribute("name",ani[ai].GetName());
				
				// alert(channels.length);
				for(var ci = 0;ci<channels.length;ci++)
				{
					// alert(channels[ci].GetNodeName());
					// alert(channels[ci].GetNumPositionKeys());
					// alert(channels[ci].GetScalingKeys(0).GetTime());
					// alert(channels[ci].GetScalingKeys(0).GetValue())
					var positionkeys = channels[ci].GetPositionKeys();
					var rotationkeys = channels[ci].GetRotationKeys();
					for(var i = 1;i <positionkeys.length || i <rotationkeys.length;i++)
					{
						if(i >= positionkeys.length)
						{
							var positionnode = sequence.CreateChild(animxml.NODE_ELEMENT);
							positionnode.value = "move";
							positionnode.SetAttribute("mesh",channels[ci].GetNodeName());
							positionnode.SetAttribute("duration",ani[ai].GetDuration());
							positionnode.SetAttribute("x",0);
							positionnode.SetAttribute("y",0);
							positionnode.SetAttribute("z",0);
						}
						else
						{
							var positionnode = sequence.CreateChild(animxml.NODE_ELEMENT);
							positionnode.value = "move";
							positionnode.SetAttribute("mesh",channels[ci].GetNodeName());
							positionnode.SetAttribute("duration",ani[ai].GetDuration());
							positionnode.SetAttribute("x",Math.round(positionkeys[i].GetValue()[0]*10000)/10000-Math.round(positionkeys[i-1].GetValue()[0]*10000)/10000);
							positionnode.SetAttribute("y",-(Math.round(positionkeys[i].GetValue()[2]*10000)/10000-Math.round(positionkeys[i-1].GetValue()[2]*10000)/10000));
							positionnode.SetAttribute("z",Math.round(positionkeys[i].GetValue()[1]*10000)/10000-Math.round(positionkeys[i-1].GetValue()[1]*10000)/10000);
						}

						if(i >= rotationkeys.length)
						{
							var rotationnode = sequence.CreateChild(animxml.NODE_ELEMENT);
							rotationnode.value = "rotate";
							rotationnode.SetAttribute("mesh",channels[ci].GetNodeName());
							rotationnode.SetAttribute("duration",ani[ai].GetDuration());
							
							var rotx = rotationnode.CreateChild(animxml.NODE_ELEMENT);
							rotx.value = "rotx";
							var rotxc = rotx.CreateChild(animxml.NODE_TEXT);
							rotxc.value = 0;
							
							
							var roty = rotationnode.CreateChild(animxml.NODE_ELEMENT);
							roty.value = "roty";
							var rotyc = roty.CreateChild(animxml.NODE_TEXT);
							rotyc.value = 0;
							
							
							var rotz = rotationnode.CreateChild(animxml.NODE_ELEMENT);
							rotz.value = "rotz";
							var rotzc = rotz.CreateChild(animxml.NODE_TEXT);
							rotzc.value = 0;
						}
						else
						{
							var rotationnode = sequence.CreateChild(animxml.NODE_ELEMENT);
							rotationnode.value = "rotate";
							rotationnode.SetAttribute("mesh",channels[ci].GetNodeName());
							rotationnode.SetAttribute("duration",ani[ai].GetDuration());
							
							var rotx = rotationnode.CreateChild(animxml.NODE_ELEMENT);
							rotx.value = "rotx";
							var rotxc = rotx.CreateChild(animxml.NODE_TEXT);
							rotxc.value = Math.round(rotationkeys[i].GetValue().GetEulerAngles()[0]*10000)/10000-Math.round(rotationkeys[i-1].GetValue().GetEulerAngles()[0]*10000)/10000;
							
							
							var roty = rotationnode.CreateChild(animxml.NODE_ELEMENT);
							roty.value = "roty";
							var rotyc = roty.CreateChild(animxml.NODE_TEXT);
							rotyc.value = -(Math.round(rotationkeys[i].GetValue().GetEulerAngles()[2]*10000)/10000-Math.round(rotationkeys[i-1].GetValue().GetEulerAngles()[2]*10000)/10000);
							
							
							var rotz = rotationnode.CreateChild(animxml.NODE_ELEMENT);
							rotz.value = "rotz";
							var rotzc = rotz.CreateChild(animxml.NODE_TEXT);
							rotzc.value = Math.round(rotationkeys[i].GetValue().GetEulerAngles()[1]*10000)/10000-Math.round(rotationkeys[i-1].GetValue().GetEulerAngles()[1]*10000)/10000;
						}

					}
					
					// var rotations = animxmlrt.CreateChild(animxml.NODE_ELEMENT);
					// rotations.value = "rotations";
					// var rotationkeys = channels[ci].GetRotationKeys();
					// for(var i = 0;i <rotationkeys.length;i++)
					// {
						// //alert(rotationkeys[i].GetValue().Rotate());
				
						// var rotationnode = rotations.CreateChild(animxml.NODE_ELEMENT);
						// rotationnode.value = "rotation";
						// rotationnode.SetAttribute("time",rotationkeys[i].GetTime());
						// rotationnode.SetAttribute("x",Math.round(rotationkeys[i].GetValue().GetEulerAngles()[0]*10000)/10000);
						// rotationnode.SetAttribute("y",Math.round(rotationkeys[i].GetValue().GetEulerAngles()[1]*10000)/10000);
						// rotationnode.SetAttribute("z",Math.round(rotationkeys[i].GetValue().GetEulerAngles()[2]*10000)/10000);
					// }
				}
			
			}
			var fl=VFS.Open("outputpath/" +filename+ "_sequences.xml",VFS.WRITE);
			animxml.Write(fl);
		}
		
		
	}
		
		
}catch(e){
    alert('error:',e);
}

System.Quit();