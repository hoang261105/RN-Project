import { Ward } from "./ward";

export interface Province {
  id: number;
  provinceName: string;
  imageURL: string; 
  licensePlates: string[]; 
  wards: Ward[]; 
}

export interface ProvinceResponse extends Omit<Province, "licensePlates" | "wards">{}