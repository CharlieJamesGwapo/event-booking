"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BookingForm from "@/app/components/BookingForm";
import {
  getEventById,
  getEventBookings,
  cancelBooking,
  deleteEvent,
  Event,
  Booking,
} from "@/app/lib/storage";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [eventId]);

  const loadData = () => {
    const loadedEvent = getEventById(eventId);
    setEvent(loadedEvent);

    if (loadedEvent) {
      const loadedBookings = getEventBookings(eventId);
      setBookings(loadedBookings);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId);
      loadData();
    }
  };

  const handleDeleteEvent = () => {
    if (
      confirm(
        "Are you sure you want to delete this event? All bookings will be cancelled."
      )
    ) {
      deleteEvent(eventId);
      window.location.href = "/";
    }
  };

  if (!mounted) return null;

  if (!event) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Event not found.
          </p>
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const bookedSeats = bookings.reduce((total, b) => total + b.seats, 0);
  const availableSeats = event.capacity - bookedSeats;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
      >
        &larr; Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {event.title}
            </h1>

            <div className="space-y-4 mb-8 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold">Date & Time:</span>{" "}
                {formattedDate}
              </p>
              <p>
                <span className="font-semibold">Total Capacity:</span>{" "}
                {event.capacity} seats
              </p>
              <p>
                <span className="font-semibold">Booked Seats:</span> {bookedSeats}
              </p>
              <p
                className={`font-semibold ${
                  availableSeats === 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                Available Seats: {availableSeats}
              </p>
            </div>

            {bookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Bookings ({bookings.length})
                </h2>
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {booking.userName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.seats} seat{booking.seats !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(booking.bookedAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3 py-1 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookings.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No bookings yet.
              </p>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <BookingForm eventId={eventId} onBookingCreated={loadData} />
            </div>

            <button
              onClick={handleDeleteEvent}
              className="w-full px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors font-semibold"
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
