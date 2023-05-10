function pullProperty(data, keyName){
    var keys = data.split(';');
    for(var i = 0;i < keys.length;i++){
        var v = keys[i]
        var vDatas = v.split(":")
        var vName = vDatas[0]
        var vValue = vDatas[1]
        if (vName == keyName){
            return vValue
        }
    }
    return "0"
}

function checkCharacter(value, characters){
    for(var i = 0;i < characters.length;i++){
        if (value == characters[i]){
            return true
        }
    }
    return false
}
function parseSize(rawData, screenSize){
    var interiorData = rawData.replace(" ", "")
    var currentPixelsSize = 0;
    var currentCall = "";
    var currentType = "";
    var lastSymbol = "+"
    for(var i = 0;i < interiorData.length;i++){
        var c = interiorData[i]
        var mathSymbol = (c == "*" || c == "/" || c == "+" || c == "-")
        if (mathSymbol && currentCall.length > 0){
            if (currentType == "px" || currentType == "%"){
                var callSize = Number.parseFloat(currentCall)
                if (currentType == "%"){
                    callSize = screenSize * (callSize / 100)
                }
                if (lastSymbol == "-"){
                    currentPixelsSize -= callSize
                }
                if (lastSymbol == "+"){
                    currentPixelsSize += callSize
                }
                
            }else{
                var callSize = Number.parseFloat(currentCall)
                if (lastSymbol == "*"){
                    currentPixelsSize *= callSize
                }
                if (lastSymbol == "/"){
                    currentPixelsSize /= callSize
                }
            }
            currentType = ""
            currentCall = ""
            lastSymbol = c
        }else{
            if (checkCharacter(c, "0123456789.-+")){
                currentCall += c;
            }
            else
            {
                currentType += c
            }
        }
    }
    if (currentCall.length > 0){
        var callSize = Number.parseFloat(currentCall)
        if (currentType == "%"){
            callSize = screenSize * (callSize / 100)
        }
        if (lastSymbol == "-"){
            currentPixelsSize -= callSize
        }
        if (lastSymbol == "+"){
            currentPixelsSize += callSize
        }
    }
    return Number.parseInt(currentPixelsSize)
}

function GetTile(width, height, left, bottom){
    var content = "<li class=\"flex dark:hidden\">"
    content += "<p href=\"https://github.com/lmas3009/cleandocs-template\" class=\"rounded w-full h-screen bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 gradient-animate\" style=\"margin-left:" + left + "px;width:" + width + "px;height:" + height + "px;margin-bottom:" + bottom + "px;\"></p>"
    content += "</li>"
    content += "<li class=\"hidden dark:flex\">"
    content += "<p href=\"https://github.com/lmas3009/cleandocs-template\" class=\"rounded w-full h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 gradient-animate\" style=\"margin-left:" + left + "px;width:" + width + "px;height:" + height + "px;margin-bottom:" + bottom + "px;\"></p>"
    content += "</li>"
    return content;
}
function rInt(max) {
    return Math.floor(Math.random() * max);
  }

void function (script) {

    //const { searchParams } = new URL(script.src);
    var sizeData = script.getAttribute("size")

    var rawWidth = pullProperty(sizeData, "width")
    var rawHeight = pullProperty(sizeData, "height")

    var body = document.body,
    html = document.documentElement;

    var width = parseSize(rawWidth, html.clientWidth)
    var height = parseSize(rawHeight, html.clientHeight)
    
    var designData = script.getAttribute("design")
    var parts = Number.parseInt(pullProperty(designData, "parts"))
    var subParts = Number.parseInt(pullProperty(designData, "subparts"))
    var deviation = parseSize(pullProperty(designData, "deviation"), width)
    var titleHeight = parseSize(pullProperty(designData, "title-height"), height)
    

    var content = "<div style=\"width:" + width + "px;height:" + height + "px\">"
    
    var titleHeight 
    var remainingHeight = height - titleHeight - 10
    var heightPer = remainingHeight / parts
    content += GetTile(Math.min(300, width), titleHeight, 0, 10)

    for(var i = 0;i < parts;i++){
        var titleHeight = Math.max(18, heightPer * 0.3)
        content += GetTile(Math.min(400 - 5 - rInt(deviation), width - 5 - rInt(deviation)), titleHeight - 8, 5, 8)
        if ((heightPer - titleHeight) > subParts * 8) {
            var subpartHeightPer = (heightPer - titleHeight) / subParts
            for(var v = 0;v < subParts;v++){
                content += GetTile(width - 10 - rInt(deviation), subpartHeightPer - 8, 10, 8)
            }
        }
    }


    content += "</div>"
    
    script.outerHTML = content;

}(document.currentScript);