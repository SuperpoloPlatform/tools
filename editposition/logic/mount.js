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

	//为路径末尾添加一个路径分割符——如果不是以分隔符结尾。
	function  AppendSeperator(path)
	{
		if(path.length == 0)
			return ((System.osName == "win32") ? "\\" : "/");

		var lastchar = path.charAt(path.length-1);
		if(lastchar != '/' && lastchar != '\\')
		{
			return path + ((System.osName == "win32") ? "\\" : "/");
		}
		return path;
	}
	
	function GetFullPath(path)
	{
		var fullpath;
		if(System.osName == "win32")
		{
			if(path.length > 2 && path[1] == ':')
			{
				fullpath = path;
			}else{
				fullpath = System.StartupPath()　+ "\\";
				fullpath += path;
			}
		}else{
			if(path[0] == '/')
			{
				fullpath = path;
			}else{
				fullpath = System.StartupPath() + "/";
				fullpath += path;
			}
		}
		return fullpath;
	}
	

	//Mount Root路径。
	//第一个选项是从命令行的rootdir获取。
	var rootdir = CmdLine.GetOption("rootdir");
	if(rootdir)
	{
		VFS.Mount("/",AppendSeperator(GetFullPath(rootdir)));
	}else
	{//否则以当前路径为root路径。
		VFS.Mount("/",AppendSeperator(System.StartupPath()));
	}
	