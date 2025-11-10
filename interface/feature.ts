import { Room } from "./room";

export interface Feature {
  id: number;
  title: string;
  iconName?: string;
  description?: string;
  rooms?: Room[]; 
}