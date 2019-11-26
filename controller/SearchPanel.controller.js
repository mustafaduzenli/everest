sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/SearchField",
	"sap/m/MessageBox"
], function (Controller, Dialog, Button, SearchField, MessageBox) {
	"use strict";

	return Controller.extend("hayat.fioHayatPriceManagement.controller.SearchPanel", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf hayat.fioHayatPriceManagement.view.SearchPanel
		 */
		onInit: function () {
			this.changeGoButtonText();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf hayat.fioHayatPriceManagement.view.SearchPanel
		 */
		onBeforeRendering: function () {
			this.changeGoButtonText();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf hayat.fioHayatPriceManagement.view.SearchPanel
		 */
		// onAfterRendering: function () {
		// 
		// },
		changeGoButtonText: function () {
			var filterBar = this.getView().byId("smartFilterBar");
			var that = this;
			filterBar.addEventDelegate({
				"onAfterRendering": function (oEvent) {
					var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();

					var oButton = oEvent.srcControl._oSearchButton;
					oButton.setText(oResourceBundle.getText("goButton"));
				}
			});
		},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf hayat.fioHayatPriceManagement.view.SearchPanel
		 */
		//	onExit: function() {
		//
		//	}
		showErrorMessages: function (messages) {
			var oDialog = new Dialog({
				title: "{i18n>systemMessages}",
				class: "sapUiResponsiveContentPadding",
				beginButton: new Button({
					text: "Close",
					type: "Reject",
					press: function (evt) {
						evt.getSource().getParent().close();
					}
				}),
				afterClose: function () {
					oDialog.close();
				}
			});
			// var oLayoutVer = new sap.ui.layout.VerticalLayout({
			// 	class: "sapUiContentPadding"
			// });
			for (var i = 0, len = messages.length; i < len; i++) {
				var oMsgStrip = new sap.m.MessageStrip({
					text: messages[i].message,
					class: "sapUiMediumMarginBottom",
					type: messages[i].severity.charAt(0).toUpperCase() + messages[i].severity.slice(1)
				});
				oDialog.addContent(oMsgStrip);
			}
			// oDialog.setLayoutData(oLayoutVer);
			oDialog.open();
		},
		onSearchPMRequests: function (evt) {
			var that = this;
			var oView = this.getView();
			var filters = evt.getSource().getFilters();
			var oDataModel = oView.getModel();
			var resourceBundle = oView.getModel("i18n").getResourceBundle();
			var pmRequestModel = oView.getModel("pmRequests");

			oDataModel.read("/PmRequestSet", {
				"filters": filters,
				"success": function (oData, oResponse) {
					if (!oData || oData.results <= 0) {
						MessageBox.error(
							resourceBundle.getText("noDataErrorMessage"), {
								styleClass: "sapUiSizeCompact"
							}
						);
					}
					pmRequestModel.getData().PMRequests = oData.results;
					pmRequestModel.refresh();
				},
				"error": function (oError) {
					var messages = JSON.parse(oError.responseText).error.innererror.errordetails;
					that.showErrorMessages(messages);
				}

			});
		}

	});

});