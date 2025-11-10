import { Province } from "./province";

export interface Ward {
  id: number;
  name: string;
  mergedFrom: string[]; 
  province: Province; 
}