"use strict";

if (!window.kniffel) {
	var kniffel = {};
}

kniffel.getComment = function (pt) {
	var comments = kniffel.getComment.comments,
	cmt = "";
	
	if (pt < 5 || pt > 375) {
		cmt = comments[0][Math.floor(Math.random()*comments[0].length)];
	}
	else if (pt >= 5 && pt < 100) {
		cmt = comments[1][Math.floor(Math.random()*comments[1].length)];
	}
	else if (pt >= 100 && pt < 180) {
		cmt = comments[2][Math.floor(Math.random()*comments[2].length)];
	}
	else if (pt >= 180 && pt <260) {
		cmt = comments[3][Math.floor(Math.random()*comments[3].length)];
	}
	else if (pt >= 260 && pt < 300) {
		cmt = comments[4][Math.floor(Math.random()*comments[4].length)];
	}
	else if (pt >= 300 && pt < 320) {
		cmt = comments[5][Math.floor(Math.random()*comments[5].length)];
	}
	else if (pt >= 320 && pt < 375) {
		cmt = comments[6][Math.floor(Math.random()*comments[6].length)];
	}
	else if (pt == 375) {
		cmt = comments[7][Math.floor(Math.random()*comments[7].length)];
	}
	
	return cmt;
};

kniffel.getComment.comments = [
	["Oh du... Cheater!!!", "Ewige Verdamnis... Cheater!", "Erwischt... Cheater!",
	"Mach dich nicht unglücklich... Cheater", "Auf ewig klamme Socken... Cheater",
	"Du... du... du... Cheater!", "Not in my House... Cheater!", "Nooooooot... Cheater",
	"Geh weg... Cheater!", "Argh... Cheater!", "Hau ab... Cheater!"],
	["Nein nein nein...", "Das nenn ich nichtmal einen Versuch", "Naja, du kannst es wohl nicht besser",
	"Probier mal Mikado aus.", "Ohje... mehr sag ich nicht.", "Himmel hilf... mehr sag ich nicht.",
	"Aua... mehr sag ich nicht.", "Talk to the whitespace... you're not worth the comment.",
	"Du hast ganz toll geklickt.", "Ich notiere: nixwars!", "Ungenügend!"],
	["Man kann sagen: du hast es probiert", "Man kann sagen: du hast es wenigstens versucht.",
	"Da konnte man schon Ansätze sehen.", "Das war nicht total scheiße.", "Vielleicht beim nächsten mal.",
	"Das war keine totale Katastrophe.", "Das war gar nicht mal so scheiße", "Geh üben!", "Mangelhaft!"],
	["Triumph ist was anderes, aber immerhin.", "Macht sicher keine Geschichte, aber immerhin.", "Nur knapp Supraschlecht, aber immerhin.",
	"Nichts aufregendes, aber immerhin.", "Keine Begeisterung, aber immerhin.", "Subsuper, aber immerhin.", "Ausreichend!",
	"Klitzekleines Tennis, aber immerhin.", "Nur knapp über lächerlich, aber immerhin.", "Für einen Anfänger nicht schlecht"],
	["Wir kommen der Sache näher.", "Wir machen Fortschritte.", "Da waren Ansätze sichtbar.", "Expertenmeinung: passtscho!",
	"Expertenmeinung: gehtklar!", "Expertenmeinung: isokay!", "Expertenmeinung: jou!", "Ich hab schlechteres gesehen.",
	"Traumergebnis für kleine Geister!", "Traumergebnis für Kniffelzwerge!", "Expertenmeinung: joa!", "Befriedigend!"],
	["Wir sind fast da.", "Beinahe fantastisch", "Gut!", "Fast Begeisternd.", "Fast Extasemachend.", "Wow... nicht schlecht!",
	"Ziemlich stark!", "Ziemlich gut!", "Ziemlich Wow!", "Glattes Super!", "Glattes Stark!", "Glattes Yeah!", "Glattes Fett!",
	"Dieses Ergebnis ehrt dich in gewisser Weise."],
	["Geschichtemachend!", "Sehr gut!", "Phantastisch.", "Saustark!", "OHHH YEAH!!!", "SAUSTARK!!!", "Granate!!!", 
	"Hail dir KniffelimperatorIn!", "EinE GroßmeisterIn ist geboren!", "Sack zugemacht und fett abgeräumt!",
	"Sehr schönes Ding!!!", "Sauschönes Ding!!!", "Gerockt... einfach nur gerockt!!!"],
	["Kniet nieder denn siehe er/sie spielte das perfekte Spiel!!!", "Zu dieser Zeit ward ihnen einE Kniffelgott/Kniffelgöttin geboren!"]
];
