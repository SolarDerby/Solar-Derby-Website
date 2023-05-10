void function (script) {
    //const { searchParams } = new URL(script.src);
    var fetchLocation = script.getAttribute("fetch")
    fetch(fetchLocation).then(r => r.text()).then(content => {
        if (script.hasAttribute("rep")) {
            content = content.replace(script.getAttribute("rep"), script.innerHTML)
        }
        var title = ""
        if (script.hasAttribute("title")){
            title = script.getAttribute("title")
        }
        content = content.replace("%title%", title)
        script.outerHTML = content;
        
    });

}(document.currentScript);