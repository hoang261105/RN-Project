import { filterHotelsByProvinces } from "@/apis/hotel.api";
import { getAllProvinces, getProvinceById } from "@/apis/province.api";
import { useQuery } from "@tanstack/react-query";

export const useProvinceById = (provinceId: number) => {
  return useQuery({
    queryFn: async () => {
      const response = await getProvinceById(provinceId);
      return response.data;
    },
    queryKey: ["province"],
  });
};

export const useProvinces = () => {
  return useQuery({
    queryFn: async () => {
      const response = await getAllProvinces();
      return response.data;
    },
    queryKey: ["provinces"],
  });
};

export const useFilterProvinces = (
  selectedProvinces: number[],
  selectedSort: string
) => {
  return useQuery({
    queryFn: async () => {
      const response = await filterHotelsByProvinces(
        selectedProvinces,
        selectedSort
      );
      return response.data;
    },
    queryKey: ["hotels", selectedProvinces, selectedSort],
  });
};
