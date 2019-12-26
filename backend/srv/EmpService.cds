using Employee as _Employee from '../db/Employee';
using Address as _Address from '../db/Address';
using Position as _Position from '../db/Position';

service odata {

  entity Employees @(
		title: 'Employees'
	) as projection on _Employee;

  entity Addresses @(
		title: 'Addresses'
	) as projection on _Address;

    entity Positions @(
		title: 'Positions'
	) as projection on _Position;

}
