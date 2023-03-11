function callDotNet() {
    alert(document.querySelector("#dailyNotes").value);
    let message = {}; // create basic object
    message.Command = "getUserProfile";
    message.Parameters = "";
    let sMessage = JSON.stringify(message);
    callApi(sMessage);
    message.Command = "getCurrentDirectory";
    message.Parameters = "";
    sMessage = JSON.stringify(message);
    callApi(sMessage);
}

// window.external.receiveMessage(message => alert(message));