# coding=utf-8
import os, sys, codecs
import xmltodict , json


def parse(inputFile, outputFile):

	# 判断文件编码是不是utf8的
	try:
		f = codecs.open(inputFile, "r", "gbk")
		xmlContent = f.read()
		f.close()
	except:
		f = codecs.open(inputFile, "r", "utf8")
		xmlContent = f.read()
		f.close()

	reload(sys)
	sys.setdefaultencoding('utf8')

	obj = xmltodict.parse(xmlContent)
	txt = json.dumps(obj, ensure_ascii=False, encoding="utf8", sort_keys=True, indent=4)
	#txt2= obj["application"]["sandTable"]["category"][0]["label"][0]["uiPosition"]
	#print txt2
	
	return txt
	
	
	#f = codecs.open(outputFile, "r", "utf8")
	#jsonContent = f.read()
	#f.close()
	
	
	#json_intercept=jsonContent[1:-1]
	#json_intercept = json_intercept.replace('\"application\":','JSON_SCHOOL= ')
	#f = codecs.open(outputFile, "w", "utf8")
	#f.write(json_intercept)
	#f.close()
	
	
#####################################
####    this is a sample

# inputFile = "json.xml"
# outputFile = "json.js"
# parse(inputFile , outputFile)