google.charts.load("current", { packages: ["corechart"] });

function drawChart1(merchant_id, report) {
	let array = [["Month", "Sales"]];
	for (i = 0; i < report.length; i++) {
		array.push([report[i].Month, report[i].Sales]);
	}
	const data = google.visualization.arrayToDataTable(array);
	const options = {
		title: "Sales Performance By Month",
		width: 1100,
		height: 250,
		hAxis: { slantedText: true },
		vAxis: {
			format: "currency",
			gridlines: { color: "black", minSpacing: 20 },
		},
	};
	const chart = new google.visualization.ColumnChart(
		document.createElement("div")
	);
	chart.draw(data, options);

	// Create a new <div> element with the class "col-12"
	const colDiv = document.createElement("div");
	colDiv.classList.add("col-12");
	// Create and append the header element (<h5>) displaying the merchant_id
	const header = document.createElement("h5");
	header.textContent = "Merchant ID: " + merchant_id;
	colDiv.appendChild(header);

	// Append the chart's container div to the colDiv
	colDiv.appendChild(chart.getContainer());

	return colDiv;
}

function drawDailySalesVConversionChart(title, divId, hAxisTitle) {
	//build an array like the example below, ( Month, Sales $number, CR percentage.)
	var arr = data.dailyPerformance;
	var chartData = google.visualization.arrayToDataTable(arr);

	var options = {
		title: "Daily Sales and Conversion Rate",
		width: 1100,
		height: 250,
		hAxis: {
			textStyle: {
				fontSize: 10, // Adjust the font size as desired
				color: "#333", // Adjust the font color as desired
			},
			slantedText: true, // Enable slanted text for better readability
			slantedTextAngle: 19, // Adjust the rotation angle of the labels as desired
		},
		vAxes: {
			0: { title: "Sales", format: "$#,###" },
			1: { title: "Conversion Rate", format: "#%" },
		},
		series: {
			0: { type: "bars", targetAxisIndex: 0 },
			1: { type: "line", targetAxisIndex: 1 },
		},
	};

	var chart = new google.visualization.ComboChart(
		document.getElementById("dailyPerformanceGraph")
	);
	chart.draw(chartData, options);
	drawDailyNumberOfSalesVConversionChart(
		"secondChart",
		"numOfSalesChart",
		"Sales"
	);
}
