declare namespace mockData {
    export interface Employee {
        id: number;
        name: string;
        job: string;
        manager: number;
        hiredate: string;
        salary: number;
        commission: number;
        department: number;
    }
}
declare const mockData: mockData.Employee[];
export = mockData;
