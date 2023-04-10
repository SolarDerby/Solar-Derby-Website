void function (script) {
    //const { searchParams } = new URL(script.src);
    var fetchLocation = script.getAttribute("fetch")
    fetch(fetchLocation).then(r => r.text()).then(content => {
        if (script.hasAttribute("rep")) {
            var repContent = "";
            var keys = script.getAttribute("buttons").split(";")
            //repContent += "<div class=\"mr-6 sm:flex md:flex lg:flex hidden\">"
            for(var i = 0;i < keys.length;i++){
                var v = keys[i]
                var vDatas = v.split(":")
                var vName = vDatas[0]
                var vValue = vDatas[1]
                
                //sm:mb-0 sm:mt-0 md:mb-0 md:mt-0 lg:mb-0 lg:mt-0
                repContent += "<li class=\"mx-2 flex\">"
                repContent += "<a href=\"" + vValue + "\">" + vName + "</a>"
                repContent += "</li>"
                
            }
            //repContent += "</div>"
            content = content.replace(script.getAttribute("rep"), repContent)
        }
        var title = ""
        if (script.hasAttribute("title")){
            title = script.getAttribute("title")
        }
        content = content.replace("%title%", title)
        script.outerHTML = content;
        
    });

}(document.currentScript);