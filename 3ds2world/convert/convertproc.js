try {
	
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
	
	
	
	function FindMaterial(materials,materialname)
	{
		var materialit = materials.GetChildren();
		for(;materialit.HasNext();)
		{
			materialnode = materialit.Next();
			if(materialnode.GetAttribute("name").value == materialname)
			{
				return materialnode;
			}
		}
		return undefined;
	}
	
	
	
	
	function CopyNode(dnode,snode)
	{	
	    dnode.value = snode.value;
		var sai = snode.GetAttribute();
		for(;sai.HasNext();)
		{
			var att = sai.Next();
			dnode.SetAttribute(att.name,att.value);
		}
		var sci = snode.GetChildren();
		for(;sci.HasNext();)
		{
			var tchild = sci.Next();
			
			if(!CopyNode(dnode.CreateChild(tchild.type),tchild))
			{
				alert("Child Node copy error!");
			}
		}
		return true;
	}
	
	/**
	 * @brief 判断<textures>节点中是否存在指定名称的贴图。
	 **/
	function CheckTexture(texturesnode, texturename)
	{
		var texturenodes = texturesnode.GetChildren();
		for(;texturenodes.HasNext();)
		{
			var texturechild = texturenodes.Next();
			if(texturechild.GetAttribute("name").value == texturename)
			{
				return true;
			}
		}
		return false;
	}
	
	/**
	 * @brief 判断<materials>节点中是否存在指定名称的材质。
	 **/
	function CheckMaterial(materialsnode, materialname)
	{
		var materialnodes = materialsnode.GetChildren();
		for(;materialnodes.HasNext();)
		{
			var materialchild = materialnodes.Next();
			if(materialchild.GetAttribute("name").value == materialname)
			{
				return true;
			}
		}
		return false;
	}
} catch(e) {
	alert(e);
}