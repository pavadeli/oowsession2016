import { Router, Request, Response } from 'express';
import { find } from './utils';
import * as mockEmployees from '../mockdata/employees';
import * as mockDepartments from '../mockdata/departments';


export const employees = Router()

    .get('/', (_: Request, res: Response) => {
        res.json(mockEmployees.map(simplify));
    })

    .get('/:id', (req: Request, res: Response) => {
        const id = +req.params['id'];
        const employee = find(mockEmployees, e => e.id === id);
        if (employee) {
            res.json(enrich(employee));
        } else {
            res.status(404).send(`Employee ${req.params['id']} does not exist.`);
        }
    });


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
    const { id, name, job } = emp;
    return { id, name, job };
}
