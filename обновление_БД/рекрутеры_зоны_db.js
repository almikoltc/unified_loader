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
    // .map(item => item.map(el => el == '' ? 'null' : el))
    // .map(item => item.map(el => el == '-' ? 'null' : el))
    .map(item => "('" + item.join("','") + "')")
    .join(',');
};

pg_cl.connect();

let res = await session.getData('1xPSW6llM14y0Q23SJlkEYWg7M9zTbxglqIxMO2ET9B0', 'свод рекрутер-светофор!A2:F');
res = res
  .map(item => [...item.slice(0, 1), item[5], ...item.slice(2, 5)]);
debugger;
res = dbFormat(res);
await pg_cl.query(`TRUNCATE public.recruiters_rating_zone`);
await pg_cl.query(`INSERT INTO public.recruiters_rating_zone VALUES ${res}`);
console.log('end');


pg_cl.end();

