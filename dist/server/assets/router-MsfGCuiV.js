import { t as supabase } from "./client-BmsDyj3x.js";
import { n as marketsQuery, t as commoditiesQuery } from "./prices-D7l65amk.js";
import { t as Route$8 } from "./admin-BB9FwSaB.js";
import { n as marketsQuery$1, t as commoditiesQuery$1 } from "./routes-bfbbaAk9.js";
import { t as Route$9 } from "./markets._marketId-C82x-YvE.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//#region src/styles.css?url
var styles_default = "/assets/styles-Hyp9-x2q.css";
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
var Route$7 = createRootRouteWithContext()({
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
				content: "Track real-time crop prices across Ghana's major markets. Get SMS price alerts for tomatoes, yam, maize and more."
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
	const { queryClient } = Route$7.useRouteContext();
	const router = useRouter();
	useEffect(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
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
var $$splitComponentImporter$6 = () => import("./subscriptions-1soBL62z.js");
var Route$6 = createFileRoute("/subscriptions")({
	head: () => ({ meta: [{ title: "SMS Subscriptions — AgriFarm" }, {
		name: "description",
		content: "Subscribe to daily or weekly SMS alerts for crop price updates."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/search.tsx
var $$splitComponentImporter$5 = () => import("./search-BcgdSqj6.js");
var Route$5 = createFileRoute("/search")({
	head: () => ({ meta: [{ title: "Search Prices — AgriFarm" }, {
		name: "description",
		content: "Search and filter crop prices across different markets in Ghana."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/prices.tsx
var $$splitComponentImporter$4 = () => import("./prices-D8mQVlyE.js");
var Route$4 = createFileRoute("/prices")({
	head: () => ({ meta: [{ title: "Price Charts — AgriFarm" }, {
		name: "description",
		content: "Interactive price trend charts for Ghanaian agricultural commodities."
	}] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(commoditiesQuery), context.queryClient.ensureQueryData(marketsQuery)]),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/officer.tsx
var $$splitComponentImporter$3 = () => import("./officer-DfXFD90v.js");
var Route$3 = createFileRoute("/officer")({
	head: () => ({ meta: [{ title: "Officer Panel — AgriFarm" }, {
		name: "description",
		content: "Data Officer portal for recording and managing agricultural crop prices."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/dashboard.tsx
var $$splitComponentImporter$2 = () => import("./dashboard-sVdrHaly.js");
var Route$2 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — AgriFarm" }, {
		name: "description",
		content: "Your AgriFarm dashboard with latest prices, trends, and subscriptions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$1 = () => import("./auth-CyD5Dgqx.js");
var Route$1 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — AgriFarm" }, {
		name: "description",
		content: "Sign in or create an AgriFarm account to track Ghanaian market prices and subscribe to SMS alerts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitErrorComponentImporter = () => import("./routes-Dlh6uesq.js");
var $$splitComponentImporter = () => import("./routes-Ds3cnpqX.js");
var Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "AgriFarm — Live Market Prices for Ghanaian Farmers" }, {
		name: "description",
		content: "Real-time crop prices across 5 major Ghanaian markets, plus SMS alerts for offline farmers."
	}] }),
	loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(marketsQuery$1), context.queryClient.ensureQueryData(commoditiesQuery$1)]),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
//#region src/routeTree.gen.ts
var SubscriptionsRoute = Route$6.update({
	id: "/subscriptions",
	path: "/subscriptions",
	getParentRoute: () => Route$7
});
var SearchRoute = Route$5.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$7
});
var PricesRoute = Route$4.update({
	id: "/prices",
	path: "/prices",
	getParentRoute: () => Route$7
});
var OfficerRoute = Route$3.update({
	id: "/officer",
	path: "/officer",
	getParentRoute: () => Route$7
});
var DashboardRoute = Route$2.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$7
});
var AuthRoute = Route$1.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$7
});
var AdminRoute = Route$8.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$7
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	AdminRoute,
	AuthRoute,
	DashboardRoute,
	OfficerRoute,
	PricesRoute,
	SearchRoute,
	SubscriptionsRoute,
	MarketsMarketIdRoute: Route$9.update({
		id: "/markets/$marketId",
		path: "/markets/$marketId",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
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
