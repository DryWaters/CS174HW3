
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
		if (jsonObject != null && hasTrucks(jsonObject)) {
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
	return null;
}

function hasTrucks(json) {
	var hasRowData = "Row" in json.Mainline.Table;
	if (!hasRowData) {
		errorMessage.innerHTML = `JSON file named ${fileName} contains no truck information.  Please check file data.`;
	}
	return hasRowData;
}

function buildHTML(json) {
	var html = "";

	var headerData = json.Mainline.Table.Header.Data;
	html+=`<table style='border: 1px solid black;'><thead><tr>`
	for (var i = 0; i < headerData.length; i++) {
		html+=`<th style='border: 1px solid black; padding: 10px;'>${headerData[i]}</th>`;
	}
	html+=`</tr></thead><tbody>`;

	var rowData = json.Mainline.Table.Row;
	for (var i = 0; i < rowData.length; i++) {
		var hubsArray = rowData[i]['Hubs']['Hub'];
		html+=`<tr><td style='border: 1px solid black; padding: 10px;'>${rowData[i]['Company']}</td>`;
		html+=`<td style='border: 1px solid black; padding: 10px;'>${rowData[i]['Services']}</td>`;
		html+=`<td style='border: 1px solid black; padding: 10px;'><ul>`;
		for (var j = 0; j < hubsArray.length; j++) {
				if (j === 0) {
					html+=`<li style='font-weight: bold'>${hubsArray[j]}</li>`;
				} else {
					html+=`<li>${hubsArray[j]}</li>`;
				}
		}
		html+=`</ul></td>`;
		html+=`<td style='border: 1px solid black; padding: 10px;'>${rowData[i]['Revenue']}</td>`;
		html+=`<td style='border: 1px solid black; padding: 10px;'><a href='${rowData[i]['HomePage']}'>${rowData[i]['HomePage']}</a></td>`;
		html+=`<td style='border: 1px solid black; padding: 10px;'><img src='${rowData[i]['Logo']}' width='200px' height='100px' alt='${rowData[i]['Company']}\'s Logo'></td></tr>`;
	}

	html+=`</tbody></table>`;
	return html;
}

function createNewWindow(html) {
	var newWindow = window.open();
	newWindow.document.body.innerHTML = html;
}
