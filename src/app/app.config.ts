import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

const routesSecond = routes.map(r => {
  if (r.path != "**") {
    return {
      ...r,
      'outlet': 'second'
    }
  } else {
    return r;
  }
});

const routesThird = routes.slice().map(r => {
  if (r.path != "**") {
    return {
      ...r,
      'outlet': 'third'
    }
  } else {
    return r;
  }
});

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideRouter(routesSecond), provideRouter(routesThird)],
};
