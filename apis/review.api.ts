import { ReviewRequest } from "@/interface/review";
import { axiosInstance } from "@/utils/axiosInstance";

// API lấy danh sách đánh giá của phòng đó
export const getReviewsByRoom = async (hotelId: number, roomId: number) => {
    const response = await axiosInstance.get(`/reviews?hotelId=${hotelId}&roomId=${roomId}`);
    return response.data;
}

// API thêm đánh giá
export const addReview = async (data: ReviewRequest) => {
    const response = await axiosInstance.post("/reviews", data);
    return response.data;
} 