function runAPI(report) {
	startDate = report.startDate;
	endDate = report.endDate;
	report_id = report.report_id;
	month = report.month;
	var merchant_id = report.merchant_id;
	let network = "";
	switch (getSelectedValue()) {
		case "CA":
			console.log("CA");
			network = "&filter_network=CA";
			break;
		case "US":
			console.log("US");

			break;
		case "AU":
			console.log("AU");
			network = "&filter_network=AU";
			break;
		case "null":
			alert("no network selected");
	}
	console.log("API DETAILS", report);
	fetch(
		"https://classic.avantlink.com/api.php?module=AdminReport&auth_key=" +
			API_KEY +
			"&merchant_id=" +
			merchant_id +
			"&merchant_parent_id=0&affiliate_id=0&website_id=0&date_begin=" +
			startDate +
			"&date_end=" +
			endDate +
			"&affiliate_group_id=0&report_id=" +
			report_id +
			"&output=xml" +
			network
	)
		.then((response) => response.text())
		.then(
			(str) =>
				(xmlDoc = new window.DOMParser().parseFromString(
					str,
					"text/xml"
				))
		)
		.then((data) => {
			// Call reportStep2 function if there's no error
			reportStep2(data, report_id, month, merchant_id);
		})
		.catch((error) => {
			// Handle API error here
			api_error(error, merchant_id);
		});
}
function getSelectedValue() {
	var radios = document.getElementsByName("networkRadio");

	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			var selectedValue = radios[i].value;
			console.log("Selected Account Type:", selectedValue);
			return selectedValue;
		}
	}
	// Handle case when no radio button is selected
	console.log("No Account Type selected");
	return null;
}
function reportStep2(xml, report_id, month, merchant_id) {
	console.log(merchant_id, " API STEP 2:", report_id);
	switch (report_id) {
		case 48:
			var data = { monthlyPerformanceSummary: [] };
			console.log(xmlDoc);
			for (i = 0; i < 13; i++) {
				let m = {};
				m.Month =
					xmlDoc.getElementsByTagName("Month")[
						i
					].childNodes[0].nodeValue;
				m.Ad_Impressions = Number(
					xmlDoc
						.getElementsByTagName("Ad_Impressions")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Click_Throughs = Number(
					xmlDoc
						.getElementsByTagName("Click_Throughs")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Sales = Number(
					xmlDoc
						.getElementsByTagName("Sales")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Number_of_Sales = Number(
					xmlDoc
						.getElementsByTagName("Number_of_Sales")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Mobile_Sales = Number(
					xmlDoc
						.getElementsByTagName("Mobile_Sales")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Number_of_Mobile_Sales = Number(
					xmlDoc
						.getElementsByTagName("Number_of_Mobile_Sales")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Commissions = Number(
					xmlDoc
						.getElementsByTagName("Commissions")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Incentives = Number(
					xmlDoc
						.getElementsByTagName("Incentives")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Network_Commissions = Number(
					xmlDoc
						.getElementsByTagName("Network_Commissions")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Number_of_Adjustments = Number(
					xmlDoc
						.getElementsByTagName("Number_of_Adjustments")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Conversion_Rate = Number(
					xmlDoc
						.getElementsByTagName("Conversion_Rate")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("%", "")
				);
				m.New_Customers = Number(
					xmlDoc
						.getElementsByTagName("New_Customers")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.New_Customer_Sales = Number(
					xmlDoc
						.getElementsByTagName("New_Customer_Sales")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Average_Sale_Amount = Number(
					xmlDoc
						.getElementsByTagName("Average_Sale_Amount")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				m.Click_Through_Rate = Number(
					xmlDoc
						.getElementsByTagName("Click_Through_Rate")
						[i].childNodes[0].nodeValue.replaceAll(",", "")
						.replaceAll("$", "")
				);
				data.monthlyPerformanceSummary.push(m);
			}
			console.log(data);
			data.monthlyPerformanceSummary.reverse();
			insertListing(
				drawChart1(merchant_id, data.monthlyPerformanceSummary)
			);
			// drawSalesVConversionChart(
			// 	"Monthly Sales and Conversions",
			// 	"monthlyPerformanceGraph",
			// 	"test"
			// );

			break;
	}
}
