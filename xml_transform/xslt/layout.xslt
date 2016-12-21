<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	
	<!-- xslt begin -->
	<xsl:template match="/">
		<GUILayout>
			<xsl:text>&#xA;</xsl:text>
			<xsl:for-each select="ui">
				<xsl:call-template name="TraverseChildNode"/>
			</xsl:for-each>
		</GUILayout>
	</xsl:template>
	
	<!-- 遍历子节点 -->
	<xsl:template name="TraverseChildNode">
		<xsl:if test="count(child::*) &gt; 0">
			<xsl:for-each select="./*">
				<xsl:choose>
					<xsl:when test="name() = 'widget' ">
						<xsl:choose>
							<!-- 如果父窗口是QTabWidget、QScrollArea，不进行转换 -->
							<xsl:when test="../@class = 'QTabWidget' "></xsl:when>
							<xsl:when test="../@class = 'QScrollArea' "></xsl:when>
							<xsl:otherwise>
								<xsl:text>	</xsl:text>
									<Window>
										<xsl:attribute name="Type">Please set a property named WindowType for this window</xsl:attribute>
										<xsl:attribute name="Name">
											<xsl:value-of select="./@name"/>
										</xsl:attribute>
										<xsl:text>&#xA;</xsl:text>
										<xsl:call-template name="TraverseChildNode"/>
									</Window>
								<xsl:text>&#xA;</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:when test="name() = 'property' ">
						<xsl:call-template name="TraverseWidget"/>
					</xsl:when>
					<!-- QTreeWidget的子节点column需要特殊处理 -->
					<xsl:when test="name() = 'column' ">
					</xsl:when>
					<!-- 如果子节点是layout，不进行转换 -->
					<xsl:when test="name() = 'layout' ">
						<xsl:comment>layout node does not support</xsl:comment>
					</xsl:when>
					<!-- 如果子节点是item，不进行转换 -->
					<xsl:when test="name() = 'item' ">
						<xsl:comment>item node does not support</xsl:comment>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="TraverseChildNode"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	
	<!-- 遍历widget节点 -->
	<xsl:template name="TraverseWidget">
		<xsl:choose>
			<!--  -->
			<xsl:when test="../@class = 'QMainWindow' ">
			</xsl:when>
			<!-- DefaultWindow、CEGUI/StaticText、CEGUI/StaticImage -->
			<xsl:when test="../@class = 'QWidget' ">
				<xsl:choose>
					<!-- 如果父窗口是QTabWidget、QScrollArea，不进行转换 -->
					<xsl:when test="../../@class = 'QTabWidget' "></xsl:when>
					<xsl:when test="../../@class = 'QScrollArea' "></xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="CvtPropToDefaultWindow"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<!-- CEGUI/Checkbox -->
			<xsl:when test="../@class = 'QCheckBox' ">
				<xsl:call-template name="CvtPropToCheckbox"/>
			</xsl:when>
			<!-- CEGUI/Combobox -->
			<xsl:when test="../@class = 'QComboBox' ">
				<xsl:call-template name="CvtPropToCombobox"/>
			</xsl:when>
			<!-- CEGUI/Editbox -->
			<xsl:when test="../@class = 'QLineEdit' ">
				<xsl:call-template name="CvtPropToEditbox"/>
			</xsl:when>
			<!-- CEGUI/MultiLineEditbox -->
			<xsl:when test="../@class = 'QPlainTextEdit' ">
				<xsl:call-template name="CvtPropToMultiLineEditbox"/>
			</xsl:when>
			<!-- CEGUI/PushButton -->
			<xsl:when test="../@class = 'QPushButton' ">
				<xsl:call-template name="CvtPropToPushButton"/>
			</xsl:when>
			<!-- CEGUI/RadioButton -->
			<xsl:when test="../@class = 'QRadioButton' ">
				<xsl:call-template name="CvtPropToRadioButton"/>
			</xsl:when>
			<!-- CEGUI/Listbox、CEGUI/ItemListbox -->
			<xsl:when test="../@class = 'QListWidget' ">
				<xsl:call-template name="CvtPropToListWidget"/>
			</xsl:when>
			<!-- CEGUI/ProgressBar -->
			<xsl:when test="../@class = 'QProgressBar' ">
				<xsl:call-template name="CvtPropToProgressBar"/>
			</xsl:when>
			<!-- CEGUI/Scrollbar -->
			<xsl:when test="../@class = 'QScrollBar' ">
				<xsl:call-template name="CvtPropToScrollbar"/>
			</xsl:when>
			<!-- CEGUI/Slider' -->
			<xsl:when test="../@class = 'QSlider' ">
				<xsl:call-template name="CvtPropToSlider"/>
			</xsl:when>
			<!-- CEGUI/Spinner -->
			<xsl:when test="../@class = 'QSpinBox' ">
				<xsl:call-template name="CvtPropToQSpinner"/>
			</xsl:when>
			<!-- CEGUI/TabControl、CEGUI/FrameWindow -->
			<xsl:when test="../@class = 'QTabWidget' ">
				<xsl:call-template name="CvtPropToTabControl"/>
			</xsl:when>
			<!-- CEGUI/Tree -->
			<xsl:when test="../@class = 'QTreeWidget' ">
				<xsl:call-template name="CvtPropToTree"/>
			</xsl:when>
			<!-- CEGUI/ScrollablePane -->
			<xsl:when test="../@class = 'QScrollArea' ">
				<xsl:call-template name="CvtPropToScrollablePane"/>
			</xsl:when>
			<!-- CEGUI/Menubar -->
			<xsl:when test="../@class = 'QMenuBar' ">
				<xsl:call-template name="CvtPropToMenubar"/>
			</xsl:when>
			<!-- CEGUI/Menu -->
			<xsl:when test="../@class = 'QMenu' ">
				<xsl:call-template name="CvtPropToMenu"/>
			</xsl:when>
			<!-- CEGUI/MultiColumnList -->
			<xsl:when test="../@class = 'QColumnView' ">
				<xsl:call-template name="CvtPropToMultiColumnList"/>
			</xsl:when>
			<!-- CEGUI/GroupBox -->
			<xsl:when test="../@class = 'QGroupBox' ">
			</xsl:when>
						<!-- TODO: 在otherwise中完成自定义属性的转换 -->
			<xsl:otherwise>
				<xsl:text>	</xsl:text>
				<xsl:text>	</xsl:text>
				<Property>
					<xsl:attribute name="Name">
						<xsl:value-of select="./@name"/>
					</xsl:attribute>
					<xsl:choose>
						<xsl:when test="./bool != ' ' ">
							<xsl:attribute name="Value">
								<xsl:value-of select="./bool"/>
							</xsl:attribute>
						</xsl:when>
						<xsl:when test="./string != ' ' ">
							<xsl:attribute name="Value">
								<xsl:value-of select="./string"/>
							</xsl:attribute>
						</xsl:when>
						<xsl:when test="./double != ' ' ">
							<xsl:attribute name="Value">
								<xsl:value-of select="./double"/>
							</xsl:attribute>
						</xsl:when>
						<xsl:when test="./number != ' ' ">
							<xsl:attribute name="Value">
								<xsl:value-of select="./number"/>
							</xsl:attribute>
						</xsl:when>
						<xsl:when test="./UInt != ' ' ">
							<xsl:attribute name="Value">
								<xsl:value-of select="./UInt"/>
							</xsl:attribute>
						</xsl:when>
					</xsl:choose>
				</Property>
				<xsl:text>&#xA;</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
			<!--
				 转换一些特殊的节点：
				WindowType - 指定生成的cegui 窗口类型(Type属性)
				geometry - 生成cegui 风格的坐标、尺寸，这里并没有完成转换，真正的转换在layout.js中执行
				toolTip - 生成cegui的Tooltip属性
				orientation - 根据这个属性值产生一个对应的bool类型的属性
			 -->
		<xsl:choose>
			<xsl:when test="./@name = 'WindowType' ">
				<xsl:text>	</xsl:text>
				<xsl:text>	</xsl:text>
				<Property>
					<xsl:attribute name="Name">WindowType</xsl:attribute>
					<xsl:attribute name="Value">
						<xsl:value-of select="./string"/>
					</xsl:attribute>
				</Property>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@name = 'geometry' ">
				<xsl:text>	</xsl:text>
				<xsl:text>	</xsl:text>
				<Property>
					<xsl:attribute name="Name">UnifiedPosition</xsl:attribute>
					<xsl:attribute name="Value">
						<xsl:value-of select="./rect/x"/>.<xsl:value-of select="./rect/y"/>.<xsl:value-of select="../../property/rect/width"/>.<xsl:value-of select="../../property/rect/height"/>
					</xsl:attribute>
				</Property>
				<xsl:text>&#xA;</xsl:text>
				<Property>
					<xsl:attribute name="Name">UnifiedSize</xsl:attribute>
					<xsl:attribute name="Value">
						<xsl:value-of select="./rect/width"/>.<xsl:value-of select="./rect/height"/>
					</xsl:attribute>
				</Property>
				<Property>
					<xsl:attribute name="Name">UnifiedMaxSize</xsl:attribute>
					<xsl:attribute name="Value">
						<xsl:value-of select="./rect/width"/>.<xsl:value-of select="./rect/height"/>
					</xsl:attribute>
				</Property>
				<Property>
					<xsl:attribute name="Name">UnifiedMinSize</xsl:attribute>
					<xsl:attribute name="Value">
						<xsl:value-of select="./rect/width"/>.<xsl:value-of select="./rect/height"/>
					</xsl:attribute>
				</Property>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@name = 'toolTip' ">
				<xsl:text>	</xsl:text>
				<xsl:text>	</xsl:text>
				<Property>
					<xsl:attribute name="Name">Tooltip</xsl:attribute>
					<xsl:attribute name="Value">
						<xsl:value-of select="./string"/>
					</xsl:attribute>
				</Property>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@name = 'orientation' ">
				<xsl:text>	</xsl:text>
				<xsl:text>	</xsl:text>
				<Property>
					<xsl:if test="../@class = 'QScrollBar' ">
						<xsl:attribute name="Name">VerticalScrollbar</xsl:attribute>
					</xsl:if>
					<xsl:if test="../@class = 'QSlider' ">
						<xsl:attribute name="Name">VerticalSlider</xsl:attribute>
					</xsl:if>
					<xsl:if test="./enum = 'Qt::Vertical'">
						<xsl:attribute name="Value">True</xsl:attribute>
					</xsl:if>
					<xsl:if test="./enum = 'Qt::Horizontal'">
						<xsl:attribute name="Value">False</xsl:attribute>
					</xsl:if>
				</Property>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	
	<!-- 根据传人的参数创建不同类型、名称的属性节点 -->
	<xsl:template name="CreateProperty">
		<xsl:param name="property_type_node"></xsl:param>
		<xsl:param name="property_value"></xsl:param>
		<xsl:param name="property_name"></xsl:param>
		<xsl:choose>
			<xsl:when test="$property_type_node = $property_value "></xsl:when>
			<xsl:otherwise>
				<xsl:text>	</xsl:text>
				<xsl:text>	</xsl:text>
				<Property>
					<xsl:attribute name="Name">
						<xsl:value-of select="$property_name"/>
					</xsl:attribute>
					<xsl:attribute name="Value">
						<xsl:value-of select="$property_type_node"/>
					</xsl:attribute>
				</Property>
				<xsl:text>&#xA;</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- 
		转换property节点:
		note - qt中添加的动态属性都有默认值，提供的cegui模版中动态属性默认值都是
		与cegui中的属性默认值相同的，所以这里需要先判断属性是否是默认值，如果有
		被修改，则转换为cegui的属性节点.
	 -->
	 <xsl:template name="CvtPropToDefaultWindow">
		<xsl:choose>
			<xsl:when test="./@name = 'Image' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'CreateProperty' "/>
					<xsl:with-param name="property_value" select=" 'set: image:' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'TextColours' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'TextColours' "/>
					<xsl:with-param name="property_value" select=" 'tl:FFFFFFFF tr:FFFFFFFF bl:FFFFFFFF br:FFFFFFFF' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'HorzFormatting' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'HorzFormatting' "/>
					<xsl:with-param name="property_value" select=" 'LeftAligned' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'VertFormatting' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'VertFormatting' "/>
					<xsl:with-param name="property_value" select=" 'VertCentred' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'VertScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'VertScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'HorzScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'HorzScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'HorzExtent' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'HorzExtent' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'VertExtent' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'VertExtent' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToCheckbox">
		<xsl:choose>
			<xsl:when test="./@name = 'text' ">
			</xsl:when>
			<xsl:when test="./@name = 'Selected' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'Selected' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToCombobox">
		<xsl:choose>
			<xsl:when test="./@name = 'ReadOnly' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ReadOnly' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ValidationString' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'ValidationString' "/>
					<xsl:with-param name="property_value" select=" '.*' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'CaratIndex' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'CaratIndex' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'EditSelectionStart' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'EditSelectionStart' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'EditSelectionLength' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'EditSelectionLength' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MaxEditTextLength' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'MaxEditTextLength' "/>
					<xsl:with-param name="property_value" select=" '1073741824' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SortList' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'SortList' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceVertScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceVertScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceHorzScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceHorzScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SingleClickMode' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'SingleClickMode' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToEditbox">
		<xsl:choose>
			<xsl:when test="./@name = 'ReadOnly' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ReadOnly' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MaskText' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'MaskText' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MaskCodepoint' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'MaskCodepoint' "/>
					<xsl:with-param name="property_value" select=" '42' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ValidationString' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'ValidationString' "/>
					<xsl:with-param name="property_value" select=" '.*' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'CaratIndex' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'CaratIndex' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SelectionStart' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'SelectionStart' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SelectionLength' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'SelectionLength' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MaxTextLength' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'MaxTextLength' "/>
					<xsl:with-param name="property_value" select=" '1073741824' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'NormalTextColour' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'NormalTextColour' "/>
					<xsl:with-param name="property_value" select=" 'FFFFFFFF' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SelectedTextColour' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'SelectedTextColour' "/>
					<xsl:with-param name="property_value" select=" 'FFFFFFFF' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ActiveSelectionColour' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'ActiveSelectionColour' "/>
					<xsl:with-param name="property_value" select=" 'FF6060FF' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'InactiveSelectionColour' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'InactiveSelectionColour' "/>
					<xsl:with-param name="property_value" select=" 'FF808080' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'BlinkCaret' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'BlinkCaret' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'BlinkCaretTimeout' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'BlinkCaretTimeout' "/>
					<xsl:with-param name="property_value" select=" '0.660000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'TextFormatting' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'TextFormatting' "/>
					<xsl:with-param name="property_value" select=" 'LeftAligned' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToMultiLineEditbox">
		<xsl:choose>
			<xsl:when test="./@name = 'ReadOnly' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ReadOnly' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'WordWrap' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'WordWrap' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'CaratIndex' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'CaratIndex' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SelectionStart' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'SelectionStart' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SelectionLength' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'SelectionLength' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MaxTextLength' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'MaxTextLength' "/>
					<xsl:with-param name="property_value" select=" '1073741824' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'Selected' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'SingleClickMode' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SelectionBrushImage' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'SelectionBrushImage' "/>
					<xsl:with-param name="property_value" select=" 'set: image:' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceVertScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceVertScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'BlinkCaret' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'BlinkCaret' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'BlinkCaretTimeout' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'BlinkCaretTimeout' "/>
					<xsl:with-param name="property_value" select=" '0.660000000000000' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToPushButton">
		<xsl:choose>
			<xsl:when test="./@name = 'text' ">
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToRadioButton">
		<xsl:choose>
			<xsl:when test="./@name = 'text' ">
			</xsl:when>
			<xsl:when test="./@name = 'Selected' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'Selected' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'GroupID' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./number"/>
					<xsl:with-param name="property_name" select=" 'GroupID' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToListWidget">
		<xsl:choose>
			<xsl:when test="./@name = 'text' ">
			</xsl:when>
			<xsl:when test="./@name = 'MultiSelect' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'MultiSelect' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'Sort' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'Sort' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceVertScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceVertScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceHorzScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceHorzScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ItemTooltips' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ItemTooltips' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToProgressBar">
		<xsl:choose>
			<xsl:when test="./@name = 'value' ">
			</xsl:when>
			<xsl:when test="./@name = 'CurrentProgress' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'CurrentProgress' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'StepSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'StepSize' "/>
					<xsl:with-param name="property_value" select=" '0.010000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'VerticalProgress' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'VerticalProgress' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ReversedProgress' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ReversedProgress' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToScrollbar">
		<xsl:choose>
			<xsl:when test="./@name = 'DocumentSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'DocumentSize' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'PageSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'PageSize' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'StepSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'StepSize' "/>
					<xsl:with-param name="property_value" select=" '1.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'OverlapSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'OverlapSize' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ScrollPosition' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'ScrollPosition' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'EndLockEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'EndLockEnabled' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToSlider">
		<xsl:choose>
			<xsl:when test="./@name = 'CurrentValue' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'CurrentValue' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MaximumValue' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'MaximumValue' "/>
					<xsl:with-param name="property_value" select=" '1.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ClickStepSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'ClickStepSize' "/>
					<xsl:with-param name="property_value" select=" '0.010000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ReversedDirection' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ReversedDirection' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToQSpinner">
		<xsl:choose>
			<xsl:when test="./@name = 'CurrentValue' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'CurrentValue' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'StepSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'StepSize' "/>
					<xsl:with-param name="property_value" select=" '1.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MinimumValue' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'MinimumValue' "/>
					<xsl:with-param name="property_value" select=" '-32768.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MaximumValue' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'MaximumValue' "/>
					<xsl:with-param name="property_value" select=" '32767.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'TextInputMode' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'TextInputMode' "/>
					<xsl:with-param name="property_value" select=" 'Integer' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToTabControl">
		<xsl:choose>
			<xsl:when test="./@name = 'currentIndex' ">
			</xsl:when>
			<xsl:when test="./@name = 'tabsClosable' ">
			</xsl:when>
			<xsl:when test="./@name = 'TabHeight' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'TabHeight' "/>
					<xsl:with-param name="property_value" select=" '{0.050000,0.000000}' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'TabTextPadding' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'TabTextPadding' "/>
					<xsl:with-param name="property_value" select=" '{0.000000,5.000000}' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'TabPanePosition' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'TabPanePosition' "/>
					<xsl:with-param name="property_value" select=" 'top' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'TabButtonType' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'TabButtonType' "/>
					<xsl:with-param name="property_value" select=" '' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SizingEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'SizingEnabled' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'FrameEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'FrameEnabled' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'TitlebarEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'TitlebarEnabled' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'CloseButtonEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'CloseButtonEnabled' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'RollUpEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'RollUpEnabled' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'RollUpState' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'RollUpState' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'DragMovingEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'DragMovingEnabled' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SizingBorderThickness' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'SizingBorderThickness' "/>
					<xsl:with-param name="property_value" select=" '8.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'NSSizingCursorImage' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'NSSizingCursorImage' "/>
					<xsl:with-param name="property_value" select=" 'set: image:' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'EWSizingCursorImage' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'EWSizingCursorImage' "/>
					<xsl:with-param name="property_value" select=" 'set: image:' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'NWSESizingCursorImage' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'NWSESizingCursorImage' "/>
					<xsl:with-param name="property_value" select=" 'set: image:' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'NESWSizingCursorImage' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'NESWSizingCursorImage' "/>
					<xsl:with-param name="property_value" select=" 'set: image:' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToTree">
		<xsl:choose>
			<xsl:when test="./@name = 'Sort' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'Sort' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'MultiSelect' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'MultiSelect' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceVertScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceVertScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceHorzScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceHorzScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ItemTooltips' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ItemTooltips' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToScrollablePane">
		<xsl:choose>
			<xsl:when test="./@name = 'ContentPaneAutoSized' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ContentPaneAutoSized' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ContentArea' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'ContentArea' "/>
					<xsl:with-param name="property_value" select=" 'l:0.000000 t:0.000000 r:0.000000 b:0.000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceVertScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceVertScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceHorzScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceHorzScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'HorzStepSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'HorzStepSize' "/>
					<xsl:with-param name="property_value" select=" '0.100000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'HorzOverlapSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'HorzOverlapSize' "/>
					<xsl:with-param name="property_value" select=" '0.100000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'HorzScrollPosition' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'HorzScrollPosition' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'VertStepSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'VertStepSize' "/>
					<xsl:with-param name="property_value" select=" '0.100000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'VertOverlapSize' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'VertOverlapSize' "/>
					<xsl:with-param name="property_value" select=" '0.100000000000000' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'VertScrollPosition' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./double"/>
					<xsl:with-param name="property_name" select=" 'VertScrollPosition' "/>
					<xsl:with-param name="property_value" select=" '0.000000000000000' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="CvtPropToMenubar">
	</xsl:template>
	<xsl:template name="CvtPropToMenu">
	</xsl:template>
	<xsl:template name="CvtPropToMultiColumnList">
		<xsl:choose>
			<xsl:when test="./@name = 'ColumnsSizable' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ColumnsSizable' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ColumnsMovable' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ColumnsMovable' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SortSettingEnabled' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'SortSettingEnabled' "/>
					<xsl:with-param name="property_value" select=" 'true' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SortDirection' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'SortDirection' "/>
					<xsl:with-param name="property_value" select=" 'None' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SortColumnID' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'SortColumnID' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'NominatedSelectionColumnID' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'NominatedSelectionColumnID' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'NominatedSelectionRow' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./UInt"/>
					<xsl:with-param name="property_name" select=" 'NominatedSelectionRow' "/>
					<xsl:with-param name="property_value" select=" '0' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceVertScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceVertScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ForceHorzScrollbar' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./bool"/>
					<xsl:with-param name="property_name" select=" 'ForceHorzScrollbar' "/>
					<xsl:with-param name="property_value" select=" 'false' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'SelectionMode' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'SelectionMode' "/>
					<xsl:with-param name="property_value" select=" 'RowSingle' "/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="./@name = 'ColumnHeader' ">
				<xsl:call-template name="CreateProperty">
					<xsl:with-param name="property_type_node" select="./string"/>
					<xsl:with-param name="property_name" select=" 'ColumnHeader' "/>
					<xsl:with-param name="property_value" select=" '' "/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	
</xsl:stylesheet>
