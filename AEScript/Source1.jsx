{
	function myComp()
	{
		//var thisComp=app.project.itemCollection.addComp();
		//var compFolder = app.project.items.addFolder("comps"); 
		thisComp.width=800;
		thisComp.height=600;
		thisComp.frameRate=24;
	};

	function myFile()
	{
		//alert("myFile()");
		//var my_import=new ImportOptions(File("d:\\Firefox_Downloads\\picture\\inter.png"));
		//下一句可用
		//app.project.importFile(new ImportOptions(File("d:\\Firefox_Downloads\\picture\\inter.png")));
		//var my_folder=Folder("D:\\Firefox_Downloads\\render");
		//var my_folder=app.project.rootFolder;
		//alert(my_folder);
		function SmartImport()
		{
			var targetFolder = new Folder("D:\\Firefox_Downloads\\render\\");//Folder.selectDialog("Import items from folder...");//new Folder("D:\\Firefox_Downloads\\render\\");
			if (targetFolder != null) {
				// If no project open, create a new project to import the files into.
				if (!app.project) {
					app.newProject();
				}
				
				
				function processFile(theFile)
				{
					try {
						// Create a variable containing ImportOptions.
						var importOptions = new ImportOptions(theFile);
						importSafeWithError(importOptions);
					} catch (error) {
						// Ignore errors.
					}
				}
				
				
				function testForSequence(files)
				{
					var searcher = new RegExp("[0-9]+");
					var movieFileSearcher = new RegExp("(mov|avi|mpg)$", "i");
					var parseResults = new Array;
					
					// Test that we have a sequence. Stop parsing after 10 files.
					for (x = 0; (x < files.length) & x < 10; x++) {
						var movieFileResult = movieFileSearcher.exec(files[x].name);
						if (!movieFileResult) {
							var currentResult = searcher.exec(files[x].name);
							// Regular expressions return null if no match was found.
							// Otherwise, they return an array with the following information:
							// array[0] = the matched string.
							// array[1..n] = the matched capturing parentheses.
							
							if (currentResult) { // We have a match -- the string contains numbers.
								// The match of those numbers is stored in the array[1].
								// Take that number and save it into parseResults.
								parseResults[parseResults.length] = currentResult[0];
							} else {
								parseResults[parseResults.length] = null;
							}
						} else {
							parseResults[parseResults.length] = null;
						}
					}
					
					// If all the files we just went through have a number in their file names, 
					// assume they are part of a sequence and return the first file.
					
					var result = null;
					for (i = 0; i < parseResults.length; ++i) {
						if (parseResults[i]) {
							if (!result) {
								result = files[i];		
							}
						} else {
							// In this case, a file name did not contain a number.
							result = null;
							break;
						}
					}
					
					return result;
				}
				
				
				function importSafeWithError(importOptions)
				{
					try { 
						app.project.importFile(importOptions);
					} catch (error) {
						alert(error.toString() + importOptions.file.fsName, scriptName);
					}
				}
				
				
				function processFolder(theFolder)
				{
					// Get an array of files in the target folder.
					var files = theFolder.getFiles();
					
					// Test whether theFolder contains a sequence.
					var sequenceStartFile = testForSequence(files);
					
					// If it does contain a sequence, import the sequence,
					if (sequenceStartFile) {
						try {
							// Create a variable containing ImportOptions.
							var importOptions = new ImportOptions(sequenceStartFile);
							
							importOptions.sequence = true;
							// importOptions.forceAlphabetical = true;		
							// Un-comment this if you want to force alpha order by default.
							importSafeWithError(importOptions);
						} catch (error) {
						}
					}
					
					// Otherwise, import the files and recurse.
					
					for (index in files) { // Go through the array and set each element to singleFile, then run the following.
						if (files[index] instanceof File) {
							if (!sequenceStartFile) { // If file is already part of a sequence, don't import it individually.
								processFile(files[index]); // Calls the processFile function above.
							}
						}
						if (files[index] instanceof Folder) {
							processFolder(files[index]); // recursion
						}
					}
				}
				
				// Recursively examine that folder.
				processFolder(targetFolder);
			}
		}
		SmartImport();
		//此project当中拥有多少对象:
		//alert(app.project.numItems);
		//alert(app.project.item(1).name);
		var proj = app.project;
		var selection = proj.selection;
		//var myComp = app.project.items.addComp("Composition_01", 1050, 576, 1, 10, 25)
		//app.project.activeItem=thisComp;
		for (var i = selection.length-1; i >= 0; i--)
		{
			//alert(app.project.activeItem);
			//app.project.activeItem is a OnlyRead attribute!
			//alert(app.project.activeItem);
			//alert("in for(){}");
			//if(selection[i]!=app.project.activeItem)
			//{
				//alert("in if(){}");
				thisComp.layers.add(selection[i]);
			//}
		}
		//value是保存所有镜头duration最大值得变量.
		var value=0;
		//循环project下所有item,将composition去除,取出最大item.duration值存放在value当中
		for(var i=1;i<=app.project.numItems;i++)
		{
			if(app.project.items[i]==thisComp)
			{
				alert("this is 'thisComp'");
				continue;
			}
			value=value>app.project.items[i].duration?value:app.project.items[i].duration;
		}
		//将当前Comp的duration设置为value.
		thisComp.duration=value;
	};

	function myRender()
	{
		//alert("myRender()");
		alert(app.activate);
		//app.project.renderQueue.items.add(thisComp);
		//alert(app.project.renderQueue.items[0]);
		var myRQueue=app.project.renderQueue.items.add( thisComp );
		alert(myRQueue.outputModules[1]);
		//myRQueue.outputModules[1].file=Folder.selectDialog("Import file is ?");
		//myRQueue.outputModules.[1].applyTemplate("png");//无效的模板 
		app.project.renderQueue.render()
	};

	function dialogWindow()
	{
		function clickComp()
		{
			dlg.btnPnl.compText=dlg.btnPnl.add("button",undefined,"CreateComposition");
			dlg.btnPnl.compText.onClick=myComp;
		};

		function clickFile()
		{
			dlg.btnPnl.fileText=dlg.btnPnl.add("button",undefined,"ImportFile");
			dlg.btnPnl.fileText.onClick=myFile;
		};

		function clickRender()
		{
			dlg.btnPnl.renderText=dlg.btnPnl.add("button",undefined,"RenderQueue");
			dlg.btnPnl.renderText.onClick=myRender;
		};

		function cancel()
		{
			dlg.btnPnl.cancleBtn=dlg.btnPnl.add("button",undefined,"Quit",{name:"cancel"});
		};

		var dlg=new Window("dialog","M_Plugin"); 
		dlg.btnPnl=dlg.add("panel",undefined,"wow");
		var button1=clickComp ();
		var button2=clickFile ();
		var button3=clickRender ();
		var button4=cancel ();
		dlg.show();
	};
}

var thisComp = app.project.items.addComp("my_comp",720,576,1.09,10.04,25);
//thisComp=app.project.activeItem;
dialogWindow();