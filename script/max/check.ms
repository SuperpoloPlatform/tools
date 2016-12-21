/*----------------------------------------------------------
--	
-- Copyright (C) 2012 Sanpolo Co.LTD
-- http://www.spolo.org
--
--  This file is part of the UGE(Uniform Game Engine).
--  Copyright (C) by SanPolo Co.Ltd. 
--  All rights reserved.
--
--  See http://uge.spolo.org/ for more information.
--
--  SanPolo Co.Ltd
--  http://uge.spolo.org/  sales@spolo.org uge-support@spolo.org

--
------------------------------------------------------------
*/


 /*col = for i in  objects collect i
  print "start"
 for i=1 to col.count do
 (
	print col[i].name;
-- 	format"%\n" i.name 
	if col[i].name.count >= 12 do
	(
-- 		i.name = "obj" + "_" + (i as string)
		-- format "%\n" ("o" + "_" + (i as string))
		print col[i].name;
	)
 )*/
 
    fn checkmattex = (
	mess = "error\n"
	i = 0
	 --遍历所有mesh
	 for iobj in  geometry do
	 (
		 --获取当前mesh下的所有材质
		 mat = iobj.material
		 submatnum = 0

		 submatnum = getNumSubMtls mat
		 
		 
		  if submatnum == 0 do
		  (
			 if mat.diffuseMap == undefined do
			 (
				 i = i +1
				 message = stringStream ""
				 message = "The mesh " + (iobj.name) + "'s material " + (mat.name) + " has not diffuseMap!\n"
				 mess = mess + message
			  )
		   )
		   
		   
		 --遍历当前材质下所有子材质
		 if submatnum >0 do
		 (
			 for im = 1 to submatnum do
			 (
				 imat = getSubMtl mat im
				
				 
				 if imat == undefined do
				 (
					 --print submatnum
					 --submatnum = submatnum + 1
					 continue
				  )
				 if imat.diffuseMap == undefined do
				 (
					 i = i +1
					 message = stringStream ""
					 message = "The mesh " + (iobj.name) + "'s material " + (mat.name) + "'s submaterial " + (imat.name) +  " has not diffuseMap!\n"
					 mess = mess + message
				  )
			 )
		)
	 )
	 if i > 0 do
	(
		 messagebox mess
	)
	return 0
 )
 
checkmattex()
 
 
 
 
 fn checkmesh = (
	 i = 0;
	 --遍历所有mesh
	 for iobj in  geometry do
	 (--判断name长度是否大于12
		if iobj.name.count >= 12 do
		(--修改meshname
			--iboj.
			tmpname = ("o" + "_" + (i as string)) 
			iobj.name = tmpname
			i += 1
		)
	 )
 )
 
 checkmesh()
 
 
 
 
   fn checkmat = (
	 i = 0;
	 --遍历所有mesh
	 for iobj in  geometry do
	 (
		 --获取当前mesh下的所有材质
		 mat = iobj.material
		 
		 if mat.name.count >= 12 do
		 (
			tmpname = ("m" + "_" + (i as string)) 
			mat.name = tmpname	 
			i += 1
		 )
		 
		 submatnum = getNumSubMtls mat
		 --遍历当前mesh下所有子材质
		 if submatnum >0 do
		 (
			 for im = 1 to submatnum do
			 (
				 imat = getSubMtl mat im
				 
				 if imat == undefined do
				 (
					 --print submatnum
					 --submatnum = submatnum + 1
					 continue
				  )
				 --判断name长度是否大于12
				if imat.name.count >= 12 do
				(--将所有名字为imat.name的material都改名
					tmpname = ("m" + "_" + (i as string)) 
					imat.name = tmpname
					
					i += 1
				)
			 )
		)
	 )
 )
 
checkmat()
 
 
  fn checktexture = (
	 i = 0;
	 --遍历所有mesh
	 for iobj in  geometry do
	 (
		 --获取当前mesh下的所有材质
		 mat = iobj.material
		 submatnum = getNumSubMtls mat
		 if submatnum == 0 do
		 (
			 texfilename = mat.diffuseMap.filename
			 texNameArr = filterString texfilename "\\."
		     texname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]
			 
			 texN = ""
			 for itexN =1 to (texNameArr.count-2) do
			 (
				 texN += texNameArr[itexN] + "\\" 
			 )
			 
			 if texname.count >=12 do
			 (
				tmpname = ("t" + "_" + (i as string)) 
				for iobjt in  geometry do
				(
					tmat = iobjt.material
					tsubmatnumber = getNumSubMtls tmat
					if tsubmatnumber == 0 do
					(
						 tmtexfilename = tmat.diffuseMap.filename
						 
						if tmtexfilename == texfilename do
						(
							tmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
							--tmat.diffuseMap.filename = tmpname
						)
					)
					if tsubmatnumber >0 do
					(
						for itm = 1 to tsubmatnumber do
						(
							 itsmat = getSubMtl tmat itm
							
							if itsmat == undefined do
							 (
								 --print submatnum
								 --submatnum = submatnum + 1
								 continue
							  )
							 tmtexfilename = itsmat.diffuseMap.filename

							if tmtexfilename == texfilename do
							(
								tmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
								--tmat.diffuseMap.filename = tmpname
							)
						)
					)
				)
				cmdstr = "ren " + texfilename +" "+ tmpname +"."+ texNameArr[texNameArr.count]
				DOSCommand cmdstr
				i += 1
			)
		 )
		 --遍历当前mesh下所有材质
		 if submatnum >0 do
		 (
			 for im = 1 to submatnum do
			 (
				 imat = getSubMtl mat im
				 if imat == undefined do
				(
					continue
				)
				 itexfilename = imat.diffuseMap.filename
				 texNameArr = filterString itexfilename "\\."
				 itexname = texNameArr[texNameArr.count-1]+"."+texNameArr[texNameArr.count]

				 if itexname.count >= 12 do
				 (
					 
					texN = ""
					for itexN =1 to (texNameArr.count-2) do
					(
						texN += texNameArr[itexN] + "\\" 
					)
					
					tmpname = ("t" + "_" + (i as string)) 
					
					for iobjt in  geometry do
					(
						tmat = iobjt.material
						tsubmatnumber = getNumSubMtls tmat
						if tsubmatnumber == 0 do
						(
							tmtexfilename = tmat.diffuseMap.filename

							if tmtexfilename == itexfilename do
							(
								tmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
								--tmat.diffuseMap.filename = tmpname
							)
						)
						if tsubmatnumber >0 do
						(
							for itm = 1 to tsubmatnumber do
							(
								 itsmat = getSubMtl tmat itm
								
								if itsmat == undefined do
								 (
									 --print submatnum
									 --submatnum = submatnum + 1
									 continue
								  )
								 tmtexfilename = itsmat.diffuseMap.filename
				
								if tmtexfilename == itexfilename do
								(
									itsmat.diffuseMap.filename = texN + tmpname +"."+texNameArr[texNameArr.count]
									--tmat.diffuseMap.filename = tmpname
								)
							)
						)
					)  
					
					cmdstr = "ren " + itexfilename +" "+ tmpname +"."+ texNameArr[texNameArr.count]
					DOSCommand cmdstr
					
					i += 1
				  )
				 
			 )
		)
	 )
 )
 
 checktexture()
 

 
 
 
 
 
 
 
 
