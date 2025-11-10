import { UserDetail, UserLogin, UserRequest } from "@/interface/user";
import { axiosInstance } from "@/utils/axiosInstance";

// Hàm đăng ký tài khoản
export const registerUser = async (data: UserRequest) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
}

// Hàm lấy danh sách user
export const getAllUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
}

// API lấy chi tiết 1 user
export const getUserById = async (id: number) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
}

// Hàm đăng nhập tài khoản
export const loginUser = async (data: UserLogin) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
}

// API cập nhật tài khoản
export const updateUser = async (data: UserDetail) => {
    const response = await axiosInstance.put(`/user/${data.id}`, data);
    return response.data;
}