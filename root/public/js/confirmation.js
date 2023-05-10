var rawConfirmation = ""
var windowDiv
void function (script) {
    //const { searchParams } = new URL(script.src);
    var fetchLocation = "./public/html/confirmation.html"
    windowDiv = document.createElement("div")
    windowDiv.setAttribute("id", "confirmation_window")
    script.parentElement.appendChild(windowDiv)
    fetch(fetchLocation).then(r => r.text()).then(content => {
        rawConfirmation = content;
        
    });

}(document.currentScript);


var hasAnswer = false
var answerValue = false
async function AskForConfirmation(title, subtitle, more_title, more_body, yes_text, no_text) {
    while(rawConfirmation.length < 1){
        await new Promise(r => setTimeout(r, 100));
    }
    var modifiedConfirmation = rawConfirmation
    modifiedConfirmation = modifiedConfirmation.replace("%title%", title)
    modifiedConfirmation = modifiedConfirmation.replace("%subtitle%", subtitle)
    modifiedConfirmation = modifiedConfirmation.replace("%more_title%", more_title)
    modifiedConfirmation = modifiedConfirmation.replace("%more_body%", more_body)
    modifiedConfirmation = modifiedConfirmation.replace("%yes%", yes_text)
    modifiedConfirmation = modifiedConfirmation.replace("%no%", no_text)
    if (no_text.length < 1){
        modifiedConfirmation = modifiedConfirmation.replace("%no_visibility%", "style=\"display:none\"")
    }

    windowDiv.innerHTML = modifiedConfirmation

    hasAnswer = false

    while(!hasAnswer){
        await new Promise(r => setTimeout(r, 100));
    }

    windowDiv.innerHTML = ""

    return answerValue
}

async function AskForNotify(title, subtitle, more_title, more_body) {
    var response = await AskForConfirmation(title, subtitle, more_title, more_body, "Ok", "")
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
