import { Feature } from "./feature";
import { Hotel } from "./hotel";

export interface Room {
  id: number;
  title: string;
  description?: string;
  price: number; 
  guestCount: number;
  bedroomCount: number;
  bedCount: number;
  bathRoomCount: number;
  hotel: Hotel; 
  features: Feature[]; 
}

export interface RoomImage {
  id: number;       
  imageURL: string; 
  room: Room;      
  size: string;
}

export interface RoomResponse{
  id: number;
  hotelId: number;
  imageUrl: string; 
  title: string;
  hotelName: string;
  price: number
}

export interface RangePrice {
  minPrice: number;
  maxPrice: number;
}

export interface RoomDetail extends Omit<Room, "hotel">{
  hotelName: string;
  images: RoomImage[]
}