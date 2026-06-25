"use client";

import { useState, useMemo } from "react";
import type { ConsultationSlot } from "@/types/catalog";

function generateSlots(): ConsultationSlot[] {
  const slots: ConsultationSlot[] = [];
  const today = new Date();
  const times = ["10:00", "11:30", "14:00", "15:30", "17:00"];

  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() === 0) continue;

    const dateStr = date.toISOString().split("T")[0];
    times.forEach((time, i) => {
      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        time,
        available: (d + i) % 3 !== 0,
      });
    });
  }

  return slots;
}

export default function ConsultationCalendar() {
  const slots = useMemo(() => generateSlots(), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(
    null
  );
  const [booked, setBooked] = useState(false);

  const uniqueDates = [...new Set(slots.map((s) => s.date))];
  const dateSlots = selectedDate
    ? slots.filter((s) => s.date === selectedDate)
    : [];

  const handleBook = () => {
    if (selectedSlot) {
      setBooked(true);
    }
  };

  if (booked && selectedSlot) {
    return (
      <div className="border border-gold/30 p-8 text-center">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
          Consultation Confirmed
        </p>
        <p className="font-serif text-2xl text-cream mb-2">
          {formatDate(selectedSlot.date)} at {selectedSlot.time}
        </p>
        <p className="text-cream/60 text-sm">
          A confirmation has been sent to your registered email. Your
          fragrance consultant will join via private video link.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-serif text-2xl text-cream mb-6">
        Schedule a Private Consultation
      </h3>

      <div className="grid grid-cols-7 gap-1 mb-8">
        {uniqueDates.slice(0, 14).map((date) => {
          const dayNum = new Date(date + "T12:00:00").getDate();
          const dayName = new Date(date + "T12:00:00").toLocaleDateString(
            "en-US",
            { weekday: "short" }
          );
          const hasAvailable = slots.some(
            (s) => s.date === date && s.available
          );

          return (
            <button
              key={date}
              type="button"
              disabled={!hasAvailable}
              onClick={() => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
              className={`p-3 text-center border transition-colors ${
                selectedDate === date
                  ? "border-gold bg-gold/10"
                  : hasAvailable
                    ? "border-cream/15 hover:border-cream/40"
                    : "border-cream/5 opacity-30 cursor-not-allowed"
              }`}
            >
              <span className="block text-[10px] uppercase text-cream/50">
                {dayName}
              </span>
              <span className="block text-lg text-cream font-serif">
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-cream/50 mb-4">
            Available times for {formatDate(selectedDate)}
          </p>
          <div className="flex flex-wrap gap-3">
            {dateSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot)}
                className={`px-5 py-2.5 text-sm border transition-colors ${
                  selectedSlot?.id === slot.id
                    ? "border-gold bg-gold/10 text-gold"
                    : slot.available
                      ? "border-cream/20 text-cream/70 hover:border-cream/40"
                      : "border-cream/10 text-cream/30 cursor-not-allowed line-through"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <button
          type="button"
          onClick={handleBook}
          className="px-8 py-3 bg-gold text-obsidian text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
        >
          Confirm Booking
        </button>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
