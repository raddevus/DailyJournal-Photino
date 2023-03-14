let today;

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
    let entryDate =  today.yyyymmdd();
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
    callApi(sMessage);
}

function loadEntry(){  
  let message = {}; // create basic object
  message.Command = "loadEntryData";
  // Create all parameters as array
  let allParameters = [];
  allParameters.push(today.yyyymmdd());
  // Call join on array to pass all parameters as a comma-delimited string
  message.Parameters = allParameters.join();
  let sMessage = JSON.stringify(message);
  callApi(sMessage);
}

function loadMonthlyEntries(){
  let message = {}; // create basic object
  message.Command = "loadMonthlyEntries";
  // Create all parameters as array
  let allParameters = [];
  allParameters.push(today.yyyymmdd());
  // Call join on array to pass all parameters as a comma-delimited string
  message.Parameters = allParameters.join();
  let sMessage = JSON.stringify(message);
  callApi(sMessage);

}

function initializeApp(){
    initApi();
    setCurrentDate();
    createYMDirectory();
    loadEntry();
    loadMonthlyEntries();
}

function initApi(){
    window.external.receiveMessage(response => {
  
      response = JSON.parse(response);
      switch (response.Command){
        case "getCurrentDirectory":{
          alert(`current directory is: ${response.Parameters}`);
          //document.querySelector("#output").innerHTML = `${response.Parameters}`;
          break;
        }  
        case "getUserProfile":{
             alert(`user home is: ${response.Parameters}`);
             //document.querySelector("#output").innerHTML = `${response.Parameters}`;
             break;
          }
          case "loadEntryData":{
            document.querySelector("#dailyNotes").value = response.Parameters;
            break;
          }
          case "loadMonthlyEntries":{
            alert(`got : ${response.AllParameters}`);
            // We've passed the Array (AllParameters) and it has been
            // Parsed into a JS array at this point.
            let allFiles = response.AllParameters;
            initMonthlyEntrySelect(allFiles);
            break;
          }
          default:{
              alert(response.Parameters);
              break;
          }
      }
    });
  }

  function setCurrentDate(){
    today = new Date();
    document.querySelector("#entryDate").valueAsDate = today;
  }

  function initMonthlyEntrySelect(allFiles){
    //alert(allFiles[0].substring(allFiles[0].lastIndexOf(`/`)+1,allFiles[0].lastIndexOf(`.`)));
    allFiles.map(filePath => {
     let currentFile = filePath.substring(filePath.lastIndexOf(`/`)+1,filePath.lastIndexOf(`.`));
      var localOption = new Option(currentFile, filePath, false, true);
		  document.querySelector('#monthEntryList').append(localOption );
    });
  }

  function dateChanged(currentDate){
    
    // to get the date set properly you have to had T00:00:00
    today = new Date(`${currentDate}T00:00:00`);
   
    // empty out the textarea in prep for any data that may load.
    document.querySelector("#dailyNotes").value = "";
    loadEntry();
    document.querySelector("#dailyNotes").focus();
  }

  Date.prototype.yyyymmdd = function(isDash=true) {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    if (isDash){
      return [this.getFullYear() + "-", mm.length===2 ? '' : '0', mm + "-", dd.length===2 ? '' : '0', dd].join(''); // padding
    }
    else{
      return [this.getFullYear() + "/", mm.length===2 ? '' : '0', mm + "/", dd.length===2 ? '' : '0', dd].join(''); // padding
    }
  };