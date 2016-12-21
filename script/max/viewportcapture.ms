
macroScript SPP_ViewportCapture
category:"Superpolo"
ButtonText:"Viewport Capture" 
tooltip:"Spp Viewport Rotate&Capture" Icon:#("Maxscript",2)
(

	rollout ViewportRollout "viewportÐý×ª½ØÍ¼" width:162 height:300
	(
		--local variable
		local myGrab
		local myBitmap
		local myIncrement = 1
		local myDir = (getdir #image)
		local myName = ""
		local newHeight
		local x = #(0,0,0)
		
		--kongjian	
		button btn_save "Éú³É" pos:[30,29] width:78 height:24 toolTip:""
		button btn_path "set directory" pos:[30,64] width:80 height:25
		edittext edt_imgname "" pos:[32,162] width:72 height:23
		label lbl_imgname "image name" pos:[33,131] width:80 height:19 enabled:true
		label lbl_path "" pos:[34,105] width:81 height:21
		--function
		--function rotate z 
		fn RotateViewPort inputAxis inputDegrees = 
		(
		if viewport.getType() != #view_persp_user do viewport.setType #view_persp_user
		ViewPortMatrix = inverse(ViewPort.GetTM())
		RotationMatrix = (quat inputDegrees inputAxis ) as Matrix3
		ViewPortMatrix *= RotationMatrix
		ViewPort.SetTM (inverse ViewPortMatrix)	
		)			
		--capture img
		fn grabViewport =
		(
		if myName != undefined then myName = edt_imgname.text
		myBitmap = gw.getViewportDib()
		myNewIncrement=(substring "0000" 1 (4-(x=myIncrement as string).count))+x
		myBitmap.filename = (myDir + "\\" + myName + myNewIncrement as string + ".bmp")
		print ("saved as " + myBitmap.filename as string)
		save myBitmap
		myIncrement += 1
		newHeight = myBitmap.height * (100/myBitmap.width as float)
		myDisplayBitmap = rendermap (bitmaptexture filename:(myDir + "\\" + myName + myNewIncrement as string + ".bmp")) size:[100,newHeight] filter:true
		setPixels myDisplayBitmap [0,0] #((color 197 197 197))
		)
		-- set path
		fn myGetpath = 
		(
		myDir = getSavePath()
		if myDir != undefined then () else myDir = (getdir #image)
			lbl_path.text=myDir
		myIncrement = 1
		)
		--function adjust viewport angle
		fn rotateangle=
		(
			xyz=#(0,0,0)
			for i in objects do
			(
				temp =#()
				temp=i.max
				for n=1 to 3 do
				(	
					print n
					if(abs(temp[n])>xyz[n])do xyz[n]=abs(temp[n])
					print xyz[n]
				)
			)
			--351.492,-27.5316,130.056
			Targetcamera fov:45 nearclip:1 farclip:1000 nearrange:0 farrange:1000 mpassEnabled:off mpassRenderPerPass:off pos:[xyz[1],xyz[2],xyz[3]] isSelected:on target:(Targetobject transform:(matrix3 [1,0,0] [0,1,0] [0,0,1] [-16.5041,-27.5316,0]))
			max vpt camera
			max delete $
			--max vpt persp user
		)
		--function 	
		on btn_save pressed do
		(
			enableSceneRedraw()
			rotateangle()
			--maxsize window
			nflag=false
			act=#()
			act=getViewSize()
			max tool maximize
			base=#()
			base=getViewSize()
			if(act[1]>=base[1])do ( nflag=true ;max tool maximize)
			--rotate view,capture img & save
		   for nloop = 1 to 4 do
		   (
				max select all
				RotateViewPort [0,0,1] 90
				completeRedraw()
				max zoomext sel all
				clearSelection()
				grabViewport()
				nloop+=1
			)
			if(nflag!=true)do max tool maximize
			messagebox "ok!"
		)
		on btn_path pressed do
			try(myGetpath();lbl_path.txt=gw.getViewportDib())catch()
		on edt_imgname changed val do
			try(myIncrement=1)catch()
	)
--createdialog ViewportRollout 
	gj = newrolloutfloater "Spp Viewport Rotate&Capture" 185 460
	addrollout  ViewportRollout gj
)