/*
 * Copyright (C) 2018 Unit-e developers
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


/**
 * Convenience Date object constructors
 */
export class Dates {

  static epoch(): Date {
    return new Date(0);
  }

  static now(): Date {
    return new Date();
  }

  /**
   * Return date object corresponding to 00:00 today, in the local timezone
   */
  static today(): Date {
    const now = Dates.now();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  static tomorrow(): Date {
    const date = Dates.today();
    date.setDate(date.getDate() + 1);
    return date;
  }

  static startOfWeek(): Date {
    const date = Dates.today();
    // UNIT-E: Note that the week as returned by getDay() starts on Sunday.
    // We can think of making it locale-dependent when we tackle i18n
    date.setDate(date.getDate() - date.getDay());
    return date;
  }

  static startOfMonth(): Date {
    const now = Dates.now();
    return new Date(now.getFullYear(), now.getMonth());
  }

  static startOfLastMonth(): Date {
    const now = Dates.now();
    return new Date(now.getFullYear(), now.getMonth() - 1);
  }

  static startOfYear(): Date {
    const now = Dates.now();
    return new Date(now.getFullYear());
  }
}
