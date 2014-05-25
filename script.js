"use strict";

window.onload = init;

function init() {
	var qs = document.querySelector("#questions");
	qs.firstElementChild.className = "selected";
	var scores = [
		"Discordo totalmente",
		"Tendo a discordar",
		"Sem opinião",
		"Tendo a concordar",
		"Concordo totalmente"
	];
	for (var i = 1; i <= qs.childElementCount; i++) {
		var options = "";
		for (var sc in scores) {
			var id = "q" + i + "_" + scores[sc].match(/\b(\S)/g).join('').toLowerCase();
			options += "<input type='radio' name='q" + i + "' " +
				"id='" + id + "' value='" + (sc - 2) + "' onchange='next(this);'/>" +
				"<label for='" + id + "'>" + scores[sc] + "</label>\n";
		}
		qs.children[i - 1].innerHTML += options;
	}
}

function next(input) {
	var lis = document.querySelectorAll("li");
	for (var li in lis) { lis[li].className = ""; }
	var nextLi = input.parentElement.nextElementSibling;
	if (nextLi !== null) nextLi.className = "selected";
	else document.querySelector("button").style.outline = "5px solid red";
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
	};
	var qs = document.querySelector("#questions");
	
	// Scoring uses the formula 2(x*y) - 3|x-y|.
	// See the README file for a detailed explanation.
	// Note: the global score provides a single number that can be used in ranking the parties,
	// but it is not currently used in the interface.

	var results = {
		"maxAgreement": 0,
		"maxDisagreement": 0
	};
	for (var p in data) { results[p] = { agree : 0, disagree : 0, neutral: 0, total : 0}; }

	// loop over the parties's answers
	for (p in data) {
		// loop over the user's answers
		for (var i = 1; i <= qs.childElementCount; i++) {
			var choice = document.querySelector("input[name=q" + i + "]:checked");
			var myAnswer = choice !== null ? choice.value : 0;
			var theirAnswer = data[p][i - 1];
			var score = 2 * (theirAnswer * myAnswer) - 3 * Math.abs(theirAnswer - myAnswer);
			results[p].total += score;
			if (score > 0) {
				results[p].agree += score;
			} else {
				if (myAnswer === 0 || theirAnswer === 0) { results[p].neutral -= score; }
				else { results[p].disagree -= score; }
			}
			if (p == Object.keys(data)[0]) { // only do this once
				results.maxAgreement += Math.pow(Math.abs(myAnswer), 3); // 0 => 0; 1 => 1; 2 => 8
				results.maxDisagreement += 6 + 7 * Math.abs(myAnswer); // 0 => -6; 1 => -13; 2 => -20
			}
		}
		var agreeementPercentage = results[p].agree / (results.maxAgreement || 1) * 100;
		var disagreeementPercentage = results[p].disagree / results.maxDisagreement * 100;
		var globalPercentage = Math.round(agreeementPercentage - disagreeementPercentage);
		
		document.querySelector("#" + p + " > span.agree > span.bar").style.width = agreeementPercentage + "%";
		document.querySelector("#" + p + " > span.disagree > span.bar").style.width = disagreeementPercentage + "%";
		document.querySelector("#" + p + " > span.score").innerHTML = globalPercentage + "%";
	}
	document.querySelector("#results").style.display = "block";
}
