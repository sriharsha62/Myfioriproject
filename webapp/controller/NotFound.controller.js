sap.ui.define([
		"fioriapp/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("fioriapp.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);