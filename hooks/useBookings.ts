import { filterBookingByStatus } from "@/apis/payment.api";
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
