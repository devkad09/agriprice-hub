//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/__root.tsx",
		children: [
			"/",
			"/admin",
			"/auth",
			"/dashboard",
			"/officer",
			"/prices",
			"/search",
			"/subscriptions",
			"/markets/$marketId"
		],
		preloads: [
			"/assets/index-DESlKd4c.js",
			"/assets/jsx-runtime-DUAcabCT.js",
			"/assets/use-auth-CHF96YYQ.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DESlKd4c.js"
		} }]
	},
	"/": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DEOCx_un.js",
			"/assets/routes-DOPSh0GM.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useSuspenseQuery-CiLENSZD.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/arrow-right-BrYaBf-n.js",
			"/assets/trending-up-DbPkfocP.js",
			"/assets/map-pin-DE6JRFbH.js",
			"/assets/smartphone-CpSgszud.js"
		]
	},
	"/admin": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/admin.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-CPxy_TVQ.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useMutation-DxRSL0lU.js",
			"/assets/useQuery-QZHa6Jfd.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/shield-alert-U3fOzSbk.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/tabs-DBP7ZnZP.js"
		]
	},
	"/auth": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/auth.tsx",
		children: void 0,
		preloads: [
			"/assets/auth-C9W325Lh.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/tabs-DBP7ZnZP.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/dashboard": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-Db4byzgP.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useQuery-QZHa6Jfd.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/arrow-right-BrYaBf-n.js",
			"/assets/bell-DxBlADyd.js",
			"/assets/trending-up-DbPkfocP.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/map-pin-DE6JRFbH.js"
		]
	},
	"/officer": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/officer.tsx",
		children: ["/officer/add-price", "/officer/manage-prices"],
		preloads: [
			"/assets/officer-0NXAjScO.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useMutation-DxRSL0lU.js",
			"/assets/useQuery-QZHa6Jfd.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/shield-alert-U3fOzSbk.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/dialog-DWRLT4by.js",
			"/assets/plus-CWWijdNJ.js",
			"/assets/alert-dialog-C38OTXRv.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/prices": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/prices.tsx",
		children: void 0,
		preloads: [
			"/assets/prices-YPrhiQaP.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useQuery-QZHa6Jfd.js",
			"/assets/useSuspenseQuery-CiLENSZD.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/loader-circle-C56wvwmk.js"
		]
	},
	"/search": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/search.tsx",
		children: void 0,
		preloads: [
			"/assets/search-BRgxDNNT.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useQuery-QZHa6Jfd.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/map-pin-DE6JRFbH.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/subscriptions": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-D_aTCypl.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useMutation-DxRSL0lU.js",
			"/assets/useQuery-QZHa6Jfd.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/bell-DxBlADyd.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/smartphone-CpSgszud.js",
			"/assets/alert-dialog-C38OTXRv.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/markets/$marketId": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/markets.$marketId.tsx",
		children: void 0,
		preloads: [
			"/assets/markets._marketId-i7-3LgEW.js",
			"/assets/app-layout-B5QlcPwf.js",
			"/assets/useQuery-QZHa6Jfd.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/trending-up-DbPkfocP.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/map-pin-DE6JRFbH.js"
		]
	},
	"/officer/add-price": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/officer.add-price.tsx",
		children: void 0,
		preloads: ["/assets/officer.add-price-BaGFd_FJ.js"]
	},
	"/officer/manage-prices": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/officer.manage-prices.tsx",
		children: void 0,
		preloads: ["/assets/officer.manage-prices-zFLHwH7i.js"]
	}
} });
//#endregion
export { tsrStartManifest };
