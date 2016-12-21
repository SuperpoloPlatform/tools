//
function mergexml(){
	this.listmat = new Array();
	this.listtex = new Array();
	this.listmesh = new Array();
	var effect_mat_rootc,effect_tex_rootc,effect_xmlt,meshindex,matindex;
	this.listmeshnode = new Array();
	this.listmatnode = new Array();
	
  }
//获得effect.xml中mat结点下的贴图名字   
mergexml.prototype.gettexlist = function(node){
	var itMainNode = node.GetChildren();
	var i = 0;
	while(itMainNode.HasNext())
	{
		var node = itMainNode.Next();
		var attrs = node.GetAttribute();
		while(attrs.HasNext()){
			var attr = attrs.Next();
			if(attr.value == "texture")
			{
				this.listtex[i] = node.contentsValue;
				i++;
			}
		}
	}
}
//获得effect.xml文件中mat名字
 mergexml.prototype.getmatlist = function(node){
	 var meshchild = node.GetChildren();
	 var i = 0;
	 while(meshchild.HasNext()){
		  var nodes = meshchild.Next();
		  var attrs = nodes.GetAttribute();
		  while(attrs.HasNext()){
			   var attr = attrs.Next();
			   this.listmat[i] = attr.value;//似乎有不妥之处;
			   this.listmatnode[i]= nodes;
			  // alert("listmat i : "+i);
			   i++;
		   } 
	  }
	  /* for(i=0;i<this.listmat.length;i++)
	  alert("this.listmat[i] : "+this.listmat[i]); */
 }
 //获得effect.xml文件中mat名字
mergexml.prototype.getmeshlist = function(){
	if(this.isopenxml == true)
	{
	//alert("1 : ");
		this.effect_tex_rootc= this.effect_xmlt.root.GetChildren();
		liblabel = this.effect_tex_rootc.Next();
		var i = 0;
		var itMainNode = liblabel.GetChildren();
		while(itMainNode.HasNext())
		{
			var node = itMainNode.Next();
		    var attrs = node.GetAttribute();
			while(attrs.HasNext()){
			var attr = attrs.Next();
			this.listmesh[i] = attr.value;
			this.listmeshnode[i] = node;
			//alert("lismesh i : "+this.listmeshnode[i]);
			i++;
			}
		}
	}
	/* for(i = 0;i<this.listmesh.length;i++)
		alert(" listmesh : "+this.listmeshnode[i]); */
	// for(i = 0;i<this.listmesh.length;i++)
		// alert(" listmesh : "+this.listmesh[i]);
}
//添加效果到xml树上
mergexml.prototype.addeffect = function(materialnode){
		matnode = this.listmatnode[this.matindex];
		this.CopyNodes(materialnode,matnode);
		this.addtexs(matnode);
	}
//打开effect.xml文件
mergexml.prototype.openxml = function(){
	this.effect_xmlt = new xmlDocument();
	var effect_fread = VFS.Open("/effect/effect.xml",VFS.READ);
	if(effect_fread != undefined)
	{
		var parseflag = this.effect_xmlt.Parse(effect_fread);
		if(parseflag)
			this.isopenxml = true;
	}
}
//将贴图添加到xml树上以及textures文件中
mergexml.prototype.addtexs = function(meshfact){
	this.gettexlist(meshfact);
	for(n =0;n<this.listtex.length;n++)
	{
		textRealNames = this.listtex[n]/* .contentsValue */
		// 检测xml文件中是否已经存在该贴图了。
		if(!VFS.Exists("/data/effectextures/"+textRealNames))
		{
			alert("没有" + textRealNames + "效果贴图,请更新spp_sdk");
		}else
		{
			if(!importer.CheckTexture(textures,textRealNames))
			{	
				this.addTextureNode(textures,textRealNames);
			}
		}
	}
}

mergexml.prototype.addTextureNode = function (texturesnode, texturePath) {
    VFS.Copy("/data/effectextures/"+texturePath,"outputpath/textures/effectextures/"+texturePath);
	var usepath = CmdLine.GetOption("usepath");//修改其中的textures信息
    var texturen = texturesnode.CreateChild(xmlDocument.NODE_ELEMENT);  //在textures节点下创建texture子节点
    texturen.value="texture";
    texturen.SetAttribute("name",texturePath);
    var texturef = texturen.CreateChild(xmlDocument.NODE_ELEMENT);
    texturef.value="file";
    var tfn = texturef.CreateChild(xmlDocument.NODE_TEXT);   //file中的路径信息可以看做是它的子节点，通过contentsValue可以获取到
    tfn.value = usepath+"/textures/effectextures/"+texturePath;    //添加路径信息
    return texturen;
};

mergexml.prototype.CopyNodes = function(dnode, snode){ 
	var itMainNode = snode.GetChildren();
	 while(itMainNode.HasNext())
	{
			var mat = dnode.CreateChild(xmlDocument.NODE_ELEMENT);
			var node = itMainNode.Next();
			//alert("node value="+node.value);
			this.CopyNodess(mat,node);
	}
    return true;
};

mergexml.prototype.CopyNodess = function(dnode, snode){   //参数均为iDocumentNode对象
    dnode.value = snode.value;
    var sai = snode.GetAttribute();  //获取snode的所有属性的迭代器
    for(;sai.HasNext();)      //扫描所有属性
    {
        var att = sai.Next();    //获取属性
        dnode.SetAttribute(att.name,att.value);   //为dnode创建相同的属性名
    }
    var sci = snode.GetChildren();   //获取snode的所有子节点的迭代器
    for(;sci.HasNext();)     //扫描所有的子节点
    {
        var tchild = sci.Next();
        
        if(!this.CopyNodess(dnode.CreateChild(tchild.type),tchild))  //检查执行是否成功
        {
             System.exitcode = 32;
            //alert("Child Node copy error!");
        }
    }
    return true;
};

mergexml.prototype.IsAddEffect = function(material){
	var strname = material.GetPropertyName(0);
	var findflag =false;			
	if(this.listmat.length > 0)
	{
		for(i=0;i<this.listmat.length;i++)
		{
			if(strname==this.listmat[i])
			{
				findflag = true;
				break;
			}
		}
	}
	return findflag;
}

mergexml.prototype.IsMesh = function(meshname){
	//var strname = material.GetPropertyName(0);
	var findflag =false;	
	//alert("this.listmesh.length :"+this.listmesh.length);
	if(this.listmesh.length > 0)
	{
	//alert(" mesh : ");
		for(i=0;i<this.listmesh.length;i++)
		{
		//alert(" mesh : "+meshname + " : "+this.listmesh[i]);	
			if(meshname==this.listmesh[i])
			{
				/* alert(" mesh : "+meshname + " : "+this.lismesh[i]);	 */
				this.meshindex = i;
			//	alert("meshindex : "+i);
				findflag = true;
				break;
			}
		}
	}
	return findflag;
}

mergexml.prototype.IsMat = function(node,material){
	 //this.getmatlist(node);
	// alert("ismat: "+this.meshindex);
	 this.getmatlist(this.listmeshnode[this.meshindex]);
	 //alert("length: "+this.listmat.length);
	 var strname = material.GetPropertyName(0);
	 var findflag =false;   
	 if(this.listmat.length > 0)
	 {
	  for(i=0;i<this.listmat.length;i++)
	  {
	  //alert("现在list有: "+this.listmat[i]);
	   if(strname==this.listmat[i])
	   {
		findflag = true;
		this.matindex = i;
		//alert("matindex : "+i);
		break;
	   }
	  }
	 }
	 return findflag;
	 
}

mergexml.prototype.isopen = function(){
	if(this.listmesh.length >0)
	{
		this.isopenxml = true;
	}
	else
	{
		this.isopenxml = false;
	}
}

//未实现
mergexml.prototype.CheckMaterial = function (materialsnode, aimaterial) {
	return true;
};

if(callbacks.Choice["mergexmls"]){
//alert("mergexmls");
mg = new mergexml();
mg.openxml();
mg.getmeshlist();
//mg.getmatlist();
//mg.isopen();
}