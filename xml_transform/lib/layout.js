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
	
	//生成的布局文件等对应的分辨率
	var screen_width;
	var screen_height;
	
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

	//遍历属性
	var TraverseAttr = function(node){
		var attrs = node.GetAttribute();
		while(attrs.HasNext()){
			var attr = attrs.Next();
			//alert("attr.name="+attr.name+"\nattr.value="+attr.value);
			switch(attr.value)
			{
				case "UnifiedPosition":
					var position = node.GetAttribute("Value").value;
					var p_array = [];
					p_array = position.split(".");
					var parent = node.parent.parent;
					if(parent.value == "GUILayout")
					{
						node.SetAttribute("Value", "{{"+ p_array[0]/screen_width +",0},{"+ p_array[1]/screen_height +",0}}");
					}
					else
					{
						node.SetAttribute("Value", "{{"+ p_array[0]/p_array[2] +",0},{"+ p_array[1]/p_array[3] +",0}}");
					}
					break;
				case "UnifiedSize":
				case "UnifiedMaxSize":
				case "UnifiedMinSize":
					var size = node.GetAttribute("Value").value;
					var s_array = [];
					s_array = size.split(".");
					var parent = node.parent.parent;
					node.SetAttribute("Value", "{{"+ s_array[0]/screen_width +",0},{"+ s_array[1]/screen_height +",0}}");
					break;
				case "WindowType":
					var type = node.GetAttribute("Value").value;
					node.parent.SetAttribute("Type",type);
					node.parent.RemoveChildren (node);
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
	var nodeGuiLayout = doc.root.GetChild("GUILayout");
	var firstNode = nodeGuiLayout.GetChild("Window");
	var children = firstNode.GetChildren();
	children.Next();
	var size = children.Next().GetAttribute("Value").value;
	var array = [];
	array = size.split(".");
	screen_width = array[0];
	screen_height = array[1];

	TraverseNode(nodeGuiLayout);
	//将修改后的xml文件写回outputfile中
	var file = VFS.Open(outputfile, VFS.WRITE);
	if(doc.WritetoFile(file))
	{
		alert("transform successfully!");
	}
	file.Flush();

}catch(e){
	alert('error: ',e);
}