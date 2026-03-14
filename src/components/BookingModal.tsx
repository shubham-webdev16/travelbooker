import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, CreditCard, Check, Shield, IndianRupee } from "lucide-react";
import { Hotel } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openRazorpay } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  hotel: Hotel;
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ hotel, open, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [paymentId, setPaymentId] = useState("");
  const [paying, setPaying] = useState(false);
  const { toast } = useToast();

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;
  const subtotal = hotel.price * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handlePay = () => {
    setPaying(true);
    openRazorpay({
      amount: total,
      hotelName: hotel.name,
      description: `${hotel.name} · ${nights} night${nights > 1 ? "s" : ""} · ${guests} guests`,
      onSuccess: (response) => {
        setPaymentId(response.razorpay_payment_id);
        setStep(3);
        setPaying(false);
        toast({
          title: "Payment Successful! ✅",
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });
      },
      onDismiss: () => {
        setPaying(false);
        toast({
          title: "Payment Cancelled",
          description: "You can try again anytime.",
          variant: "destructive",
        });
      },
    });
  };

  const handleClose = () => {
    setStep(1);
    setCheckIn("");
    setCheckOut("");
    setGuests("2");
    setPaymentId("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-card-hover"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-card-foreground">
                {step === 3 ? "Booking Confirmed! 🎉" : "Book Your Stay"}
              </h2>
              <button onClick={handleClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {step === 3 ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">
                  Thank you for your booking!
                </h3>
                <p className="text-muted-foreground mb-2">
                  Your reservation at {hotel.name} has been confirmed.
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  {checkIn} → {checkOut} · {guests} guests
                </p>
                <p className="text-sm font-medium text-primary mb-1">
                  Total Paid: ₹{total.toLocaleString()}
                </p>
                {paymentId && (
                  <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 inline-block mt-2">
                    Payment ID: {paymentId}
                  </p>
                )}
                <div className="mt-6">
                  <Button onClick={handleClose} className="bg-primary text-primary-foreground">
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-3 mb-6">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-card-foreground">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground">{hotel.location}</p>
                    <p className="text-sm font-medium text-primary mt-1">
                      ₹{hotel.price.toLocaleString()} / night
                    </p>
                  </div>
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-card-foreground mb-1 block">
                          <Calendar className="inline h-3.5 w-3.5 mr-1" /> Check-in
                        </label>
                        <Input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground mb-1 block">
                          <Calendar className="inline h-3.5 w-3.5 mr-1" /> Check-out
                        </label>
                        <Input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-1 block">
                        <Users className="inline h-3.5 w-3.5 mr-1" /> Guests
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!checkIn || !checkOut}
                      className="w-full bg-primary text-primary-foreground"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">₹{hotel.price.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                        <span className="text-card-foreground font-medium">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes & fees (12%)</span>
                        <span className="text-card-foreground font-medium">₹{taxes.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-semibold">
                        <span className="text-card-foreground">Total</span>
                        <span className="text-primary">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Secure Payment via Razorpay</p>
                        <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking, Wallets supported</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button
                        onClick={handlePay}
                        disabled={paying}
                        className="flex-1 bg-primary text-primary-foreground"
                      >
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {paying ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
