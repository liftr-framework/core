import { Router } from "express";

export default function Module(moduleData:any[]) {
    const router = Router();
    const variables = moduleData.map((object: any) => object.route);
    // this is the mapped routes
    variables.map((routeInfo) => {
        const { path, method, handlers } = routeInfo;
        return routerBuilder(router, path, method, handlers)
    })
    return router;
}

function routerBuilder(router: Router, path: string, method: string, handlers: any): Router {
    switch(method) {
        case 'get':
            router = router.get(path, ...handlers)
            break;
        case 'post':
            router = router.post(path, ...handlers)
            break;
        case 'patch':
            router = router.patch(path, ...handlers)
            break;
        case 'delete':
            router = router.delete(path, ...handlers)
            break;
        case 'put':
          router = router.put(path, ...handlers)
          break;
        default:
            break;
      }
      return router;
}