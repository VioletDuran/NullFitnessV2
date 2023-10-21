// config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly mainUrl: string = 'http://localhost:3000';
  public readonly userUrl: string = '/users';
  public readonly rutinasUrl: string = '/rutina';
  public readonly gptUrl: string = '/gpt';
  public readonly ejercicioUrl: string = '/ejercicio';
  // Otras variables globales que necesites
  constructor() { }
}