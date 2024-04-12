// import mysql2 from 'mysql2';

// import { cfglb } from "config-custom";

/*
    sử dụng kiểu khai báo biến const cho 1 đối tượng  , không sử dụng return hàm :
    > khi sử dụng return , thì mỗi lần gọi hàm sẽ return ra 1 connect , 10 lần sẽ return ra 10 connect 
    > sử dụng khai báo biến , khi sử dụng sẽ trỏ đến vùng nhớ chứa đối tượng đó 
*/

// export var CONNECTION_POOL_dbAdxNotice = mysql2.createPool({
//     host: cfglb.dbAdxNotice.host,
//     port: cfglb.dbAdxNotice.port,
//     user: cfglb.dbAdxNotice.user,
//     password: cfglb.dbAdxNotice.password,
//     database: cfglb.dbAdxNotice.dbname,
//     connectionLimit: 15,
//     connectTimeout: 15000,
//     supportBigNumbers: true,
//     bigNumberStrings: true,
//     multipleStatements: true
// });