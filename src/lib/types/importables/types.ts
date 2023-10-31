// Tipos importables
export interface SportCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  active: boolean;
  cancelTimeLimit: number;
  paymentTimeLimit: number;
  courts: Court[];
  days: Day[];
  user: User;
  city: City;
}

export interface City {
  id: number;
  name: string;
  postCode: string;
  sportCenters: SportCenter[];
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  role?: string;
  registerDate: Date;
  cbu?: string;
  Alias?: string;
  sportcenter?: SportCenter;
  reservations: Reservation[];
}

export interface Day {
  id: number;
  name: string;
  firstHalfStartTime: number; //Hora inicio primera media jornada
  firstHalfEndTime: number; //Hora fin primera media jornada
  secondHalfStartTime: number; //Hora inicio segunda media jornada
  secondHalfEndTime: number; //Hora fin segunda media jornada
  sportCenter: SportCenter;
  appointments: Appointment[];
}

export interface Sport {
  id: number;
  name: string;
  duration: number; //Minutes
  courts: Court[];
}

export interface Court {
  id: number;
  price: number;
  description?: string;
  sportCenter: SportCenter;
  sport: Sport;
  appointments: Appointment[];
}

export interface Appointment {
  id: number;
  date: Date;
  startTime: number; // Tiempo medido en minutos, rango: [0, 1440] (24 horas son 1440 minutos)
  endTime: number; // Tiempo medido en minutos, rango: [0, 1440]
  active: boolean;
  court: Court;
  day: Day;
  reservations: Reservation[];
}

export interface Reservation {
  id: number;
  date: Date;
  state?: string; // pending | approved | rejected | canceled
  observation?: string;
  partialPayment: number;
  paymentConfirmation?: Blob;
  appointment: Appointment;
  user: User;
}
