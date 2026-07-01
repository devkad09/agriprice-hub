import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/index.tsx?tsr-split=errorComponent
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ jsx("main", {
	className: "grid min-h-screen place-items-center p-6 text-center",
	children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
		className: "font-display text-xl font-semibold",
		children: "Couldn't load AgriFarm data"
	}), /* @__PURE__ */ jsx("p", {
		className: "mt-2 text-sm text-muted-foreground",
		children: error.message
	})] })
});
//#endregion
export { SplitErrorComponent as errorComponent };
