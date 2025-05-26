export type ProfessionalEvent = {
  type: "reserva" | "visita";
  start: string; // ISO date
  end: string;   // ISO date
};

export type WorkingHours = {
  [day in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']?: { start: number; end: number } | null;
};

export interface ProfessionalReview {
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface ProfessionalProject {
  title: string;
  description: string;
  year: number;
}

export interface Professional {
  id: number;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  location: string;
  verified: boolean;
  category: string;
  visitCost: number;
  allowsDirectBooking: boolean;
  bookingPrice?: number;
  bookingNotes?: string;
  agenda?: ProfessionalEvent[];
  workingHours?: WorkingHours;
  description?: string;
  reviewsList?: ProfessionalReview[];
  portfolio?: ProfessionalProject[];
} 