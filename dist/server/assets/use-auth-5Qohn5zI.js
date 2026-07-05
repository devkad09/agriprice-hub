import { useEffect, useState } from "react";
//#region src/lib/use-auth.ts
var AUTH_TOKEN_KEY = "AGRIFARM_AUTH_TOKEN";
function useAuth() {
	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	async function loadProfile(token) {
		try {
			const response = await fetch("/api/auth/profile", { headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			} });
			if (!response.ok) {
				localStorage.removeItem(AUTH_TOKEN_KEY);
				setSession(null);
				setUser(null);
				return;
			}
			const json = await response.json();
			setSession({
				access_token: token,
				user: json.data
			});
			setUser(json.data);
		} catch (error) {
			console.error("Failed to load auth profile", error);
			localStorage.removeItem(AUTH_TOKEN_KEY);
			setSession(null);
			setUser(null);
		}
	}
	useEffect(() => {
		const token = localStorage.getItem(AUTH_TOKEN_KEY);
		if (!token) {
			setLoading(false);
			return;
		}
		loadProfile(token).finally(() => setLoading(false));
	}, []);
	const signOut = () => {
		localStorage.removeItem(AUTH_TOKEN_KEY);
		setSession(null);
		setUser(null);
	};
	return {
		session,
		user,
		loading,
		signOut
	};
}
//#endregion
export { useAuth as n, AUTH_TOKEN_KEY as t };
