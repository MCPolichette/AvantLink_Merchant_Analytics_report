function generatePDF() {
	document.getElementById("title").hidden = true;
	document.getElementById("monthlyReport").hidden = true;
	document.getElementById("manual-report-data").hidden = true;
	document.getElementById("updateTopPerformers").hidden = true;

	var hiddenClasses = document.getElementsByClassName("removeForPrint");
	for (var i = 0; i < hiddenClasses.length; i++) {
		hiddenClasses[i].style.display = "none";
	}
}
