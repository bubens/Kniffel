/* jshint strict:true */

util.time = (function () {
	"use strict";
	return {
		twitterfy : function (date) {
			var dif = ((new Date().getTime() - date) / 1000),
			days = Math.floor(dif / 86400),
			str = "";
			
			if (isNaN(days) || days < 0) {
				return null;
			}
			if (days > 31) {
				return util.time.beautify(date);
			}
			
			if (days === 0) {
				if (dif < 60) {
					return "gerade eben";
				}
				else if (dif < 120) {
					return "vor 1 Minute";
				}
				else if (dif < 3600) {
					return "vor "+(Math.floor(dif / 60))+" Minuten";
				}
				else if (dif < 7200) {
					return "vor 1 Stunde";
				}
				else if (dif < 86400) {
					return "vor "+(Math.floor(dif / 3600))+" Stunden";
				}
			}
			else if (days == 1) {
				return "Gestern";
			}
			else if (days < 7) {
				return "vor " + days + " Tagen";
			}
			else if (days <= 31) {
				return "vor " + Math.ceil(days/7) + " Wochen";
			}
		},
		
		beautify : function (d) {
			var date = new Date(d),
			str = "";
			str += util.leadZero(date.getDay()) + ".";
			str += util.leadZero((date.getMonth() + 1)) + ".";
			str += util.leadZero((date.getYear()%100)) + " (";
			str += util.leadZero((date.getHours())) + ":";
			str += util.leadZero((date.getMinutes()) + ")");
			return str;
		}
	};
		
}());

