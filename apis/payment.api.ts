import { BookingRequest, Status } from "@/interface/booking";
import { axiosInstance } from "@/utils/axiosInstance";

// API thanh toán đặt phòng
export const paymentRoom = async (data: BookingRequest) => {
    const response = await axiosInstance.post("/bookings", data);
    return response.data;
}

// API lọc booking theo trạng thái
export const filterBookingByStatus = async (userId: number, status: Status) => {
    const response = await axiosInstance.get(`/bookings?userId=${userId}&status=${status}`);
    return response.data;
}