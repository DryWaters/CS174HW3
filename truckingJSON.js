
var button = document.getElementById("queryButton");
var fileNameInput = document.getElementById("truckingFileName");
var errorMessage = document.getElementById("errorMessage");
var fileName;

button.addEventListener("click", function() {
	processQuery();

});

fileNameInput.addEventListener("keyup", function(event) {
	if (event.which === 13) {
		processQuery();
	}
});

function processQuery() {
	var processedHTML;
	fileName = fileNameInput.value;
	if (isFileNameValid(fileName)) {
		var jsonObject = loadJSON(fileName);
		if (jsonObject != false) {
			processedHTML = buildHTML(jsonObject);
			createNewWindow(processedHTML);
		}	
	}
}

function isFileNameValid(name) {
	var tempFile = name.toLowerCase();
	var fileExtension = tempFile.split(".");	

	if (name.length == 0) {
		errorMessage.innerHTML = "Empty file name.  Please try again.";
	}  else if (fileExtension[fileExtension.length - 1] != "json" || fileExtension.length < 2) {		// Make sure last part of the split ends with .json
		errorMessage.innerHTML = "Not a JSON file.  Please try again.";
	} else {
		errorMessage.innerHTML = "";
		fileNameInput.value = "";
		return true;
	}
	return false;
}

function loadJSON(url) {
	var jsonDoc;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", url, false);
	try {
		xmlhttp.send();
		jsonDoc = xmlhttp.responseText;
		return JSON.parse(jsonDoc);
	} catch (err) {
		errorMessage.innerHTML = `Failed to load JSON file named ${fileName}, with error ${err}`;
	}
	return false;
}

function buildHTML(json) {
	var html = "";
	console.log(json.Mainline);

	return html;
}

function createNewWindow(html) {
	var newWindow = window.open();
	newWindow.document.body.innerHTML = html;
}

