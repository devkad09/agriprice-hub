import { createClient } from "@supabase/supabase-js";

// Valid mock UUIDs
export const MOCK_MARKETS = [
  { id: "da000000-0000-0000-0000-000000000001", name: "Makola Market", region: "Greater Accra", description: "Largest open-air market in Accra" },
  { id: "da000000-0000-0000-0000-000000000002", name: "Kumasi Central Market", region: "Ashanti", description: "Central trading hub in Kumasi" },
  { id: "da000000-0000-0000-0000-000000000003", name: "Kejetia Market", region: "Ashanti", description: "One of the largest markets in West Africa" },
  { id: "da000000-0000-0000-0000-000000000004", name: "Techiman Market", region: "Bono East", description: "Major agricultural produce market in central Ghana" },
  { id: "da000000-0000-0000-0000-000000000005", name: "Tamale Market", region: "Northern", description: "Principal market serving northern Ghana" },
];

export const MOCK_COMMODITIES = [
  { id: "c0000000-0000-0000-0000-000000000001", name: "Tomatoes", category: "Vegetable", unit_of_measure: "crate" },
  { id: "c0000000-0000-0000-0000-000000000002", name: "Onions", category: "Vegetable", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000003", name: "Pepper", category: "Vegetable", unit_of_measure: "bag (50kg)" },
  { id: "c0000000-0000-0000-0000-000000000004", name: "Garden Eggs", category: "Vegetable", unit_of_measure: "crate" },
  { id: "c0000000-0000-0000-0000-000000000005", name: "Okra", category: "Vegetable", unit_of_measure: "bag (50kg)" },
  { id: "c0000000-0000-0000-0000-000000000006", name: "Yam", category: "Tuber", unit_of_measure: "tuber" },
  { id: "c0000000-0000-0000-0000-000000000007", name: "Cassava", category: "Tuber", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000008", name: "Cocoyam", category: "Tuber", unit_of_measure: "bag (50kg)" },
  { id: "c0000000-0000-0000-0000-000000000009", name: "Sweet Potato", category: "Tuber", unit_of_measure: "bag (50kg)" },
  { id: "c0000000-0000-0000-0000-000000000010", name: "Plantain", category: "Fruit", unit_of_measure: "bunch" },
  { id: "c0000000-0000-0000-0000-000000000011", name: "Maize", category: "Cereal", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000012", name: "Rice", category: "Cereal", unit_of_measure: "bag (50kg)" },
  { id: "c0000000-0000-0000-0000-000000000013", name: "Millet", category: "Cereal", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000014", name: "Sorghum", category: "Cereal", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000015", name: "Groundnuts", category: "Legume", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000016", name: "Cowpea", category: "Legume", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000017", name: "Soybeans", category: "Legume", unit_of_measure: "bag (100kg)" },
  { id: "c0000000-0000-0000-0000-000000000018", name: "Watermelon", category: "Fruit", unit_of_measure: "piece" },
  { id: "c0000000-0000-0000-0000-000000000019", name: "Orange", category: "Fruit", unit_of_measure: "bag (50kg)" },
  { id: "c0000000-0000-0000-0000-000000000020", name: "Pineapple", category: "Fruit", unit_of_measure: "piece" },
];

export interface MockProfile {
  id: string;
  full_name: string;
  phone: string;
  region: string;
  created_at: string;
  updated_at: string;
}

export interface MockUserRole {
  id: string;
  user_id: string;
  role: "farmer" | "data_officer" | "admin";
  created_at: string;
}

export interface MockPrice {
  id: string;
  commodity_id: string;
  market_id: string;
  price_ghs: number;
  date_recorded: string;
  recorded_by?: string;
  created_at: string;
}

export interface MockSmsSubscription {
  id: string;
  user_id: string;
  commodity_id: string;
  frequency: "daily" | "weekly";
  active: boolean;
  created_at: string;
}

export interface MockAuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  details?: any;
  created_at: string;
}

export interface MockDbState {
  markets: typeof MOCK_MARKETS;
  commodities: typeof MOCK_COMMODITIES;
  profiles: MockProfile[];
  user_roles: MockUserRole[];
  prices: MockPrice[];
  sms_subscriptions: MockSmsSubscription[];
  audit_log: MockAuditLog[];
  session: {
    user: {
      id: string;
      email: string;
      user_metadata: {
        full_name: string;
        phone: string;
        region: string;
      };
    };
    access_token: string;
  } | null;
}

// Generate last 30 days price history for Ghanaian markets
function generateHistoricalPrices() {
  const prices: MockPrice[] = [];
  const basePrices: Record<string, number> = {
    "c0000000-0000-0000-0000-000000000001": 600, // Tomatoes
    "c0000000-0000-0000-0000-000000000002": 800, // Onions
    "c0000000-0000-0000-0000-000000000003": 400, // Pepper
    "c0000000-0000-0000-0000-000000000004": 300, // Garden Eggs
    "c0000000-0000-0000-0000-000000000005": 250, // Okra
    "c0000000-0000-0000-0000-000000000006": 30,  // Yam
    "c0000000-0000-0000-0000-000000000007": 150, // Cassava
    "c0000000-0000-0000-0000-000000000008": 200, // Cocoyam
    "c0000000-0000-0000-0000-000000000009": 180, // Sweet Potato
    "c0000000-0000-0000-0000-000000000010": 50,  // Plantain
    "c0000000-0000-0000-0000-000000000011": 450, // Maize
    "c0000000-0000-0000-0000-000000000012": 500, // Rice
    "c0000000-0000-0000-0000-000000000013": 350, // Millet
    "c0000000-0000-0000-0000-000000000014": 300, // Sorghum
    "c0000000-0000-0000-0000-000000000015": 650, // Groundnuts
    "c0000000-0000-0000-0000-000000000016": 550, // Cowpea
    "c0000000-0000-0000-0000-000000000017": 400, // Soybeans
    "c0000000-0000-0000-0000-000000000018": 25,  // Watermelon
    "c0000000-0000-0000-0000-000000000019": 120, // Orange
    "c0000000-0000-0000-0000-000000000020": 15,  // Pineapple
  };

  const marketMultipliers: Record<string, number> = {
    "da000000-0000-0000-0000-000000000001": 1.15, // Makola
    "da000000-0000-0000-0000-000000000002": 1.05, // Kumasi
    "da000000-0000-0000-0000-000000000003": 1.04, // Kejetia
    "da000000-0000-0000-0000-000000000004": 0.85, // Techiman (source hub)
    "da000000-0000-0000-0000-000000000005": 0.90, // Tamale
  };

  const today = new Date();
  for (let d = 30; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);

    for (const market of MOCK_MARKETS) {
      for (const commodity of MOCK_COMMODITIES) {
        const base = basePrices[commodity.id] ?? 100;
        const mult = marketMultipliers[market.id] ?? 1.0;
        
        // Add pseudo-random fluctuation based on date and IDs
        const seed = parseInt(market.id.slice(-2), 16) + parseInt(commodity.id.slice(-2), 16) + d;
        const fluctuation = Math.sin(seed * 0.5) * 0.08 + Math.cos(seed * 0.2) * 0.04;
        
        const finalPrice = Math.round(base * mult * (1 + fluctuation) * 100) / 100;

        prices.push({
          id: `p-${market.id.slice(-4)}-${commodity.id.slice(-4)}-${dateStr}`,
          market_id: market.id,
          commodity_id: commodity.id,
          price_ghs: finalPrice,
          date_recorded: dateStr,
          created_at: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 AM
        });
      }
    }
  }
  return prices;
}

// Global server/client store key
const GLOBAL_STORE_KEY = "AGRIFARM_MOCK_DB";

function createInitialState(): MockDbState {
  return {
    markets: MOCK_MARKETS,
    commodities: MOCK_COMMODITIES,
    profiles: [
      { id: "a0000000-0000-0000-0000-000000000001", full_name: "System Administrator", phone: "+233240000001", region: "Greater Accra", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "a0000000-0000-0000-0000-000000000002", full_name: "MoFA Data Officer", phone: "+233240000002", region: "Bono East", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "a0000000-0000-0000-0000-000000000003", full_name: "Kofi Mensah", phone: "+233240000003", region: "Ashanti", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ],
    user_roles: [
      { id: "ur1", user_id: "a0000000-0000-0000-0000-000000000001", role: "admin", created_at: new Date().toISOString() },
      { id: "ur2", user_id: "a0000000-0000-0000-0000-000000000002", role: "data_officer", created_at: new Date().toISOString() },
      { id: "ur3", user_id: "a0000000-0000-0000-0000-000000000003", role: "farmer", created_at: new Date().toISOString() },
    ],
    prices: generateHistoricalPrices(),
    sms_subscriptions: [],
    audit_log: [],
    session: null,
  };
}

export function getMockDb(): MockDbState {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(GLOBAL_STORE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback if JSON parse fails
      }
    }
    const initial = createInitialState();
    localStorage.setItem(GLOBAL_STORE_KEY, JSON.stringify(initial));
    return initial;
  } else {
    // SSR / Server node process
    const globalObj = globalThis as any;
    if (!globalObj[GLOBAL_STORE_KEY]) {
      globalObj[GLOBAL_STORE_KEY] = createInitialState();
    }
    return globalObj[GLOBAL_STORE_KEY];
  }
}

export function saveMockDb(state: MockDbState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(GLOBAL_STORE_KEY, JSON.stringify(state));
  } else {
    const globalObj = globalThis as any;
    globalObj[GLOBAL_STORE_KEY] = state;
  }
}

class MockQueryBuilder {
  private table: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderCol: string | null = null;
  private orderAscending = true;
  private limitCount: number | null = null;
  private isSingle = false;
  private isCount = false;

  private insertData: any = null;
  private updateData: any = null;
  private isDelete = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns = "*", options?: { count?: string; head?: boolean }) {
    if (options?.count) {
      this.isCount = true;
    }
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push((item) => item[column] >= value);
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push((item) => item[column] <= value);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(data: any) {
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.updateData = data;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const res = await this.execute();
      return onfulfilled ? onfulfilled(res) : res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute() {
    const db = getMockDb();
    const tableData = db[this.table as keyof MockDbState] as any[];
    if (!tableData) {
      return { data: null, error: { message: `Table ${this.table} not found in mock DB` } };
    }

    // Handlers for mutations
    if (this.insertData) {
      const newItems = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const inserted: any[] = [];
      for (const item of newItems) {
        const newItem = {
          id: item.id || `gen-${Math.random().toString(36).substring(2, 9)}`,
          created_at: new Date().toISOString(),
          ...item,
        };
        tableData.push(newItem);
        inserted.push(newItem);
      }
      saveMockDb(db);
      return { data: this.isSingle ? inserted[0] : inserted, error: null };
    }

    if (this.updateData) {
      // Find items matching filters
      const updated: any[] = [];
      const updatedTable = tableData.map((item) => {
        const matches = this.filters.every((f) => f(item));
        if (matches) {
          const newItem = { ...item, ...this.updateData, updated_at: new Date().toISOString() };
          updated.push(newItem);
          return newItem;
        }
        return item;
      });
      (db as any)[this.table] = updatedTable;
      saveMockDb(db);
      return { data: this.isSingle ? updated[0] : updated, error: null };
    }

    if (this.isDelete) {
      const remaining: any[] = [];
      const deleted: any[] = [];
      for (const item of tableData) {
        const matches = this.filters.every((f) => f(item));
        if (matches) {
          deleted.push(item);
        } else {
          remaining.push(item);
        }
      }
      (db as any)[this.table] = remaining;
      saveMockDb(db);
      return { data: this.isSingle ? deleted[0] : deleted, error: null };
    }

    // Read Query
    let result = [...tableData];

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sorting
    if (this.orderCol) {
      const col = this.orderCol;
      const asc = this.orderAscending;
      result.sort((a, b) => {
        let valA = a[col];
        let valB = b[col];
        if (typeof valA === "string") {
          return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return asc ? (valA ?? 0) - (valB ?? 0) : (valB ?? 0) - (valA ?? 0);
      });
    }

    // Apply limit
    if (this.limitCount !== null) {
      result = result.slice(0, this.limitCount);
    }

    // Resolve nested relationships
    // e.g. commodity:commodities(...) or market:markets(...)
    result = result.map((item) => {
      const cloned = { ...item };
      
      // Resolve commodity relation
      if ("commodity_id" in cloned) {
        cloned.commodity = db.commodities.find((c) => c.id === cloned.commodity_id) || null;
      }
      // Resolve market relation
      if ("market_id" in cloned) {
        cloned.market = db.markets.find((m) => m.id === cloned.market_id) || null;
      }
      // Resolve profile relation
      if (this.table === "user_roles" || this.table === "sms_subscriptions") {
        cloned.profile = db.profiles.find((p) => p.id === cloned.user_id) || null;
      }

      return cloned;
    });

    if (this.isCount) {
      return { count: result.length, data: this.isSingle ? result[0] : result, error: null };
    }

    return { data: this.isSingle ? (result[0] || null) : result, error: null };
  }
}

export const mockSupabase = {
  from(table: string) {
    return new MockQueryBuilder(table);
  },

  async rpc(fn: string, args: any) {
    const db = getMockDb();
    if (fn === "has_role") {
      const { _user_id, _role } = args;
      const hasRole = db.user_roles.some((ur) => ur.user_id === _user_id && ur.role === _role);
      return { data: hasRole, error: null };
    }
    return { data: null, error: { message: `RPC ${fn} not implemented in mock client` } };
  },

  auth: {
    async getSession() {
      const db = getMockDb();
      return { data: { session: db.session }, error: null };
    },

    async signInWithPassword(credentials: { email: string; password?: string }) {
      const db = getMockDb();
      const email = credentials.email.toLowerCase();
      // Map mock emails to mock profiles
      const profile = db.profiles.find((p) => {
        if (email.includes("admin") && p.full_name.includes("Admin")) return true;
        if (email.includes("officer") && p.full_name.includes("Officer")) return true;
        if (email.includes("farmer") && p.full_name.includes("Kofi")) return true;
        return false;
      });

      if (!profile) {
        return { data: { user: null }, error: { message: "Invalid login credentials for mock mode." } };
      }

      const mockSession = {
        user: {
          id: profile.id,
          email,
          user_metadata: {
            full_name: profile.full_name,
            phone: profile.phone,
            region: profile.region,
          },
        },
        access_token: `mock-token-${profile.id}`,
      };

      db.session = mockSession;
      saveMockDb(db);
      this._notifyListeners("SIGNED_IN", mockSession);
      return { data: mockSession, error: null };
    },

    async signUp(credentials: { email: string; password?: string; options?: any }) {
      const db = getMockDb();
      const email = credentials.email.toLowerCase();
      
      // Check if user already exists
      const existing = db.profiles.find((p) => p.phone === (credentials.options?.data?.phone || ""));
      if (existing) {
        return { data: { user: null }, error: { message: "User already exists" } };
      }

      const newUserId = `u-${Math.random().toString(36).substring(2, 9)}`;
      const fullName = credentials.options?.data?.full_name || "New Farmer";
      const phone = credentials.options?.data?.phone || "+233200000000";
      const region = credentials.options?.data?.region || "Ashanti";
      const requestedRole = credentials.options?.data?.role || "farmer";

      const newProfile: MockProfile = {
        id: newUserId,
        full_name: fullName,
        phone,
        region,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const newRole: MockUserRole = {
        id: `ur-${Math.random().toString(36).substring(2, 9)}`,
        user_id: newUserId,
        role: requestedRole,
        created_at: new Date().toISOString(),
      };

      db.profiles.push(newProfile);
      db.user_roles.push(newRole);

      const mockSession = {
        user: {
          id: newUserId,
          email,
          user_metadata: {
            full_name: fullName,
            phone: phone,
            region: region,
          },
        },
        access_token: `mock-token-${newUserId}`,
      };

      db.session = mockSession;
      saveMockDb(db);
      this._notifyListeners("SIGNED_IN", mockSession);
      return { data: mockSession, error: null };
    },

    async signOut() {
      const db = getMockDb();
      db.session = null;
      saveMockDb(db);
      this._notifyListeners("SIGNED_OUT", null);
      return { error: null };
    },

    async signInWithOAuth(options: any) {
      console.log("OAuth signin requested with options:", options);
      // Automatically log in as Kofi (Farmer) for mock OAuth
      return this.signInWithPassword({ email: "farmer@agrifarm.com" });
    },

    // Custom event listeners management
    _listeners: [] as Array<(event: string, session: any) => void>,
    onAuthStateChange(callback: (event: string, session: any) => void) {
      this._listeners.push(callback);
      // Immediately call with current session
      const db = getMockDb();
      setTimeout(() => callback("INITIAL_SESSION", db.session), 0);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this._listeners = this._listeners.filter((l) => l !== callback);
            },
          },
        },
      };
    },

    _notifyListeners(event: string, session: any) {
      for (const listener of this._listeners) {
        try {
          listener(event, session);
        } catch (e) {
          console.error("Error in onAuthStateChange listener:", e);
        }
      }
    },

    // Used in auth-middleware on the server side
    async getClaims(token: string) {
      const db = getMockDb();
      const userId = token.replace("mock-token-", "");
      const profile = db.profiles.find((p) => p.id === userId);
      const roleRow = db.user_roles.find((ur) => ur.user_id === userId);
      
      if (!profile || !roleRow) {
        return { data: null, error: { message: "Invalid session token" } };
      }

      return {
        data: {
          claims: {
            sub: userId,
            email: `${roleRow.role}@agrifarm.com`,
            role: roleRow.role,
            user_metadata: {
              full_name: profile.full_name,
              phone: profile.phone,
              region: profile.region,
            },
          },
        },
        error: null,
      };
    },
  },
};
