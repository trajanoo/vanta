import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
declare const gapi: any;
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendar {

  private CLIENT_ID = environment.GOOGLE_CLIENT_ID;
  private SCOPES = 'https://www.googleapis.com/auth/calendar';

  private tokenClient: any;
  private isGapiLoaded = false;

  constructor() {
    this.init();
  }

  private async init() {
    await new Promise<void>((resolve) => {
      gapi.load('client', () => resolve());
    });

    await gapi.client.init({
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });

    this.isGapiLoaded = true;

    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (resp: any) => {
        if (resp.access_token) gapi.client.setToken({ access_token: resp.access_token });
      },
    });
  }

  async authenticate() {
    return new Promise<void>((resolve, reject) => {
      this.tokenClient.callback = (resp: any) => {
        if (resp.error) return reject(resp);
        resolve();
      };

      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  async createEvent(task: { title: string; date: string; description?: string }) {
    if (!this.isGapiLoaded) throw new Error('GAPI not loaded');
  
    await this.authenticate();
  
    const [year, month, day] = task.date.split("-").map(Number);

    const start = new Date(year, month - 1, day, 9, 0, 0);
    const end = new Date(year, month - 1, day, 9, 30, 0);
  
    const event = {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: start.toISOString().replace("Z", ""),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: end.toISOString().replace("Z", ""),
        timeZone: 'America/Sao_Paulo',
      },
    };
  
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
  
    return response;
  }
}
