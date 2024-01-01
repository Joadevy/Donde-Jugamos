/* eslint-disable prettier/prettier */
import type dayjsType from "dayjs";
import type { Reservation } from "@prisma/client";
import type { ApiResponse } from "../types/importables/types";

import dayjs from "dayjs";
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://dondejugamos.vercel.app/",
  "https://www.dondejugamos.vercel.app/",
];

export function timeToMinutes(time: string): number {
  const timeArrayString = time.split(":");

  const hour = parseInt(timeArrayString[0]) || 0;
  const minutes = parseInt(timeArrayString[1]) || 0;

  return hour * 60 + minutes;
}

export function timeInStringFromMinutes(minutes: string): string {

  const hour = (Math.floor(Number(minutes) / 60)).toString().padStart(2, "0");
  const minutesLeft = (Number(minutes) % 60).toString().padEnd(2, "0");

// Devuelve sin el "hs" al final ya que se mapea segun el "value" del select inicial y este no tiene el "hs", sino se rompe
  return `${hour}:${minutesLeft}`;
}

export function timeToMinutesDayJs(date: dayjs.Dayjs): number {
  const hour = date.hour();

  const minutes = date.minute();

  return hour * 60 + minutes;
}

export function minutesToTimeDayJs(time: number): dayjsType.Dayjs {
  const minutes = timeInStringFromMinutes(time.toString());
  
  return dayjs(`2023-12-10T${minutes}`);
}


export function getRootUrl(){
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://dondejugamos.vercel.app";
}

export function capitalize(string:string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Para testear que funciona se puede pasar por parametro: new Date(new Date().getTime() + 60 * 60 * 1000) y 60, de esa forma daria false ya que estariamos dentro del rango que ya no puede cancelar
export function isPossibleToCancel(appointmentDate:Date,minutesToCancel:number){
  const dateToCancel = dayjs(appointmentDate).subtract(minutesToCancel,"minutes");
  const now = dayjs();

  return dateToCancel.isAfter(now);
}

export const turnStateToSpanish = (state: Reservation["state"], plural?:"plural") => {
  switch (state) {
    case "pending":
      return `pendiente${plural ? "s" : ""}`;
    case "approved":
      return `aprobada${plural ? "s" : ""}`;
    case "canceled":
      return `cancelada${plural ? "s" : ""}`;
    case "rejected":
    return `rechazada${plural ? "s" : ""}`;
    default:
      return `pendiente${plural ? "s" : ""}`;
  }
};

export function generateApiResponse(data: unknown, status: number, message: string): ApiResponse {
    return {
      data,
      status,
      message,
    }
}

export const CountReservationsByState = (reservations: Reservation[]) => {
  return reservations.reduce<Record<Reservation["state"], number>>((acc, reservation) => {
    const { state } = reservation

    if (acc[state]) {
      acc[state]++;
    } else {
      acc[state] = 1;
    }

    return acc;
  }
  , {"approved":0,"rejected":0,"pending":0,"canceled":0});
}


export function diferenciaEnDias(fecha1: Date, fecha2: Date): number {
  const unDiaEnMilisegundos = 1000 * 60 * 60 * 24; // 1 día en milisegundos

  // Restar una fecha de la otra para obtener la diferencia en milisegundos
  const diferenciaMs = Math.abs(fecha1.getTime() - fecha2.getTime());

  // Convertir la diferencia de milisegundos a días
  const diferenciaDias = Math.floor(diferenciaMs / unDiaEnMilisegundos);

  return diferenciaDias;
}

export function changeDateTime(date: Date, hour = 0, minutes = 0, seconds = 0, milliseconds = 0): Date {
  const dateChanged = new Date(date);

  dateChanged.setHours(hour);
  dateChanged.setMinutes(minutes);
  dateChanged.setSeconds(seconds);
  dateChanged.setMilliseconds(milliseconds);

  return dateChanged;
}


const dateParts= {
  'dayNumber': 'd',
  'dayName': 'eeee',
  'dayFull': 'eeee d',
  'monthNumber': 'L',
  'monthName': 'LLLL',
  'year': 'y',
  'fullNumber': 'd/L/y'
}

export function getPartOfDate(date: Date, part?: 'dayNumber' | 'dayName' | 'dayFull' | 'monthNumber' | 'monthName' | 'year' | 'fullNumber', capital?: boolean, translate = false): string {
  const dateStr = format(date, part ? dateParts[part] : dateParts.fullNumber, translate ? {
    locale: es,
  } : {
    locale: enUS,
  }).trim().toLowerCase();

  if (capital) {
    return capitalize(dateStr);
  }

  return dateStr;
}

export function formatNumber(number: number) {
  return number.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export const showStringMaxLength = (str:string, maxLength:number) => str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
