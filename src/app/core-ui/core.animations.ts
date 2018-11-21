/*
 * Copyright (C) 2017-2018 The Particl developers
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

import {
  trigger, state, style,
  animate, transition, keyframes
} from '@angular/animations';

export function flyInOut() {
  return trigger('flyInOut', [
    transition('* => next', [
      animate(300, keyframes([
        style({transform: 'translateX(100%)', offset: 0}),
        style({transform: 'translateX(15px)',  offset: 0.3}),
        style({transform: 'translateX(0)',     offset: 1.0})
      ]))
      ]),
    transition('* => prev', [
      animate(300, keyframes([
        style({transform: 'translateX(-100%)',     offset: 0}),
        style({transform: 'translateX(-15px)', offset: 0.3}),
        style({transform: 'translateX(0)',  offset: 1.0})
      ]))
    ])
  ]);
}

export function slideDown() {
  return trigger('slideDown', [
    state('*', style({ 'overflow-y': 'hidden' })),
    state('void', style({ 'overflow-y': 'hidden' })),
    transition('* => void', [
      style({ height: '*' }),
      animate(250, style({ height: 0, padding: 0 }))
    ]),
    transition('void => *', [
      style({ height: '0', padding: 0 }),
      animate(250, style({ height: '*', padding: '*' }))
    ])
  ]);
}
