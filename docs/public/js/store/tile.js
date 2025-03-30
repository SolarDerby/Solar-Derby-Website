function ReplaceTooltips(original){
    original = original.replace("%tooltip_stl%", "An .STL file is the most commonly used filetype for 3D printing and is ready to print with most printing software. Part downloads are not pre oriented.")
    original = original.replace("%tooltip_license%", "The file you are downloading is provided under the Creative Commons; CC BY: This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use.")
    return original;
}

void function (script) {
    //const { searchParams } = new URL(script.src);
    //<div class="flex-tag">.STL</div>
    var fetchLocation = "./public/html/store/tile.html"
    var itemID = script.getAttribute("item");
    fetch(fetchLocation).then(r => r.text()).then(tileContent => {
        fetchLocation = "./public/store/" + itemID + "/settings.config"
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
                    var content = contentParts[v].split("\"")[1].split("\"")[0].replace("<-.>", ",");
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
                            downloadLink = "./public/store/" + itemID + downloadLink
                        }
                        tileContent = tileContent.replace("%image%", downloadLink)
                        
                    }
                    else if (key == "downloads"){
                        var splitContent = content.split(";")
                        var fileType = splitContent[0]
                        var downloadLink = "/downloads/" + itemID + fileType
                        if (downloadLink.startsWith("/")){
                            downloadLink = "./public/store/" + itemID + downloadLink
                        }
                        var moreBody = splitContent[1]

                        var clickCommand = "AskForConfirmationLink('Download', '" + title + " as " + fileType + "', 'More Info', '" + ReplaceTooltips(moreBody) + "', 'Download', 'Cancel', '" + downloadLink + "')"
                        buttonsContent += "<a type=\"button\" onclick =\"" + clickCommand + "\" class=\"select-none rounded border border-gray-600 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-300 font-medium text-gray-600\">Download " + fileType + "</a>\n"
                    }
                    else if (key == "links"){
                        var splitContent = content.split(";")
                        var linkTitle = splitContent[0]
                        var downloadLink = splitContent[1]
                        var clickCommand = ""
                        if (downloadLink.startsWith("/")){
                            downloadLink = "./public/store/" + itemID + downloadLink
                            clickCommand = "window.open(" + downloadLink + ", '_blank')"
                            buttonsContent += "<a type=\"button\" onclick =\"" + clickCommand + "\" class=\"select-none rounded border border-gray-600 bg-gray-50 hover:bg-gray-300 px-3 py-1.5 text-sm font-medium text-black\">" + linkTitle + "</a>\n"
                        }
                        else if (downloadLink.length == 0)
                        {
                            clickCommand = "./item/?item=" + itemID
                            buttonsContent += "<a type=\"button\" href =\"" + clickCommand + "\" class=\"select-none rounded border border-gray-600 bg-gray-50 hover:bg-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600\">" + linkTitle + "</a>\n"
                        }
                        else
                        {
                            clickCommand = "AskForConfirmationLink('" + linkTitle + "', 'Open link to a third party website.', 'More Info', 'These links are being provided as a convenience and for informational purposes only; they do not constitute an endorsement or an approval by Solar Derby of any of the products, services or opinions of the corporation or organization or individual. Solar Derby bears no responsibility for the accuracy, legality or content of the external site or for that of subsequent links. Contact the external site for answers to questions regarding its content.', 'Open', 'Cancel', '" + downloadLink + "')"
                            buttonsContent += "<a type=\"button\" onclick =\"" + clickCommand + "\" class=\"select-none rounded border border-gray-600 bg-gray-50 hover:bg-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600\">" + linkTitle + "</a>\n"
                        }
                    }
                }
            }
            tileContent = tileContent.replace("%buttons%", buttonsContent)
            script.outerHTML = tileContent;
        });
    });
}(document.currentScript);
