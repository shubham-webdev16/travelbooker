import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowLeft, Heart, Share2, Wifi, UtensilsCrossed, Dumbbell, Waves, Car, Wind } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HotelMap } from "@/components/HotelMap";
import { BookingModal } from "@/components/BookingModal";
import { hotels, reviews } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Restaurant: <UtensilsCrossed className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
  Pool: <Waves className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  AC: <Wind className="h-4 w-4" />,
};

export default function HotelDetail() {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const hotelReviews = reviews.filter((r) => r.hotelId === id);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Hotel not found</h1>
          <Link to="/hotels">
            <Button className="bg-primary text-primary-foreground">Back to Hotels</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 container mx-auto px-4">
        <Link to="/hotels" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Hotels
        </Link>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8"
        >
          <div className="md:col-span-2 aspect-[16/10] rounded-2xl overflow-hidden">
            <img
              src={hotel.images[selectedImg]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-3">
            {hotel.images.slice(1, 3).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i + 1)}
                className="rounded-2xl overflow-hidden aspect-[16/9]"
              >
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                      {hotel.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      <span className="text-sm text-muted-foreground">({hotel.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{hotel.name}</h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setWishlisted(!wishlisted)}>
                    <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <div className="h-9 w-9 rounded-lg bg-card flex items-center justify-center text-primary">
                      {amenityIcons[a] || <span className="text-sm">✦</span>}
                    </div>
                    <span className="text-sm font-medium text-foreground">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Location</h2>
              <div className="h-72 rounded-2xl overflow-hidden border border-border">
                <HotelMap lat={hotel.lat} lng={hotel.lng} name={hotel.name} />
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                Reviews ({hotelReviews.length})
              </h2>
              <div className="space-y-4">
                {hotelReviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl p-4 shadow-card">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{review.userName}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
                {hotelReviews.length === 0 && (
                  <p className="text-muted-foreground">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">₹{hotel.price.toLocaleString()}</span>
                <span className="text-muted-foreground">/ night</span>
              </div>
              <Button
                onClick={() => setBookingOpen(true)}
                className="w-full h-12 bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90"
              >
                Book Now
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Free cancellation up to 24 hours before check-in
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BookingModal hotel={hotel} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
