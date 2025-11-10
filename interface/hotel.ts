import { User } from "./interface";
import { Province } from "./province";

export interface Hotel {
  id: number;
  name: string;
  address: string;
  user: User; 
  province: Province; 
  createdAt: string; 
  updatedAt: string; 
}

export interface HotelResponse extends Omit<Hotel, "user" | "createdAt" | "updatedAt" | "province">{
  provinceName: string;
  imageURL: string
}

export interface HotelImage {
  id: number;       
  imageUrl: string; 
  hotel: Hotel;     
}