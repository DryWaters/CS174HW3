
var button = document.getElementById("queryButton");
var fileNameInput = document.getElementById("truckingFileName");
var errorMessage = document.getElementById("errorMessage");
var fileName;

button.addEventListener("click", function() {
	processQuery()
});

fileNameInput.addEventListener('keyup', function(event) {
	if (event.which === 13) {
		processQuery();
	}
});

function processQuery() {
	fileName = fileNameInput.value;
	checkFileName(fileName);
}

function checkFileName(name) {
	var tempFile = name.toLowerCase();
	var fileExtension = tempFile.split(".");	

	if (name.length == 0) {
		errorMessage.innerHTML = "Empty file name.  Please try again.";
	}  else if (fileExtension[fileExtension.length - 1] != "json" || fileExtension.length < 2) {		// Make sure last part of the split ends with .json
		errorMessage.innerHTML = "Not a JSON file.  Please try again.";
	} else {
		errorMessage.innerHTML = "";
	}
}