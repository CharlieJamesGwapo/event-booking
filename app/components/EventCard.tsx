"use client";

import Link from "next/link";
import { Event } from "@/app/lib/storage";
import { getAvailableSeats } from "@/app/lib/storage";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const available = getAvailableSeats(event.id);
  const isFull = available === 0;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {event.title}
      </h3>

      <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-400">
        <p>
          <span className="font-semibold">Date:</span> {formattedDate}
        </p>
        <p>
          <span className="font-semibold">Capacity:</span> {event.capacity} seats
        </p>
        <p className={`font-semibold ${isFull ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
          Available: {available} seats
        </p>
      </div>

      <Link
        href={`/events/${event.id}`}
        className="inline-block px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
      >
        View & Book
      </Link>
    </div>
  );
}
