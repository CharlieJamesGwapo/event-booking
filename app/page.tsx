"use client";

import { useState, useEffect } from "react";
import EventForm from "./components/EventForm";
import EventCard from "./components/EventCard";
import { getEvents, Event } from "./lib/storage";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadEvents();
  }, []);

  const loadEvents = () => {
    const loadedEvents = getEvents();
    setEvents(loadedEvents);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <EventForm onEventCreated={loadEvents} />
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No events yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Upcoming Events ({events.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
