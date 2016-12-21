//this is a test.

try {
	var CONSOLE = Registry.Get("iConsole");
	//获得执行参数
	var allOpt = false;
	var guideOpt = false;
	allOpt = CmdLine.GetOption("all");
	guideOpt = CmdLine.GetOption("guide");
	CONSOLE.WriteLine(allOpt);
	CONSOLE.WriteLine(guideOpt);
    a=new xmlDocument();
	yangxiuwu = new xmlDocument();
	yangroot = yangxiuwu.CreateRoot();
    b=VFS.Open("test.xgml");
	var flag = a.Parse(b);
	CONSOLE.WriteLine(flag);
	if(!flag){
		alert("文件没有打开，请检查");
	}
	//获取跟节点的名字为"section"的子节点
    rc = a.root.GetChild("section");
	//输出的节点的名称
    CONSOLE.WriteLine(rc.value);
	//获取该节点的所有属性
    sectionAttribute = rc.GetAttribute();
	//输出属性"name"的值
    CONSOLE.WriteLine(rc.GetAttribute("name").value);
    sectionName = sectionAttribute.Next();
	//输出第一个属性名
    CONSOLE.WriteLine(sectionName.name);
	//输出第一个属性的值
    CONSOLE.WriteLine(sectionName.value);
	//获取第一个名称为"section"的几点
    sectionXgmlSection=rc.GetChild("section");
	//输出其父节点名称
    CONSOLE.WriteLine(sectionXgmlSection.parent.value);
	//sectionXgmlSection的属性name的值graph
    CONSOLE.WriteLine(sectionXgmlSection.GetAttribute("name").value);
    sectionXgmlChildren = sectionXgmlSection.GetChildren();
	//该值sectionXgmlChildrenCount应该是xgml文件中node和edge的个数和加3
	sectionXgmlChildrenCount = sectionXgmlChildren.GetEndPosition();
	var i = 0;
	CONSOLE.WriteLine("sectionXgmlChildrenCount = " + sectionXgmlChildrenCount);
	do
	{
		sectionXgmlChildrenCount--;
		sectionGraph = sectionXgmlChildren.Next();
		CONSOLE.WriteLine("sectionGraphValue = " + sectionGraph.value);
		if("section" == sectionGraph.value){
			CONSOLE.WriteLine("true");
			sectionGraphSection = sectionGraph.GetAttribute("name").value;
			if("node" == sectionGraphSection){
				//node
				CONSOLE.WriteLine(sectionGraphSection);
				sectionGraphChildren = sectionGraph.GetChildren();
				sectionNodeID = sectionGraphChildren.Next().contentsValue;
				CONSOLE.WriteLine("sectionNodeID = "+ sectionNodeID);
				sectionNodeLabel = sectionGraphChildren.Next().contentsValue;
				CONSOLE.WriteLine("uuu "+ sectionNodeLabel);
				//接收该参数时的功能体现为定点的导出，目前因为解析不了中文，暂时没有用到
				if(guideOpt){
					childn__n = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
					childn__n.value = "n__n" + i;
					// childText.SetAttribute("value",sectionNodeLabel);
					
					
					//输出节点的名称
					childText = childn__n.CreateChild(xmlDocument.NODE_ELEMENT);
					childText.value = "text";
					childText.SetAttribute("value",sectionNodeLabel);
					// alert(sectionNodeLabel)
					
					childTextChinese = childText.CreateChild(xmlDocument.NODE_ELEMENT);
					childTextChinese.value = "chinese";
					// childTextChinese.SetAttribute("",sectionNodeLabel);
					
					childTextEnglish = childText.CreateChild(xmlDocument.NODE_ELEMENT);
					childTextEnglish.value = "english";
					// childTextEnglish.SetAttribute("value",sectionNodeLabel);
					
					childSoundUrl = childn__n.CreateChild(xmlDocument.NODE_ELEMENT);
					childSoundUrl.value = "SoundUrl";
					// childSoundUrl.SetAttribute("value",sectionNodeLabel);
					
					childSoundUrlChinese = childSoundUrl.CreateChild(xmlDocument.NODE_ELEMENT);
					childSoundUrlChinese.value = "chinese";
					// childSoundUrlChinese.SetAttribute("",sectionNodeLabel);
					
					childSoundUrlEnglish = childSoundUrl.CreateChild(xmlDocument.NODE_ELEMENT);
					childSoundUrlEnglish.value = "english";
					// childSoundUrlEnglish.SetAttribute("value",sectionNodeLabel);
					
					childChinese = childn__n.CreateChild(xmlDocument.NODE_ELEMENT);
					childChinese.value = "chinese";
					// childChinese.SetAttribute("value",sectionNodeLabel);
					
					childEnglish = childn__n.CreateChild(xmlDocument.NODE_ELEMENT);
					childEnglish.value = "english";
					// childEnglish.SetAttribute("",sectionNodeLabel);
				}
				//节点的获取是一层层的，需要或得中间子节点
				sectionGraphics = sectionGraph.GetChild("section");
				sectionGraphicsName = sectionGraphics.GetAttribute("name").value;
				CONSOLE.WriteLine(sectionGraphicsName);
				nodeSectionGraphicsAttribute = sectionGraphics.GetChild("attribute");
				nodeSectionGraphicsAttributeKey = nodeSectionGraphicsAttribute.GetAttribute("key").value;
				CONSOLE.WriteLine(nodeSectionGraphicsAttributeKey);
				//获得sectionGraphics的全部子节点
				sectionGraphicsChildren = sectionGraphics.GetChildren();
				sectionGraphicsChildrenNext = sectionGraphicsChildren.Next();
				CONSOLE.WriteLine("X" + sectionGraphicsChildrenNext.GetAttribute("key").value);
				//获得节点Key，并计算成3DMax中对应的值
				//X坐标的操作
				xPosition = sectionGraphicsChildrenNext.contentsValue;
				xPositionMax = (0.29793848187628)*xPosition + (-311.2572974753868);
				if(allOpt){
					//直接输出yEd中节点的X坐标
					childx = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
					childx.value = "yEd中节点的X坐标";
					childx.SetAttribute("value",xPosition);
					//输出yEd转换为Max中节点的X坐标
					childxx = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
					childxx.value = "转换为Max中节点的X坐标";
					childxx.SetAttribute("value",xPositionMax);
				}
				//打印节点Key属性的名称(x)和没有计算转换的子节点的值
				CONSOLE.WriteLine("X" + sectionGraphicsChildrenNext.GetAttribute("key").value);
				CONSOLE.WriteLine("yEd中X的value = "+ xPosition + "    转换后的3DMax的value = " + xPositionMax);
				sectionGraphicsChildrenNext = sectionGraphicsChildren.Next();
				//Y坐标的操作
				yPosition = sectionGraphicsChildrenNext.contentsValue;
				yPositionMax = (-0.2977459282842601)*yPosition + (354.4022616997787);  
				if(allOpt){
					//直接输出yEd中节点的Y坐标
					childy = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
					childy.value = "yEd中节点的Y坐标";
					childy.SetAttribute("value",yPosition);
					//输出yEd转换为Max中节点的Y坐标
					childyy = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
					childyy.value = "转换为Max中节点的Y坐标";
					childyy.SetAttribute("value",yPosition);
				}
				//打印节点Key属性的名称(y)和没有计算转换的子节点的值
				CONSOLE.WriteLine("Y" + sectionGraphicsChildrenNext.GetAttribute("key").value);
				CONSOLE.WriteLine("yEd中Y的value = "+ yPosition + "    转换后的3DMax的value = " + yPositionMax);
				//输出定义的三维信息，此时坐标的对应关系
				/**
					yEd的x对应3DMax的x；yEd的y对应3DMax的z；3DMax的y由开发者指定；
				*/
				childvar = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
				childvar.value = "var v"+sectionNodeID+"= ["+xPositionMax+", 0, "+yPositionMax+"];";
				//输出创建节点的JS方法
				childNode = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
				childNode.value = "var gn"+sectionNodeID+" = celgraph.CreateNode('n"+sectionNodeID+"',v"+sectionNodeID+");"
				sectionGraphicsChildrenNext = sectionGraphicsChildren.Next();
				//w
				CONSOLE.WriteLine("W" + sectionGraphicsChildrenNext.GetAttribute("key").value);
				CONSOLE.WriteLine(sectionGraphicsChildrenNext.contentsValue);//获得子节点的值，直接拿
				sectionGraphicsChildrenNext = sectionGraphicsChildren.Next();
				//h
				CONSOLE.WriteLine("H" + sectionGraphicsChildrenNext.GetAttribute("key").value);
				CONSOLE.WriteLine(sectionGraphicsChildrenNext.contentsValue);//获得子节点的值，直接拿
			}
			if("edge" == sectionGraphSection){
				//edge
				CONSOLE.WriteLine(sectionGraphSection);
				edgeattribute = sectionGraph.GetChildren();
				ppp = edgeattribute.Next();
				from = ppp.contentsValue;
				//输出"contentsValue"属性
				CONSOLE.WriteLine(ppp.GetAttribute("key").value);
				CONSOLE.WriteLine(from);
				ppp = edgeattribute.Next();
				to = ppp.contentsValue
				//输出"contentsValue"属性
				CONSOLE.WriteLine(ppp.GetAttribute("key").value);
				CONSOLE.WriteLine(to);
				if(allOpt){
					// 输出节点直接关系
					childFrom = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
					childFrom.value = "两点之间的关系fromTo";
					childFrom.SetAttribute("from",from);
					childFrom.SetAttribute("to",to);
				}
				//输出创建的节点的关系
				childEdge = yangroot.CreateChild(xmlDocument.NODE_ELEMENT);
				childEdge.value = "celgraph.AddEdge(gn" + from + ", gn" + to + ", true);"
			}
		}
	}while(sectionXgmlChildrenCount > 0)
    b=VFS.Open("json_autorun.js",1);
	//将操作以后的xml写入文件"good.js"中
    yangxiuwu.WritetoFile(b);
}catch(e){
    alert('error:',e);
}

System.Quit();