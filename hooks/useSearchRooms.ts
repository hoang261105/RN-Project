import { getRoomsByName } from "@/apis/room.api";
import { useQuery } from "@tanstack/react-query";

export const useSearchRooms = (debouncedKeyboard: string) => {
  return useQuery({
    queryFn: async () => {
      const response = await getRoomsByName(debouncedKeyboard);
      return response.data;
    },
    queryKey: ["rooms", debouncedKeyboard],
  });
};
