import { Hotel } from "./hotel";
import { User } from "./interface";
import { Room } from "./room";

export interface Review {
  id: number;
  hotel: Hotel; 
  user: User; 
  room: Room; 
  rating: number; 
  comment?: string; 
  commentDate: string; 
  createdAt: string;
}

export interface ReviewResponse {
  id: number;
  fullName: string;
  avatar: string;
  comment?: string; 
  commentDate: string; 
  rating: number
}

export interface ReviewRequest{
  hotelId?: number;
  roomId?: number;
  userId?: number;
  rating: number;
  comment: string;
}