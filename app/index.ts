import * as express from 'express';
import * as cors from 'cors';
import { employees } from './employees';
import { sseMiddleware } from './sse';

express()

    // Enable cors
    .use(cors())

    // Enable Server-Sent Events    
    .use(sseMiddleware)

    // Logging
    .use((req: express.Request, _: express.Response, next: express.NextFunction) => {
        console.log(req.method, req.url);
        next();
    })

    // Install the "employees" module
    .use('/employees', employees)

    .get('/', express.static('./app/demo'))

    // Fallback    
    .use((req: express.Request, res: express.Response) => {
        res.status(404).send(`Unknown request: "${req.method} ${req.url}". Try: "GET /employees".`);
    })

    // Go!    
    .listen(8080);

console.log('Mock services started');
