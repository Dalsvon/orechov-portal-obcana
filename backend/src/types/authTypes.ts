  export interface Admin {
    id: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface AuthResponse {
    message?: string;
    error?: string;
  }

  export interface AuthResponseCheck {
    message?: string;
    error?: string;
    isAuthenticated?: boolean;
  }