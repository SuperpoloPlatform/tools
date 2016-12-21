macroScript SPP_buildTool
category:"Superpolo"
ButtonText:"Build ToolSet" 
tooltip:"Spp Build ToolSet" Icon:#("Maxscript",2)
(

	
	fn getCmdPath = 
	(--得到项目的路径 

		p =maxFilePath
		cmd_p = ""
		cmd = ""
		if p != "" then 
		(-- 判断是否保存文件
			p_arr = filterString p "\\"
			projectPath = p_arr[1] + "\\" + p_arr[2]
			if p_arr.count>3 and projectPath == "D:\p" then 
			(
				cmd_p = p_arr[1] + "\\" + p_arr[2] + "\\" + p_arr[3]
				cmd = "cd /d " +cmd_p
			)else
			(
				messagebox "请保存在正确的项目目录下！"
			)
			
		)else
		(
			messagebox "请保存场景！"
		)
		cmd

	)
-- 	 getCmdPath()
	-- 查看build帮助
	-- cmd = getCmdPath()
	-- DOSCommand (cmd + " -h & pause")
	--------------------------------------------
	--重新构建项目，并生成安装包
	-- cmd = getCmdPath()
	-- DOSCommand (cmd + "-publish")

	rollout builder "引擎查看器" width:246 height:303
	(
		button btn1 "本体预览" pos:[27,35] width:193 height:22
		GroupBox grp1 "本体查看器" pos:[11,11] width:222 height:57
		GroupBox grp2 "场景查看器" pos:[11,80] width:223 height:214
		button btn3 "动态光计算" pos:[21,100] width:203 height:27
		button btn4 "低品质烘焙" pos:[22,130] width:202 height:27
		button btn5 "只改过贴图，点击此按钮更新计算" pos:[15,225] width:216 height:27
		button btn6 "精度烘焙" pos:[111,179] width:112 height:27
		dropdownList ddl1 "精细度" pos:[26,164] width:77 height:41 items:#("25", "49", "100", "225", "400")
		button btn47 "预览" pos:[23,255] width:198 height:29
		on btn1 pressed do
		(
			messagebox"建设中！！！"
		)
		on btn3 pressed do
		(
			-- 动态灯光build
			cmd = getCmdPath()
			if cmd != "" do
			(
	-- 			DOSCommand (cmd+" & sppbuild")
				cmdstr = "/C \"" +	cmd+" & sppbuild"
				ShellLaunch "cmd" cmdstr	
				
			)
		)
		on btn4 pressed do
		(
			--采用默认参数烘焙场景，默认值为16
			cmd = getCmdPath()
			if cmd != "" do
			(
-- 				DOSCommand (cmd +" & sppbuild --lighter")
				cmdstr = "/C \"" + cmd +" & sppbuild --lighter"
				ShellLaunch "cmd" cmdstr
			)
		)
		on btn5 pressed do
		(
			-- 增量式构建，不清空target目录
			cmd = getCmdPath()
			if cmd != "" do
			(
				
-- 				DOSCommand (cmd + " & sppbuild --build")
				cmdstr = "/C \"" + cmd + " & sppbuild --build"
				ShellLaunch "cmd" cmdstr
			)
		)
		on btn6 pressed do
		(
			--指定参数烘焙场景，默认值为16
			cmd = getCmdPath()
			if cmd != "" do
			(
				inten = ddl1.selected 
-- 				DOSCommand (cmd + " & sppbuild --lighter2=" + inten )
				cmdstr = "/C \"" + cmd + " & sppbuild --lighter2=" + inten 
				ShellLaunch "cmd" cmdstr
			)
		)
		on btn47 pressed do
		(
			-- 清空target目录
			cmd = getCmdPath() 
			if cmd != "" do
			(
				--DOSCommand (cmd + "\\target & spp --tools=\"viewscene\"")
				cmdstr = "/C \"" + cmd + "\\target & spp --tools=viewscene\""
				-- messageBox cmdstr
				ShellLaunch "cmd" cmdstr
			)
		)
	)
	try(destroyDialog builder)catch()
	CreateDialog builder
)



