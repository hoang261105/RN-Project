import { RangePrice } from "@/interface/room";
import { axiosInstance } from "@/utils/axiosInstance";

// Hàm lấy danh sách và tìm kiếm phòng
export const getRoomsByName = async (keyboard: string) => {
    const response = await axiosInstance.get(`/rooms?title=${keyboard}`);
    return response.data;
}

// API lấy danh sách tất cả phòng
export const getAllRooms = async () => {
    const response = await axiosInstance.get("/rooms");
    return response.data
}

// Hàm lấy chi tiết 1 phòng
export const getRoomById = async (id: number) => {
    const response = await axiosInstance.get(`/rooms/${id}`);
    return response.data;
}

// Hàm lấy chi tiết 1 hình ảnh
export const getImageById = async (imageId: number, roomId: number) => {
    const response = await axiosInstance.get(`/rooms/${roomId}/images/${imageId}`);
    return response.data;
}

// Hàm lấy danh sách phòng theo khách sạn
export const getRoomsByHotel = async (hotelId: number, rangePrice: RangePrice, sortBy: string) => {
    const params = new URLSearchParams();

    if (sortBy) {
        params.append("sortBy", sortBy);
    }

    if (rangePrice.minPrice > 0) {
        params.append("minPrice", rangePrice.minPrice.toString());
    }
    if (rangePrice.maxPrice > 0) {
        params.append("maxPrice", rangePrice.maxPrice.toString());
    }

    const response = await axiosInstance.get(`/hotels/${hotelId}/rooms`, { params });
    return response.data;
}
