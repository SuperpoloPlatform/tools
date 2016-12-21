<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:mx="http://www.adobe.com/2006/mxml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<Imageset>
			<xsl:attribute name="Name">spp</xsl:attribute>
			<xsl:attribute name="Imagefile">spp.png</xsl:attribute>
			<xsl:attribute name="AutoScaled">false</xsl:attribute>
			<xsl:for-each select="mx:Application">
				<xsl:attribute name="NativeHorzRes">
					<xsl:value-of select="./@width"/>
				</xsl:attribute>
				<xsl:attribute name="NativeVertRes">
					<xsl:value-of select="./@height"/>
				</xsl:attribute>
			</xsl:for-each>	
			<xsl:text>&#xA;</xsl:text>
			<xsl:for-each select="mx:Application/mx:Image">
				<xsl:text>	</xsl:text>
				<Image>
					<xsl:attribute name="Name">
						<xsl:value-of select="./@id"/>
					</xsl:attribute>
					<xsl:attribute name="XPos">
						<xsl:value-of select="./@x"/>
					</xsl:attribute>
					<xsl:attribute name="YPos">
						<xsl:value-of select="./@y"/>
					</xsl:attribute>
					<xsl:attribute name="Width">
						<xsl:value-of select="./@width"/>
					</xsl:attribute>
					<xsl:attribute name="Height">
						<xsl:value-of select="./@height"/>
					</xsl:attribute>
				</Image>	
				<xsl:text>&#xA;</xsl:text>
			</xsl:for-each>
		</Imageset>	
	</xsl:template>
</xsl:stylesheet>
