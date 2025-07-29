// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// PrimeNG v19+ Theme Config
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { MessageService, ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    importProvidersFrom(FormsModule),
    MessageService,
    ConfirmationService,

    // ✅ PrimeNG Theme com personalização tipo Nubank/Wise
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          colors: {
            primary: '#7c3aed',        // Roxo Nubank
            primaryAlt: '#a78bfa',     // Roxo claro
            accent: '#10b981',         // Verde Wise
            accentAlt: '#6ee7b7',      // Verde claro
            surface: '#f4f4f5',        // Cinza claro de fundo
            content: '#111827',        // Texto escuro
            border: '#d1d5db',         // Borda leve
            error: '#ef4444',          // Vermelho alerta
            warning: '#f59e0b',        // Amarelo alerta
            info: '#3b82f6',           // Azul claro
            success: '#22c55e'         // Verde sucesso
          },
          radius: '0.75rem',  // bordas arredondadas
          scale: 1,           // tamanho padrão
          fontFamily: "'Inter', sans-serif"
        }
      }
    })
  ]
};
