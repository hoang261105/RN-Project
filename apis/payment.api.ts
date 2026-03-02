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

// API lọc danh sách khoảng ngày theo trạng thái
export const filterBookingByDateRange = async (roomId: number) => {
    const response = await axiosInstance.get(`/bookings/room/${roomId}/booked-dates`);
    return response.data;
}

// API hủy đặt phòng
export const cancelBooking = async (bookingId: number) => {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
}