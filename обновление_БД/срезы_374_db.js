import googleSh from "../Class/googleSh.js";
import pg from 'pg'; const Client = pg.Client;


const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});

pg_cl.connect();

let session = new googleSh();

let head = ['prefix', 'list_name', 'city', 'hr_manager_id', 'hr_manager_name', 'sale_director_id',
  'sale_director_name', 'sale_manager_id', 'sale_manager_name', 'employee_id', 'employee_name',
  'post_type', 'status', 'group_0', 'priority_status', 'employment_date', 'dismissal_date', 'delete_date',
  'additional_staff', 'working_type', 'working_status', 'additional_work_address', 'position_type',
  'work_address', 'department', 'post', 'attraction_form', 'attraction_sourse'];
// head = head.map(item => item.toLowerCase());


// await pg_cl.query(`TRUNCATE public.empty_tab`);

// let m = new Map([
//   ["2023-12-01 0:00:00", "1L5pO4KPIIxCigWmlHmB2h7p1qlqT-w3aNc282tzyGbo"],
//   ["2024-01-01 0:00:00", "15ZwG-axlluo3TpESMX_VFioqsMSWsJ1dNvL2NO86uTA"],
//   ["2024-02-01 0:00:00", "1Y7TKRiiLDeiUmHMoQSGN-pXbtRfcivfJ2JVFU8jWncw"],
//   ["2024-03-01 0:00:00", "1fyXAwMvY-EKDYGkuDWQo4mf8W_zBvqQt6iguURbli2s"],
//   ["2024-04-01 0:00:00", "1FSDrLkAvT4060i4YwWCYu_Muboi-4ymkV3-4IsF2xLM"]
// ]);

// for (let [key, value] of m) {
//   console.log(key, value);
//   await importInBD(key, value);
// }

// async function importInBD(key, value) {
//   let date;
//   date = await session.scanSheet(value, "A:Z", key);
//   // date = date.filter(item => item[11] == "АУП" && item[12] == "Активен" && item[22] !== "null");
//   date = session.objToSQLRow(head, session.rowToObject(head, date));
//   await pg_cl.query(`INSERT INTO public.empty_tab (${head.join(',').toLowerCase()}) VALUES ${date}`);
// }



let q = await pg_cl.query(`select * from public.empty_tab`);

// debugger;

// let sourse = q.rows.filter(item => item['prefix'] === '2024-03-01 0:00:00');
// let sourseObj = {};
// sourse.map(item => sourseObj[item['employee_id']] = item);

let destination = q.rows.filter(item => item['prefix'] === '2024-04-01 0:00:00'/*  || item['prefix'] === '2024-01-01' || item['prefix'] === '2024-02-01' */);


let i = 0;

for (let destinationItem of destination) {

  i += 1;

  console.log(i, destination.length);

  // let qw = sourseObj[destinationItem['employee_id']];
  // if (!qw) { continue; }
  // let qqw = ['position_type', 'work_address', 'department', 'post', 'attraction_form', 'attraction_sourse',];
  // debugger;

  // for (let key of qqw) { destinationItem[key] = qw[key]; }

  let res = [];

  for (let val of head) {
    res.push(destinationItem[val]);
  }

  res = session.objToSQLRow(head, session.rowToObject(head, [res]));

  await pg_cl.query(`INSERT INTO public.slice_374 (${head.join(',').toLowerCase()}) VALUES ${res}`);
}

// await pg_cl.query(`TRUNCATE public.sl_374`);

pg_cl.end();



