import { APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { DbService } from './app/core/db/db.service';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

function initDatabaseFactory(dbService: DbService): () => Promise<void> {
  return async () => {
    try {
      await dbService.init();
    } catch (error) {
      console.error('[App] Database initialization failed', error);
    }
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initDatabaseFactory,
      deps: [DbService],
    },
  ],
});
