# req.validate(data, schema)

Under the `Request` object of Express you have access to a validation method. This validate uses joi and therefore requires a schema to be passed to validate the data.

- `data` `<any>` Data that requires validation
- `schema` `<joi.SchemaLike>` joi.Schema used to validate whatever is passed in the first parameter
- `options` `<joi.ValidationOptions>` options for the joi.validate function



