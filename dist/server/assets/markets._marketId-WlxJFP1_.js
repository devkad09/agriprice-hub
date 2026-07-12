import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/markets.$marketId.tsx
var $$splitComponentImporter = () => import("./markets._marketId-Bu2z_ci4.js");
var Route = createFileRoute("/markets/$marketId")({
	head: () => ({ meta: [{ title: "Market Details — AgriFarm" }, {
		name: "description",
		content: "View current commodity prices at this market."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
