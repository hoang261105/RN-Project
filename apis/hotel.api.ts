import { axiosInstance } from "@/utils/axiosInstance";

// Hàm lấy danh sách khách sạn theo tỉnh thành
export const getHotelsByProvinceId = async (provinceId: number, sortBy: string) => {
    const response = await axiosInstance.get(`/${provinceId}/hotels?sortBy=${sortBy}`);
    return response.data;
}

// Hàm lấy chi tiết 1 khách sạn
export const getHotelById = async (id: number) => {
    const response = await axiosInstance.get(`/hotels/${id}`);
    return response.data
}

// Hàm lọc danh sách theo các tỉnh thành
export const filterHotelsByProvinces = async (provinceIds: number[], sortBy: string) => {
    const params = new URLSearchParams();

    if (sortBy) {
        params.append("sortBy", sortBy);
    }

    provinceIds.forEach(id => {
        params.append("provinceId", id.toString());
    });

    const response = await axiosInstance.get("/hotels", { params });
    return response.data;
}