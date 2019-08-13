import { Application, Router, RequestHandler } from 'express';
import { LiftrDocs } from '@liftr/docs';
import { SwaggerRequestBody, SwaggerDescriptionInfo, SwaggerServers } from './interfaces';
import * as joiObject from 'joi';

declare global {
    namespace Express {
      interface Request  {
        session?: Session;
        validate(data: string| Object, schema: joi.Schema): Promise<any>;
      }
      interface SessionData {
        [key: string]: any;
      }
  
      interface Session extends SessionData {
        isValid(issuer: string): boolean;
        hasFunctionality(functionalityId: string): boolean;
        get(attr: string): any;
        logout(res: Express.Request, cookieDomain: string): void;
        fetch(id: string, logging: any): Promise<any>;
        destroy(id: string, res: Response, cookieDomain: string, logging: any): Promise<any>;
      }
    }
  }

// declare module 'express-serve-static-core' {

//     interface Router extends {
//         post: Express;
//     }
//     interface Request {
//       myField?: string
//     }
//     interface Response {
//       myField?: string
//     }
//   }
/**
 * The Liftr class contains methods to run a Liftr Server
 * See the documentation for a clear overview of what each one does.
 */

 // TODO: Remove class and make it function based (running class is too much overhead)
export class Liftr {
    routes: AppRouter[];
    app: Application;
    constructor(routes:AppRouter[], app:Application) {
        this.routes = routes;
        this.app = app;
    }

    /**
     * The server method runs the Application that is passed based on the port and configuration already set
     * @param {Application} app  An express Application is passed here to start the server
     */
    public server(app: Application) {

       return app.listen(app.get('port'), () => {
            console.log(
                'App is running on http://localhost:%d in %s mode',
                app.get('port'),
                app.get('env'),
            );
        });
    }

    /**
     * The setRoutes method loops through the routes and sets them on the Application server
     * @param {AppRouter[]} routes The routes setup in the LiftrRoutingModule are passed here
     * @param {Application} app  An express Application is passed here to start the server
     */
    public setRoutes(routes: AppRouter[], app: Application) {
        return routes.forEach((route: AppRouter) => app.use(route.path, route.middleware, route.handler));
    }

    /**
     * The useDocs runs LiftrDocs under the hood.
     * Refer to the documentation for more details https://github.com/farisT/liftr-docs
     * @param {Application} app  An express Application is passed here to start the server
     * @param {AppRouter[]} routes The routes setup in the LiftrRoutingModule are passed here
     * @param  {SwaggerDescriptions} swaggerDescriptions
     * @param {SwaggerResponses} swaggerResponses
     */

    public useDocs(app: Application, routes:AppRouter[], swaggerDescriptions: SwaggerDescriptions, swaggerResponses: SwaggerResponses) {
        return app.use('/docs', LiftrDocs(routes, swaggerDescriptions, swaggerResponses));
    }
}

/**
 * The setRoutes method loops through the routes and sets them on the Application server
 * @param {AppRouter[]} routes The routes setup in the LiftrRoutingModule are passed here
 * @param {Application} app  An express Application is passed here to start the server
*/
function setRoutes(app: Application, routes: AppRouter[]) {
    return routes.forEach((route: AppRouter) => app.use(route.path, route.middleware, route.handler));
}

/**
 * The useDocs runs LiftrDocs under the hood.
 * Refer to the documentation for more details https://github.com/farisT/liftr-docs
 * @param {Application} app  An express Application is passed here to start the server
 * @param {AppRouter[]} routes The routes setup in the LiftrRoutingModule are passed here
 * @param  {SwaggerDescriptions} swaggerDescriptions
 * @param {SwaggerResponses} swaggerResponses
 */
export function useDocs(
    app: Application, 
    routes:AppRouter[],
    swaggerDescriptions: SwaggerDescriptions,
    swaggerResponses: SwaggerResponses
    ) {
    return app.use('/docs', LiftrDocs(routes, swaggerDescriptions, swaggerResponses));
}

async function validate(data: string | Object, schema: joi.Schema ) {
    console.log('hahahahahah')
}

function setValidateObject(app: Application) {
    app.use((req, res, next) => {
        req.validate = validate;
        next();
    });
}



export function server(app: Application, routes: AppRouter[]) {
    setValidateObject(app);
    setRoutes(app, routes);
    return app.listen(app.get('port'), () => {
        console.log(
            'App is running on http://localhost:%d in %s mode',
            app.get('port'),
            app.get('env'),
        );
    });
}

/**
 * define joi dependency for use within api
 * make sure to keep joi updated
 */
export const joi = joiObject;

/**
 * AppRouter interface contains the necessary typing for the LiftrRoutingModule
 */
export interface AppRouter {
    path: string;
    middleware: any[];
    handler: Router;
}

/**
 * The SwaggerResponses interface is used to categorize the necessary swagger fields for liftr-docs
 * For more info check https://github.com/farisT/liftr-docs
 */
export interface SwaggerResponses {
    responses?: any;
    requestBody: SwaggerRequestBody
}

/**
 * The SwaggerDescriptions interface is used to categorize the necessary swagger fields for liftr-docs
 * For more info check https://github.com/farisT/liftr-docs
 */
export interface SwaggerDescriptions {
    info: SwaggerDescriptionInfo;
    servers: [SwaggerServers]
    openapi: string;
    paths?: any;
}
