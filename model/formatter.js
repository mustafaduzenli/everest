sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
					return sStatus ?  resourceBundle.getText("quantityStatusLimited") : "-" ;
		},
		statusState: function (sStatus) {
					return sStatus ?  "Warning" : "None" ;
		}
	};
});