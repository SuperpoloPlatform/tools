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
	Plugin.Load("spp.script.ipc");
	Event.Send("application.open",true);
	
	//命令行选项索引
	var optIndex = 0;
	
	//启动xsltproc时传人的命令行参数数组
	var args = [];
	var argsIndex = 0;
	
	//生成的xml文件名称
	var outputfile;
	//生成的xml文件类型
	var outputfileType;
	var work_path = "";
	/*
	解析命令行，将spp命令行参数转换为xsltproc命令行参数
	*/

	outputfile = CmdLine.GetOption('output');
	var xsltfile = CmdLine.GetOption('xslt');
	var inputfile = CmdLine.GetOption('input');
	if(!outputfile)
	{
		alert("you have lost the option [--output=] ");
	}
	if(!xsltfile)
	{
		alert("you have lost the option [--xslt=] ");
	}
	if(!inputfile)
	{
		alert("you have lost the option [--input=] ");
	}
	var array = [];
	array = outputfile.split(".");
	outputfileType = array[1];
	outputfile = "/output/"+outputfile;
	
	var xsltproc_args = [];
	xsltproc_args[0] = "-o";
	xsltproc_args[1] = ".."+outputfile;
	xsltproc_args[2] = "../xslt/"+xsltfile;
	xsltproc_args[3] = "../input/"+inputfile;
	
	//执行xsltproc进程完成xslt转换
	var path = "/xsltproc/xsltproc.exe";
	if(CmdLine.GetOption("tools"))
	{
		outputfile = "/tools"+outputfile;
		path = "/tools"+path;
		work_path = "/tools";
	}
	var pipes = ["", "", "pipeError_1"];
	System.Report("xsltproc.exe "+xsltproc_args, 0, "xslt_transform");
	var childProcess = IPC.StartProcess(path, xsltproc_args, pipes);
	var ret = childProcess.join(); 
	//判断子进程返回码，如果xslt转换失败，spp退出
	switch(ret)
	{
		case 0:
			System.Report("normal", 0, "xslt_transform");
			break;
		case 1:
			alert("no argument");
			exit(1);
		case 2:
			alert("too many parameters");
			exit(1);
		case 3:
			alert("unknown option");
			exit(1);
		case 4:
			alert("failed to parse the stylesheet");
			exit(1);
		case 5:
			alert("error in the stylesheet");
			exit(1);
		case 6:
			alert("error in one of the documents");
			exit(1);
		case 7:
			alert("unsupported xsl:output method");
			exit(1);
		case 8:
			alert("string parameter contains both quote and double-quotes");
			exit(1);
		case 9:
			alert("internal processing error");
			exit(1);
		case 10:
			alert("processing was stopped by a terminating message");
			exit(1);
		case 11:
			alert("could not write the result to the output file");
			exit(1);
	}
	//根据输出文件的名称后缀来
	switch(outputfileType)
	{
		case "layout":
				if(!load(work_path+"/lib/layout.js"))
				{
					System.Report("Failed to load 'layout.js'", 1, "xslt_transform");
				}
				break;
		case "imageset":
				break;
		case "html":
				if(!load(work_path+"/lib/dojo_html.js"))
				{
					System.Report("Failed to load 'dojo_html.js'", 1, "xslt_transform");
				}
				break;
		default:
			alert("No designated output file types!");
			exit(1);
	}
	
	System.Quit();
	
}catch(e){
	alert('error: ',e);
}