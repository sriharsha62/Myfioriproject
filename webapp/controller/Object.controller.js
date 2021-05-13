/*global location*/

sap.ui.define([
	"fioriapp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"fioriapp/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	formatter
) {
	"use strict";
	var that;
	return BaseController.extend("fioriapp.controller.Object", {

		formatter: formatter,

		onInit: function() {
			that = this;
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("fioriapp.fragments.userInfo", this);
				this.getView().addDependent(this.oDialog); // this line will share the resoruces of view with the fragment.
			}

			var createHistoryModel = new JSONModel();
			createHistoryModel.setData({
				"CompName": "",
				"Fdate": "",
				"Tdate": "",
				"Designation": "",
				"Reason": ""
			});
			this.getView().setModel(createHistoryModel, 'createHistoryModel');

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function(oEvent) {
			that.parameter = oEvent.getParameter('arguments');

			var oEmpId = this.getModel("EmpDetail").getProperty("/EmpId");
			if (oEmpId !== "") {
				this.bindData();
			}

		},

		bindData: function() {
			var vEmpId = this.getModel("EmpDetail").getProperty("/EmpId");
			this.getView().getModel().read("/DetailSet(" + vEmpId + ")", {
				urlParameters: {
					"$expand": "EmpDetailTo_WrkHistory"
				},
				success: function(oData, response) {
					that.getView().getModel("EmpDetail").setData(oData);

				},
				error: function(response) {

				}
			});
		},

		handleBack: function(oEvent) {

			this.getRouter().navTo("worklist");

		},
		handleEdit: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("EmpDetail").getPath();
			that.historyPath = sPath;
			var oData = this.getView().getModel("EmpDetail").getProperty(sPath);
			var createHistoryModel = this.getView().getModel("createHistoryModel");
			createHistoryModel.setProperty("/CompName", oData.CompName);
			createHistoryModel.setProperty("/Fdate", oData.Fdate);
			createHistoryModel.setProperty("/Tdate", oData.Tdate);
			createHistoryModel.setProperty("/Designation", oData.Designation);
			createHistoryModel.setProperty("/Reason", oData.Reason);
			that.isEditExisting = true;
			
			this.oDialog.open();
			
		},
		handleCreateHistory: function(oEvent) {

			var createHistoryModel = this.getView().getModel("createHistoryModel");
			createHistoryModel.setProperty("/CompName", "");
			createHistoryModel.setProperty("/Fdate", "");
			createHistoryModel.setProperty("/Tdate", "");
			createHistoryModel.setProperty("/Designation", "");
			createHistoryModel.setProperty("/Reason", "");
			that.isEditExisting = false;
			this.oDialog.open();
		},
		handleClose: function(oEvent) {
			//read the inputs from fragment

			this.oDialog.close();
		},
		handleOk: function(oEvent) {
			
			var CompName = sap.ui.getCore().byId("compName").getValue();
			var Fdate = sap.ui.getCore().byId("fromDate").getValue();
			var Tdate = sap.ui.getCore().byId("toDate").getValue();
			var Designation = sap.ui.getCore().byId("designation").getValue();
			var Reason = sap.ui.getCore().byId("reason").getValue();
			
			if(that.isEditExisting === false){
			var Data = {
				"CompName": CompName,
				"Designation": Designation,
				"Fdate": Fdate,
				"Reason": Reason,
				"Tdate": Tdate
			};
			var empDetailModel = this.getView().getModel("EmpDetail");
			var rows = empDetailModel.getProperty("/EmpDetailTo_WrkHistory");
			rows.results.push(Data);
			empDetailModel.setProperty("/EmpDetailTo_WrkHistory", rows);
			}
			else{
				//do nothing.
				var oData = this.getView().getModel("EmpDetail").getProperty(that.historyPath);
				oData.CompName = CompName;
				oData.Fdate = Fdate;
				oData.Tdate = Tdate;
				oData.Designation = Designation;
				oData.Reason = Reason;
				
				this.getView().getModel("EmpDetail").setProperty(that.historyPath,oData);
				
				//this.getView().getModel().refresh();
			}
			
			
			this.oDialog.close();

		}

	});

});