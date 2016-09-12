import { Router, Request, Response } from 'express';
import { find } from './utils';
import { Connection, Topic } from './sse';
import * as mockEmployees from '../mockdata/employees';
import * as mockDepartments from '../mockdata/departments';


export const employees = Router();


// Employees list
employees.get('/', (_: Request, res: Response) => {
    res.json(mockEmployees.map(simplify));
});


// Realtime updates
const clients = new Topic();
employees.get('/updates', (_: Request, { sseConnection }: Response) => {
    sseConnection.setup();
    clients.add(sseConnection);
    sendUpdates(sseConnection);
});


// A single employee detail information
employees.get('/:id', (req: Request, res: Response) => {
    const employee = findEmployee(req);
    if (employee) {
        res.json(enrich(employee));
    } else {
        res.status(404).send(`Employee ${req.params['id']} does not exist.`);
    }
});


// Cast a vote
employees.post('/:id/vote', (req: Request, res: Response) => {
    const employee = findEmployee(req);
    if (!employee) {
        res.sendStatus(404);
        return;
    }

    employee.votes = employee.votes + 1 || 1;
    res.sendStatus(200);

    clients.forEach(sendUpdates);
});


function sendUpdates(conn: Connection) {
    conn.send(mockEmployees.map(({ id, votes = 0 }) => ({ id, votes })));
}

function findEmployee(req: Request) {
    const id = +req.params['id'];
    return find(mockEmployees, e => e.id === id);
}

function enrich({ id, name, job, hiredate, salary, commission, manager, department }: mockEmployees.Employee) {
    return {
        id,
        name,
        job,
        hiredate,
        salary,
        commission,
        manager: simplify(find(mockEmployees, e => e.id === manager)),
        subordinates: mockEmployees.filter(e => e.manager === id).map(simplify),
        department: find(mockDepartments, d => d.id === department),
    };
}

function simplify(emp?: mockEmployees.Employee) {
    if (!emp) return emp;
    const { id, name, job, votes = 0 } = emp;
    return { id, name, job, votes };
}
