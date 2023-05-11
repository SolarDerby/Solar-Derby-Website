var docsLocation = ""
var script;

async function webpageContent(src){
    const response = await fetch(docsLocation + src).then(r => r.text()).then(content => {return content;});
    return response
}

function toggleDocsDropdown(){
    var docDrop = document.getElementById('docs-dropdown-menu')
    if (docDrop.hasAttribute('style'))
    { 
        docDrop.removeAttribute('style')
    }
    else
    { 
        docDrop.setAttribute('style', 'display:none') 
    }
}

function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}

function PrintDocs() {
    var divContents = document.getElementById("page-content").innerHTML;
    var a = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<body > <h1>Div contents are <br>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}

function RevalidateScripts(node) 
{
    var scripts = Array.prototype.slice.call(node.getElementsByTagName("script"), 0)
    for (var v = 0; v < scripts.length; v++){
        var scriptNode = scripts[v]
        var parentNode = scriptNode.parentNode;
        parentNode.removeChild(scriptNode)

        var newScriptNode = document.createElement("script")
        for (var k = 0; k < scriptNode.attributes.length; k++) {
            var attrib = scriptNode.attributes[k];
            newScriptNode.setAttribute(attrib.name, attrib.value)
        }
        parentNode.appendChild(newScriptNode)
    }
}

function LoadDocsDropdown(){
    var fetchLocation = "./public/html/docs-dropdown.html"

    try {
        fetch(fetchLocation).then(r => r.text()).then(async content => {
            while(document.getElementById("docs_subcategory_button") == null){
                await new Promise(r => setTimeout(r, 100));
            }
            var dropdownParent = document.getElementById("docs_subcategory_button").parentElement;
            dropdownParent.innerHTML = ""
            var contentNodes = Array.prototype.slice.call(parseHTML(content).children, 0)
            
            for(var i = 0; i < contentNodes.length; i++){
                var node = contentNodes[i]
                RevalidateScripts(node)  
                dropdownParent.appendChild(node)
            }
            
        });
    }catch (error){
        AskForNotify("400", "Bad Request.", "More Info", "On Load Dropdown Function - " + error)
    }
}

function uuidv4() {
return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
);
}

function LoadDocs(fetchLocation){
    var name = "404 Docs Dont Exist"

    var docTable = document.getElementById("docs-table-of-contents")
    var docContents = document.getElementById("docs-content")

    try {
        fetch(fetchLocation).then(r => r.text()).then(async content => {
            try {
                var lines = content.split('\n');

                name = lines[0]
                docsLocation = lines[1]

                console.log("Loading [" + name + "] Documentation : \"" + fetchLocation + "\"")

                var newContent = "";
                var webContent = "<div class=\" flex-tile-clean p-10\"> <div class=\"w-full items-center flex justify-center flex-col\"> <p class=\"text-4xl text-white\">" + name + "</p></div></div>"
                
                var currentSection = "";
                var submenu = false;
                var lastmenu = false;
                for(var i = 2;i < lines.length;i++){
                    var title = lines[i].split("\"")[1]
                    var src = lines[i].split("src=\"")[1].split("\"")[0]
                    
                    if (src == "heading")
                    {
                        currentSection = title + "-";

                        newContent += "<p class=\"border-y-[2px] font-normal text-2xl\" style=\"margin-bottom:15px;\">" + title + "</p>"
            
                        webContent += "<div id=\"" + title + "\" class=\"w-full\">"
                        webContent += "<h3 class=\"flex items-center mt-12 mb-6\">"
                        webContent += "<span aria-hidden=\"true\" class=\"w-4 bg-gray-200 rounded h-0.5\"></span>"
                        webContent += "<span class=\"mx-3 text-4xl font-medium\">" + title + "</span>"
                        webContent += "<span aria-hidden=\"true\" class=\"flex-grow bg-gray-200 rounded h-0.5\"></span>"
                        webContent += "</h3>"
                        webContent += "</div>"
                    }
                    else
                    {
                        var sectionTitle = i.toString();
                        var sectionHref = window.location.origin + window.location.pathname + window.location.search + "#" + sectionTitle
                        if (lines[i][0] != "-"){
                            if (submenu){
                                submenu = false
                                newContent += " </ul>"
                            }
                            if (lastmenu){
                                lastmenu = false
                                webContent += "</section>"
                            }
                            lastmenu = true;
                            webContent += "<section id=\"" + sectionTitle + "\"><div class=\"h-full mt-5\">"
                            webContent += "<p class=\"font-normal text-2xl\">" + title + "</p>"
                            webContent += await webpageContent(src)
                            webContent += "</div>"
                            newContent = newContent + "<li class=\"font-medium\"><a href=\"" + sectionHref  + "\">" + title + "</a></li>"
                        }else{
                            if (!submenu){
                                submenu = true
                                newContent += "<ul class=\"nav\">"
                            }
                            webContent += "<section id=\"" + sectionTitle + "\" class=\"border-l-[2px]\"><div class=\"h-full mt-3 ml-5\">"
                            webContent += "<p class=\"font-normal text-xl\">" + title + "</p>"
                            webContent += await webpageContent(src)
                            webContent += "</div></section>"
                            newContent += "<li class=\"text-[#111] dark:text-slate-300 pl-[20px] font-[400] border-l-[2px]\"> <a href=\"" + sectionHref + "\">" + title + "</a></li>"
                        }
                        //code here using lines[i] which will give you each line
                    }
                }
                if (submenu){
                    submenu = false
                    newContent += " </ul>"
                }
                const parser = new DOMParser();
                
                
                var webContentNodes = Array.prototype.slice.call(parseHTML(webContent).children, 0)

                docTable.innerHTML = newContent
                
                for(var i = 0; i < webContentNodes.length; i++){
                    var node = webContentNodes[i]
                    RevalidateScripts(node)  
                    docContents.appendChild(node)
                }

                document.getElementById("docs-placeholder-content").setAttribute("style", "display:none")
                document.getElementById("docs-placeholder-table-of-contents").setAttribute("style", "display:none")
            } catch (error){
                AskForNotify("500", "Internal Server Error", "More Info", "On Load Function - " + error)
            }
        });
    }catch (error){
        AskForNotify("400", "Bad Request.", "More Info", "On Load Function - " + error)
    }
}

function GetDocSource(docName){
    try {
        fetch(fetchLocation).then(r => r.text()).then(async content => {
            while(document.getElementById("docs_subcategory_button") == null){
                await new Promise(r => setTimeout(r, 100));
            }
            document.getElementById("docs_subcategory_button").parentElement.innerHTML = content
        });
    }catch (error){
        AskForNotify("400", "Bad Request.", "More Info", "On Get Source Function - " + error)
    }
}

function ReloadDocs(docName){
    var fetchLocation = script.getAttribute("fetch")

    document.getElementById("docs-table-of-contents").innerHTML = ""
    document.getElementById("docs-content").innerHTML = ""
    document.getElementById("docs-placeholder-content").removeAttribute("style")
    document.getElementById("docs-placeholder-table-of-contents").removeAttribute("style")

    try {
        fetch(fetchLocation).then(r => r.text()).then(async content => {
            try{
                //Await the dropdown menu
                while(document.getElementById("docs-dropdown-subheading") == null){
                    await new Promise(r => setTimeout(r, 100));
                }

                var lines = content.split('\n');

                var found_src = ""
                var found_title = ""
                for(var i = 0;i < lines.length;i++){
                    var title = lines[i].split("\"")[1]
                    var heading = lines[i].split("heading=\"")[1].split("\"")[0]
                    var subheading = lines[i].split("subheading=\"")[1].split("\"")[0]
                    var borderColor = lines[i].split("dropdown-border=\"")[1].split("\"")[0]
                    var src = lines[i].split("src=\"")[1].split("\"")[0]
                    
                    if (found_src.length < 1){
                        found_src = src
                        found_title = title
                        document.getElementById("docs-dropdown-heading").innerHTML = heading
                        document.getElementById("docs-dropdown-subheading").innerHTML = subheading
                        document.getElementById("docs-dropdown-border").setAttribute("class", document.getElementById("docs-dropdown-border").getAttribute("class") + " border-" + borderColor)
                        document.title = heading + " " + subheading + " - Solar Derby"
                    }
                    else if (title.toLowerCase() == docName.toLowerCase()){
                        found_src = src
                        found_title = title
                        document.getElementById("docs-dropdown-heading").innerHTML = heading
                        document.getElementById("docs-dropdown-subheading").innerHTML = subheading
                        document.getElementById("docs-dropdown-border").setAttribute("class", document.getElementById("docs-dropdown-border").getAttribute("class") + " border-" + borderColor)
                        document.title = heading + " " + subheading + " - Solar Derby"
                    }
                }
                if (found_title.toLowerCase() == docName.toLowerCase() || docName.length < 1){
                    LoadDocs(found_src)
                }else{
                    document.title = "Error"
                    AskForNotify("404", "Item could not be found.", "More Info", "The requested doc's manifest could not be found in the docs library file, it might not exist.")
                }
            } catch (error){
                AskForNotify("500", "Internal Server Error", "More Info", "On Reload Function - " + error)
            }
        });
    }catch (error){
        AskForNotify("400", "Bad Request.", "More Info", "On Reload Function - " + error)
    }
}

void function (_script) {
    script = _script
    LoadDocsDropdown();

    try{
        var urlParams = new URLSearchParams(window.location.search);
        var docName = urlParams.get('doc')
        if (docName == null){
            docName = ""
        }
        ReloadDocs(docName)
    }catch (error){
        AskForNotify("500", "Internal Server Error", "More Info", "On Start Function - " + error)
    }
    
}(document.currentScript);