void function (script) {
    //const { searchParams } = new URL(script.src);
    script.parentElement.setAttribute("href", window.location.origin + window.location.pathname + script.parentElement.getAttribute("href"))

}(document.currentScript);