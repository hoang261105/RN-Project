export interface User{
    id?: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
    gender: boolean;
    avatar?: string;
    dateOfBirth: Date;
}

export interface UserRequest extends Omit<User, "id"> {}

export interface UserLogin extends Pick<User, "email" | "password"> {}

export interface UserDetail extends Omit<User, "password">{}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
    newPasswordConfirm: string;
}
