type Id : String(4);
using Employee from './Employee';


entity Position {
    key pid : Id;
    name : String(100);
    salary: Double;

    toEmployees : association to many Employee on toEmployees.pid = pid;
};