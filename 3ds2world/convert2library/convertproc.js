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