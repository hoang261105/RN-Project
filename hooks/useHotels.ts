import { getHotelById } from "@/apis/hotel.api";
import { useQuery } from "@tanstack/react-query";

export const useHotelById = (hotelId: number) => {
    return useQuery({
    queryFn: async () => {
      const response = await getHotelById(hotelId);
      return response.data;
    },
    queryKey: ["hotel"],
  });
}

