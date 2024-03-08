function build_products_sold_table() {
	let table = document.getElementById("productsSoldReport");
	let thead = document.getElementById("productTHead");
	let headArray = [
		"Products SKU",
		"Product Name",
		"Total Sales count ",
		"Mobile Sales Count",
		"Total Sales Amount",
	];
	for (var i = 0; i < headArray.length; i++) {
		thead
			.appendChild(document.createElement("th"))
			.appendChild(document.createTextNode(headArray[i]));
	}
	// table.style.textAlign = "right";
	for (let i = 0; i < report.productList.length; i++) {
		buildRow(
			table,
			[i],
			[
				report.productList[i].Product_SKU,
				report.productList[i].Product_Name,
				report.productList[i].Sale_Count,
				report.productList[i].Mobile_Sale_Count,
				report.productList[i].Total_Product_Sale_Amount,
			]
		);
	}
}
