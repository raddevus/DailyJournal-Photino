function callApi(){
    let message = {}; // create basic object
    message.Command = "getUserProfile";
    message.Parameters = "";
    let sMessage = JSON.stringify(message);
    console.log(sMessage);
    window.external.sendMessage(sMessage);
}

function initApi(){
    window.external.receiveMessage(response => {
  
      response = JSON.parse(response);
      switch (response.Command){
          case "getUserProfile":{
             alert(`user home is: ${response.Parameters}`);
             document.querySelector("#output").innerHTML = `${response.Parameters}`;
             break;
          }
          default:{
              alert(response.Parameters);
              break;
          }
      }
    });
  }