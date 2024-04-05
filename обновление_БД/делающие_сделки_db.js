import googleSh from "../Class/googleSh.js";
import axios from 'axios';
import pg from 'pg'; const Client = pg.Client;
import dotenv from 'dotenv'; import { drivelabels_v2beta } from "googleapis";
dotenv.config();


/* получение данных из гугл */
let session = new googleSh();


let dbFormat = (arr) => {
  return arr
    .map(item => item.map(el => el == '' ? 'null' : el))
    .map(item => item.length == 8 ? item : [...item, 0])
    .map(item => "('" + item.join("','") + "')")
    .join(',');
};

let dbFormat1 = (arr, strLength) => {
  return arr
    .map(item => item.map(el => el == '' ? 'null' : el))
    .map(item => setLength(item, strLength))
    .map(item => "('" + item.join("','") + "')")
    .join(',');
};

let setLength = (arr, length) => {
  if (arr.length < length) {
    arr = [...arr, 'null'];
    return setLength(arr, length);
  } else {
    return arr;
  }
};

/* подлючение к базе данных */
const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});
pg_cl.connect();

let res = await session.getData('1N2qbjUnp2el3IXV8d_xniv5zd6nEiL8EuGa3aQOF9fw', 'Data!A2:H');
let res1 = await session.getData('1gqIm95L2SCx8SayzvE_CwQx32ttNgFwjbsyR50BNf08', 'Data!A2:H');
await pg_cl.query(`TRUNCATE public.making_deals`);
await pg_cl.query(`INSERT INTO public.making_deals VALUES ${dbFormat(res, 8)}`); console.log('Далающие сделки ч1');
await pg_cl.query(`INSERT INTO public.making_deals VALUES ${dbFormat(res1, 8)}`); console.log('Далающие сделки ч2');

res = await session.getData('1N2qbjUnp2el3IXV8d_xniv5zd6nEiL8EuGa3aQOF9fw', 'Data численность!A2:G');
res1 = await session.getData('1gqIm95L2SCx8SayzvE_CwQx32ttNgFwjbsyR50BNf08', 'Data численность!A2:G');
debugger;
await pg_cl.query(`TRUNCATE public.making_deals_all_employees`);
await pg_cl.query(`INSERT INTO public.making_deals_all_employees VALUES ${dbFormat1(res, 7)}`); console.log('Общ численность ч1');
await pg_cl.query(`INSERT INTO public.making_deals_all_employees VALUES ${dbFormat1(res1, 7)}`); console.log('Общ численность ч2');

pg_cl.end();

