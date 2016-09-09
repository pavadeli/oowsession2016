import * as express from 'express';
import { employees } from './employees';


express()

    // Logging
    .use((req: express.Request, _: express.Response, next: express.NextFunction) => {
        console.log(req.method, req.url);
        next();
    })

    .use('/employees', employees)

    .listen(8080);

console.log('Mock services started');
