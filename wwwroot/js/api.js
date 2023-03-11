function callApi(sMessage){
    
    console.log(sMessage);
    window.external.sendMessage(sMessage);
}

function initializeApp(){
    initApi();

}

function initApi(){
    window.external.receiveMessage(response => {
  
      response = JSON.parse(response);
      switch (response.Command){
          case "getUserProfile":{
             alert(`user home is: ${response.Parameters}`);
             //document.querySelector("#output").innerHTML = `${response.Parameters}`;
             break;
          }
          case "getCurrentDirectory":{
            alert(`current directory is: ${response.Parameters}`);
            //document.querySelector("#output").innerHTML = `${response.Parameters}`;
            break;
          }
          default:{
              alert(response.Parameters);
              break;
          }
      }
    });
  }