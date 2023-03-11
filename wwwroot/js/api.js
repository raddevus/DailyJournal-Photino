function callApi(sMessage){
    
    console.log(sMessage);
    window.external.sendMessage(sMessage);
}

function createYMDirectory(){
    
    let message = {}; // create basic object
    message.Command = "createYMDir";
    message.Parameters = "";
    let sMessage = JSON.stringify(message);
    callApi(sMessage);
}

function saveEntryData(){
    console.log("in saveEntryData()...");
    let entryDate =  new Date().yyyymmdd();
    let entryData = document.querySelector("#dailyNotes").value;

    let message = {}; // create basic object
    message.Command = "saveEntryData";
    // Create all parameters as array
    let allParameters = [];
    allParameters.push(entryDate.toString());
    allParameters.push(entryData);
    // Call join on array to pass all parameters as a comma-delimited string
    message.Parameters = allParameters.join();
    let sMessage = JSON.stringify(message);
    alert(sMessage);
    callApi(sMessage);
}

function initializeApp(){
    initApi();
    createYMDirectory();
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

  Date.prototype.yyyymmdd = function() {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
  
    return [this.getFullYear() + "-", mm.length===2 ? '' : '0', mm + "-", dd.length===2 ? '' : '0', dd].join(''); // padding
  };