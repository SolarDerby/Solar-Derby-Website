function ReplaceTooltips(original){
    original = original.replace("%tooltip_stl%", "An .STL file is the most commonly used filetype for 3D printing and is ready to print with most printing software. Part downloads are not pre oriented.")
    original = original.replace("%tooltip_license%", "The file you are downloading is provided under the Creative Commons; CC BY: This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use.")
    return original;
}

function AppendTile(elementID, itemID){
    var newDiv = document.createElement("div")
    newDiv.setAttribute("class", "flex-tile")
    var newScript = document.createElement("script")
    newScript.setAttribute("src", "./public/js/store/tile.js")
    newScript.setAttribute("item", itemID)
    newDiv.appendChild(newScript)
    document.getElementById(elementID).appendChild(newDiv)
}
void function (script) {
    //const { searchParams } = new URL(script.src);
    //<div class="flex-tag">.STL</div>
    try{
        var urlParams = new URLSearchParams(window.location.search);
        var itemID = urlParams.get('item')
        var fetchLocation = "./public/store/" + itemID + "/settings.config"
        fetch(fetchLocation).then(r => r.text()).then(content => {
            try{
                document.getElementById("estimated_cost").innerHTML = "";
                document.getElementById("title").innerHTML = "";
                document.getElementById("subtitle").innerHTML = "";
                document.getElementById("description").innerHTML = "";
                document.getElementById("dependencies").innerHTML = "";
                document.getElementById("associated").innerHTML = "";
                var buttonsContent = ""
                var tagsContent = ""
                var figuresContent = ""
                var partsContent = ""
                var extraImagesContent = ""
                var dependenciesContent = 0
                var associatedContent = 0
                

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
                            document.title = content + " - Solar Derby";
                            document.getElementById("title").innerHTML = content;
                        }
                        else if (key == "type"){
                            document.getElementById("subtitle").innerHTML = content;
                        }
                        else if (key == "description"){
                            document.getElementById("description").innerHTML = content;
                        }
                        else if (key == "estimated cost"){
                            document.getElementById("estimated_cost").innerHTML = content;
                        }
                        else if (key == "tags"){
                            var tag = "<div class=\"flex-tag\">" + content + "</div>"
                            tagsContent += tag
                        }
                        else if (key == "image"){
                            var downloadLink = content
                            if (downloadLink.startsWith("/")){
                                downloadLink = "./public/store/" + itemID + downloadLink
                            }
                            document.getElementById("image").setAttribute("src", downloadLink)
                        }
                        else if (key == "extra images"){
                            var downloadLink = content
                            if (downloadLink.startsWith("/")){
                                downloadLink = "./public/store/" + itemID + downloadLink
                            }
                            var imageElement = "<img src=\"" + downloadLink + "\" class=\"h-full mr-2 w-fit object-cover rounded-lg\" loading=\"lazy\"></img>"
                            extraImagesContent += imageElement + "\n"
                        }
                        else if (key == "figures"){
                            figuresContent += "<p class=\"mt-2 block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200\">" + content + "</p>"
                        }
                        else if (key == "parts"){
                            partsContent += "<p class=\"mt-2 block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200\">" + content + "</p>"
                        }
                        else if (key == "associated"){
                            associatedContent++
                            AppendTile("associated", content)
                        }
                        else if (key == "dependencies"){
                            dependenciesContent++
                            AppendTile("dependencies", content)
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
                            buttonsContent += "<a type=\"button\" onclick =\"" + clickCommand + "\" class=\"select-none rounded border border-gray-600 bg-gray-50 hover:bg-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600\">Download " + fileType + "</a>\n"
                        }
                        else if (key == "links"){
                            var splitContent = content.split(";")
                            var linkTitle = splitContent[0]
                            var downloadLink = splitContent[1]
                            var clickCommand = ""
                            if (downloadLink.startsWith("/")){
                                downloadLink = "./public/store/" + itemID + downloadLink
                                clickCommand = "window.open(" + downloadLink + ", '_blank')"
                                buttonsContent += "<a type=\"button\" onclick =\"" + clickCommand + "\" class=\"select-none rounded border border-gray-600 bg-gray-50 hover:bg-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600\">" + linkTitle + "</a>\n"
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
                if (tagsContent.length > 0){
                    document.getElementById("tags").innerHTML = tagsContent;
                }else{
                    document.getElementById("tags_body").innerHTML = ""
                }
                if (figuresContent.length > 0){
                    document.getElementById("figures").innerHTML = figuresContent;
                }else{
                    document.getElementById("figures_body").innerHTML = ""
                }
                if (partsContent.length > 0){
                    document.getElementById("parts").innerHTML = partsContent;
                }else{
                    document.getElementById("parts_body").innerHTML = ""
                }
                if (dependenciesContent == 0){
                    document.getElementById("dependencies_body").remove()
                }
                if (associatedContent == 0){
                    document.getElementById("associated_body").remove()
                }
                if (extraImagesContent.length > 0){
                    document.getElementById("extra_images").innerHTML = extraImagesContent
                }else{
                    document.getElementById("extra_images_body").remove();
                }
                document.getElementById("buttons").innerHTML = buttonsContent;
                
                document.getElementById("loading_placeholder").remove();
                document.getElementById("main_content").removeAttribute("style");
            }
            catch (error){
                AskForNotify("500", "Internal Server Error", "More Info", error)
            }
        });
    }catch (error){
        AskForNotify("400", "Bad Request.", "More Info", error)
    }
    
    
}(document.currentScript);