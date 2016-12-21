class xml_block(object):
    __slots__ = 'name', 'children', 'options', 'data'
    def __init__(self):
        self.name = ''
        self.data = None
        self.children = []
        self.options = {}
    def __repr__(self):
        return '\nname:%s\ndata:%s\noptions:%s\nchildren:%s\n' % (self.name, self.data, self.options, self.children)
    def dump(self):
        return '\nname:%s\ndata:%s\noptions:%s\nchildren count:%s' % (self.name, self.data, self.options, len(self.children))
    
def xml2list(xml_text):
    tag_bounds = []
    xml_list = []
    # Mark all start and ends for the <> and </>
    START, END, SINGLE = 0,1,2 # is it a start tag, end tag or a single tag.
    i=0
    while i < len(xml_text):
        # tag all < and > 
        if xml_text[i] == '<':
            i = ii = i+1 # increase i so we can use slicing
            while xml_text[ii] != '>': ii += 1
            
            if xml_text[i] == '!': pass # comment, assume <!--
            elif xml_text[i] == '?': pass # assume <?xml
            elif xml_text[i] == '/': # Ending
                tag_bounds.append((i,ii, END))
            else: # Starting
                if xml_text[ii-1] == '/':
                    tag_bounds.append((i,ii-1, SINGLE)) # dont include the /
                else:
                    tag_bounds.append((i,ii, START))
            i= ii
        i+=1
        
    def build_xml(tag_idx, children):
        '''
        gets all the data between here and the next index
        '''
        tag = tag_bounds[tag_idx] # must be the starter - tag[2] == True
        
        if tag[2] == END:
            print(xml_text[tag[0]:tag[1]])
            print(xml_list)
            raise("Error")
        
        xml_blk = xml_block()
        children.append(xml_blk)
        
        name_and_opts = xml_text[tag[0] : tag[1]].split()
        xml_blk.name = name_and_opts[0]
        
        if len(name_and_opts) > 1: # Some options were set
            i =1
            while i < len(name_and_opts):
                # print name_and_opts
                key,val = name_and_opts[i].split('=')
                if val[0]=='"' and val[-1] == '"': val = val[1:-1] # strip ""
                xml_blk.options[key] = val
                i+=1
        
        if tag[2] == SINGLE: # this tag has no matching end tag, return the next index.
            return tag_idx+1
        
        tag_next = tag_bounds[tag_idx+1]
        xml_blk.data = xml_text[tag[1]+1:tag_next[0]-1].strip() # Text between now and the next tag is data
        
        tag_idx += 1
        while 1:
            tag_next = tag_bounds[tag_idx]
            # This ends the current tag
            if tag_next[2] == END:
                name = xml_text[tag_next[0]+1:tag_next[1]]
                if name == xml_blk.name :
                    return tag_idx + 1
                # Should only be ending the current tag
            else:
                tag_idx= build_xml(tag_idx, xml_blk.children)
                if tag_idx >= len(tag_bounds):
                    return tag_idx # will finish
    
    build_xml(0, xml_list)
    return xml_list


	
xmls="""
<svg> 
     xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" i:viewOrigin="245 469.6484" i:rulerOrigin="0 0" i:pageBounds="0 841.8896 595.2754 0"
     xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
     width="109" height="98.722" viewBox="0 0 109 98.722" overflow="visible" enable-background="new 0 0 109 98.722"
     xml:space="preserve">
    <metadata>
        <variableSets  xmlns="&ns_vars;">
            <variableSet  varSetName="binding1" locked="none">
                <variables></variables>
                <v:sampleDataSets  xmlns="&ns_custom;" xmlns:v="&ns_vars;"></v:sampleDataSets>
            </variableSet>
        </variableSets>
        <sfw  xmlns="&ns_sfw;">
            <slices></slices>
            <sliceSourceBounds  y="370.927" x="245" width="109" height="98.722" bottomLeftOrigin="true"></sliceSourceBounds>
        </sfw>
    </metadata>
    <switch>
        <foreignObject requiredExtensions="&ns_ai;" x="0" y="0" width="1" height="1">
            <i:pgfRef  xlink:href="#adobe_illustrator_pgf">
            </i:pgfRef>
        </foreignObject>
        <g i:extraneous="self">
            <g id="Calque_1" i:layer="yes" i:dimmedPercent="50" i:rgbTrio="#4F008000FFFF">
                <g>
                    <g>
                        <path i:knockout="Off" fill="#F35B13" d="M78,83.648c15,2.5,26-4,31-40c0,0-13,5-19,16s3,23-12,22s-36-10-26-46
                            s-17.5-37-26.5-35.5C13.082,2.218-2,6.648,0,10.648s14.5,2,25,1c9.178-0.874,17,3,11,25s-4,57,15,62
                            C59.68,100.932,68,85.148,78,83.648z"/>
                    </g>
                </g>
            </g>
        </g>
    </switch>
</svg>
"""

xml2list(xmls)