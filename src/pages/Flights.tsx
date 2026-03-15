import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plane, ArrowRight, Clock, Filter } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { flights } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openRazorpay } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";

export default function FlightsPage() {
  const { toast } = useToast();
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [sortBy, setSortBy] = useState("price-low");
  const [classFilter, setClassFilter] = useState("");

  const filtered = useMemo(() => {
    let result = flights.filter((f) => {
      const matchFrom = !fromSearch || f.from.toLowerCase().includes(fromSearch.toLowerCase()) || f.fromCode.toLowerCase().includes(fromSearch.toLowerCase());
      const matchTo = !toSearch || f.to.toLowerCase().includes(toSearch.toLowerCase()) || f.toCode.toLowerCase().includes(toSearch.toLowerCase());
      const matchClass = !classFilter || f.class === classFilter;
      return matchFrom && matchTo && matchClass;
    });
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "duration") result.sort((a, b) => a.duration.localeCompare(b.duration));
    return result;
  }, [fromSearch, toSearch, sortBy, classFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Search Flights
          </h1>
          <p className="text-muted-foreground mb-8">Find the best deals on domestic & international flights</p>

          {/* Search Bar */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">From</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-[-45deg]" />
                  <Input placeholder="City or airport" value={fromSearch} onChange={(e) => setFromSearch(e.target.value)} className="pl-10 bg-background" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">To</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-[45deg]" />
                  <Input placeholder="City or airport" value={toSearch} onChange={(e) => setToSearch(e.target.value)} className="pl-10 bg-background" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Class</label>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground">
                  <option value="">All Classes</option>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground">
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">{filtered.length} flights found</p>

          {/* Flight Cards */}
          <div className="space-y-4">
            {filtered.map((flight, i) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {flight.airlineLogo}
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">{flight.airline}</p>
                      <p className="text-xs text-muted-foreground capitalize">{flight.class} · {flight.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-1 justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-card-foreground">{flight.departTime}</p>
                      <p className="text-xs text-muted-foreground">{flight.fromCode}</p>
                    </div>
                    <div className="flex flex-col items-center flex-1 max-w-[200px]">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {flight.duration}
                      </p>
                      <div className="w-full h-px bg-border relative my-1">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <Plane className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-card-foreground">{flight.arriveTime}</p>
                      <p className="text-xs text-muted-foreground">{flight.toCode}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-2xl font-bold text-primary">₹{flight.price.toLocaleString()}</p>
                    <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => {
                      openRazorpay({
                        amount: flight.price,
                        hotelName: flight.airline,
                        description: `${flight.fromCode} → ${flight.toCode} | ${flight.date} | ${flight.class}`,
                        onSuccess: (res) => {
                          toast({ title: "✈️ Flight Booked!", description: `Payment ID: ${res.razorpay_payment_id}` });
                        },
                        onDismiss: () => {
                          toast({ title: "Payment Cancelled", variant: "destructive" });
                        },
                      });
                    }}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No flights found.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setFromSearch(""); setToSearch(""); setClassFilter(""); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
