function buildRow(table, row, columns) {
	var row = table.insertRow(row);
	for (i = 0; i < columns.length; i++) {
		var cell = (row.insertCell(i).innerHTML = columns[i]);
	}
}
function updateTableCell(tableId, rowNum, colNum, newText) {
	console.log(tableId, rowNum, colNum, newText);
	// Get a reference to the table
	let table = document.querySelector(tableId);
	// Get a reference to the cell
	let row = table.row[rowNum];
	let cell = row.cell[colNum];
	// Update the innerHTML of the cell
	cell.innerHTML = newText;
}

function add_borders(table_id, column) {
	var table = document.getElementById(table_id);
	var totalRowCount = table.rows.length - 1;
	for (i = 0; i < totalRowCount + 1; i++) {
		table.rows[i].cells[column].style.cssText +=
			"border-left-width :2px;  border-style:solid; border-left-color: #000000";
	}
}
function hideColumn(tableId, columnIndex) {
	console.log("hiding Columns");
	let table = document.getElementById(tableId);
	let rows = table.rows;

	for (let i = 0; i < rows.length; i++) {
		let cells = rows[i].cells;
		if (cells.length > columnIndex) {
			cells[columnIndex].style.display = "none";
		}
	}
}
function tableHeaders(tableID, array) {
	let table = document.getElementById(tableID);
	let thead = document.createElement("thead");
	table.appendChild(thead);
	for (var i = 0; i < array.length; i++) {
		thead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(array[i]));
	}
}
function updateHeaders() {
	document.getElementById("merchantCard").innerHTML = merchant.name;
	document.getElementById("merchantCardId").innerHTML = "ID: " + merchant.id;
	document.getElementById("merchantCardMonth1").innerHTML =
		data.month + " " + report.year;

	document.getElementById("report_merchant_name").innerHTML =
		merchant.name +
		" - ID: " +
		merchant.id +
		" - Performance Report for " +
		data.month +
		" " +
		report.year;
}
function buildQuickStatsTable() {
	console.log("Quick-stats Table");
	let tablex = document.getElementById("quickStats");
	let thead = document.getElementById("qstatsHead");
	let summaryHeadersArray = [
		" ",
		data.monthlyPerformanceSummary[0].Month,
		"change YOY",
		"%change YOY",
		"",
	];
	for (var i = 0; i < summaryHeadersArray.length; i++) {
		thead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(summaryHeadersArray[i]));
	}
	function dollarRowValues(text, m1, m2, x) {
		let icon = icons.up;
		let posOrNeg = "+";
		let value = m1 - m2;
		let percent;
		if (value < 0) {
			icon = icons.down;
			posOrNeg = "";
			percent = "-" + (((m2 - m1) / m2) * 100).toFixed(2);
		} else {
			percent = (((m1 - m2) / m2) * 100).toFixed(2);
		}
		console.log(percent, value, icon);
		return [text, toUSD(m1), toUSD(value), posOrNeg + percent + "%", icon];
	}
	function otherRowValues(text, m1, m2, x) {
		let icon = icons.up;
		let posOrNeg = "+";
		let value = m1 - m2;
		let percent;
		if (value < 0) {
			icon = icons.down;
			posOrNeg = "";
			percent = "-" + (((m2 - m1) / m2) * 100).toFixed(2);
		} else {
			percent = (((m1 - m2) / m2) * 100).toFixed(2);
		}
		if (text === "Conversion Rate") {
			m1 = m1 + "%";
			value = value.toFixed(2) + "%";
		}
		return [text, m1, posOrNeg + value, posOrNeg + percent + "%", icon];
	}
	console.log(data.monthlyPerformanceSummary);
	let yoydifferences = {
		Sales: dollarRowValues(
			"Sales",
			data.monthlyPerformanceSummary[0].Sales,
			data.monthlyPerformanceSummary[12].Sales
		),

		Number_of_Sales: otherRowValues(
			"Number_of_Sales",
			data.monthlyPerformanceSummary[0].Number_of_Sales,
			data.monthlyPerformanceSummary[12].Number_of_Sales
		),
		Mobile_Sales: dollarRowValues(
			"Mobile Sales",
			data.monthlyPerformanceSummary[0].Mobile_Sales,
			data.monthlyPerformanceSummary[12].Mobile_Sales
		),
		Click_Throughs: otherRowValues(
			"Click Throughs",
			data.monthlyPerformanceSummary[0].Click_Throughs,
			data.monthlyPerformanceSummary[12].Click_Throughs
		),
		Average_Sale_Amount: dollarRowValues(
			"Avg Sale Amount",
			data.monthlyPerformanceSummary[0].Average_Sale_Amount,
			data.monthlyPerformanceSummary[12].Average_Sale_Amount
		),
		Conversion_Rate: otherRowValues(
			"Conversion Rate",
			data.monthlyPerformanceSummary[0].Conversion_Rate,
			data.monthlyPerformanceSummary[12].Conversion_Rate
		),
	};
	tablex.style.textAlign = "right";
	let quickstatArr = [
		yoydifferences.Sales,
		yoydifferences.Number_of_Sales,
		yoydifferences.Mobile_Sales,
		yoydifferences.Click_Throughs,
		yoydifferences.Average_Sale_Amount,
		yoydifferences.Conversion_Rate,
	];
	if (document.getElementById("mobileSalesCheck").checked === false) {
		quickstatArr.splice(2, 1);
	}
	for (let row = 0; row < quickstatArr.length; row++) {
		buildRow(tablex, row, quickstatArr[row]);
	}
	console.log("QUICKSTATS DONE");
}
function buildYoyTable() {
	let table = document.getElementById("yoySummaryReport");
	let thead = document.getElementById("yoySummaryTHead");
	let summaryHeadersArray = [
		" ",
		data.monthlyPerformanceSummary[0].Month,
		data.monthlyPerformanceSummary[12].Month,
		"% Change",
		"",
		"Nominal Change",
	];
	for (var i = 0; i < summaryHeadersArray.length; i++) {
		thead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(summaryHeadersArray[i]));
	}
	function dollarRowValues(text, m1, m2, x) {
		console.log("OTHER ROWS _ __ _ _ @@@@@@@@@@@@@@@@@");
		let dollarIcon = icons.up;
		let posOrNeg = "+";
		let value = m1 - m2;
		let percent;
		if (value < 0) {
			dollarIcon = icons.down;
			posOrNeg = "";
			percent = "-" + (((m2 - m1) / m2) * 100).toFixed(2);
		} else {
			percent = (((m1 - m2) / m2) * 100).toFixed(2);
		}
		return [
			text,
			toUSD(m1),
			toUSD(m2),
			percent + "%",
			dollarIcon,
			posOrNeg + toUSD(value),
		];
	}
	function otherRowValues(text, m1, m2, x) {
		let icon = icons.up;
		let posOrNeg = "+";
		let value = m1 - m2;
		let percent;
		if (value < 0) {
			icon = icons.down;
			posOrNeg = "";
			percent = "-" + (((m2 - m1) / m2) * 100).toFixed(2);
		} else {
			percent = (((m1 - m2) / m2) * 100).toFixed(2);
		}
		if (text === "Conversion Rate") {
			m1 = m1 + "%";
			m2 = m2 + "%";
			value = value.toFixed(2) + "%";
		}
		console.log(icon);
		return [text, m1, m2, percent + "%", icon, posOrNeg + value];
	}
	console.log(data.monthlyPerformanceSummary);
	let yoydifferences = {
		Sales: dollarRowValues(
			"Sales",
			data.monthlyPerformanceSummary[0].Sales,
			data.monthlyPerformanceSummary[12].Sales
		),
		Number_of_Sales: otherRowValues(
			"# of Sales",
			data.monthlyPerformanceSummary[0].Number_of_Sales,
			data.monthlyPerformanceSummary[12].Number_of_Sales
		),
		Mobile_Sales: dollarRowValues(
			"Mobile Sales",
			data.monthlyPerformanceSummary[0].Mobile_Sales,
			data.monthlyPerformanceSummary[12].Mobile_Sales
		),
		Click_Throughs: otherRowValues(
			"Click Throughs",
			data.monthlyPerformanceSummary[0].Click_Throughs,
			data.monthlyPerformanceSummary[12].Click_Throughs
		),
		Average_Sale_Amount: dollarRowValues(
			"Avg Sale Amount",
			data.monthlyPerformanceSummary[0].Average_Sale_Amount,
			data.monthlyPerformanceSummary[12].Average_Sale_Amount
		),
		Conversion_Rate: otherRowValues(
			"Conversion Rate",
			data.monthlyPerformanceSummary[0].Conversion_Rate,
			data.monthlyPerformanceSummary[12].Conversion_Rate
		),
		Ad_Impressions: otherRowValues(
			"Ad Impressions",
			data.monthlyPerformanceSummary[0].Ad_Impressions,
			data.monthlyPerformanceSummary[12].Ad_Impressions
		),
		Number_of_Mobile_Sales: otherRowValues(
			"# of Mobile Sales",
			data.monthlyPerformanceSummary[0].Number_of_Mobile_Sales,
			data.monthlyPerformanceSummary[12].Number_of_Mobile_Sales
		),
	};
	table.style.textAlign = "right";
	buildRow(table, 0, yoydifferences.Ad_Impressions);
	buildRow(table, 1, yoydifferences.Click_Throughs);
	buildRow(table, 2, yoydifferences.Sales);
	buildRow(table, 3, yoydifferences.Number_of_Sales);
	buildRow(table, 4, yoydifferences.Mobile_Sales);
	buildRow(table, 5, yoydifferences.Number_of_Mobile_Sales);
	buildRow(table, 6, yoydifferences.Average_Sale_Amount);
	buildRow(table, 7, yoydifferences.Conversion_Rate);
}
function buildMomTable() {
	let table = document.getElementById("momSummaryReport");
	let thead = document.getElementById("momSummaryTHead");
	let summaryHeadersArray = [
		" ",
		data.monthlyPerformanceSummary[0].Month,
		data.monthlyPerformanceSummary[1].Month,
		"% Change",
		"",
		"Nominal Change",
	];
	for (var i = 0; i < summaryHeadersArray.length; i++) {
		thead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(summaryHeadersArray[i]));
	}
	function dollarRowValues(text, m1, m2, x) {
		let icon = icons.up;
		let posOrNeg = "+";
		let value = m1 - m2;
		let percent = (((m1 - m2) / m2) * 100).toFixed(2);
		if (value < 0) {
			posOrNeg = icons.down;
			icon = icons.down;
			posOrNeg = "";
		}
		return [
			text,
			toUSD(m1),
			toUSD(m2),
			percent + "%",
			icon,
			posOrNeg + toUSD(value),
		];
	}
	function otherRowValues(text, m1, m2, x) {
		let icon = icons.up;
		let posOrNeg = "+";
		let value = m1 - m2;
		let percent = (((m1 - m2) / m2) * 100).toFixed(2);
		if (value < 0) {
			icon = icons.down;
			posOrNeg = "";
		}
		if (text === "Conversion Rate") {
			m1 = m1 + "%";
			m2 = m2 + "%";
			value = value.toFixed(2) + "%";
		}
		return [text, m1, m2, percent + "%", icon, posOrNeg + value];
	}
	console.log(data.monthlyPerformanceSummary);
	let momdifferences = {
		Sales: dollarRowValues(
			"Sales",
			data.monthlyPerformanceSummary[0].Sales,
			data.monthlyPerformanceSummary[1].Sales
		),
		Number_of_Sales: otherRowValues(
			"# of Sales",
			data.monthlyPerformanceSummary[0].Number_of_Sales,
			data.monthlyPerformanceSummary[1].Number_of_Sales
		),
		Mobile_Sales: dollarRowValues(
			"Mobile Sales",
			data.monthlyPerformanceSummary[0].Mobile_Sales,
			data.monthlyPerformanceSummary[1].Mobile_Sales
		),
		Click_Throughs: otherRowValues(
			"Click Throughs",
			data.monthlyPerformanceSummary[0].Click_Throughs,
			data.monthlyPerformanceSummary[1].Click_Throughs
		),
		Average_Sale_Amount: dollarRowValues(
			"Avg Sale Amount",
			data.monthlyPerformanceSummary[0].Average_Sale_Amount,
			data.monthlyPerformanceSummary[1].Average_Sale_Amount
		),
		Conversion_Rate: otherRowValues(
			"Conversion Rate",
			data.monthlyPerformanceSummary[0].Conversion_Rate,
			data.monthlyPerformanceSummary[1].Conversion_Rate
		),
		Ad_Impressions: otherRowValues(
			"Ad Impressions",
			data.monthlyPerformanceSummary[0].Ad_Impressions,
			data.monthlyPerformanceSummary[1].Ad_Impressions
		),
		Number_of_Mobile_Sales: otherRowValues(
			"# of Mobile Sales",
			data.monthlyPerformanceSummary[0].Number_of_Mobile_Sales,
			data.monthlyPerformanceSummary[1].Number_of_Mobile_Sales
		),
	};

	table.style.textAlign = "right";
	buildRow(table, 0, momdifferences.Ad_Impressions);
	buildRow(table, 1, momdifferences.Click_Throughs);
	buildRow(table, 2, momdifferences.Sales);
	buildRow(table, 3, momdifferences.Number_of_Sales);
	buildRow(table, 4, momdifferences.Mobile_Sales);
	buildRow(table, 5, momdifferences.Number_of_Mobile_Sales);
	buildRow(table, 6, momdifferences.Average_Sale_Amount);
	buildRow(table, 7, momdifferences.Conversion_Rate);
}
function buildAffiliateTable(array) {
	let table = document.getElementById("affiliateSummaryReport");
	table.innerHTML = `<thead id="affTableTHead"></thead>`;
	let thead = document.getElementById("affTableTHead");
	let headArray = [
		"Affiliate",
		data.abMonth + " " + report.year + " Sales",
		"YoY %",
		data.abMonth + " " + report.year + " Clicks",
		"YoY %",
		data.abMonth + " " + report.year + " TotalSpend",
		"YoY %",
		data.abMonth + " " + report.year + " ROAS",
		"YoY %",
	];
	for (var z = 0; z < headArray.length; z++) {
		thead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(headArray[z]));
	}
	function percentNaNCheck(value) {
		if (isNaN(value)) {
			return "N/A";
		} else {
			return (value * 100).toFixed(2) + "%";
		}
	}
	table.style.textAlign = "right";

	if (array.length < report.topAffiliateCount) {
		report.topAffiliateCount = array.length;
	}
	console.log("ALERT", report.topAffiliateCount);
	if (report.topAffiliateCount) {
		for (let i = 0; i < report.topAffiliateCount; i++) {
			console.log(array[i]);
			if (isNaN(array[i].Sales)) {
				return 0;
			}
			if (array[i].Sales > 0) {
				buildRow(table, i, [
					array[i].Affiliate,
					toUSD(array[i].Sales),
					percentNaNCheck(array[i].salesYOYpercent),
					array[i].Click_Throughs,
					percentNaNCheck(array[i].Click_ThroughsYOYpercent),
					toUSD(array[i].Total_Commission.toFixed(2)),
					percentNaNCheck(array[i].totalCommissionYOYPercent),
					toUSD(array[i].roa.toFixed(2)),
					percentNaNCheck(array[i].roaYOYPercent),
				]);
				console.log(i);
			}
		}
	}
	add_borders("affiliateSummaryReport", 3);
	add_borders("affiliateSummaryReport", 5);
	add_borders("affiliateSummaryReport", 7);
	affiliateReportButton.disabled = true;
}

function buildGrowthAndDeclineTables(declineArr, growthArr) {
	let numberOfAffiliates = 5;
	if (declineArr.length < numberOfAffiliates) {
		numberOfAffiliates = declineArr.length;
	}
	console.log(declineArr);
	console.log(growthArr);
	let gTable = document.getElementById("growing_report");
	let gThead = document.getElementById("gTableTHead");
	let gheadArray = [
		"Affiliate",
		data.monthlyPerformanceSummary[0].Month,
		data.monthlyPerformanceSummary[12].Month,
		"% Growth",
	];
	for (var i = 0; i < gheadArray.length; i++) {
		gThead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(gheadArray[i]));
	}
	for (var j = 0; j < numberOfAffiliates; j++) {
		buildRow(gTable, j, [
			growthArr[j].Affiliate,
			toUSD(growthArr[j].Sales_Current),
			toUSD(growthArr[j].Sales_Previous),
			growthArr[j].Percent_Change_in_Sales + "%",
		]);
	}
	let dTable = document.getElementById("declining_report");
	let dThead = document.getElementById("dTableTHead");
	let dheadArray = [
		"Affiliate",
		data.monthlyPerformanceSummary[0].Month,
		data.monthlyPerformanceSummary[12].Month,
		"% Decline",
	];
	for (var k = 0; k < dheadArray.length; k++) {
		dThead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(dheadArray[k]));
	}

	for (var l = 0; l < numberOfAffiliates; l++) {
		buildRow(dTable, l, [
			declineArr[l].Affiliate,
			toUSD(declineArr[l].Sales_Current),
			toUSD(declineArr[l].Sales_Previous),
			declineArr[l].Percent_Change_in_Sales + "%",
		]);
	}
	removeDisabledButton("product_report_btn");

	completeButton(
		"affiliate_report_button",
		"COMPLETED - Affiliate Performance API"
	);
	removeDisabledButton("subAffiliate_report_btn");
}
function buildSubAffTable(array) {
	let table = document.getElementById("subAffiliateSummaryReport");
	let thead = document.getElementById("subAffTableTHead");
	let headArray = [
		"Sub Affiliate",
		data.abMonth + " " + report.year + " Sales",
		data.abMonth + " " + report.year + " Clicks",
		data.abMonth + " " + report.year + " TotalSpend",
		data.abMonth + " " + report.year + " ROAS",
	];
	for (var i = 0; i < headArray.length; i++) {
		thead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(headArray[i]));
	}
	table.style.textAlign = "right";

	for (let i = 0; i < report.topAffiliateCount; i++) {
		if (array[i].Sales > 0) {
			buildRow(table, i, [
				array[i].Affiliate + " - " + array[i].Sub_Affiliate_Domain,
				toUSD(array[i].Sales),
				array[i].Click_Throughs,
				toUSD(array[i].Total_Commission.toFixed(2)),
				toUSD(array[i].roa.toFixed(2)),
			]);
		}
	}
	affiliateReportButton.disabled = true;
	completeButton(
		"subAffiliate_report_btn",
		"COMPLETED - SubAFfiliate Performance API"
	);
}
function buildybuildye(array) {}
