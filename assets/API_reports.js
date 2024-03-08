function runAPI(report) {
	startDate = report.startDate;
	endDate = report.endDate;
	report_id = report.report_id;
	month = report.month;
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
			merchant.id +
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
		.then((data) =>
			// console.log(data)
			reportStep2(data, report_id, month)
		);
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
function reportStep2(xml, report_id, month) {
	console.log("API STEP 2:", report_id);
	switch (report_id) {
		case 96:
			console.log(xml);
			let subAffiliates = [];
			xmlDoc = xml.getElementsByTagName("Table1");
			console.log(xmlDoc.length);
			console.log(
				xmlDoc[0].getElementsByTagName("Sub_Affiliate_Domain")[0]
			);
			for (let i = 0; i < xmlDoc.length; i++) {
				let isSub = "";
				if (
					xmlDoc[i].getElementsByTagName("Sub_Affiliate_Domain")[0]
						.childNodes[0] &&
					xmlDoc[i].getElementsByTagName("Sub_Affiliate_Domain")[0]
						.childNodes[0].nodeValue
				) {
					isSub = xmlDoc[i].getElementsByTagName(
						"Sub_Affiliate_Domain"
					)[0].childNodes[0].nodeValue;
				}
				subAffiliates.push({
					Affiliate:
						xmlDoc[i].getElementsByTagName("Affiliate_Name")[0]
							.childNodes[0].nodeValue,
					Click_Throughs: Number(
						xmlDoc[i]
							.getElementsByTagName("Click_Throughs")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Affiliate_Id:
						xmlDoc[i].getElementsByTagName("Affiliate_Id")[0]
							.childNodes[0].nodeValue,
					Number_of_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Number_of_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Commissions: Number(
						xmlDoc[i]
							.getElementsByTagName("Commissions")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Network_Commissions: Number(
						xmlDoc[i]
							.getElementsByTagName("Network_Commissions")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Sub_Affiliate_Domain: isSub,
					Incentives: Number(
						xmlDoc[i]
							.getElementsByTagName("Incentives")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Conversion_Rate: Number(
						xmlDoc[i]
							.getElementsByTagName("Conversion_Rate")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("%", "")
					),
					New_Customers: Number(
						xmlDoc[i]
							.getElementsByTagName("New_Customers")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					New_Customer_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("New_Customer_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Mobile_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Mobile_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Number_of_Mobile_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Number_of_Mobile_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
				});
				subAffiliates[i].Total_Commission =
					subAffiliates[i].Commissions +
					subAffiliates[i].Network_Commissions +
					subAffiliates[i].Incentives;
				subAffiliates[i].roa =
					subAffiliates[i].Sales / subAffiliates[i].Total_Commission;
			}
			subAffiliates.sort(function (a, b) {
				return b.Sales - a.Sales;
			});
			console.log(subAffiliates);
			report.subAffiliates = subAffiliates;
			buildSubAffTable(report.subAffiliates);
			break;
		case 65:
			let affArray = [];
			let growthArr = [];
			let declineArr = [];
			xmlDoc = xml.getElementsByTagName("Table1");
			console.log(xmlDoc);
			console.log;
			for (let i = 0; i < xmlDoc.length; i++) {
				affArray.push({
					Affiliate:
						xmlDoc[i].getElementsByTagName("Affiliate_Name")[0]
							.childNodes[0].nodeValue,
					Sales_Current: Number(
						xmlDoc[i]
							.getElementsByTagName("Sales_Current")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Sales_Previous: Number(
						xmlDoc[i]
							.getElementsByTagName("Sales_Previous")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Percent_Change_in_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Percent_Change_in_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("%", "")
					),
				});
			}
			for (j = 0; j < affArray.length; j++) {
				if (
					affArray[j].Sales_Previous > 0 &&
					affArray[j].Sales_Current > 0
				) {
					growthArr.push(affArray[j]);
					declineArr.push(affArray[j]);
				}
			}
			console.log(affArray);
			growthArr.sort(
				(a, b) =>
					parseFloat(b.Percent_Change_in_Sales) -
					parseFloat(a.Percent_Change_in_Sales)
			);
			declineArr.sort(
				(a, b) =>
					parseFloat(a.Percent_Change_in_Sales) -
					parseFloat(b.Percent_Change_in_Sales)
			);
			buildGrowthAndDeclineTables(declineArr, growthArr);

			break;
		case 48:
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
			runAPI({
				report_id: 1,
				startDate: primaryMonth.startDate,
				endDate: primaryMonth.endDate,
				month: "primary",
			});

			buildYoyTable();
			buildMomTable();
			report.monthArray = data.monthlyPerformanceSummary;
			// drawChart1();
			drawSalesVConversionChart(
				"Monthly Sales and Conversions",
				"monthlyPerformanceGraph",
				"test"
			);

			break;
		case 18:
			console.log(xmlDoc.getElementsByTagName("Product_SKU").length);
			if (
				xmlDoc.getElementsByTagName("Product_SKU").length <
				report.itemCount
			) {
				report.itemCount =
					xmlDoc.getElementsByTagName("Product_SKU").length;
			}
			for (let i = 0; i < report.itemCount; i++) {
				let x = {};
				x.Product_SKU =
					xmlDoc.getElementsByTagName("Product_SKU")[i].textContent;
				x.Product_Name =
					xmlDoc.getElementsByTagName("Product_Name")[i].textContent;
				x.Sale_Count =
					xmlDoc.getElementsByTagName("Sale_Count")[i].textContent;
				x.Mobile_Sale_Count =
					xmlDoc.getElementsByTagName("Mobile_Sale_Count")[
						i
					].textContent;
				x.Total_Product_Sale_Amount = xmlDoc.getElementsByTagName(
					"Total_Product_Sale_Amount"
				)[i].textContent;
				if (x.Product_Name === "") {
					x.Product_Name = "Product name not specified";
				}
				report.productList[i] = x;
			}
			removeDisabledButton("select_affiliates_btn");
			completeButton(
				"product_report_btn",
				"COMPLETED - Products Sold API"
			);
			build_products_sold_table();
			break;
		case 12:
			let days = xmlDoc.getElementsByTagName("Sales").length;
			console.log(days);
			let dailyArr = [["Day", "Sales", "Conversion Rate"]];
			let secondArr = [["Day", "Number of Sales", "Conversion Rate"]];
			for (let i = 0; i < days; i++) {
				dailyArr.push([
					removeYearFromDate(
						xmlDoc.getElementsByTagName("Date")[i].textContent
					),
					Number(
						xmlDoc
							.getElementsByTagName("Sales")
							[i].innerHTML.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Number(
						xmlDoc
							.getElementsByTagName("Conversion_Rate")
							[i].innerHTML.replaceAll("%", "")
					) / 100,
				]);
				secondArr.push([
					removeYearFromDate(
						xmlDoc.getElementsByTagName("Date")[i].textContent
					),
					Number(
						xmlDoc
							.getElementsByTagName("Number_of_Sales")
							[i].innerHTML.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Number(
						xmlDoc
							.getElementsByTagName("Conversion_Rate")
							[i].innerHTML.replaceAll("%", "")
					) / 100,
				]);
			}
			console.log(dailyArr);
			data.SaleNumPerformance = secondArr;
			data.dailyPerformance = dailyArr;
			drawDailySalesVConversionChart(
				"Daily Sales and Conversions",
				"dailyPerformanceGraph",
				"sales"
			);
			break;
		case 1: //Performance Summary
			console.log(xml);
			merchant.name =
				xmlDoc.getElementsByTagName(
					"Merchant"
				)[0].childNodes[0].nodeValue;
			updateHeaders();
			completeButton("submitBtn", "Merchant & Date Selected");
			removeDisabledButton("affiliate_report_button");
			removeDisabledButton("dailyReportButton");
			// removeDisabledButton("viewReport");
			break;
		case 15: //Performance Summary by Affiliate for selected dates
			let affiliates = [];
			xmlDoc = xml.getElementsByTagName("Table1");
			console.log(xmlDoc.length);
			console.log;
			for (let i = 0; i < xmlDoc.length; i++) {
				affiliates.push({
					Affiliate:
						xmlDoc[i].getElementsByTagName("Affiliate")[0]
							.childNodes[0].nodeValue,
					Click_Throughs: Number(
						xmlDoc[i]
							.getElementsByTagName("Click_Throughs")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Affiliate_Id:
						xmlDoc[i].getElementsByTagName("Affiliate_Id")[0]
							.childNodes[0].nodeValue,
					Number_of_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Number_of_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Commissions: Number(
						xmlDoc[i]
							.getElementsByTagName("Commissions")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Network_Commissions: Number(
						xmlDoc[i]
							.getElementsByTagName("Network_Commissions")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Ad_Impressions: Number(
						xmlDoc[i]
							.getElementsByTagName("Ad_Impressions")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Incentives: Number(
						xmlDoc[i]
							.getElementsByTagName("Incentives")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Conversion_Rate: Number(
						xmlDoc[i]
							.getElementsByTagName("Conversion_Rate")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("%", "")
					),
					New_Customers: Number(
						xmlDoc[i]
							.getElementsByTagName("New_Customers")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					New_Customer_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("New_Customer_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Mobile_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Mobile_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
					Number_of_Mobile_Sales: Number(
						xmlDoc[i]
							.getElementsByTagName("Number_of_Mobile_Sales")[0]
							.childNodes[0].nodeValue.replaceAll(",", "")
							.replaceAll("$", "")
					),
				});
				affiliates[i].Total_Commission =
					affiliates[i].Commissions +
					affiliates[i].Network_Commissions +
					affiliates[i].Incentives;
				affiliates[i].roa = Number(
					affiliates[i].Sales /
						affiliates[i].Total_Commission.toFixed(2)
				);
			}
			if (month === "primary") {
				primaryMonth.affiliateReport = affiliates;
				runAPI({
					report_id: 15,
					startDate: priorMonth.startDate,
					endDate: priorMonth.endDate,
					month: "prior",
				});
			} else {
				priorMonth.affiliateReport = affiliates;
				for (let i = 0; i < primaryMonth.affiliateReport.length; i++) {
					for (
						let j = 0;
						j < priorMonth.affiliateReport.length;
						j++
					) {
						if (
							primaryMonth.affiliateReport[i].Affiliate_Id ===
							priorMonth.affiliateReport[j].Affiliate_Id
						) {
							primaryMonth.affiliateReport[i].lySales =
								priorMonth.affiliateReport[j].Sales;
							let x;
							if (
								primaryMonth.affiliateReport[i].Sales >
								priorMonth.affiliateReport[j].Sales
							) {
								x = (
									(primaryMonth.affiliateReport[i].Sales -
										priorMonth.affiliateReport[j].Sales) /
									primaryMonth.affiliateReport[i].Sales
								).toFixed(2);
							} else {
								x = (
									(primaryMonth.affiliateReport[i].Sales -
										priorMonth.affiliateReport[j].Sales) /
									priorMonth.affiliateReport[j].Sales
								).toFixed(2);
							}

							primaryMonth.affiliateReport[i].salesYOYpercent =
								Number(x);
							primaryMonth.affiliateReport[i].lyClick_Throughs =
								priorMonth.affiliateReport[j].Click_Throughs;

							let y;
							if (
								primaryMonth.affiliateReport[i].Click_Throughs >
								priorMonth.affiliateReport[j].Click_Throughs
							) {
								y = (
									(primaryMonth.affiliateReport[i]
										.Click_Throughs -
										priorMonth.affiliateReport[j]
											.Click_Throughs) /
									primaryMonth.affiliateReport[i]
										.Click_Throughs
								).toFixed(2);
							} else {
								y = (
									(primaryMonth.affiliateReport[i]
										.Click_Throughs -
										priorMonth.affiliateReport[j]
											.Click_Throughs) /
									priorMonth.affiliateReport[j].Click_Throughs
								).toFixed(2);
							}
							// console.log(y);

							primaryMonth.affiliateReport[
								i
							].Click_ThroughsYOYpercent = y;
							let lyROA;
							if (isNaN(priorMonth.affiliateReport[j].roa)) {
								lyROA = 0;
							} else {
								lyROA = Number(
									priorMonth.affiliateReport[j].roa.toFixed(2)
								);
							}

							let tyROA = Number(
								primaryMonth.affiliateReport[i].roa.toFixed(2)
							);
							let roayoy = (tyROA - lyROA) / tyROA;
							primaryMonth.affiliateReport[i].roaYOYPercent =
								roayoy.toFixed(3);
							//
							let totalCommissionYoy;
							if (
								primaryMonth.affiliateReport[i]
									.Total_Commission >
								priorMonth.affiliateReport[j].Total_Commission
							) {
								totalCommissionYoy = (
									(primaryMonth.affiliateReport[i]
										.Total_Commission -
										priorMonth.affiliateReport[j]
											.Total_Commission) /
									primaryMonth.affiliateReport[i]
										.Total_Commission
								).toFixed(2);
							} else {
								totalCommissionYoy = (
									(primaryMonth.affiliateReport[i]
										.Total_Commission -
										priorMonth.affiliateReport[j]
											.Total_Commission) /
									priorMonth.affiliateReport[j]
										.Total_Commission
								).toFixed(2);
							}

							//

							// let totalCommissionYoy = (
							// 	(primaryMonth.affiliateReport[i]
							// 		.Total_Commission -
							// 		priorMonth.affiliateReport[j]
							// 			.Total_Commission) /
							// 	primaryMonth.affiliateReport[i].Total_Commission
							// ).toFixed(2);

							primaryMonth.affiliateReport[
								i
							].totalCommissionYOYPercent = totalCommissionYoy;
							// if (primaryMonth.affiliateReport[i].lySales > 0) {
							report.yoyPerformance.push(
								primaryMonth.affiliateReport[i]
							);

							// }
						}
					}
				}
				console.log(
					"##################################################################"
				);
				console.log(primaryMonth.affiliateReport[70]);
				console.log(primaryMonth.affiliateReport.length);
				primaryMonth.affiliateReport.sort(
					(a, b) => b.Click_Throughs - a.Click_Throughs
				);
				report.yoyPerformance.sort(function (a, b) {
					return b.Click_Throughs - a.Click_Throughs;
				});
				primaryMonth.affiliateReport.sort((a, b) => b.Sales - a.Sales);
				report.yoyPerformance.sort(function (a, b) {
					return b.Sales - a.Sales;
				});
				for (xy = 0; xy < primaryMonth.affiliateReport.length; xy++) {
					// console.log(primaryMonth.affiliateReport[xy].Sales);
					if (
						primaryMonth.affiliateReport[xy].Affiliate_Id ===
						"142482"
					) {
						console.log("HERE");
					}
				}
				console.log(primaryMonth);
				let topTen = [];
				let lessThanTen = 10;
				console.log(primaryMonth.affiliateReport.length);
				if (primaryMonth.affiliateReport.length < 10) {
					lessThanTen === primaryMonth.affiliateReport.length;
				}
				if (lessThanTen) {
					for (let k = 0; k < lessThanTen; k++) {
						topTen.push(report.yoyPerformance[k]);
					}
				}
				console.log("building tables");
				buildAffiliateTable(primaryMonth.affiliateReport);
				console.log("table built");
				buildQuickStatsTable();
				runAPI({
					report_id: 65,
					startDate: primaryMonth.startDate,
					endDate: primaryMonth.endDate,
					month: "primary",
				});
			}
			break;
	}
}
