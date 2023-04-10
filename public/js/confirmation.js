void function (script) {
    //const { searchParams } = new URL(script.src);
    var fetchLocation = "./public/html/confirmation.html"
    fetch(fetchLocation).then(r => r.text()).then(content => {
        script.outerHTML = content;
        
    });

}(document.currentScript);
