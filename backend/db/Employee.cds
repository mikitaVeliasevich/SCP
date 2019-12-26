using Id from './Position';
using Address from './Address';

entity Employee {
    key eid : Id;
    pid : Id;
    name: String(100);
    surname : String(100);
    email: String(100);
    phoneNumber: String(100);

    toAddress : association to one Address on toAddress.eid = eid;
};