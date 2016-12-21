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

try {
	//转换完成，访问生成的xml文件outputfile
	if(!VFS.Exists(outputfile))
	{
		System.Report(outputfile+" does not exist", 2, "error");
	}
	
	var doc = new xmlDocument();
	var file = VFS.Open(outputfile);
	if(!doc.Parse(file))
	{
		System.Report("Parse "+outputfile+" failed", 2, "error");
	}

	var event_map = [];
	
	//遍历属性
	var TraverseAttr = function(node){
		var attrs = node.GetAttribute();
		while(attrs.HasNext()){
			var attr = attrs.Next();
			//alert("attr.name="+attr.name+"\nattr.value="+attr.value);
			switch(attr.name)
			{
				case "eventlist":
					var evt_list = node.GetAttribute("eventlist").value;
					var target = node.GetAttribute("id").value;
					event_map[target] = evt_list;
					break;
			}
		}
	}
	//遍历节点
	var TraverseNode = function(parent){
		var children = parent.GetChildren();
		while(children.HasNext()){
			var node = children.Next();
			TraverseAttr(node);
			TraverseNode(node);
		}
	}
	//获取根节点及其宽高值
	var node_html = doc.root.GetChild("html");
	TraverseNode(node_html);
	
	var subscribe_text = "";
	for(var target in event_map)
	{
		var evt_array = [];
		evt_array = event_map[target].split(";");
		for(var index in evt_array)
		{
			var text = "	on("+target+", \""+evt_array[index]+"\", function(e){});\n"
			subscribe_text =  subscribe_text.concat(text);
		}
	}
	var content = "require([\"dojo/on\"], function(on){\n\
"+subscribe_text+"\
});";
	
	if(VFS.WriteFile(work_path+"/output/script.js", content))
	{
		alert("transform successfully!");
	}

}catch(e){
	alert('error: ',e);
}