import { axiosInstance } from "@/utils/axiosInstance";

// Hàm lấy danh sách 34 tỉnh thành
export const getAllProvinces = async () => {
    const response = await axiosInstance.get("/provinces");
    return response.data
}

// Hàm lấy ra chi tiết 1 tỉnh thành
export const getProvinceById = async (id: number) => {
    const response = await axiosInstance.get(`/provinces/${id}`);
    return response.data;
}