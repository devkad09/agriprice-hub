import { t as mockSupabase } from "./mock-client-BgqKkggR.js";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
//#region src/integrations/supabase/client.ts
function createSupabaseClient() {
	const SUPABASE_URL = "https://fbrcnxwypiccqazgyxbz.supabase.co";
	const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicmNueHd5cGljY3Fhemd5eGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODQ4NTgsImV4cCI6MjA5NzU2MDg1OH0.3DQaW5GBBgRFPCSZsBiyudZFYOPLL0pAbyVQ1mY9DRo";
	if (SUPABASE_URL.includes("your-project") || SUPABASE_URL.includes("fbrcnxwypiccqazgyxbz") || false) {
		if (typeof window !== "undefined") {
			console.log("[Supabase] Unreachable or default Supabase project configured. Falling back to local Mock Client.");
			setTimeout(() => {
				try {
					toast.info("Offline Demo Mode Active", {
						description: "Using mock local database. Log in as farmer@agrifarm.com, officer@agrifarm.com, or admin@agrifarm.com (password: password123).",
						duration: 8e3
					});
				} catch (e) {}
			}, 1e3);
		}
		return mockSupabase;
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
