import { filterBookingByDateRange, filterBookingByStatus } from "@/apis/payment.api";
import { Status } from "@/interface/booking";
import { useQuery } from "@tanstack/react-query";

export const useBookings = (userId?: number, status?: Status) => {
  return useQuery({
    queryKey: ["bookings", userId, status],
    queryFn: async () => {
      if (!userId) return [];
      const response = await filterBookingByStatus(userId, status!);
      return response.data;
    },
    enabled: !!userId, 
      refetchOnWindowFocus: false, // 👈 thêm dòng này
  refetchOnReconnect: false,
  });
};

export const useBookedDates = (roomId?: number) => {
  return useQuery({
    queryKey: ["bookedDates", roomId],
    queryFn: async () => {
      if (!roomId) return [];
      const response = await filterBookingByDateRange(roomId);
      return response.data;
    },
    enabled: !!roomId,
    refetchOnWindowFocus: false, 
    refetchOnReconnect: false,
  });
}