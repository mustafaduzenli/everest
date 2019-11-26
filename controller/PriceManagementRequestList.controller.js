sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"hayat/fioHayatPriceManagement/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/SearchField"
], function (Controller, formatter, JSONModel, Filter, FilterOperator, SearchField) {
	"use strict";

	return Controller.extend("hayat.fioHayatPriceManagement.controller.PriceManagementRequestList", {

		_initialFilters: {
			all: "",
			mKPrices: [new Filter({
				path: "Prcrsn",
				operator: FilterOperator.EQ,
				value1: "05"
			})],
			nonMKPrices: [new Filter({
				path: "Prcrsn",
				operator: FilterOperator.NE,
				value1: "05"
			})]

		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf hayat.fioHayatPriceManagement.view.PriceManagementRequestList
		 */
		onInit: function () {
			var viewModel = new JSONModel({
				"plantVisible": false,
				"reasonCodeVisible": false,
				"title": "",
				"allCount": "",
				"mkCount": "",
				"nonMKCount": ""
			});
			this.getView().setModel(viewModel, "viewModel");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf hayat.fioHayatPriceManagement.view.PriceManagementRequestList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf hayat.fioHayatPriceManagement.view.PriceManagementRequestList
		 */
		onAfterRendering: function () {
			// setInterval(this.setCount(), 45000);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf hayat.fioHayatPriceManagement.view.PriceManagementRequestList
		 */
		//	onExit: function() {
		//
		//	}
		formatter: formatter,
		handleLinkPress: function (evt) {
			var thisObj = evt.getSource().getBindingContext("pmRequests").getObject();
			var fieldName = evt.getSource().getBindingInfo("text").parts[0].path;
			var viewModel = this.getView().getModel("viewModel");
			var messageBundle = this.getView().getModel("i18n").getResourceBundle();
			var title = "";
			if (fieldName === "Werks") {
				viewModel.setProperty("/plantVisible", true);
				viewModel.setProperty("/materialVisible", false);
				viewModel.setProperty("/reasonCodeVisible", false);
				title = messageBundle.getText("plant");
				viewModel.setProperty("/title", title);

			} else if (fieldName === "Prcrsn") {
				viewModel.setProperty("/plantVisible", false);
				viewModel.setProperty("/materialVisible", false);
				viewModel.setProperty("/reasonCodeVisible", true);
				title = messageBundle.getText("reasonCode");
				viewModel.setProperty("/title", title);
			} else if (fieldName === "Matnr") {
				viewModel.setProperty("/plantVisible", false);
				viewModel.setProperty("/materialVisible", true);
				viewModel.setProperty("/reasonCodeVisible", false);
				title = messageBundle.getText("material");
				viewModel.setProperty("/title", title);

			}
			viewModel.refresh();
			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("hayat.fioHayatPriceManagement.fragment.LineDetailPopover", this);
				this.getView().addDependent(this._oPopover);
				this._oPopover.bindElement("/PmRequestSet(Preqn='" + thisObj.Preqn + "',Matnr='" + thisObj.Matnr + "')");
			}

			this._oPopover.openBy(evt.getSource());
		},
		handleIconFilterSelect: function (oEvent) {
			var selectedFilter;
			var sKey = oEvent.getParameter("key");
			var viewModel = this.getView().getModel("viewModel");
			var oView = this.getView();
			var oldMK = oView.byId("colOldMK");
			var newMK = oView.byId("colNewMK");
			var curMK = oView.byId("colCurMK");
			var mkPriceChange = oView.byId("colMKPriceChange");
			var priceChange = oView.byId("colPriceChange");
			var oldPrice = oView.byId("colOldPrice");
			var requestPrice = oView.byId("colRequestPrice");
			if (sKey === "all") {
				priceChange.setVisible(true);
				mkPriceChange.setVisible(true);
				newMK.setVisible(true);
				curMK.setVisible(true);
				oldMK.setVisible(true);
				oldPrice.setVisible(true);
				requestPrice.setVisible(true);
				newMK.setMinScreenWidth("tablet");
				curMK.setMinScreenWidth("tablet");
				oldMK.setMinScreenWidth("tablet");
				mkPriceChange.setMinScreenWidth("tablet");
				// viewModel.setProperty("/mkVisible", true);
			} else if (sKey === "mKPrices") {
				mkPriceChange.setVisible(true);
				newMK.setVisible(true);
				curMK.setVisible(true);
				oldMK.setVisible(true);
				newMK.setMinScreenWidth();
				curMK.setMinScreenWidth();
				oldMK.setMinScreenWidth();
				priceChange.setVisible(false);
				oldPrice.setVisible(false);
				requestPrice.setVisible(false);
				selectedFilter = this._initialFilters.mKPrices;
				// viewModel.setProperty("/mkVisible", true);
			} else if (sKey === "nonMKPrices") {
				priceChange.setVisible(true);
				newMK.setVisible(false);
				mkPriceChange.setVisible(false);
				curMK.setVisible(false);
				oldMK.setVisible(false);
				oldPrice.setVisible(true);
				requestPrice.setVisible(true);
				selectedFilter = this._initialFilters.nonMKPrices;
				// viewModel.setProperty("/mkVisible", false);
			}
			viewModel.refresh();
			this.refreshModelData(selectedFilter);
		},
		addFilters1: function (aFilters, oFilter) {
			var result;
			if (aFilters.length <= 0) {
				return [oFilter];
			}
			var copiedFilter = jQuery.extend(true, {}, aFilters[0]);
			if (aFilters[0]._bMultiFilter) {
				if (aFilters[0].bAnd) {
					copiedFilter.aFilters.push(oFilter);
					result = aFilters;
				} else {
					result = [new Filter({
						and: true,
						filters: [
							copiedFilter,
							new Filter({
								and: false,
								filters: [oFilter]
							})
						]
					})];

				}
			} else {
				result = [new Filter({
					and: true,
					filters: [oFilter, aFilters[0]]
				})];
			}
			return result;
		},
		addFilters:function (filters, tabFilters) {
			// Bu fonksiyonu da  constructFilter'dan kopyaladim filtrelerin bAnd alani true gelmeyince hata veriyordu
			// onu atlamak icin ve buradaki filtre yapisini benim yazdigim createUrl fonksiyonuna uydurmak icin
			// yaptim gelen verilere etkisi nedir tam olarak bilemiyorum bir kontorl etmek gerekebilir.
			// var result = [];
			// if (filters.length) {
			// 	var copiedFilter = jQuery.extend(true,{}, tabFilters[0]);
			// 	result[0].aFilters.push(copiedFilter);
			// 	result.push(filters[0]);
			// } else {
			// 	result.push(tabFilters[0]);
			// }
			// result[0].bAnd = true;
			// return result;
			var result = [];
			if (filters.length && filters.length > 0) {
				var copiedFilter = jQuery.extend(true, {}, filters[0]);
				result.push(copiedFilter);
				result[0].aFilters.push(tabFilters[0]);
			} else {
				result.push(tabFilters[0]);
			}
			result[0].bAnd = true;
			return result;
		},
		refreshModelData: function (selectedIconFilter) {
			var oView = this.getView();
			var searchView = this.getView().getParent().getParent().byId("searchPanelView");
			var smartFilterBar = searchView.byId("smartFilterBar");
			var filters = selectedIconFilter ? this.addFilters(smartFilterBar.getFilters(), selectedIconFilter) : smartFilterBar.getFilters();

			var oDataModel = oView.getModel();
			var pmRequestModel = oView.getModel("pmRequests");
			var that = this;

			pmRequestModel.getData().PMRequests = [];

			oDataModel.read("/PmRequestSet", {
				"filters": filters,
				"success": function (oData, oResponse) {
					pmRequestModel.getData().PMRequests = oData.results;
					pmRequestModel.refresh();
					that.setCount();
				},
				"error": function (oError) {
					pmRequestModel.refresh();
				}
			});
		},
		setCount: function () {
			var searchView = this.getView().getParent().getParent().byId("searchPanelView");
			var smartFilterBar = searchView.byId("smartFilterBar");
			var filtersAll = smartFilterBar.getFilters();
			var filtersMK = this.addFilters(smartFilterBar.getFilters(), this._initialFilters.mKPrices);
			var filtersNonMK = this.addFilters(smartFilterBar.getFilters(), this._initialFilters.nonMKPrices);
			var viewModel = this.getView().getModel("viewModel");

			var oDataModel = this.getView().getModel();
			// var messageModel =  this.getView().getModel("message");   
			oDataModel.read("/PmRequestSet/$count", {
				success: function (oData) {
					viewModel.setProperty("/allCount", oData);
					viewModel.refresh();
				},
				error:function(){
				},
				filters: filtersAll
			});

			oDataModel.read("/PmRequestSet/$count", {
				success: function (oData) {
					viewModel.setProperty("/mkCount", oData);
					viewModel.refresh();
				},
				filters: filtersMK,
				error:function(){
				}
			});

			oDataModel.read("/PmRequestSet/$count", {
				success: function (oData) {
					viewModel.setProperty("/nonMKCount", oData);
					viewModel.refresh();
				},
				filters: filtersNonMK,
				error:function(){
				}
			});
		},
		onMessagePopoverPress: function (oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},
		_getMessagePopover: function () {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				// create popover lazily (singleton)
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "hayat.fioHayatPriceManagement.fragment.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		}

	});

});