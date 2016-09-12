import { Request, Response, NextFunction } from 'express';

// We extend the Response interface as follows:
declare module 'express' {
    interface Response {
        sseConnection: Connection
    }
}

// ... with this middleware:
export function sseMiddleware(_: Request, res: Response, next: NextFunction) {
    res.sseConnection = new Connection(res);
    next();
}

/**
 * A Connection is a simple SSE manager for 1 client.
 */
export class Connection {
    constructor(public readonly res: Response) { }

    setup() {
        this.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        })
    }

    send(data: {}) {
        this.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}

/**
 * A Topic handles a bundle of connections with cleanup after lost connection.
 */
export class Topic {
    private connections: Connection[] = [];

    add(conn: Connection) {
        const { connections } = this;
        connections.push(conn);

        console.log('New client connected, now: ', connections.length);
        conn.res.on('close', () => {
            const i = connections.indexOf(conn);
            if (i >= 0) {
                connections.splice(i, 1);
            }
            console.log('Client disconnected, now: ', connections.length);
        });
    }

    forEach(cb: (conn: Connection) => void) {
        this.connections.forEach(cb);
    }
}
