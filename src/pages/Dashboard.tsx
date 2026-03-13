import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { bookings } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const statusColors: Record<string, string> = {
  confirmed: "bg-accent/10 text-accent",
  pending: "bg-secondary/10 text-secondary",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-muted text-muted-foreground",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">Manage your bookings and travel history</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Bookings", value: bookings.length, icon: Calendar },
              { label: "Upcoming Trips", value: bookings.filter(b => b.status === "confirmed" || b.status === "pending").length, icon: MapPin },
              { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl p-6 shadow-card">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            Booking History
          </h2>
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-4 shadow-card flex flex-col md:flex-row gap-4"
              >
                <img
                  src={booking.hotelImage}
                  alt={booking.hotelName}
                  className="h-24 w-24 md:h-28 md:w-36 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-card-foreground text-lg">
                        {booking.hotelName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.checkIn} → {booking.checkOut} · {booking.guests} guests
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-semibold text-card-foreground">₹{booking.totalPrice.toLocaleString()}</p>
                    <Link to={`/hotel/${booking.hotelId}`}>
                      <Button variant="outline" size="sm">View Hotel</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
