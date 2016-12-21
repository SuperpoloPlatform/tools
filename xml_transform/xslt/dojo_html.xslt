<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<!-- xslt begin -->
	<xsl:template match="/">
		<html>
			<body class="">
				<xsl:text>&#xA;</xsl:text>
				<xsl:for-each select="ui">
					<xsl:call-template name="TraverseChildNode"/>
				</xsl:for-each>
			</body>
		</html>
	</xsl:template>
	<!-- 遍历子节点 -->
	<xsl:template name="TraverseChildNode">
		<xsl:if test="count(child::*) &gt; 0">
			<xsl:for-each select="./*">
				<xsl:choose>
					<xsl:when test="name() = 'widget' ">
						<xsl:choose>
							<xsl:when test="../@class = 'QToolBox' ">
								<xsl:text>&#xA;</xsl:text>
								<xsl:text>	</xsl:text>
								<div>
									<xsl:attribute name="data-dojo-type">dijit.layout.ContentPane</xsl:attribute>
									<xsl:call-template name="TraverseChildNode"/>
								</div>
								<xsl:text>&#xA;</xsl:text>
							</xsl:when>
							<xsl:when test="../@class = 'QTabWidget' ">
								<xsl:text>&#xA;</xsl:text>
								<xsl:text>	</xsl:text>
								<div>
									<xsl:attribute name="data-dojo-type">dijit.layout.ContentPane</xsl:attribute>
									<xsl:call-template name="TraverseChildNode"/>
								</div>
								<xsl:text>&#xA;</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:call-template name="TraverseWidgetNode"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:when test="name() = 'addaction' ">
						<xsl:if test="../@class = 'QMenu' ">
							<div>
								<xsl:attribute name="data-dojo-type">dijit.MenuItem</xsl:attribute>
							</div>
						</xsl:if>
					</xsl:when>
					<xsl:when test="name() = 'property' ">
						<xsl:call-template name="TraversePropertyNode"/>
					</xsl:when>
					<xsl:when test="name() = 'column' ">
					</xsl:when>
					<xsl:when test="name() = 'attribute' ">
						<xsl:if test="../../@class = 'QToolBox' or ../../@class = 'QTabWidget' ">
							<xsl:attribute name="title"><xsl:value-of select="./string"/></xsl:attribute>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="TraverseChildNode"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	<!-- 遍历widget节点 -->
	<xsl:template name="TraverseWidgetNode">
		<xsl:choose>
			<xsl:when test="./@class = 'QWidget' ">
				<xsl:choose>
					<xsl:when test="../@class = 'QMainWindow' ">
						<xsl:call-template name="TraverseChildNode"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>&#xA;</xsl:text>
						<xsl:text>	</xsl:text>
						<div>
							<xsl:attribute name="data-dojo-type">dijit.layout.ContentPane</xsl:attribute>
							<xsl:call-template name="TraverseChildNode"/>
						</div>
						<xsl:text>&#xA;</xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="./@class = 'QFrame' ">
				<xsl:text>&#xA;</xsl:text>
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.layout.BorderContainer</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QPushButton' ">
				<xsl:text>&#xA;</xsl:text>
				<xsl:text>	</xsl:text>
				<button>
					<xsl:attribute name="data-dojo-type">dijit.form.Button</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</button>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QLineEdit' ">
				<xsl:text>	</xsl:text>
				<input>
					<xsl:attribute name="data-dojo-type">dijit.form.TextBox</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</input>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QCheckBox' ">
				<xsl:text>	</xsl:text>
				<!-- TODO:输出checkbox右侧label的值-->
				<input>
					<xsl:attribute name="data-dojo-type">dijit.form.CheckBox</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</input>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QComboBox' ">
				<xsl:text>	</xsl:text>
				<select>
					<xsl:call-template name="TraverseChildNode"/>
				</select>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QPlainTextEdit' ">
				<xsl:text>	</xsl:text>
				<span>
					<xsl:attribute name="data-dojo-type">dijit.InlineEditBox</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</span>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QLabel' ">
				<xsl:text>	</xsl:text>
				<label>
					<xsl:call-template name="TraverseChildNode"/>
				</label>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QRadioButton' ">
				<xsl:text>	</xsl:text>
				<span>
					<xsl:attribute name="data-dojo-type">digit.form.RadioButton</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</span>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QListWidget' ">
				<xsl:text>	</xsl:text>
				<select>
					<xsl:attribute name="data-dojo-type">digit.form.MultiSelect</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</select>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QTableWidget' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.form.Form</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QTreeWidget' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.Tree</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QProgressBar' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.ProgressBar</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QSlider' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QSpinBox' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.form.NumberSpinner</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QToolBox' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.layout.AccordionContainer</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QTabWidget' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.layout.TabContainer</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QMenuBar' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.MenuBar</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QMenu' ">
				<xsl:text>	</xsl:text>
				<xsl:choose>
					<xsl:when test=" ../@class = 'QMenuBar' and ./addaction ">
						<div>
							<xsl:attribute name="data-dojo-type">dijit.PopupMenuBarItem</xsl:attribute>
							<div>
								<xsl:attribute name="data-dojo-type">dijit.Menu</xsl:attribute>
								<xsl:call-template name="TraverseChildNode"/>
							</div>
						</div>
					</xsl:when>
					<xsl:when test=" ../@class = 'QMenu' and ./addaction ">
						<div>
							<xsl:attribute name="data-dojo-type">dijit.PopupMenuItem</xsl:attribute>
							<div>
								<xsl:attribute name="data-dojo-type">dijit.Menu</xsl:attribute>
								<xsl:call-template name="TraverseChildNode"/>
							</div>
						</div>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QTimeEdit' ">
				<xsl:text>	</xsl:text>
				<input>
					<xsl:attribute name="data-dojo-type">dijit.form.TimeTextBox</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</input>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QDateEdit' ">
				<xsl:text>	</xsl:text>
				<input>
					<xsl:attribute name="data-dojo-type">dijit.form.DateTextBox</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</input>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:when test="./@class = 'QToolButton' ">
				<xsl:text>	</xsl:text>
				<div>
					<xsl:attribute name="data-dojo-type">dijit.form.DropDownButton</xsl:attribute>
					<xsl:call-template name="TraverseChildNode"/>
				</div>
				<xsl:text>&#xA;</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="TraverseChildNode"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- QSlider属性 -->
	<xsl:template name="CvtSliderProperty">
		<xsl:choose>
			
		</xsl:choose>
	</xsl:template>
	<!-- QSpinBox属性 -->
	<xsl:template name="CvtSpinBoxProperty">
		<xsl:choose>
			
		</xsl:choose>
	</xsl:template>
	<!-- 遍历property节点 -->
	<xsl:template name="TraversePropertyNode">
		<xsl:choose>
			<xsl:when test="./@name = 'id' ">
				<xsl:if test="./string != '' ">
					<xsl:attribute name="id"><xsl:value-of select="./string"/></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'name' ">
				<xsl:if test="./string != '' ">
					<xsl:attribute name="name"><xsl:value-of select="./string"/></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'type' ">
				<xsl:if test="./string != '' ">
					<xsl:attribute name="type"><xsl:value-of select="./string"/></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'data-dojo-type' ">
				<xsl:if test="./string != '' ">
					<xsl:attribute name="data-dojo-type"><xsl:value-of select="./string"/></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'data-dojo-id' ">
				<xsl:if test="./string != '' ">
					<xsl:attribute name="data-dojo-id"><xsl:value-of select="./string"/></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'data-dojo-props' ">
				<xsl:if test="./string != '' ">
					<xsl:attribute name="data-dojo-props"><xsl:value-of select="./string"/></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'orientation' ">
				<xsl:choose>
					<xsl:when test="./enum = 'Qt::Horizontal' ">
						<xsl:attribute name="data-dojo-type">dijit.form.HorizontalSlider</xsl:attribute>
					</xsl:when>
					<xsl:when test="./enum = 'Qt::Vertical' ">
						<xsl:attribute name="data-dojo-type">dijit.form.VerticalSlider</xsl:attribute>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="./@name = 'minimum' ">
				<xsl:if test="./number != '' ">
					<xsl:if test="../@class = 'QSlider' ">
						<xsl:attribute name="minimum"><xsl:value-of select="./number"/></xsl:attribute>
					</xsl:if>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'maximum' ">
				<xsl:if test="./number != '' ">
					<xsl:if test="../@class = 'QSlider' ">
						<xsl:attribute name="maximum"><xsl:value-of select="./number"/></xsl:attribute>
					</xsl:if>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'intermediateChanges' ">
				<xsl:if test="./string != '' ">
					<xsl:if test="../@class = 'QSlider' ">
						<xsl:attribute name="intermediateChanges"><xsl:value-of select="./string"/></xsl:attribute>
					</xsl:if>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'constraints' ">
				<xsl:if test="./string != '' ">
					<xsl:if test="../@class = 'QSpinBox' ">
						<xsl:attribute name="constraints"><xsl:value-of select="./string"/></xsl:attribute>
					</xsl:if>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'smallDelta' ">
				<xsl:if test="./string != '' ">
					<xsl:if test="../@class = 'QSpinBox' ">
						<xsl:attribute name="smallDelta"><xsl:value-of select="./string"/></xsl:attribute>
					</xsl:if>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'value' ">
				<xsl:if test="./number != '' ">
					<xsl:if test="../@class = 'QSpinBox' ">
						<xsl:attribute name="value"><xsl:value-of select="./number"/></xsl:attribute>
					</xsl:if>
					<xsl:if test="../@class = 'QSlider' ">
						<xsl:attribute name="value"><xsl:value-of select="./string"/></xsl:attribute>
					</xsl:if>
				</xsl:if>
			</xsl:when>
			<xsl:when test="./@name = 'text' ">
				<xsl:choose>
					<xsl:when test="../@class = 'QLineEdit' ">
						<xsl:attribute name="value"><xsl:value-of select="./string"/></xsl:attribute>
					</xsl:when>
					<xsl:when test="../../@class = 'QComboBox' or ../../@class = 'QListWidget' ">
						<option>
							<xsl:value-of select="./string"/>
						</option>
					</xsl:when>
					<xsl:when test="../@class = 'QLabel' ">
						<xsl:value-of select="./string"/>
					</xsl:when>
					<xsl:when test="../@class = 'QToolButton' ">
						<span>
							<xsl:value-of select="./string"/>
						</span>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="./@name = 'toolTip' ">
				<xsl:choose>
					<xsl:when test="../@class = 'QPlainTextEdit' ">
						<xsl:attribute name="title"><xsl:value-of select="./string"/></xsl:attribute>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="./@name = 'maximumSize' ">
				<xsl:choose>
					<xsl:when test="./size/width != '16777215' and ./size/height != '16777215' ">
						<xsl:attribute name="style"><xsl:value-of select=" concat('height:', ./size/height, 'px;', 'width:', ./size/width, 'px;') "/></xsl:attribute>
					</xsl:when>
					<xsl:when test="./size/width != '16777215' ">
						<xsl:attribute name="style"><xsl:value-of select=" concat('width:', ./size/width, 'px;') "/></xsl:attribute>
					</xsl:when>
					<xsl:when test="./size/height != '16777215' ">
						<xsl:attribute name="style"><xsl:value-of select=" concat('height:', ./size/height, 'px;') "/></xsl:attribute>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="./@name = 'geometry' ">
				<xsl:choose>
					<xsl:when test="../@class = 'QMainWindow' ">
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="style"><xsl:value-of select=" concat('position:absolute; top:', ./rect/y, 'px;', 'left:', ./rect/x, 'px;') "/></xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="./@name = 'title' ">
				<span>
					<xsl:value-of select="./string"/>
				</span>
			</xsl:when>
			<xsl:when test="./@name = 'eventlist' ">
				<xsl:attribute name="eventlist"><xsl:value-of select="./string"/></xsl:attribute>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
