//#region src/integrations/supabase/mock-client.ts
var MOCK_MARKETS = [
	{
		id: "da000000-0000-0000-0000-000000000001",
		name: "Makola Market",
		region: "Greater Accra",
		description: "Largest open-air market in Accra"
	},
	{
		id: "da000000-0000-0000-0000-000000000002",
		name: "Kumasi Central Market",
		region: "Ashanti",
		description: "Central trading hub in Kumasi"
	},
	{
		id: "da000000-0000-0000-0000-000000000003",
		name: "Kejetia Market",
		region: "Ashanti",
		description: "One of the largest markets in West Africa"
	},
	{
		id: "da000000-0000-0000-0000-000000000004",
		name: "Techiman Market",
		region: "Bono East",
		description: "Major agricultural produce market in central Ghana"
	},
	{
		id: "da000000-0000-0000-0000-000000000005",
		name: "Tamale Market",
		region: "Northern",
		description: "Principal market serving northern Ghana"
	}
];
var MOCK_COMMODITIES = [
	{
		id: "c0000000-0000-0000-0000-000000000001",
		name: "Tomatoes",
		category: "Vegetable",
		unit_of_measure: "crate"
	},
	{
		id: "c0000000-0000-0000-0000-000000000002",
		name: "Onions",
		category: "Vegetable",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000003",
		name: "Pepper",
		category: "Vegetable",
		unit_of_measure: "bag (50kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000004",
		name: "Garden Eggs",
		category: "Vegetable",
		unit_of_measure: "crate"
	},
	{
		id: "c0000000-0000-0000-0000-000000000005",
		name: "Okra",
		category: "Vegetable",
		unit_of_measure: "bag (50kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000006",
		name: "Yam",
		category: "Tuber",
		unit_of_measure: "tuber"
	},
	{
		id: "c0000000-0000-0000-0000-000000000007",
		name: "Cassava",
		category: "Tuber",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000008",
		name: "Cocoyam",
		category: "Tuber",
		unit_of_measure: "bag (50kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000009",
		name: "Sweet Potato",
		category: "Tuber",
		unit_of_measure: "bag (50kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000010",
		name: "Plantain",
		category: "Fruit",
		unit_of_measure: "bunch"
	},
	{
		id: "c0000000-0000-0000-0000-000000000011",
		name: "Maize",
		category: "Cereal",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000012",
		name: "Rice",
		category: "Cereal",
		unit_of_measure: "bag (50kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000013",
		name: "Millet",
		category: "Cereal",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000014",
		name: "Sorghum",
		category: "Cereal",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000015",
		name: "Groundnuts",
		category: "Legume",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000016",
		name: "Cowpea",
		category: "Legume",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000017",
		name: "Soybeans",
		category: "Legume",
		unit_of_measure: "bag (100kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000018",
		name: "Watermelon",
		category: "Fruit",
		unit_of_measure: "piece"
	},
	{
		id: "c0000000-0000-0000-0000-000000000019",
		name: "Orange",
		category: "Fruit",
		unit_of_measure: "bag (50kg)"
	},
	{
		id: "c0000000-0000-0000-0000-000000000020",
		name: "Pineapple",
		category: "Fruit",
		unit_of_measure: "piece"
	}
];
function generateHistoricalPrices() {
	const prices = [];
	const basePrices = {
		"c0000000-0000-0000-0000-000000000001": 600,
		"c0000000-0000-0000-0000-000000000002": 800,
		"c0000000-0000-0000-0000-000000000003": 400,
		"c0000000-0000-0000-0000-000000000004": 300,
		"c0000000-0000-0000-0000-000000000005": 250,
		"c0000000-0000-0000-0000-000000000006": 30,
		"c0000000-0000-0000-0000-000000000007": 150,
		"c0000000-0000-0000-0000-000000000008": 200,
		"c0000000-0000-0000-0000-000000000009": 180,
		"c0000000-0000-0000-0000-000000000010": 50,
		"c0000000-0000-0000-0000-000000000011": 450,
		"c0000000-0000-0000-0000-000000000012": 500,
		"c0000000-0000-0000-0000-000000000013": 350,
		"c0000000-0000-0000-0000-000000000014": 300,
		"c0000000-0000-0000-0000-000000000015": 650,
		"c0000000-0000-0000-0000-000000000016": 550,
		"c0000000-0000-0000-0000-000000000017": 400,
		"c0000000-0000-0000-0000-000000000018": 25,
		"c0000000-0000-0000-0000-000000000019": 120,
		"c0000000-0000-0000-0000-000000000020": 15
	};
	const marketMultipliers = {
		"da000000-0000-0000-0000-000000000001": 1.15,
		"da000000-0000-0000-0000-000000000002": 1.05,
		"da000000-0000-0000-0000-000000000003": 1.04,
		"da000000-0000-0000-0000-000000000004": .85,
		"da000000-0000-0000-0000-000000000005": .9
	};
	const today = /* @__PURE__ */ new Date();
	for (let d = 30; d >= 0; d--) {
		const date = new Date(today);
		date.setDate(today.getDate() - d);
		const dateStr = date.toISOString().slice(0, 10);
		for (const market of MOCK_MARKETS) for (const commodity of MOCK_COMMODITIES) {
			const base = basePrices[commodity.id] ?? 100;
			const mult = marketMultipliers[market.id] ?? 1;
			const seed = parseInt(market.id.slice(-2), 16) + parseInt(commodity.id.slice(-2), 16) + d;
			const fluctuation = Math.sin(seed * .5) * .08 + Math.cos(seed * .2) * .04;
			const finalPrice = Math.round(base * mult * (1 + fluctuation) * 100) / 100;
			prices.push({
				id: `p-${market.id.slice(-4)}-${commodity.id.slice(-4)}-${dateStr}`,
				market_id: market.id,
				commodity_id: commodity.id,
				price_ghs: finalPrice,
				date_recorded: dateStr,
				created_at: new Date(date.getTime() + 480 * 60 * 1e3).toISOString()
			});
		}
	}
	return prices;
}
var GLOBAL_STORE_KEY = "AGRIFARM_MOCK_DB";
function createInitialState() {
	return {
		markets: MOCK_MARKETS,
		commodities: MOCK_COMMODITIES,
		profiles: [
			{
				id: "a0000000-0000-0000-0000-000000000001",
				full_name: "System Administrator",
				phone: "+233240000001",
				region: "Greater Accra",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			},
			{
				id: "a0000000-0000-0000-0000-000000000002",
				full_name: "MoFA Data Officer",
				phone: "+233240000002",
				region: "Bono East",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			},
			{
				id: "a0000000-0000-0000-0000-000000000003",
				full_name: "Kofi Mensah",
				phone: "+233240000003",
				region: "Ashanti",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}
		],
		user_roles: [
			{
				id: "ur1",
				user_id: "a0000000-0000-0000-0000-000000000001",
				role: "admin",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			},
			{
				id: "ur2",
				user_id: "a0000000-0000-0000-0000-000000000002",
				role: "data_officer",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			},
			{
				id: "ur3",
				user_id: "a0000000-0000-0000-0000-000000000003",
				role: "farmer",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}
		],
		prices: generateHistoricalPrices(),
		sms_subscriptions: [],
		audit_log: [],
		session: null
	};
}
function getMockDb() {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem(GLOBAL_STORE_KEY);
		if (stored) try {
			return JSON.parse(stored);
		} catch {}
		const initial = createInitialState();
		localStorage.setItem(GLOBAL_STORE_KEY, JSON.stringify(initial));
		return initial;
	} else {
		const globalObj = globalThis;
		if (!globalObj[GLOBAL_STORE_KEY]) globalObj[GLOBAL_STORE_KEY] = createInitialState();
		return globalObj[GLOBAL_STORE_KEY];
	}
}
function saveMockDb(state) {
	if (typeof window !== "undefined") localStorage.setItem(GLOBAL_STORE_KEY, JSON.stringify(state));
	else {
		const globalObj = globalThis;
		globalObj[GLOBAL_STORE_KEY] = state;
	}
}
var MockQueryBuilder = class {
	table;
	filters = [];
	orderCol = null;
	orderAscending = true;
	limitCount = null;
	isSingle = false;
	isCount = false;
	insertData = null;
	updateData = null;
	isDelete = false;
	constructor(table) {
		this.table = table;
	}
	select(columns = "*", options) {
		if (options?.count) this.isCount = true;
		return this;
	}
	eq(column, value) {
		this.filters.push((item) => item[column] === value);
		return this;
	}
	neq(column, value) {
		this.filters.push((item) => item[column] !== value);
		return this;
	}
	gte(column, value) {
		this.filters.push((item) => item[column] >= value);
		return this;
	}
	lte(column, value) {
		this.filters.push((item) => item[column] <= value);
		return this;
	}
	order(column, options) {
		this.orderCol = column;
		this.orderAscending = options?.ascending ?? true;
		return this;
	}
	limit(count) {
		this.limitCount = count;
		return this;
	}
	single() {
		this.isSingle = true;
		return this;
	}
	insert(data) {
		this.insertData = data;
		return this;
	}
	update(data) {
		this.updateData = data;
		return this;
	}
	delete() {
		this.isDelete = true;
		return this;
	}
	async then(onfulfilled, onrejected) {
		try {
			const res = await this.execute();
			return onfulfilled ? onfulfilled(res) : res;
		} catch (err) {
			if (onrejected) return onrejected(err);
			throw err;
		}
	}
	async execute() {
		const db = getMockDb();
		const tableData = db[this.table];
		if (!tableData) return {
			data: null,
			error: { message: `Table ${this.table} not found in mock DB` }
		};
		if (this.insertData) {
			const newItems = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
			const inserted = [];
			for (const item of newItems) {
				const newItem = {
					id: item.id || `gen-${Math.random().toString(36).substring(2, 9)}`,
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					...item
				};
				tableData.push(newItem);
				inserted.push(newItem);
			}
			saveMockDb(db);
			return {
				data: this.isSingle ? inserted[0] : inserted,
				error: null
			};
		}
		if (this.updateData) {
			const updated = [];
			const updatedTable = tableData.map((item) => {
				if (this.filters.every((f) => f(item))) {
					const newItem = {
						...item,
						...this.updateData,
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					updated.push(newItem);
					return newItem;
				}
				return item;
			});
			db[this.table] = updatedTable;
			saveMockDb(db);
			return {
				data: this.isSingle ? updated[0] : updated,
				error: null
			};
		}
		if (this.isDelete) {
			const remaining = [];
			const deleted = [];
			for (const item of tableData) if (this.filters.every((f) => f(item))) deleted.push(item);
			else remaining.push(item);
			db[this.table] = remaining;
			saveMockDb(db);
			return {
				data: this.isSingle ? deleted[0] : deleted,
				error: null
			};
		}
		let result = [...tableData];
		for (const filter of this.filters) result = result.filter(filter);
		if (this.orderCol) {
			const col = this.orderCol;
			const asc = this.orderAscending;
			result.sort((a, b) => {
				let valA = a[col];
				let valB = b[col];
				if (typeof valA === "string") return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
				return asc ? (valA ?? 0) - (valB ?? 0) : (valB ?? 0) - (valA ?? 0);
			});
		}
		if (this.limitCount !== null) result = result.slice(0, this.limitCount);
		result = result.map((item) => {
			const cloned = { ...item };
			if ("commodity_id" in cloned) cloned.commodity = db.commodities.find((c) => c.id === cloned.commodity_id) || null;
			if ("market_id" in cloned) cloned.market = db.markets.find((m) => m.id === cloned.market_id) || null;
			if (this.table === "user_roles" || this.table === "sms_subscriptions") cloned.profile = db.profiles.find((p) => p.id === cloned.user_id) || null;
			return cloned;
		});
		if (this.isCount) return {
			count: result.length,
			data: this.isSingle ? result[0] : result,
			error: null
		};
		return {
			data: this.isSingle ? result[0] || null : result,
			error: null
		};
	}
};
var mockSupabase = {
	from(table) {
		return new MockQueryBuilder(table);
	},
	async rpc(fn, args) {
		const db = getMockDb();
		if (fn === "has_role") {
			const { _user_id, _role } = args;
			return {
				data: db.user_roles.some((ur) => ur.user_id === _user_id && ur.role === _role),
				error: null
			};
		}
		return {
			data: null,
			error: { message: `RPC ${fn} not implemented in mock client` }
		};
	},
	auth: {
		async getSession() {
			return {
				data: { session: getMockDb().session },
				error: null
			};
		},
		async signInWithPassword(credentials) {
			const db = getMockDb();
			const email = credentials.email.toLowerCase();
			const profile = db.profiles.find((p) => {
				if (email.includes("admin") && p.full_name.includes("Admin")) return true;
				if (email.includes("officer") && p.full_name.includes("Officer")) return true;
				if (email.includes("farmer") && p.full_name.includes("Kofi")) return true;
				return false;
			});
			if (!profile) return {
				data: { user: null },
				error: { message: "Invalid login credentials for mock mode." }
			};
			const mockSession = {
				user: {
					id: profile.id,
					email,
					user_metadata: {
						full_name: profile.full_name,
						phone: profile.phone,
						region: profile.region
					}
				},
				access_token: `mock-token-${profile.id}`
			};
			db.session = mockSession;
			saveMockDb(db);
			this._notifyListeners("SIGNED_IN", mockSession);
			return {
				data: mockSession,
				error: null
			};
		},
		async signUp(credentials) {
			const db = getMockDb();
			const email = credentials.email.toLowerCase();
			if (db.profiles.find((p) => p.phone === (credentials.options?.data?.phone || ""))) return {
				data: { user: null },
				error: { message: "User already exists" }
			};
			const newUserId = `u-${Math.random().toString(36).substring(2, 9)}`;
			const fullName = credentials.options?.data?.full_name || "New Farmer";
			const phone = credentials.options?.data?.phone || "+233200000000";
			const region = credentials.options?.data?.region || "Ashanti";
			const requestedRole = credentials.options?.data?.role || "farmer";
			const newProfile = {
				id: newUserId,
				full_name: fullName,
				phone,
				region,
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const newRole = {
				id: `ur-${Math.random().toString(36).substring(2, 9)}`,
				user_id: newUserId,
				role: requestedRole,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			db.profiles.push(newProfile);
			db.user_roles.push(newRole);
			const mockSession = {
				user: {
					id: newUserId,
					email,
					user_metadata: {
						full_name: fullName,
						phone,
						region
					}
				},
				access_token: `mock-token-${newUserId}`
			};
			db.session = mockSession;
			saveMockDb(db);
			this._notifyListeners("SIGNED_IN", mockSession);
			return {
				data: mockSession,
				error: null
			};
		},
		async signOut() {
			const db = getMockDb();
			db.session = null;
			saveMockDb(db);
			this._notifyListeners("SIGNED_OUT", null);
			return { error: null };
		},
		async signInWithOAuth(options) {
			console.log("OAuth signin requested with options:", options);
			return this.signInWithPassword({ email: "farmer@agrifarm.com" });
		},
		_listeners: [],
		onAuthStateChange(callback) {
			this._listeners.push(callback);
			const db = getMockDb();
			setTimeout(() => callback("INITIAL_SESSION", db.session), 0);
			return { data: { subscription: { unsubscribe: () => {
				this._listeners = this._listeners.filter((l) => l !== callback);
			} } } };
		},
		_notifyListeners(event, session) {
			for (const listener of this._listeners) try {
				listener(event, session);
			} catch (e) {
				console.error("Error in onAuthStateChange listener:", e);
			}
		},
		async getClaims(token) {
			const db = getMockDb();
			const userId = token.replace("mock-token-", "");
			const profile = db.profiles.find((p) => p.id === userId);
			const roleRow = db.user_roles.find((ur) => ur.user_id === userId);
			if (!profile || !roleRow) return {
				data: null,
				error: { message: "Invalid session token" }
			};
			return {
				data: { claims: {
					sub: userId,
					email: `${roleRow.role}@agrifarm.com`,
					role: roleRow.role,
					user_metadata: {
						full_name: profile.full_name,
						phone: profile.phone,
						region: profile.region
					}
				} },
				error: null
			};
		}
	}
};
//#endregion
export { mockSupabase as t };
