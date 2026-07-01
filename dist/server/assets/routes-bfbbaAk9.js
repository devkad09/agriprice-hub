import { t as supabase } from "./client-BmsDyj3x.js";
import { queryOptions } from "@tanstack/react-query";
//#region src/routes/index.tsx?tsr-shared=1
var marketsQuery = queryOptions({
	queryKey: ["markets"],
	queryFn: async () => {
		const { data, error } = await supabase.from("markets").select("id, name, region, description").order("name");
		if (error) throw error;
		return data;
	}
});
var commoditiesQuery = queryOptions({
	queryKey: ["commodities"],
	queryFn: async () => {
		const { data, error } = await supabase.from("commodities").select("id, name, category, unit_of_measure").order("name");
		if (error) throw error;
		return data;
	}
});
//#endregion
export { marketsQuery as n, commoditiesQuery as t };
