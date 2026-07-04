// Types
export interface Event {
  id: string;
  title: string;
  date: string;
  capacity: number;
}

export interface Booking {
  id: string;
  eventId: string;
  userName: string;
  email: string;
  seats: number;
  bookedAt: string;
}

// Storage keys
const EVENTS_KEY = "events";
const BOOKINGS_KEY = "bookings";

// Initialize storage in browser
const isClient = typeof window !== "undefined";

// Get all events
export const getEvents = (): Event[] => {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading events:", error);
    return [];
  }
};

// Get event by ID
export const getEventById = (id: string): Event | null => {
  const events = getEvents();
  return events.find((e) => e.id === id) || null;
};

// Create event
export const createEvent = (title: string, date: string, capacity: number): Event => {
  const events = getEvents();
  const newEvent: Event = {
    id: Date.now().toString(),
    title,
    date,
    capacity,
  };
  events.push(newEvent);
  if (isClient) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }
  return newEvent;
};

// Delete event
export const deleteEvent = (id: string): void => {
  const events = getEvents().filter((e) => e.id !== id);
  if (isClient) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }
  // Also delete all bookings for this event
  const bookings = getBookings().filter((b) => b.eventId !== id);
  if (isClient) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
};

// Get all bookings
export const getBookings = (): Booking[] => {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading bookings:", error);
    return [];
  }
};

// Get bookings for specific event
export const getEventBookings = (eventId: string): Booking[] => {
  const bookings = getBookings();
  return bookings.filter((b) => b.eventId === eventId);
};

// Get booked seats count for event
export const getBookedSeats = (eventId: string): number => {
  const bookings = getEventBookings(eventId);
  return bookings.reduce((total, b) => total + b.seats, 0);
};

// Get available seats for event
export const getAvailableSeats = (eventId: string): number => {
  const event = getEventById(eventId);
  if (!event) return 0;
  const booked = getBookedSeats(eventId);
  return event.capacity - booked;
};

// Create booking
export const createBooking = (
  eventId: string,
  userName: string,
  email: string,
  seats: number
): Booking | null => {
  const event = getEventById(eventId);
  if (!event) return null;

  const available = getAvailableSeats(eventId);
  if (seats > available) return null;

  const bookings = getBookings();
  const newBooking: Booking = {
    id: Date.now().toString(),
    eventId,
    userName,
    email,
    seats,
    bookedAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  if (isClient) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }

  return newBooking;
};

// Cancel booking
export const cancelBooking = (id: string): void => {
  const bookings = getBookings().filter((b) => b.id !== id);
  if (isClient) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
};

// Update booking
export const updateBooking = (
  id: string,
  userName: string,
  email: string,
  seats: number
): Booking | null => {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) return null;

  const event = getEventById(booking.eventId);
  if (!event) return null;

  const currentBooked = getBookedSeats(booking.eventId);
  const available = event.capacity - (currentBooked - booking.seats);

  if (seats > available) return null;

  const updatedBooking: Booking = {
    ...booking,
    userName,
    email,
    seats,
  };

  const index = bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookings[index] = updatedBooking;
    if (isClient) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  }

  return updatedBooking;
};
