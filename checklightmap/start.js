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


	

	var inputpath = CmdLine.GetOption("input");   

	var outputfile = CmdLine.GetOption("output");  
	
	
	
		
	
	var  fl = outputfile.length;
	for(;fl>=0;fl--)
	{
		if(outputfile[fl] == '\\')
		{
			break;
		}
	}
	var filename = outputfile.substr(fl+1,outputfile.length);

	var outputpath = outputfile.substr(0,fl+1);
	
	// alert(outputpath);

	VFS.Mount("/inputpath",inputpath);

	VFS.Mount("/outputpath",outputpath);

	var lightmapnames = VFS.FindFiles("/inputpath/");
	
	
	// alert(lightmapnames);
	
	
	var namearr = [];
	
	var a = 0;
	for(var ilp in lightmapnames)
	{
	    var mapname = lightmapnames[ilp].substr(11,lightmapnames[ilp].length);
		namearr[a] = mapname;
		a++;
	}
	
	// alert(namearr);
	
	
	var namestr = "";
	
	for(var i in namearr)
	{
		namestr += namearr[i] + "\n";
	}
	
	
	// alert(namestr);
	
	// alert(VFS.Exists("/outputpath/VRayLog.txt"));
	
	
	var file = VFS.Open("/outputpath/" + filename,1);
	
	file.Write(namestr,namestr.length);
	
// END