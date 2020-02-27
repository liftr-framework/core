import { Application, Request, Response, NextFunction } from 'express';
import { validate } from '@hapi/joi';
import { AppRouter } from './interfaces';


/**
 * Applies the req.validate to the request object with joi validation function
 */
export function setValidationObject(app: Application): void {
    app.use((req: Request, res: Response, next: NextFunction) => {
        req.validate = validate;
        next();
    });
}

/**
 * The setRoutes method loops through the routes and sets them on the Application server
*/
export function setRoutes(app: Application, routes: AppRouter[]) {
  	return routes.forEach((route: AppRouter) => app.use(route.path, route.middleware, route.module.router));
}

/**
 * flatten arrays that are nested
*/
export function flatten(arr: any[]) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }
