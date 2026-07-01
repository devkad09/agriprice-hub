//#region \0%23tanstack-start-server-fn-resolver
var manifest = {
	"033667c913ae56469aafaeabfe0bb307b255c02bdc29f23d0a370ba6275ee32b": {
		functionName: "toggleSubscription_createServerFn_handler",
		importer: () => import("./subscriptions.functions-C_aFP6RN.js")
	},
	"0a0bf57d7b6efb2f314e1a37c175354f200c3fa4d8029f46951a0077d9a9f431": {
		functionName: "adminListUsers_createServerFn_handler",
		importer: () => import("./admin-BzsJg37T.js")
	},
	"0ed8c2e1fe0e1bd99f34b5579c3c8a8c933aa00d42dfacb3e7bc81b002fe9062": {
		functionName: "adminListAuditLogs_createServerFn_handler",
		importer: () => import("./admin-BzsJg37T.js")
	},
	"391b4fee013d02c747f0dcb6b56a3754cef2b6aef8a3c9945f8dc7ae5539f475": {
		functionName: "createPrice_createServerFn_handler",
		importer: () => import("./prices.functions-rjGSxcha.js")
	},
	"4b307f313d2dc4df5c2d69e166789922ea08512a495d0183d10501de2042f373": {
		functionName: "getPriceTrends_createServerFn_handler",
		importer: () => import("./prices.functions-rjGSxcha.js")
	},
	"4fbc6da2ab4aa04a6a8a2c34de712dc592acee5d52f091572a8bed8cbce81b9b": {
		functionName: "createSubscription_createServerFn_handler",
		importer: () => import("./subscriptions.functions-C_aFP6RN.js")
	},
	"68b7dc5ef20f7ffa6aafb0badcff36b70e38a45a1d4e3011e25753b2c2e56de8": {
		functionName: "adminChangeUserRole_createServerFn_handler",
		importer: () => import("./admin-BzsJg37T.js")
	},
	"93a12b46deca1ae195fb14d8e3a2b161e574bd35f0a342182f87d95592135e7f": {
		functionName: "comparePricesAcrossMarkets_createServerFn_handler",
		importer: () => import("./prices.functions-rjGSxcha.js")
	},
	"9bdf53a1577ff7b70a9687264bba4a30b281151a1b926c8c0ba640a84a438c66": {
		functionName: "adminTriggerSMSAlerts_createServerFn_handler",
		importer: () => import("./admin-BzsJg37T.js")
	},
	"9c769814b8c94cae80fb03c608865601d5165c9c607ee6ca237fd03de6549f96": {
		functionName: "getLatestPrices_createServerFn_handler",
		importer: () => import("./prices.functions-rjGSxcha.js")
	},
	"a65c8f90a9a3ee4a6ac67b90a3a8109b073901a8d36dcc8a23872d99aab49821": {
		functionName: "updatePrice_createServerFn_handler",
		importer: () => import("./prices.functions-rjGSxcha.js")
	},
	"c0b94b24a2ce3eb2aafdd399238dd328b77039135a067d255c7aa84af5277f3a": {
		functionName: "deletePrice_createServerFn_handler",
		importer: () => import("./prices.functions-rjGSxcha.js")
	},
	"d652fc387ba51bccc0f3320556f7f74bca720169f0d68460150cbf4483faf479": {
		functionName: "deleteSubscription_createServerFn_handler",
		importer: () => import("./subscriptions.functions-C_aFP6RN.js")
	},
	"db93b73ca5ea47be0eb6257e9edbb91e33349c411592267c7c9d89a938c50d36": {
		functionName: "adminBulkImportPrices_createServerFn_handler",
		importer: () => import("./admin-BzsJg37T.js")
	},
	"e24333c6272feb27d0ee4789f0270818e43d936a3c3c10b227d97f693ab057d2": {
		functionName: "listSubscriptions_createServerFn_handler",
		importer: () => import("./subscriptions.functions-C_aFP6RN.js")
	},
	"eee3e1f498ce72252a6c0b4ff5e16a2c290edc99ace864c5cc8377e8d4cf6f8c": {
		functionName: "listPrices_createServerFn_handler",
		importer: () => import("./prices.functions-rjGSxcha.js")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
