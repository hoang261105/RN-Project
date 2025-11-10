import { getAllRooms, getRoomById, getRoomsByHotel } from "@/apis/room.api";
import { RangePrice } from "@/interface/room";
import { useQuery } from "@tanstack/react-query";

export const useRooms = () => {
  return useQuery({
    queryFn: async () => {
      const response = await getAllRooms();
      return response.data;
    },
    queryKey: ["rooms"],
  });
};

export const useFilterRooms = (
  hotelId: number,
  rangePrice: RangePrice,
  selectedSort: string
) => {
  return useQuery({
    queryFn: async () => {
      const response = await getRoomsByHotel(hotelId, rangePrice, selectedSort);
      return response.data;
    },
    queryKey: ["rooms", hotelId, rangePrice, selectedSort],
  });
};

export const useRoomById = (id: number) => {
  return useQuery({
    queryFn: async () => {
      const response = await getRoomById(id);
      return response.data;
    },
    queryKey: ["room"],
  });
};
