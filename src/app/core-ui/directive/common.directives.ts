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

import { Directive, Input, ElementRef, Renderer } from '@angular/core';

/** Focus the given element based on a condition */
@Directive({
  selector : '[appFocusElement]'
})
export class FocusDirective {
  constructor(
    public renderer: Renderer,
    public elementRef: ElementRef) {}

  @Input()
  set appFocusElement(condition: boolean) {
    if (condition) {
      this.renderer.invokeElementMethod(
          this.elementRef.nativeElement, 'focus', []);
    }
  }
}

/** Focus the given element after 500ms, useful for focusing after rendering */
@Directive({
  selector : '[appFocusTimeout]'
})
export class FocusTimeoutDirective {
  constructor(
    public renderer: Renderer,
    public elementRef: ElementRef) {}

  @Input()
  set appFocusTimeout(condition: boolean) {
    if (condition) {
      setTimeout(() => this.renderer.invokeElementMethod(
        this.elementRef.nativeElement, 'focus', []), 500);
    }
  }
}
