sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		genderFullform: function(sValue) {
			if (sValue === "M") {
				//	var messageText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("male");
			
				sValue="Male";		
			} else if (sValue === "F") {
				sValue = "Female";
			}
			return sValue;

		}

	};

});