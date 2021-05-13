sap.ui.define([
	"fioriapp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fioriapp/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, MessageBox) {
	"use strict";

	var that;

	return BaseController.extend("fioriapp.controller.Worklist", {

		formatter: formatter,

		onInit: function() {
			that = this;
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

		},

		handleDelete: function(oEvent) {
			that.empId = oEvent.getSource().getParent().getParent().getCells()[0].getText();
			MessageBox.show("Are You Sure You want to Delete ?", {
				title: "Question",
				icon: MessageBox.Icon.QUESTION,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function(oAction) {
					if (oAction === "YES") {
						var oModel = that.getOwnerComponent().getModel();
						var path = "/DetailSet(" + that.empId + ")";
						oModel.remove(path, {
							async: true,
							success: function(oData) {
								that.getView().getModel().refresh();
							},
							error: function(oError) {

							}
						});

					}
					if (oAction === "NO") {
						// do nothing
					}
				}
			});

		},

		handleNext: function() {
			var firstName = this.byId("inpFname").getValue();
			var lastName = this.byId("inpLname").getValue();

			var aData = {
				"firstName": firstName,
				"lastName": lastName
			};

			var oModel = new JSONModel(aData);
			sap.ui.getCore().setModel(oModel, "dataModel");

			/*	this.getRouter().navTo("object",{
					"firstName":firstName,
					"lastName":lastName
				});*/
			this.getRouter().navTo("object");
		},
		handleSelection: function(oEvent) {
			var firstName = oEvent.getSource().getCells()[0].getText();
			var lastName = oEvent.getSource().getCells()[1].getText();
			var Gender = oEvent.getSource().getCells()[2].getText();

			var lineData = {
				"firstName": firstName,
				"lastName": lastName,
				"Gender": Gender
			};

			var oModel = new JSONModel(lineData);
			sap.ui.getCore().setModel(oModel, "dataModel");

			//get language.
			var language = sap.ui.getCore().getConfiguration().getLanguage();

			//navigate
			this.getRouter().navTo("object");

		},
		onLanguageSelect: function(oEvent) {

			var language = sap.ui.getCore().getConfiguration().getLanguage();
			var lang = oEvent.getSource().getSelectedKey();
			if (lang === "English") {
				sap.ui.getCore().getConfiguration().setLanguage("en-GB");
			} else if (lang === "Hindhi") {
				sap.ui.getCore().getConfiguration().setLanguage("hi");
			}

			//sap.ui.getCore().byId("lang").setText(language);
			this.byId("lang").setText(sap.ui.getCore().getConfiguration().getLanguage());

		},
		aadWork: function(oEvent) {
			this.getRouter().navTo("object");
		},
		onEditEmp: function(oEvent) {

			/*var empid = oEvent.getSource().getParent().getParent().getCells()[0].getText();
			var firstName = oEvent.getSource().getParent().getParent().getCells()[1].getText();
			var lastName = oEvent.getSource().getParent().getParent().getCells()[2].getText();
			var email = oEvent.getSource().getParent().getParent().getCells()[3].getText();
			var gender = oEvent.getSource().getParent().getParent().getCells()[4].getText();
			
			var lineData = {
				"empId": empid,
				"inpFname": firstName,
				"lastName": lastName,
				"email": email,
				"gender": gender
			};
			var oModel = new JSONModel(lineData);
			sap.ui.getCore().setModel(oModel, "dataModel");
			this.getRouter().navTo("object");*/

			var getCells = oEvent.getSource().getParent().getParent().getCells();
			var EmpId = getCells[0].getText();

			//enable input boxes
			getCells[1].setProperty("editable", true);
			getCells[2].setProperty("editable", true);
			getCells[3].setProperty("editable", true);
			getCells[4].setProperty("editable", true);

			//oEvent.getSource().getParent().getParent().getCells()[1].set

			//this.getView().getModel("EmpDetail").setProperty("/EmpId",EmpId);
			//this.getRouter().navTo("object");

			//var vEmpId = this.getModel("EmpDetail").getProperty("/EmpId");
			this.getView().getModel().read("/DetailSet(" + EmpId + ")", {
				urlParameters: {
					"$expand": "EmpDetailTo_WrkHistory"
				},
				success: function(oData, response) {
					that.getView().getModel("EmpDetail").setData(oData);

				},
				error: function(response) {

				}
			});

			//enable and disable input boxes.
			var oItem = oEvent.getSource().getParent().getParent();
			var oTable = this.getView().byId("oTab");
			var oIndex = oTable.indexOfItem(oItem);

			if (typeof this.previousItem !== "undefined") {

				var oItemPrevCells = oTable.getItems()[this.previousItem].getCells();
				oItemPrevCells[1].setProperty("editable", false);
				oItemPrevCells[2].setProperty("editable", false);
				oItemPrevCells[3].setProperty("editable", false);
				oItemPrevCells[4].setProperty("editable", false);
			}
			this.previousItem = oIndex;

			var oHistoryTable = this.getView().byId("oTable");
			oHistoryTable.setProperty("visible", true);
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

			if (that.isEditExisting === false) {
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
			} else {
				//do nothing.
				var oData = this.getView().getModel("EmpDetail").getProperty(that.historyPath);
				oData.CompName = CompName;
				oData.Fdate = Fdate;
				oData.Tdate = Tdate;
				oData.Designation = Designation;
				oData.Reason = Reason;

				this.getView().getModel("EmpDetail").setProperty(that.historyPath, oData);

				//this.getView().getModel().refresh();
			}

			this.oDialog.close();

		},
		addEmp: function() {
			var fName = this.byId("inpFname").getValue();
			var lName = this.byId("inpLname").getValue();
			var gender = this.byId("inpGender").getValue();
			var email = this.byId("inpEmail").getValue();

			var Data = {
				//"EmpId": "",
				"Fname": fName,
				"Lname": lName,
				"EmailId": email,
				"Gender": gender,
			};

			var path = "/DetailSet";
			var oModel = this.getOwnerComponent().getModel();
			oModel.create(path, Data, {
				async: true,
				success: function() {

				},
				error: function() {

				}
			});
			/*		oModel.create('/DetailSet', Data, null,
				function() {
					MessageBox.show("Create successful");
				},
				function() {
					MessageBox.show("Create Failed");
				});
*/
			//var detailSet = this.getView().getModel("DetailSet");
			//this.byId("oTab").getModel().getProperty("/DetailSet").push(Data);

		},
		updAll: function(oEvent) {
			

			//this.getOwnerComponent().getModel("EmpDetail").getProperty("/EmailId");
			//this.byId("oTab");
			//get changed cells Employee table
			var oCells = this.byId("oTab").getItems()[this.previousItem].getCells();
			var fname = oCells[1].getValue();
			var lname = oCells[2].getValue();
			var email = oCells[3].getValue();
			var gender = oCells[4].getValue();

			//update the values to the model.
			var finalModel = this.getOwnerComponent().getModel("EmpDetail");
			finalModel.setProperty("/Fname", fname);
			finalModel.setProperty("/Lname", lname);
			finalModel.setProperty("/EmailId", email);
			finalModel.setProperty("/Gender", gender);

			var data = finalModel.getData();

			this.getView().getModel().create("/DetailSet", data, {

				success: function(oData, oResponse) {
					sap.m.MessageToast.show("Update Successful");	
				},
				error: function(oError) {
				   sap.m.MessageToast.show("Update Failed");
				}
			});
			

		}

	});
});