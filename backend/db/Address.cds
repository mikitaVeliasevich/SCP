using Id from './Position';

entity Address {
    key adid : Id;
    eid : Id;
    city : String(100);
    street : String(100);
    houseNum : Integer;
    flatNum: Integer;
};