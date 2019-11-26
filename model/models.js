sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device, shell) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createUserModel: function () {
			var user = sap.ushell.Container.getService("UserInfo").getUser();
			var userData = {};
			if (user) {
				userData = {
					// "DateFormat": user.getDateFormat(),
					// "DefaultErrorHandler": user.getDefaultErrorHandler(),
					"Email": user.getEmail(),
					"FirstName": user.getFirstName(),
					"FullName": user.getFullName(),
					"Id": user.getId(),
					"Language": user.getLanguage(),
					"LastName": user.getLastName()
					// "Menu": user.getMenu(),
					// "NumberFormat": user.getNumberFormat(),
					// "System": user.getSystem(),
					// "Theme": user.getTheme(),
					// "TimeFormat": user.getTimeFormat(),
					// "TimeZone": user.getTimeZone(),
					// "WelcomeMessage": user.getWelcomeMessage()
				};
			}
			var oModel = new JSONModel(userData);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createPMRequestModel: function () {
			var oModel = new JSONModel({
				"PMRequests": []
			});
			return oModel;
		}

	};
});