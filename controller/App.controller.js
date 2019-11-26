sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button"
], function (Controller, MessageToast, Dialog, Button) {
	"use strict";
	return Controller.extend("hayat.fioHayatPriceManagement.controller.App", {
		onInit:function(){
			// set message model
			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");

			// activate automatic message generation for complete view
			oMessageManager.registerObject(this.getView(), true);
		},
		handleApprovePMRequest: function (evt) {
			this.createDeepEntity("A");
		},
		handleRejectPMRequest: function (evt) {
			this.createDeepEntity("R");
		},
		showErrorMessages: function (messages) {
			var oDialog = new Dialog({
				title: "{i18n>systemMessages}",
				beginButton: new Button({
					text: "Close",
					type: "Reject",
					press: function (evt) {
						evt.getSource().getParent().close();
					},
					afterClose: function () {
						oDialog.close();
					}
				})
			});
			// var oLayoutVer = new sap.ui.layout.VerticalLayout({
			// 	class: "sapUiContentPadding"
			// });
			for (var i = 0, len = messages.length; i < len; i++) {
				var oMsgStrip = new sap.m.MessageStrip({
					text: messages[i].message,
					class: "sapUiMediumMarginBottom",
					type: messages[i].severity === "info" ? "Information" : messages[i].severity.charAt(0).toUpperCase() + messages[i].severity.slice(
						1)
				});
				oDialog.addContent(oMsgStrip);
			}
			// oDialog.setLayoutData(oLayoutVer);
			oDialog.open();
		},
		createDeepEntity: function (processType) {
			var that = this;
			var oView = this.getView();
			var oTable = oView.byId("pmrListView").byId("pmRequestList");
			var selectedBindingContexts = oTable.getSelectedContexts();
			var oDataModel = oView.getModel();
			var serviceData = {
				"ProcessType": processType,
				"Werks": "",
				"HeaderItem": []
			};

			for (var i = 0, len = selectedBindingContexts.length; i < len; i++) {
				var thisRow = selectedBindingContexts[i].getObject();
				serviceData.HeaderItem.push({
					"Preqn": thisRow.Preqn,
					"Matnr": thisRow.Matnr,
					"Werks": thisRow.Werks
				});
			}

			oDataModel.create("/HeaderSet",
				serviceData, {
					"success": function (oData, response) {
						var messages = JSON.parse(response.headers["sap-message"]);
						if (messages.details.length <= 0) {
							messages.details.push(messages);
						}
						that.showErrorMessages(messages.details);
						that.refreshModelData();

					},
					"error": function (oError) {
						var messages = JSON.parse(oError.responseText).error.innererror.errordetails;
						that.showErrorMessages(messages);
					}
				});

		},
		onMessagePopoverPress: function (oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},
        _getMessagePopover : function () {
            // create popover lazily (singleton)
            if (!this._oMessagePopover) {
                // create popover lazily (singleton)
                this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "hayat.fioHayatPriceManagement.fragment.MessagePopover", this);
                this.getView().addDependent(this._oMessagePopover);
            }
            return this._oMessagePopover;
        },
		refreshModelData: function () {
			var oView = this.getView();
			var searchView = oView.byId("searchPanelView");
			var smartFilterBar = searchView.byId("smartFilterBar");
			var filters = smartFilterBar.getFilters();

			var oDataModel = oView.getModel();
			var pmRequestModel = oView.getModel("pmRequests");
			
			pmRequestModel.getData().PMRequests = [];

			oDataModel.read("/PmRequestSet", {
				"filters": filters,
				"success": function (oData, oResponse) {
					pmRequestModel.getData().PMRequests = oData.results;
					pmRequestModel.refresh();
				},
				"error": function (oError) {
					pmRequestModel.refresh();
				}
			});
		}
	});
});