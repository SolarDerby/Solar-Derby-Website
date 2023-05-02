var rawConfirmation = ""
void function (script) {
    //const { searchParams } = new URL(script.src);
    var fetchLocation = "./public/html/confirmation.html"
    fetch(fetchLocation).then(r => r.text()).then(content => {
        rawConfirmation = content;
        var masterContent = "<div id=\"confirmation-window\"></div>"
        script.outerHTML = masterContent;
    });

}(document.currentScript);


var hasAnswer = false
var answerValue = false
async function AskForConfirmation(title, subtitle, more_title, more_body, yes_text, no_text) {
    var modifiedConfirmation = rawConfirmation
    modifiedConfirmation = modifiedConfirmation.replace("%title%", title)
    modifiedConfirmation = modifiedConfirmation.replace("%subtitle%", subtitle)
    modifiedConfirmation = modifiedConfirmation.replace("%more_title%", more_title)
    modifiedConfirmation = modifiedConfirmation.replace("%more_body%", more_body)
    modifiedConfirmation = modifiedConfirmation.replace("%yes%", yes_text)
    modifiedConfirmation = modifiedConfirmation.replace("%no%", no_text)
    document.getElementById("confirmation-window").innerHTML = modifiedConfirmation

    hasAnswer = false

    while(!hasAnswer){
        await new Promise(r => setTimeout(r, 100));
    }

    document.getElementById("confirmation-window").innerHTML = ""

    return answerValue
}

async function AskForConfirmationLink(title, subtitle, more_title, more_body, yes_text, no_text, link) {
    var response = await AskForConfirmation(title, subtitle, more_title, more_body, yes_text, no_text)
    if (response){
        window.open(link, '_blank');
    }
}


function ConfirmationYes(){
    hasAnswer = true
    answerValue = true
}
function ConfirmationNo(){
    hasAnswer = true
    answerValue = false
}
