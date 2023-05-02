void function (script) {
    //const { searchParams } = new URL(script.src);
    //<div class="flex-tag">.STL</div>
    var fetchLocation = "./public/html/store/tile.html"
    console.log("Loading")
    fetch(fetchLocation).then(r => r.text()).then(tileContent => {
        fetchLocation = "./public/store/" + script.getAttribute("item") + "/settings.config"
        fetch(fetchLocation).then(r => r.text()).then(content => {
            var buttonsContent = ""
            var title = ""
            var lines = content.split('\n');
            for(var i = 0;i < lines.length;i++){
                var line = lines[i]

                var key = line.split("=")[0]
                var contentRaw = line.split("=")[1]
                var contentParts = contentRaw.split(",")
                for(var v = 0;v < contentParts.length;v++){
                    var content = contentParts[v].split("\"")[1].split("\"")[0]
                    if (key == "title"){
                        title = content;
                        tileContent = tileContent.replace("%title%", content)
                    }
                    else if (key == "type"){
                        tileContent = tileContent.replace("%type%", content)
                    }
                    else if (key == "tags"){
                        var tag = "<div class=\"flex-tag\">" + content + "</div>"
                        tileContent = tileContent.replace("<!--%tags%-->", "<!--%tags%-->" + tag)
                        
                    }
                    else if (key == "image"){
                        var downloadLink = content
                        if (downloadLink.startsWith("/")){
                            downloadLink = "./public/store/" + script.getAttribute("item") + downloadLink
                        }
                        tileContent = tileContent.replace("%image%", downloadLink)
                        
                    }
                    else if (key == "downloads"){
                        var splitContent = content.split(";")
                        var fileType = splitContent[0]
                        var downloadLink = splitContent[1]
                        if (downloadLink.startsWith("/")){
                            downloadLink = "./public/store/" + script.getAttribute("item") + downloadLink
                        }
                        var moreBody = splitContent[2]

                        var clickCommand = "AskForConfirmationLink('Download', '" + title + " as " + fileType + "', 'More Info', '" + moreBody + "', 'Download', 'Cancel', '" + downloadLink + "')"
                        buttonsContent += "<button type=\"button\" onclick =\"" + clickCommand + "\" class=\"rounded border border-gray-600 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600\">Download " + fileType + "</button>\n"
                    }
                    else if (key == "links"){
                        var splitContent = content.split(";")
                        var linkTitle = splitContent[0]
                        var downloadLink = splitContent[1]
                        var clickCommand = ""
                        if (downloadLink.startsWith("/")){
                            downloadLink = "./public/store/" + script.getAttribute("item") + downloadLink
                            clickCommand = "window.open(" + downloadLink + ", '_blank')"
                        }else{
                            clickCommand = "AskForConfirmationLink('" + linkTitle + "', 'Open Link', 'More Info', 'This link redirects to a third party website.', 'Open', 'Cancel', '" + downloadLink + "')"
                        }
                        buttonsContent += "<button type=\"button\" onclick =\"" + clickCommand + "\" class=\"rounded border border-gray-600 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600\">" + linkTitle + "</button>\n"
                    }
                }
            }
            tileContent = tileContent.replace("%buttons%", buttonsContent)
            script.outerHTML = tileContent;
        });
    });
}(document.currentScript);
