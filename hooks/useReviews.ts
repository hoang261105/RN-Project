import { getReviewsByRoom } from "@/apis/review.api";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (hotelId: number, roomId: number) => {
  return useQuery({
    queryKey: ["reviews", hotelId, roomId],
    queryFn: async () => {
      const response = await getReviewsByRoom(hotelId, roomId);
      return response.data;
    },
    enabled: !!hotelId && !!roomId, 
  });
};
