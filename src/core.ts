import { Application, Router } from 'express';
import { LiftrDocs } from 'liftr-docs';
import { SwaggerRequestBody, SwaggerDescriptionInfo, SwaggerServers } from './interfaces';

/**
 * The Liftr class contains methods to run a Liftr Server
 * See the documentation for a clear overview of what each one does.
 */
export class Liftr {
    routes: AppRouter[];
    app: Application;
    constructor(routes:AppRouter[], app:Application) {
        this.routes = routes;
        this.app = app;
    }


    /**
     * The server method runs the Application that is passed based on the port and configuration already set
     * @type {Application}
     * @param app  An express Application is passed here to start the server
     */
    static server(app: Application) {
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
     * @type {AppRouter}
     * @param routes The routes setup in the LiftrRoutingModule are passed here
     * @type {Application}
     * @param app  An express Application is passed here to start the server
     */
    static setRoutes(routes: AppRouter[], app: Application) {
        return routes.forEach((route: AppRouter) => app.use(route.path, route.middleware, route.handler));
    }

    /**
     * The useDocs runs LiftrDocs under the hood.
     * Refer to the documentation for more details https://github.com/farisT/liftr-docs
     * @type {Application}
     * @param app  An express Application is passed here to start the server
     * @type {AppRouter}
     * @param routes The routes setup in the LiftrRoutingModule are passed here
     * @type {SwaggerDescriptions}
     * @param swaggerDescriptions
     * @type {SwaggerResponses}
     * @param swaggerResponses
     */

    static useDocs(app: Application, routes:AppRouter[], swaggerDescriptions: SwaggerDescriptions, swaggerResponses: SwaggerResponses) {
        return app.use('/docs', LiftrDocs(routes, swaggerDescriptions, swaggerResponses));
    }

    // static RoutingModule(routes: any){
    //     console.log(routes);
    //     // routes[0].middleware.push('hello')
    //     // console.log(routes[0].handler.name)
    // }

    // static Route() {
    //     return Router();
    // }
}

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
