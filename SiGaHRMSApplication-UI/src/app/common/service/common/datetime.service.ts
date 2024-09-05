
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class DateTimeService {
  constructor() {}

  /**
   * Gets the current UTC date/time.
   */
  getUtcNow(): Date {
    return new Date(new Date().toISOString());
  }

  /**
   * Gets the current EST date/time.
   */
  getEstNow(): Date {
    const now = new Date();
    return this.convertToEst(now);
  }

  /**
   * Converts a date/time from UTC to EST.
   * @param dateTime The date/time to convert.
   * @returns The converted date/time in EST.
   */
  convertFromUtcToEst(dateTime: Date): Date {
    const utcDate = new Date(dateTime.toISOString());
    return this.convertToEst(utcDate);
  }

  /**
   * Converts a date/time from EST to UTC.
   * @param dateTime The date/time to convert.
   * @returns The converted date/time in UTC.
   */
  convertFromEstToUtc(dateTime: Date): Date {
    const estDate = new Date(dateTime.toISOString());
    const estOffset = this.getEstOffset(estDate);
    const utcTime = estDate.getTime() + (estOffset * 60 * 60 * 1000);
    return new Date(utcTime);
  }

  /**
   * Converts a given date/time to EST.
   * @param date The date/time to convert.
   * @returns The converted date/time in EST.
   */
  private convertToEst(date: Date): Date {
    const utcOffset = date.getTimezoneOffset() * 60000;
    const estOffset = this.getEstOffset(date) * 3600000;
    return new Date(date.getTime() + utcOffset - estOffset);
  }

  /**
   * Gets the EST offset based on whether daylight saving is in effect.
   * @param date The date to check.
   * @returns The offset in hours.
   */
  private getEstOffset(date: Date): number {
    const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    const stdTimezoneOffset = Math.max(jan, jul);
    return date.getTimezoneOffset() === stdTimezoneOffset ? -5 : -4;
  }
}
