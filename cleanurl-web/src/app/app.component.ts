import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ShortUrlService } from './services/short-url.service';
import { ShortUrlResponse } from './models/short-url.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  originalUrl = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<ShortUrlResponse | null>(null);
  copied = signal(false);

  constructor(private readonly shortUrlService: ShortUrlService) {}

  onSubmit(): void {
    const url = this.originalUrl.trim();

    if (!url) {
      this.errorMessage.set('Informe uma URL para encurtar.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.result.set(null);
    this.copied.set(false);

    this.shortUrlService.create(url).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(this.extractErrorMessage(err));
        this.loading.set(false);
      },
    });
  }

  copyToClipboard(): void {
    const short = this.result();
    if (!short) {
      return;
    }

    navigator.clipboard
      .writeText(short.shortUrl)
      .then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      })
      .catch(() => {
        this.errorMessage.set('Não foi possível copiar o link automaticamente.');
      });
  }

  reset(): void {
    this.originalUrl = '';
    this.result.set(null);
    this.errorMessage.set(null);
    this.copied.set(false);
  }

  private extractErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Não foi possível conectar à API. Verifique se o servidor está rodando.';
    }

    const apiMessage = err.error?.message;
    if (Array.isArray(apiMessage)) {
      return apiMessage.join(' ');
    }
    if (typeof apiMessage === 'string') {
      return apiMessage;
    }

    return 'Ocorreu um erro ao encurtar a URL. Tente novamente.';
  }
}
