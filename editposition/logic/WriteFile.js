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

	// Class WriteFile
	function WriteFile(){
	
		//addFile方法创建文件 写入内容
		this.addFile=function(route,text){
		var file_to_write = VFS.Open(route,VFS.WRITE);
		var content=text;
		VFS.WriteFile(route,content);
		
		//VFS.WriteFile("D:\ACB.txt","DSFASDFA");
		//VFS.ReadFile("D:\ACB.txt").GetString();
		}
	
	}