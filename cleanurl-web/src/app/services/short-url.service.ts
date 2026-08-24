import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreateShortUrlRequest, ShortUrlResponse } from '../models/short-url.model';

@Injectable({
  providedIn: 'root',
})
export class ShortUrlService {
  private readonly baseUrl = `${environment.apiUrl}/urls`;

  constructor(private readonly http: HttpClient) {}

  create(originalUrl: string): Observable<ShortUrlResponse> {
    const payload: CreateShortUrlRequest = { originalUrl };
    return this.http.post<ShortUrlResponse>(this.baseUrl, payload);
  }
}
