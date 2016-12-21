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


	// Class WriteRoleXml
	function WriteRoleXml(){
		this.Rolexml=function(){
		xmlString = "<application type='school'>"
		xmlString += "\n\t<roleSelect>"
		xmlString += "\n\t\t<role>"
		xmlString += "\n\t\t\t<position>["+(roleSelectNode.pos.x as string)+","+(roleSelectNode.pos.z as string)+","+(roleSelectNode.pos.y as string)+"]</position>" 
		xmlString += "\n\t\t\t<rotation></rotation>"
		xmlString += "\n\t\t</role>"
		xmlString += "\n\t\t<camrea>"
		xmlString += "\n\t\t\t<position></position>"
		xmlString += "\n\t\t\t<rotation></rotation>"
		xmlString += "\n\t\t</camrea>"
		xmlString += "\n\t</roleSelect>"
		
		xmlString += "\n\t<roleInitialize>"
		xmlString += "\n\t\t<role>"
		xmlString += "\n\t\t\t<position></position>" 
		xmlString += "\n\t\t\t<rotation></rotation>"
		xmlString += "\n\t\t</role>"
		xmlString += "\n\t\t<camrea>"
		xmlString += "\n\t\t\t<position></position>"
		xmlString += "\n\t\t\t<rotation></rotation>"
		xmlString += "\n\t\t</camrea>"
		xmlString += "\n\t</roleInitialize>"
		xmlString +="\n</application>"
		alert("true321");
		var file_to_write = VFS.Open("role.xml",VFS.WRITE);
		
		alert(VFS.WriteFile("role.xml",xmlString));
		
		//VFS.WriteFile("D:\ACB.txt","DSFASDFA");
		//VFS.ReadFile("D:\ACB.txt").GetString();
		}
	
	}

				

	