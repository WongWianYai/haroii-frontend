import { API_URL, API_BASE_PATH } from "@/config";
import { MenuItem, MeResponse, Restaurant, Owner } from "@/types";

class ApiClient {
    private baseUrl: string;
    private apiBasePath: string;

    constructor(baseUrl: string, apiBasePath: string) {
        this.baseUrl = baseUrl;
        this.apiBasePath = apiBasePath;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${this.apiBasePath}${endpoint}`;
        const config: RequestInit = {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Auth endpoints
    async getMe(): Promise<MeResponse> {
        return this.request<MeResponse>("/auth/me");
    }

    async updateOwner(owner: Owner): Promise<Owner> {
        return this.request<Owner>("/auth/me", {
            method: "PUT",
            body: JSON.stringify(owner),
        });
    }

    async updateRestaurant(restaurant: Restaurant): Promise<Restaurant> {
        return this.request<Restaurant>("/auth/restaurant/me", {
            method: "PUT",
            body: JSON.stringify(restaurant),
        });
    }

    // Menu endpoints
    async getMenuItems(): Promise<MenuItem[]> {
        return this.request<MenuItem[]>("/menu");
    }

    async createMenuItem(formData: FormData): Promise<MenuItem> {
        return fetch(`${this.baseUrl}${this.apiBasePath}/menu`, {
            method: "POST",
            body: formData,
            credentials: "include",
        }).then(res => {
            if (!res.ok) throw new Error("Failed to create menu item");
            return res.json();
        });
    }

    async updateMenuItem(id: string, formData: FormData): Promise<MenuItem> {
        return fetch(`${this.baseUrl}${this.apiBasePath}/menu/${id}`, {
            method: "PUT",
            body: formData,
            credentials: "include",
        }).then(res => {
            if (!res.ok) throw new Error("Failed to update menu item");
            return res.json();
        });
    }

    async deleteMenuItem(id: string): Promise<void> {
        return this.request<void>(`/menu/${id}`, {
            method: "DELETE",
        });
    }
}

export const apiClient = new ApiClient(API_URL, API_BASE_PATH);