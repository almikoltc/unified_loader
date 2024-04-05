import googleSh from "../Class/googleSh.js";
import pg from 'pg'; const Client = pg.Client;
import dotenv from 'dotenv';
dotenv.config();

/* получение данных из гугл */
let session = new googleSh();

/* подлючение к базе данных */
const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});


let dbFormat = (arr) => {
  return arr
    .map(item => item.map(el => el == '' ? 'null' : el))
    .map(item => item.map(el => el == '-' ? 'null' : el))
    .map(item => "('" + item.join("','") + "')")
    .join(',');
};

pg_cl.connect();

let res = await session.getData('1nonRuxYizLzOLLvVmnT1DXtHbbsPzn-I-sz1lL0npQ8', 'СВОД!A2:R');
res = res
  .map(item => [...item.slice(0, 11), ...item.slice(12, 14), item[17]])
  .filter(item => item[1] != "")
  .filter(item => item[11] != "-");
res = dbFormat(res);
debugger;
await pg_cl.query(`TRUNCATE public.cities_catalog`);
await pg_cl.query(`INSERT INTO public.cities_catalog VALUES ${res}`);
console.log('end');


pg_cl.end();

