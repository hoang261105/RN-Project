export enum Status{
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  CHECKED_OUT = "CHECKED_OUT"
};
export interface Booking {
  id: number;
  startDate: string; 
  endDate: string; 
  adults: number;
  children: number;
  infants: number;
  paymentMethod?: string; 
  status: Status; 
}

export interface BookingResponse{
  bookingId: number;
  checkInDate: string; 
  roomId: number;
  checkOutDate: string; 
  hotelId: number;
  roomName: string;
  hotelName: string;
  imageURL: string;
  status: Status
}

export interface BookingRequest{
  roomId: number;
  hotelId: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  infants: number;
  paymentOption: string;
  paymentMethodId: number;
}