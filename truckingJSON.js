const button = document.getElementById("queryButton");
const fileNameInput = document.getElementById("truckingFileName");
const errorMessage = document.getElementById("errorMessage");
let fileName;

// create listeners for click and enter key for input field
button.addEventListener("click", function() {
	processQuery();
});

fileNameInput.addEventListener("keyup", function(event) {
	if (event.which === 13) {
		processQuery();
	}
});

// process the JSONquery that is entered
function processQuery() {
	let processedHTML;
	fileName = fileNameInput.value;	// get fileName from Input Field
	if (isFileNameValid(fileName)) {	// check if field is not empty and ends with extension.json
		let jsonObject = loadJSON(fileName);	// load the file if available, returns null if error
		if (jsonObject != null && hasTrucks(jsonObject)) {	// if file is loaded and contains truck data
			processedHTML = buildHTML(jsonObject);	// parse the JSON into HTML to be placed in new window
			createNewWindow(processedHTML);	// open a new window and place the built HTML
		} 
	}
}

// check if filename is empty and ends with .json extension
function isFileNameValid(name) {
	let tempFile = name.toLowerCase();
	let fileExtension = tempFile.split(".");	

	if (name.length == 0) {
		errorMessage.innerHTML = "Empty file name.  Please try again.";
	}  else if (fileExtension[fileExtension.length - 1] != "json" || fileExtension.length < 2) { 
		errorMessage.innerHTML = "Not a JSON file.  Please try again.";
	} else {
		errorMessage.innerHTML = "";
		fileNameInput.value = "";
		return true;
	}
	return false;
}

// load the JSON file if available and parse into DOM model
function loadJSON(url) {
	let jsonDoc;
	let xmlhttp;
	if (window.XMLHttpRequest) {	
		xmlhttp = new XMLHttpRequest();	// used for new browsers
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");	// used for IE5, IE6
	}
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

// check if JSON contains Row data on truck listings.
function hasTrucks(json) {
	let hasRowData = "Row" in json.Mainline.Table;
	if (!hasRowData) {
		errorMessage.innerHTML = `JSON file named ${fileName} contains no truck information.  Please check file data.`;
	}
	return hasRowData;
}

// build HTML from JSON Dom
function buildHTML(json) {
	let html = "";

	// process table header data
	const headerData = json.Mainline.Table.Header.Data;
	html+=`<table style='border: 1px solid black;'><thead><tr>`
	for (let i = 0; i < headerData.length; i++) {
		html+=`<th style='border: 1px solid black; padding: 10px;'>${headerData[i]}</th>`;
	}
	html+=`</tr></thead><tbody>`;

	// process trucking row data
	const rowData = json.Mainline.Table.Row;
	for (let i = 0; i < rowData.length; i++) {
		const hubsArray = rowData[i]['Hubs']['Hub'];
		html+=`<tr><td style='border: 1px solid black; padding: 10px;'>${rowData[i]['Company']}</td>`;
		html+=`<td style='border: 1px solid black; padding: 10px;'>${rowData[i]['Services']}</td>`;
		html+=`<td style='border: 1px solid black; padding: 10px;'><ul>`;
		for (let j = 0; j < hubsArray.length; j++) {
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

// create a new blank window and place the built HTML
function createNewWindow(html) {
	let newWindow = window.open();
	newWindow.document.body.innerHTML = html;
}