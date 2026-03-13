export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  description: string;
  type: "hotel" | "resort" | "villa" | "apartment";
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string;
}

export interface Review {
  id: string;
  hotelId: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SearchFilters {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  rating: number;
  type: string;
  sortBy: "price-low" | "price-high" | "rating" | "popular";
}
