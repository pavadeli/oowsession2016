import * as express from 'express';
import { employees } from './employees';


express()

    // Logging
    .use((req: express.Request, _: express.Response, next: express.NextFunction) => {
        console.log(req.method, req.url);
        next();
    })

    .use('/employees', employees)

    .use((req: express.Request, res: express.Response) => {
        res.status(404).send(`Unknown request: "${req.method} ${req.url}". Try: "GET /employees".`);
    })

    .listen(8080);

console.log('Mock services started');
