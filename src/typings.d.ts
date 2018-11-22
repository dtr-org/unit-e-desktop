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

/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// TODO: maybe move into ipc.types ?

interface Window {
  electron: boolean;
  sendNotification: Function;
  require: any;
  ipc: {
    on: (channel: string, listener: Function) => void;
    once: (channel: string, listener: Function) => void;
    send: (channel: string, arguments?: {}) => void;
    sendSync: (channel: string, arguments?: {}) => void;
    sendToHost: (channel: string, arguments?: {}) => void;
    removeListener: (channel: string, listener: Function) => void;
    removeAllListeners: (channel?: string) => void;
    listenerCount: (channel?: string) => number;
  }
}
