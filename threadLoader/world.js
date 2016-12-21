//this is a test.

try {
	var CONSOLE = Registry.Get("iConsole");
	//获得执行参数
	var allOpt = false;
	allOpt = CmdLine.GetOption("all");
	alert(allOpt);
    a=new xmlDocument();
	yangxiuwu = new xmlDocument();
	yangroot = yangxiuwu.CreateRoot();
    b=VFS.Open("world.xml");
	var flag = a.Parse(b);
	alert(flag);
	if(!flag){
		alert("文件没有打开，请检查");
	}
	//获取跟节点的名字为"world"的子节点
    rc = a.root.GetChild("world");
	//输出的节点的名称
    alert(rc.value);
	//获取该节点的所有属性
    sectionAttribute = rc.GetAttribute();
	//获取第一个名称为"section"的几点
    sectionXgmlSection=rc.GetChild("sector");
	//sectionXgmlSection的属性name的值graph
    alert(sectionXgmlSection.GetAttribute("name").value);
    sectionXgmlChildren = sectionXgmlSection.GetChildren();
	//该值sectionXgmlChildrenCount应该是xgml文件中node和edge的个数和加3
	sectionXgmlChildrenCount = sectionXgmlChildren.GetEndPosition();
	alert("sectorChildren = " + sectionXgmlChildrenCount);
	do
	{
		sectionXgmlChildrenCount--;
		sectionGraph = sectionXgmlChildren.Next();
		alert("sectionGraphValue = " + sectionGraph.value);
		if("meshobj" == sectionGraph.value){
			alert(sectionGraph.value);
			sectionGraphSection = sectionGraph.GetAttribute("name").value;
			alert(sectionGraphSection);//meshobj's name
			
			meshobjChildren = sectionGraph.GetChild("move");
			meshobjChild = meshobjChildren.value;
			
			alert(meshobjChild);
			
			moveValueX = meshobjChildren.GetChild("v").GetAttribute("x").value;
			moveValueY = meshobjChildren.GetChild("v").GetAttribute("y").value;
			moveValueZ = meshobjChildren.GetChild("v").GetAttribute("z").value;
			alert(moveValueX);
			
			if((124.90711212158203 - 50) < moveValueX
				&& moveValueX < 124.90711212158203
				|| (-319.63427734375 - 50) < moveValueZ
				&& moveValueZ < -319.63427734375)
			{
				alert(0);
				alert(sectionGraphSection);
			}
		}
	}while(sectionXgmlChildrenCount > 0)
    b=VFS.Open("json_guides_lishiwenhua.xml",1);
	//将操作以后的xml写入文件"good.js"中
    yangxiuwu.WritetoFile(b);
}catch(e){
    alert('error:',e);
}

System.Quit();