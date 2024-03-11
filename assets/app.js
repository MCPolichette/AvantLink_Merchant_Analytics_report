// global variables
var merchant = {};
var merchantList = [];
function addMerchant() {
	var merchantIdInput = document.getElementById("merchantIdInput");
	console.log(merchantIdInput);
	var merchantId = merchantIdInput.value.trim();
	if (merchantId !== "") {
		var merchantList = document.getElementById("merchantList");
		var listItem = document.createElement("li");
		listItem.className = "list-group-item";
		listItem.textContent = merchantId;
		var removeButton = document.createElement("button");
		removeButton.className = "btn btn-danger btn-sm float-end IdRemove";
		removeButton.textContent = "Remove";
		removeButton.addEventListener("click", function () {
			listItem.remove();
		});
		listItem.appendChild(removeButton);
		merchantList.appendChild(listItem);
		merchantIdInput.value = "";
		document.getElementById("selectedMerchantButton").disabled = false;
	}
}
function api_error(error, merchant_id) {
	if (error.message.includes("Failed to fetch")) {
		console.error(merchant_id, +" Failed to fetch data:", error);
		var column = document.createElement("div");
		column.classList.add("col-12");

		// Create an <h5> element for the Merchant ID
		var merchantIdHeader = document.createElement("h5");
		merchantIdHeader.textContent = "Merchant ID: " + merchant_id;
		column.appendChild(merchantIdHeader);

		// Create an <h6> element for the error
		var errorHeader = document.createElement("h6");
		errorHeader.textContent = "Error: " + error;
		column.appendChild(errorHeader);
		console.log(column);
		insertListing(column, "danger");
	} else {
		// Handle other types of errors example below
		// console.error("An error occurred:", error);
	}
}
function runSelectedMerchants() {
	var merchantList = [];
	var listItems = document.querySelectorAll("#merchantList li");
	listItems.forEach(function (item) {
		var merchantId = item.textContent.trim().replace("Remove", "");
		merchantList.push(merchantId);
	});
	document
		.querySelectorAll(".IdRemove")
		.forEach((item) => item.classList.add("disabled"));
	console.log(merchantList);
	loadButton("selectedMerchantButton");
	var acceptableData = true;
	today.date = DateToString(new Date());
	today.year = new Date().getFullYear();
	today.month = new Date().getMonth();
	today.day = new Date().getDay();
	console.log(today);
	var api_start_date = today.year - 1 + "-" + today.month + "-01";
	var api_end_date = getLastDayOfPreviousMonth();
	console.log(api_end_date, api_start_date);

	for (i = 0; i < merchantList.length; i++) {
		console.log(i);
		runAPI({
			report_id: 48,
			startDate: api_start_date,
			endDate: api_end_date,
			merchant_id: merchantList[i],
		});
	}

	// API Call switch for FAILURE - Display - SUCCESS - run a graph, and some sort of algorithm to detect a month where drop off occured.
}

function isNumber(value) {
	return typeof value === "number" && isFinite(value);
}
function removeYearFromDate(dateString) {
	var parts = dateString.split("/");
	var month = parts[0];
	var day = parts[1];
	return month + "/" + day;
}
var icons = {
	up: `<i class="fa fa-caret-square-o-up" style="color:green"></i>`,
	down: `<i class="fa fa-caret-square-o-down" style="color:red"></i>`,
};
var today = {};
var primaryMonth = { month: "primary", affiliateReport: [] };
var priorMonth = { month: "prior" };
var viewReportButton = document.getElementById("viewReport");
var affiliateReportButton = document.getElementById("affiliate_report_button");
//General Functions
function toUSD(dollarInt) {
	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	dollarUSD = formatter.format(dollarInt);
	return dollarUSD;
}
function hideRow(rowId, btnId) {
	let row = document.getElementById(rowId);
	let btn = document.getElementById(btnId);
	if (row.hidden) {
		btn.innerHTML = "Hide the Display Below";
		row.hidden = false;
	} else {
		btn.innerHTML = "Show Hidden Row";
		row.hidden = true;
	}
}
function insertListing(columns, classes) {
	console.log(columns);
	console.log(classes);
	// Create a new <div> element with the class "row"
	var row = document.createElement("div");
	row.classList.add("row");
	switch (classes) {
		case "danger":
			row.classList.add("alert", "alert-danger");
			break;
		default:
			break;
	}
	for (i = 0; i < columns.length; i++) {
		console.log(i);
		row.appendChild(columns[i]);
	}

	// Get the element with the id "graph_display"
	var graphDisplay = document.getElementById("graph_display");

	// Append the new <div> element to the "graph_display" element
	graphDisplay.appendChild(row);
	graphDisplay.appendChild(document.createElement("br"));
}
function removeDisabledButton(id) {
	let btn = document.getElementById(id);
	btn.disabled = false;
	btn.classList = "btn btn-success";
}
function loadButton(id) {
	// document.getElementById("first_loading_bar").hidden = false;
	let btn = document.getElementById(id);
	btn.disabled = true;
	btn.classList = "btn btn-outline.primary";
	btn.innerHTML = `<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
}
function getLastDayOfPreviousMonth() {
	// Get the current date
	const currentDate = new Date();
	// Set the date to the first day of the current month
	currentDate.setDate(1);
	// Set the date to the previous day, which effectively sets it to the last day of the previous month
	currentDate.setDate(0);

	// Extract year, month, and date components
	const year = currentDate.getFullYear();
	// JavaScript months are zero-based, so we add 1 to get the previous month
	const month = currentDate.getMonth() + 1;
	const day = currentDate.getDate();

	// Format the date as yyyy-mm-dd
	const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
		.toString()
		.padStart(2, "0")}`;

	// Return the formatted date
	return formattedDate;
}
function addNote() {
	let noteTitle = document.getElementById("manualTitleText").value;
	let noteContent = document.getElementById("manualNotesText").value;
	let noteSection = document.getElementById("notesDiv");
	noteContent = noteContent.replace(/\r?\n/g, "<br />");
	let note = `<h5>` + noteTitle + `</h5><p>` + noteContent + `</p>`;
	noteSection.insertAdjacentHTML("afterend", note);
	noteTitle = "";
	noteContent = "";
}
function completeButton(id, newText) {
	document.getElementById("first_loading_bar").hidden = true;
	let btn = document.getElementById(id);
	btn.disabled = true;
	btn.innerHTML = newText;
}
function hide(arr) {
	//Reveals a hidden HTML element.
	arr.forEach((id) => {
		let element = document.getElementById(id);
		element.hidden = true;
	});
}
function unhide(arr) {
	//Reveals a hidden HTML element.
	arr.forEach((id) => {
		let element = document.getElementById(id);
		console.log(element);
		if (element.hidden) {
			element.removeAttribute("hidden");
		}
	});
}
function updateDivArray(array, text) {
	for (let i = 0; i < array.length; i++) {
		document.getElementById(array[i]).innerHTML = text;
	}
}

function DateToString(date) {
	let options = {
		// weekday: "short", //to display the full name of the day, you can use short to indicate an abbreviation of the day
		day: "numeric",
		month: "long", //to display the full name of the month
		year: "numeric",
	};
	var sDay = date.toLocaleDateString("en-US", options);
	return sDay;
}
function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}
function use_local_storage() {
	let x = window.localStorage.test;
	document.getElementById("password_input").value = x;
	console.log("used local storage to populate API key");
}
function password_check() {
	API_KEY = document.getElementById("password_input").value;
	switch (API_KEY.length) {
		case 32:
			window.localStorage.setItem("test", API_KEY);
			unhide(["monthlyReport", "report_display"]);
			hide(["title"]);
			document.getElementById("first_display").remove();
			break;
		default:
			alert("This key is an unacceptable value");
			break;
	}
}

function createRow() {
	// Create a new <div> element with the class "row"
	var row = document.createElement("div");
	row.classList.add("row");

	// Get the element with the id "graph_display"
	var graphDisplay = document.getElementById("graph_display");

	// Append the new <div> element to the "graph_display" element
	graphDisplay.appendChild(row);
}

function identifySignificantDrops(data) {
	console.log("BUGS");
	let significantDrops = [];
	for (let i = 1; i < data.length; i++) {
		const currentSales = data[i].Sales;
		const previousSales = data[i - 1].Sales;

		// Calculate the percentage change in sales
		const percentageChange =
			((currentSales - previousSales) / previousSales) * 100;

		// Define a threshold for significant drops
		const threshold = -70; // 70% drop

		// If the percentage change is below the threshold, consider it a significant drop
		if (percentageChange < threshold) {
			significantDrops.push({
				Month: data[i].Month,
				Sales: data[i].Sales,
				PreviousMonthSales: previousSales,
				PercentageChange: percentageChange.toFixed(2) + "%",
			});
		}
	}

	return significantDrops;
}

// function perfomance_report() {
// 	loadButton("submitBtn");
// 	var acceptableData = true;
// 	today.date = DateToString(new Date());
// 	today.year = new Date().getFullYear();
// 	today.month = new Date().getMonth();
// 	console.log(today);
// 	merchant.id = document.getElementById("merchant_ID_input").value;
// 	report.month = document.getElementById("selectedMonth").value;
// 	let merchantLogo =
// 		"https://static.avantlink.com/merchant-logos/" + merchant.id;
// 	if (merchant.id != "23437") {
// 		merchantLogo += ".png"; // Append the file extension
// 	}
// 	document.getElementById("merchant_logo").src = merchantLogo;

// 	let selectedYear = document.getElementById("selectedYear").value;
// 	report.year = Number(selectedYear);
// 	if (document.getElementById("yoyDisplayCheck")) {
// 		report.hideYoY = true;
// 	}
// 	switch (report.month) {
// 		case "-01":
// 			data.month = "January";
// 			data.abMonth = "Jan";
// 			data.priorAbMonth = "Dec";
// 			data.thisMonthArray = [1, report.year];
// 			data.oneMonthAgoArray = [12, report.year - 1];
// 			data.twoMonthsAgoArray = [11, report.year - 1];
// 			data.previousMonth = "December";
// 			data.twoMonthsAgo = "November";
// 			break;
// 		case "-02":
// 			data.month = "February";
// 			data.abMonth = "Feb";
// 			data.priorAbMonth = "Jan";
// 			data.thisMonthArray = [2, report.year];
// 			data.oneMonthAgoArray = [1, report.year];
// 			data.twoMonthsAgoArray = [12, report.year - 1];
// 			data.previousMonth = "January";
// 			data.twoMonthsAgo = "December";

// 			break;
// 		case "-03":
// 			data.month = "March";
// 			data.abMonth = "Mar";
// 			data.priorAbMonth = "Feb";
// 			data.thisMonthArray = [3, report.year];
// 			data.oneMonthAgoArray = [2, report.year];
// 			data.twoMonthsAgoArray = [1, report.year];
// 			data.previousMonth = "February";
// 			data.twoMonthsAgo = "January";

// 			break;
// 		case "-04":
// 			data.month = "April";
// 			data.abMonth = "Apr";
// 			data.priorAbMonth = "Mar";
// 			data.thisMonthArray = [4, report.year];
// 			data.oneMonthAgoArray = [3, report.year];
// 			data.twoMonthsAgoArray = [2, report.year];
// 			data.previousMonth = "March";
// 			data.twoMonthsAgo = "February";

// 			break;
// 		case "-05":
// 			data.month = "May";
// 			data.abMonth = "May";
// 			data.priorAbMonth = "Apr";
// 			data.thisMonthArray = [5, report.year];
// 			data.oneMonthAgoArray = [4, report.year];
// 			data.twoMonthsAgoArray = [3, report.year];
// 			data.previousMonth = "April";
// 			data.twoMonthsAgo = "March";

// 			break;
// 		case "-06":
// 			data.month = "June";
// 			data.abMonth = "Jun";
// 			data.priorAbMonth = "May";
// 			data.thisMonthArray = [6, report.year];
// 			data.oneMonthAgoArray = [5, report.year];
// 			data.twoMonthsAgoArray = [4, report.year];
// 			data.previousMonth = "May";
// 			data.twoMonthsAgo = "April";

// 			break;
// 		case "-07":
// 			data.month = "July";
// 			data.abMonth = "Jul";
// 			data.priorAbMonth = "Jun";
// 			data.thisMonthArray = [7, report.year];
// 			data.oneMonthAgoArray = [6, report.year];
// 			data.twoMonthsAgoArray = [5, report.year];
// 			data.previousMonth = "June";
// 			data.twoMonthsAgo = "May";

// 			break;
// 		case "-08":
// 			data.month = "August";
// 			data.abMonth = "Aug";
// 			data.priorAbMonth = "Jul";
// 			data.thisMonthArray = [8, report.year];
// 			data.oneMonthAgoArray = [7, report.year];
// 			data.twoMonthsAgoArray = [6, report.year];
// 			data.previousMonth = "July";
// 			data.twoMonthsAgo = "June";

// 			break;
// 		case "-09":
// 			data.month = "September";
// 			data.abMonth = "Sep";
// 			data.priorAbMonth = "Aug";
// 			data.thisMonthArray = [9, report.year];
// 			data.oneMonthAgoArray = [8, report.year];
// 			data.twoMonthsAgoArray = [7, report.year];
// 			data.previousMonth = "August";
// 			data.twoMonthsAgo = "July";

// 			break;
// 		case "-10":
// 			data.month = "October";
// 			data.abMonth = "Oct";
// 			data.priorAbMonth = "Sep";
// 			data.thisMonthArray = [10, report.year];
// 			data.oneMonthAgoArray = [9, report.year];
// 			data.twoMonthsAgoArray = [8, report.year];
// 			data.previousMonth = "September";
// 			data.twoMonthsAgo = "August";

// 			break;
// 		case "-11":
// 			data.month = "November";
// 			data.abMonth = "Nov";
// 			data.priorAbMonth = "Oct";
// 			data.previousMonth = "October";
// 			data.thisMonthArray = [11, report.year];
// 			data.oneMonthAgoArray = [10, report.year];
// 			data.twoMonthsAgoArray = [9, report.year];
// 			data.twoMonthsAgo = "September";

// 			break;
// 		case "-12":
// 			data.month = "December";
// 			data.abMonth = "Dec";
// 			data.priorAbMonth = "Nov";
// 			data.previousMonth = "November";
// 			data.thisMonthArray = [12, report.year];
// 			data.oneMonthAgoArray = [11, report.year];
// 			data.twoMonthsAgoArray = [10, report.year];
// 			data.twoMonthsAgo = "October";

// 			break;
// 	}

// 	report.previousyear = report.year - 1;
// 	if (report.year > today.year || report.year < 2005) {
// 		acceptableData = false;
// 		alert("Incompatible year");
// 	}
// 	// report.previous_year = year - 1;
// 	console.log(merchant, report);
// 	if (report.month == "Select Month") {
// 		alert("No Month Selected \nPlease select a month");
// 		acceptableData = false;
// 	}
// 	if (merchant.id == "") {
// 		alert("No Merchant Data");
// 		acceptableData = false;
// 	}
// 	if (acceptableData === true) {
// 		let primaryDayCount = daysInMonth(
// 			report.month.replaceAll("-", ""),
// 			report.year
// 		);
// 		console.log(primaryDayCount);
// 		let priorYearDayCount = daysInMonth(
// 			report.month.replaceAll("-", ""),
// 			report.previousyear
// 		);

// 		primaryMonth.startDate = report.year + report.month + "-01";
// 		primaryMonth.endDate =
// 			report.year + report.month + "-" + primaryDayCount;
// 		priorMonth.startDate = report.previousyear + report.month + "-01";
// 		priorMonth.endDate =
// 			report.previousyear + report.month + "-" + priorYearDayCount;
// 		console.log(primaryMonth);
// 		console.log(priorMonth);
// 		// viewReportButton.hidden = false;
// 		document.getElementById("merchant_ID_input").disabled = true;
// 		document.getElementById("selectedMonth").disabled = true;
// 		document.getElementById("selectedYear").disabled = true;
// 		runAPI({
// 			report_id: 48,
// 			startDate: priorMonth.startDate,
// 			endDate: primaryMonth.endDate,
// 			month: "primary",
// 		});
// 	}
// }
//THESE  SCRIPTS REQUIRE NO EDITS:
// function affiliate_report() {
// 	document.getElementById("first_loading_bar").hidden = false;
// 	document.getElementById(
// 		"affiliate_report_button"
// 	).innerHTML = `<div class="spinner-border text-primary" role="status">
//   <span class="visually-hidden">Loading...</span>
// </div>`;
// 	runAPI({
// 		report_id: 15,
// 		startDate: primaryMonth.startDate,
// 		endDate: primaryMonth.endDate,
// 		month: "primary",
// 	});
// }
// function products_sold_report() {
// 	document.getElementById("first_loading_bar").hidden = false;
// 	runAPI({
// 		report_id: 18,
// 		startDate: primaryMonth.startDate,
// 		endDate: primaryMonth.endDate,
// 		month: "primary",
// 	});
// }
// function subAffiliate_report() {
// 	document.getElementById("subAffiliate_report_btn").disabled = true;
// 	document.getElementById("first_loading_bar").hidden = false;
// 	runAPI({
// 		report_id: 96,
// 		startDate: primaryMonth.startDate,
// 		endDate: primaryMonth.endDate,
// 		month: "primary",
// 	});
// }
// function runDailyChart() {
// 	runAPI({
// 		report_id: 12,
// 		startDate: primaryMonth.startDate,
// 		endDate: primaryMonth.endDate,
// 		month: "next",
// 	});
// }
// function handleFileSelect(event, id) {
// 	var files = event.target.files;
// 	var imageContainer = document.getElementById(id);
// 	imageContainer.innerHTML = ""; // Clear previous content

// 	for (var i = 0; i < files.length; i++) {
// 		var file = files[i];
// 		if (file.type.match("image/png")) {
// 			var reader = new FileReader();
// 			reader.onload = function (e) {
// 				var imageElement = document.createElement("img");
// 				imageElement.classList.add("image-preview");
// 				imageElement.src = e.target.result;

// 				var removeButton = document.createElement("button");
// 				removeButton.classList.add(
// 					"btn",
// 					"btn-danger",
// 					"btn-sm",
// 					"my-2",
// 					"close",
// 					"removeForPrint"
// 				);
// 				removeButton.textContent = "Remove";
// 				removeButton.addEventListener("click", function () {
// 					var imageContainerDiv = this.parentNode;
// 					imageContainerDiv.remove();
// 				});

// 				var imageContainerDiv = document.createElement("div");
// 				imageContainerDiv.classList.add(
// 					"noteBox",
// 					"col-12",
// 					"text-center"
// 				);
// 				imageContainerDiv.appendChild(imageElement);
// 				imageContainerDiv.appendChild(removeButton);

// 				imageContainer.appendChild(imageContainerDiv);
// 			};
// 			reader.readAsDataURL(file);
// 		}
// 	}
// }
