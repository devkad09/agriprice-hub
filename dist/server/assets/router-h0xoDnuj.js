import { n as marketsQuery, t as commoditiesQuery } from "./prices-Dy9v5rAt.js";
import { n as marketsQuery$1, t as commoditiesQuery$1 } from "./routes-CuV4hfC5.js";
import { t as Route$11 } from "./markets._marketId-WlxJFP1_.js";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-DiFGHUBC.css";
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "AgriFarm — Live Market Prices for Ghanaian Farmers" },
			{
				name: "description",
				content: "Track real-time crop prices across Ghana's major markets. Get SMS price alerts for vegetables, tomatoes, yam, maize and more."
			},
			{
				property: "og:title",
				content: "AgriFarm — Live Market Prices for Ghanaian Farmers"
			},
			{
				property: "og:description",
				content: "Real-time crop prices across 5 major Ghanaian markets, plus SMS alerts for offline farmers."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			position: "top-center",
			richColors: true
		})]
	});
}
//#endregion
//#region src/routes/subscriptions.tsx
var $$splitComponentImporter$9 = () => import("./subscriptions-BshsyyuM.js");
var Route$9 = createFileRoute("/subscriptions")({
	head: () => ({ meta: [{ title: "SMS Subscriptions — AgriFarm" }, {
		name: "description",
		content: "Subscribe to daily or weekly SMS alerts for crop price updates."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/search.tsx
var $$splitComponentImporter$8 = () => import("./search-DOPMRJrW.js");
var Route$8 = createFileRoute("/search")({
	head: () => ({ meta: [{ title: "Search Prices — AgriFarm" }, {
		name: "description",
		content: "Search and filter crop prices across different markets in Ghana."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/prices.tsx
var $$splitComponentImporter$7 = () => import("./prices-B-tNNipQ.js");
var Route$7 = createFileRoute("/prices")({
	head: () => ({ meta: [{ title: "Price Charts — AgriFarm" }, {
		name: "description",
		content: "Interactive price trend charts for Ghanaian agricultural commodities."
	}] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(commoditiesQuery), context.queryClient.ensureQueryData(marketsQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/officer.tsx
var $$splitComponentImporter$6 = () => import("./officer-CG11CDNs.js");
var Route$6 = createFileRoute("/officer")({
	head: () => ({ meta: [{ title: "Officer Panel — AgriFarm" }, {
		name: "description",
		content: "Data Officer portal for recording and managing agricultural crop prices."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/dashboard.tsx
var $$splitComponentImporter$5 = () => import("./dashboard-CVLZSVlS.js");
var Route$5 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — AgriFarm" }, {
		name: "description",
		content: "Your AgriFarm dashboard with latest prices, trends, and subscriptions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$4 = () => import("./auth-BmIQvXbb.js");
var Route$4 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — AgriFarm" }, {
		name: "description",
		content: "Sign in or create an AgriFarm account to track Ghanaian market prices and subscribe to SMS alerts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter$3 = () => import("./admin-BJ3Ve-IN.js");
var Route$3 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin Console — AgriFarm" }, {
		name: "description",
		content: "Admin Dashboard for managing users, audit logs, and bulk CSV imports."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitErrorComponentImporter = () => import("./routes-Dlh6uesq.js");
var $$splitComponentImporter$2 = () => import("./routes-DbruURct.js");
var Route$2 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "AgriFarm — Live Market Prices for Ghanaian Farmers" }, {
		name: "description",
		content: "Real-time crop prices across 5 major Ghanaian markets, plus SMS alerts for offline farmers."
	}] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(marketsQuery$1), context.queryClient.ensureQueryData(commoditiesQuery$1)]),
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
//#region src/routes/officer.manage-prices.tsx
var $$splitComponentImporter$1 = () => import("./officer.manage-prices-DJOr6khX.js");
var Route$1 = createFileRoute("/officer/manage-prices")({
	head: () => ({ meta: [{ title: "Manage Prices — Officer Panel — AgriFarm" }, {
		name: "description",
		content: "Manage recorded market prices."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/officer.add-price.tsx
var $$splitComponentImporter = () => import("./officer.add-price-YQ5KJgcH.js");
var Route = createFileRoute("/officer/add-price")({
	head: () => ({ meta: [{ title: "Add Price — Officer Panel — AgriFarm" }, {
		name: "description",
		content: "Record a new market price (Data Officers only)."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var SubscriptionsRoute = Route$9.update({
	id: "/subscriptions",
	path: "/subscriptions",
	getParentRoute: () => Route$10
});
var SearchRoute = Route$8.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$10
});
var PricesRoute = Route$7.update({
	id: "/prices",
	path: "/prices",
	getParentRoute: () => Route$10
});
var OfficerRoute = Route$6.update({
	id: "/officer",
	path: "/officer",
	getParentRoute: () => Route$10
});
var DashboardRoute = Route$5.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$10
});
var AuthRoute = Route$4.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$10
});
var AdminRoute = Route$3.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$10
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var OfficerManagePricesRoute = Route$1.update({
	id: "/manage-prices",
	path: "/manage-prices",
	getParentRoute: () => OfficerRoute
});
var OfficerAddPriceRoute = Route.update({
	id: "/add-price",
	path: "/add-price",
	getParentRoute: () => OfficerRoute
});
var MarketsMarketIdRoute = Route$11.update({
	id: "/markets/$marketId",
	path: "/markets/$marketId",
	getParentRoute: () => Route$10
});
var OfficerRouteChildren = {
	OfficerAddPriceRoute,
	OfficerManagePricesRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	AuthRoute,
	DashboardRoute,
	OfficerRoute: OfficerRoute._addFileChildren(OfficerRouteChildren),
	PricesRoute,
	SearchRoute,
	SubscriptionsRoute,
	MarketsMarketIdRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
