import { API_URL, API_BASE_PATH } from "@/config";
import { LoginFormData, RegisterFormData } from "./auth-validation";
import { AUTH_ERROR_MESSAGES } from "@/constants/auth-messages";

// API request/response types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    restaurant: {
        id: string;
        name: string;
        slug: string;
        type: string;
        address?: string;
        phone?: string;
        openTime: string;
        closeTime: string;
    };
    token: string;
}

export interface RegisterRequest {
    owner: {
        name: string;
        email: string;
        phone: string;
        password: string;
    };
    restaurant: {
        name: string;
        type: string;
        address: string;
    };
}

export interface RegisterResponse {
    message: string;
    userId: string;
    restaurantId: string;
}

class AuthApiClient {
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

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new AuthError(
                    errorData.code || 'server-error',
                    errorData.message || AUTH_ERROR_MESSAGES['server-error'],
                    response.status
                );
            }

            return response.json();
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }

            // Network or other errors
            throw new AuthError(
                'network-error',
                AUTH_ERROR_MESSAGES['network-error'],
                0
            );
        }
    }

    async login(data: LoginFormData): Promise<LoginResponse> {
        const request: LoginRequest = {
            email: data.email,
            password: data.password,
        };

        return this.request<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(request),
        });
    }

    async register(data: RegisterFormData): Promise<RegisterResponse> {
        const request: RegisterRequest = {
            owner: {
                name: data.ownerName,
                email: data.email,
                phone: data.phone,
                password: data.password,
            },
            restaurant: {
                name: data.restaurantName,
                type: data.restaurantType,
                address: data.address,
            },
        };

        return this.request<RegisterResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(request),
        });
    }

    async logout(): Promise<void> {
        return this.request<void>("/auth/logout", {
            method: "POST",
        });
    }
}

// Custom error class for authentication errors
export class AuthError extends Error {
    constructor(
        public code: string,
        message: string,
        public status: number
    ) {
        super(message);
        this.name = 'AuthError';
    }
}

// Error message mapper
export const mapAuthError = (error: unknown): string => {
    if (error instanceof AuthError) {
        return AUTH_ERROR_MESSAGES[error.code as keyof typeof AUTH_ERROR_MESSAGES] || error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return AUTH_ERROR_MESSAGES['unknown-error'];
};

// Export singleton instance
export const authApiClient = new AuthApiClient(API_URL, API_BASE_PATH);