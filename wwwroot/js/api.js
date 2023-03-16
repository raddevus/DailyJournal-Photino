let today;
let dirSeparator = null;

document.querySelector("html").addEventListener("keydown", (event) => {
  // alert(`ctrlkey : ${event.ctrlKey}`);
  
  if (event.ctrlKey ) {
    if (event.code == "KeyS"){
    saveEntryData();
    }
  }
});

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

function loadPathSeparator(){  
  let message = {}; // create basic object
  message.Command = "getDirSeparator";
  // No parameters required
  message.Parameters = "null";
  let sMessage = JSON.stringify(message);
  callApi(sMessage);
}

function initializeApp(){
    initApi();
    setCurrentDate();
    loadPathSeparator();
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
        case "getDirSeparator":{
          
          dirSeparator = `${response.Parameters}`;
          
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
            // We've passed the Array (AllParameters) and it has been
            // Parsed into a JS array at this point.
            // remove all the current items in the monthentrylist
            let monthListOptions = document.querySelectorAll("#monthEntryList option");
            monthListOptions.forEach(option => option.remove());
            let allFiles = response.AllParameters;
            initMonthlyEntrySelect(allFiles);
            break;
          }
          case "saveEntryData":{
            loadMonthlyEntries();
            document.querySelector("#dailyNotes").focus();
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
    let monthListCtrl = document.querySelector("#monthEntryList");
    sortDateEntries(allFiles);
    allFiles.map(filePath => {
     let currentFile = filePath.substring(filePath.lastIndexOf(dirSeparator)+1,filePath.lastIndexOf(`.`));
      var localOption = new Option(currentFile, filePath, false, true);
		  monthListCtrl.append(localOption );
    });
    monthListCtrl.selectedIndex = -1;
  }

  function monthEntryChangeHandler(filePath){
    let selectedDate = filePath.options[filePath.selectedIndex].text;
    today = new Date(`${selectedDate}T00:00:00`);
    loadEntry();
    document.querySelector("#entryDate").valueAsDate = today;
  }

  function dateChanged(currentDate){
    
    // to get the date set properly you have to had T00:00:00
    today = new Date(`${currentDate}T00:00:00`);
   
    // empty out the textarea in prep for any data that may load.
    document.querySelector("#dailyNotes").value = "";
    loadEntry();
    document.querySelector("#dailyNotes").focus();

    loadMonthlyEntries();
  }

  function sortDateEntries(allDates){
    allDates.sort((x, y) => {
      // to change to descending order switch "<" for ">"
      return x.toLowerCase() > y.toLowerCase();
    });
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