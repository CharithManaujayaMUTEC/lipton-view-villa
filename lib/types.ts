export type Room = {
  id: string;
  name: string;
  type: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  beds: string;
  size: number;
  units: number;
  amenities: string[];
  images: string[];
  badge: string;
  rating: number;
  featured: boolean;
  active: boolean;
};

export type BookingStatus = "pending" | "confirmed" | "checked-in" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "deposit" | "paid";

export type Booking = {
  id: string;
  ref: string;
  roomId: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string;
  guests: number;
  total: number;
  discountCode?: string;
  status: BookingStatus;
  payment: PaymentStatus;
  source: "website" | "booking.com" | "phone" | "admin";
  notes: string;
  createdAt: string;
};

export type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  title: string;
  category: string;
  featured: boolean;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discount: number;
  code: string;
  validUntil: string;
  active: boolean;
  image: string;
};

export type Review = {
  id: string;
  name: string;
  country: string;
  rating: number;
  text: string;
  date: string;
  published: boolean;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
};

export type HeroSlide = {
  id: string;
  type: "image" | "video";
  url: string;
  line1: string;
  line2: string;
};

export type Settings = {
  heroSlides: HeroSlide[];
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  heroImage: string;
  location: string;
  phone: string;
  email: string;
  address: string;
  about: string;
  tourVideoUrl: string;
  tourPoster: string;
  checkInTime: string;
  checkOutTime: string;
  taxPercent: number;
  statGuests: string;
  statProperties: string;
  statSupport: string;
  statRating: string;
};

export type Role = "admin" | "manager" | "guest";
export type Session = { email: string; name: string; role: Role };

export type Data = {
  rooms: Room[];
  bookings: Booking[];
  media: MediaItem[];
  offers: Offer[];
  reviews: Review[];
  messages: Message[];
  settings: Settings;
};
