import { a as listMarkets, i as listCommodities } from "./backend-prices-CbhrBvjN.js";
import { queryOptions } from "@tanstack/react-query";
//#region src/routes/index.tsx?tsr-shared=1
var marketsQuery = queryOptions({
	queryKey: ["markets"],
	queryFn: async () => {
		return listMarkets();
	}
});
var commoditiesQuery = queryOptions({
	queryKey: ["commodities"],
	queryFn: async () => {
		return listCommodities();
	}
});
//#endregion
export { marketsQuery as n, commoditiesQuery as t };
