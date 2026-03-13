import { motion } from "framer-motion";
import { HotelCard } from "./HotelCard";
import { hotels } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FeaturedHotels() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Hotels
            </h2>
            <p className="text-muted-foreground text-lg">
              Hand-picked stays for an unforgettable experience
            </p>
          </div>
          <Link to="/hotels" className="hidden md:block">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.slice(0, 3).map((hotel, i) => (
            <HotelCard key={hotel.id} hotel={hotel} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/hotels">
            <Button variant="outline" className="border-primary text-primary">
              View All Hotels <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
