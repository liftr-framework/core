import { Router, RequestHandler } from "express";
import { RouteComponent, ModuleData, ModuleReturnData } from "../interfaces";

/**
 * The Module is a structure to builds the routes with related middleware
 * It has an optional schema inclusion for creating documentation of your routes
 */
export function Module(moduleData: ModuleData[]) : ModuleReturnData {
    const router = Router();
    for (let index = 0; index < moduleData.length; index++) {
        const middleware = moduleData[index].middleware;
        const { path , method, handlers } = moduleData[index].route;
        routerBuilder(router, path, method, middleware, handlers);
    };
    return { router, moduleData };
}

export const Route  =  {
    get(path: string, ...handlers: RequestHandler[]): RouteComponent {
        return {
            path,
            method: 'get',
            handlers,
        }
    },
    post(path: string, ...handlers: RequestHandler[]): RouteComponent {
        return {
            path,
            method: 'post',
            handlers,
        }
    },
    patch(path: string, ...handlers: RequestHandler[]): RouteComponent {
        return {
            path,
            method: 'patch',
            handlers,
        }
    },
    delete(path: string, ...handlers: RequestHandler[]): RouteComponent {
        return {
            path,
            method: 'delete',
            handlers,
        }
    },
    put(path: string, ...handlers: RequestHandler[]): RouteComponent {
        return {
            path,
            method: 'put',
            handlers,
        }
    },
};


function routerBuilder(router: Router, path: string, method: string, middleware: any[], handlers: any): Router {
    switch(method) {
        case 'get':
            router = router.get(path, ...middleware, ...handlers);
            break;
        case 'post':
            router = router.post(path, ...middleware, ...handlers);
            break;
        case 'patch':
            router = router.patch(path, ...middleware, ...handlers);
            break;
        case 'delete':
            router = router.delete(path, ...middleware, ...handlers);
            break;
        case 'put':
          router = router.put(path, ...middleware, ...handlers);
          break;
        default:
            break;
      }
      return router;
}
