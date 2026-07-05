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
			"/assets/index-BZMYCNow.js",
			"/assets/jsx-runtime-DUAcabCT.js",
			"/assets/use-auth-CHF96YYQ.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-BZMYCNow.js"
		} }]
	},
	"/": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DCzPiIpV.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useSuspenseQuery-DNT5rum5.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/arrow-right-BrYaBf-n.js",
			"/assets/trending-up-DbPkfocP.js",
			"/assets/map-pin-DE6JRFbH.js",
			"/assets/routes-DEOCx_un.js"
		]
	},
	"/admin": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/admin.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-DlTne8p_.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useMutation-DLPBpy2h.js",
			"/assets/useQuery-BXhP-dhm.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/shield-alert-D3GmWGJY.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/tabs-DBP7ZnZP.js"
		]
	},
	"/auth": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/auth.tsx",
		children: void 0,
		preloads: [
			"/assets/auth-BUEg7Kav.js",
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
			"/assets/dashboard-B03KfQK7.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useQuery-BXhP-dhm.js",
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
			"/assets/officer-DhbY4pFL.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useMutation-DLPBpy2h.js",
			"/assets/useQuery-BXhP-dhm.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/dialog-BviTWoZ8.js",
			"/assets/plus-CWWijdNJ.js",
			"/assets/shield-alert-D3GmWGJY.js",
			"/assets/alert-dialog-C1I8xsav.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/prices": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/prices.tsx",
		children: void 0,
		preloads: [
			"/assets/prices-SQXKChfk.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useQuery-BXhP-dhm.js",
			"/assets/useSuspenseQuery-DNT5rum5.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/loader-circle-C56wvwmk.js"
		]
	},
	"/search": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/search.tsx",
		children: void 0,
		preloads: [
			"/assets/search-D0-8R0PF.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useQuery-BXhP-dhm.js",
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
			"/assets/subscriptions-Du3ZlT8E.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useMutation-DLPBpy2h.js",
			"/assets/useQuery-BXhP-dhm.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/bell-DxBlADyd.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/alert-dialog-C1I8xsav.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/markets/$marketId": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/markets.$marketId.tsx",
		children: void 0,
		preloads: [
			"/assets/markets._marketId-BS52XlYz.js",
			"/assets/app-layout-DSxG_s43.js",
			"/assets/useQuery-BXhP-dhm.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/trending-up-DbPkfocP.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/map-pin-DE6JRFbH.js"
		]
	},
	"/officer/add-price": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/officer.add-price.tsx",
		children: void 0,
		preloads: ["/assets/officer.add-price-B3-MFkwe.js"]
	},
	"/officer/manage-prices": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/officer.manage-prices.tsx",
		children: void 0,
		preloads: ["/assets/officer.manage-prices-CNgJMDgQ.js"]
	}
} });
//#endregion
export { tsrStartManifest };
