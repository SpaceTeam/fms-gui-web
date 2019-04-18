import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Logger {

  constructor() { }

  static log(msg: any) { console.log(msg); }
  static error(msg: any) { console.error(msg); }
  static warn(msg: any) { console.warn(msg); }
}
