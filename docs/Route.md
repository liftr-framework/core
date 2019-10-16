# Route.<method>(path, ...handlers)

The `Route` contains all the REST methods to create endpoints. This works just like an Express router. You add the path and any middlewares/controller 

- `path` `<string>` Path of the sub-route
- `...handlers` `<RequestHandler[]>` Any Express middlewares/controller can be passed here
