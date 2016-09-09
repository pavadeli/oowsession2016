declare namespace mockData {
    export interface Department {
        id: number;
        name: string;
        location: string;
    }
}
declare const mockData: mockData.Department[];
export = mockData;
