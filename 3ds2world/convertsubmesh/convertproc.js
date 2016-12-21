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
	
	
	
	
	
	
	
	
	
	function CheckTexture(texturesnode,texturename)
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
	
	
	
	
	function CheckMaterial(materialsnode,materialname)
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
	
	
	
	function FindMeshName(scene,meshname)
	{
		var mai = new Array();
		for(var jr=0;jr<scene.rootNode.numChildren;jr++)
		{
			var ainode = scene.rootNode.GetChildren(jr)
			if(ainode.GetMeshIndex() == undefined)
			{
				continue;
			}
			for(var mci =0 ;mci<ainode.GetMeshIndex().length; mci++)
			{
				//alert(jr);
				//alert(scene.rootNode.GetChildren(jr).GetMeshIndex());
				//修改其中的library信息
				var mesh = scene.GetMeshes(ainode.GetMeshIndex(mci));
				if(mesh.GetName() == meshname)
				{
					mai.push(ainode.GetMeshIndex(mci));
				}
			}
		}
		return mai;
	}