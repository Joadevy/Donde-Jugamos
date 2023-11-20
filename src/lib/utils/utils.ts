/* eslint-disable prettier/prettier */
import type dayjsType from "dayjs";
import type { Reservation } from "@prisma/client";
import type { ApiResponse } from "../types/importables/types";

import dayjs from "dayjs";
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.dondejugamos.vercel.app";
}

export function capitalize(string:string) {
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
