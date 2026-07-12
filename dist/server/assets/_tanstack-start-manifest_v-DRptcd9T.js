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
			"/assets/index-DchoTWGF.js",
			"/assets/jsx-runtime-DUAcabCT.js",
			"/assets/use-auth-CHF96YYQ.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DchoTWGF.js"
		} }]
	},
	"/": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-BKINdD1c.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useSuspenseQuery-D28ayW3N.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/arrow-right-BrYaBf-n.js",
			"/assets/trending-up-DbPkfocP.js",
			"/assets/map-pin-DE6JRFbH.js",
			"/assets/smartphone-CpSgszud.js",
			"/assets/routes-DEOCx_un.js"
		]
	},
	"/admin": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/admin.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-BAmVjeKS.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useMutation-6B7eEKy-.js",
			"/assets/useQuery-C1Vfx9Q0.js",
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
			"/assets/auth-B2yM3qGX.js",
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
			"/assets/dashboard-CrznMBSA.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useQuery-C1Vfx9Q0.js",
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
			"/assets/officer-Bccpss1l.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useMutation-6B7eEKy-.js",
			"/assets/useQuery-C1Vfx9Q0.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/shield-alert-U3fOzSbk.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/dialog-C5_51z-3.js",
			"/assets/plus-CWWijdNJ.js",
			"/assets/alert-dialog-Db9WQwXX.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/prices": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/prices.tsx",
		children: void 0,
		preloads: [
			"/assets/prices-B7nRtraz.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useQuery-C1Vfx9Q0.js",
			"/assets/useSuspenseQuery-D28ayW3N.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/loader-circle-C56wvwmk.js"
		]
	},
	"/search": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/search.tsx",
		children: void 0,
		preloads: [
			"/assets/search-CSMgv8ub.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useQuery-C1Vfx9Q0.js",
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
			"/assets/subscriptions-COps_Ztt.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useMutation-6B7eEKy-.js",
			"/assets/useQuery-C1Vfx9Q0.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/bell-DxBlADyd.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/smartphone-CpSgszud.js",
			"/assets/alert-dialog-Db9WQwXX.js",
			"/assets/label-CvIIq-0m.js",
			"/assets/input-DGrpsgw5.js"
		]
	},
	"/markets/$marketId": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/markets.$marketId.tsx",
		children: void 0,
		preloads: [
			"/assets/markets._marketId-BYHNexIx.js",
			"/assets/app-layout-BsLToU3T.js",
			"/assets/useQuery-C1Vfx9Q0.js",
			"/assets/card-BgZzN3mQ.js",
			"/assets/trending-up-DbPkfocP.js",
			"/assets/loader-circle-C56wvwmk.js",
			"/assets/map-pin-DE6JRFbH.js"
		]
	},
	"/officer/add-price": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/officer.add-price.tsx",
		children: void 0,
		preloads: ["/assets/officer.add-price-DoW4pr1O.js"]
	},
	"/officer/manage-prices": {
		filePath: "/Users/kad/Desktop/KAD/agriprice-hub-main/src/routes/officer.manage-prices.tsx",
		children: void 0,
		preloads: ["/assets/officer.manage-prices-0WMSSzZm.js"]
	}
} });
//#endregion
export { tsrStartManifest };
