"use strict";

window.onload = init;

function init() {
	var qs = document.querySelector("#questions");
	qs.firstElementChild.className = "selected";
	var labels = ["Discordo totalmente", "Discordo", "Sem opinião", "Concordo", "Concordo totalmente"];
	for (var i = 1; i <= qs.childElementCount; i++) {
		var options = ""
		for (var l in labels) {
			var id = "q" + i + "_" + labels[l].match(/\b(\S)/g).join('').toLowerCase()
			options += "<input type='radio' name='q" + i + "' " +
				"id='" + id + "' value='" + (l - 2) + "' onchange='next(this);'/>" +
				"<label for='" + id + "'>" + labels[l] + "</label>\n"
		}
		qs.children[i - 1].innerHTML += options;
	}
}

function next(input) {
	var lis = document.querySelectorAll("li");
	for (var li in lis) { lis[li].className = ""; }
	var nextLi = input.parentElement.nextElementSibling;
	if (nextLi != null) nextLi.className = "selected";
	else document.querySelector("button").style.outline = "5px solid red"
}

function calculate() {
	var data = {
		"livre"     : [-2,-1,-2, 0, 2, 1,-2,-1,-2, 0,-1, 2,-2,-2,-1, 1,-2, 2,-2, 1, 2,-1,-1,-2, 0, 2, 2, 0,-1, 2],
		"ps"        : [-2,-1,-2, 1, 1,-2, 0,-2,-1, 1,-1, 1, 1,-1, 1, 0,-1, 1,-1, 1, 2,-1, 1,-1, 0, 2, 2, 0,-2, 2],
		"pan"       : [-1, 0,-1,-1, 1, 1, 0,-1,-1,-2,-1, 1,-1,-1, 1, 0,-1,-1,-2, 2, 2,-1, 0,-2, 0, 2, 0, 0, 0, 2],
		"be"        : [-1, 1,-2,-1, 2, 2,-2, 1,-2,-1,-2, 2,-2,-2,-2, 2,-2, 2,-2, 2, 2,-1, 1,-2, 1, 2, 2, 2,-1, 1],
		"mpt"       : [-1, 0,-1,-2, 1, 1,-1,-2,-2, 0,-2, 1,-1, 0,-2, 0,-1, 1, 0, 0, 2, 1,-1,-1, 2, 0,-2,-2, 0, 2],
		"pctp-mrpp" : [ 2, 1,-2,-2, 2, 2,-2, 2,-2,-2,-2, 2,-2,-2,-2, 2,-2, 2,-1, 2, 2, 0, 1,-2, 0, 1, 2, 2, 0, 2],
		"cdu"       : [ 1, 1,-2,-2, 2, 2,-1, 2,-2,-2,-2, 2,-2,-2,-2, 1,-2, 2,-1, 2, 2,-2, 1,-2, 0, 1, 2,-2, 1, 2],
		"psd-cds-pp": [-2,-1,-2, 1, 1,-2, 1,-2, 1, 2, 1, 1, 2, 1, 1,-2, 1,-1, 1,-1,-1, 1, 0,-1, 0,-1,-1,-1,-2,-1]
	}
	var qs = document.querySelector("#questions");

	var results = {}
	var maxDisagreement = 4 * qs.childElementCount; // max difference is +2 to -2, and there are 30 questions
	for (var p in data) { results[p] = [0, maxDisagreement]; } //initialize

	// loop over the parties
	for (var p in data) {
		// loop over the answers
		for (var i = 1; i <= qs.childElementCount; i++) {
			var choice = document.querySelector("input[name=q" + i + "]:checked");
			var myAnswer = choice != null ? choice.value : 0;
			var theirAnswer = data[p][i - 1];

			if (myAnswer != 0 && theirAnswer != 0) {
				results[p][0] += Math.abs(theirAnswer - myAnswer);
			} else {
				// if either of us doesn't care, don't count as agreement
				results[p][1] -= 4;
			}
		}
		var percentage = "desconhecido";
		if (results[p][1] > 0) { // avoid division by zero
			percentage = Math.round((results[p][1] - results[p][0]) / results[p][1] * 100) + "%";
		}
		var pctDisplay = document.querySelector("#" + p + ">span.pct");
		pctDisplay.innerHTML = percentage;
	}
	document.querySelector("#results").style.display = "block";
}
