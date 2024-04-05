import EsoftAPI from "../Class/EsoftAPI.js";
import requestArr from './query1022_DarBol.json' assert { type: 'json' };
import pg from 'pg'; const Client = pg.Client;


const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});

pg_cl.connect();
// await pg_cl.query(`TRUNCATE public.hr_funnel_374`);

let from = '2024-03-01', to = '2024-04-01';

await pg_cl.query(`DELETE FROM public.hr_funnel_374 WHERE date_vihoda_na_raboty between '${from}' and '${to}' `);
requestArr[1].filterQuery[0].values = [`${from} TO ${to}`];
let head = requestArr[1].displayedFieldsArr;

console.log(requestArr[1].filterQuery[0].values);

for (let request of [requestArr[1]]) {
  // console.log(request.report, request.displayedFieldsArr);
  let dateAPI374 = new EsoftAPI(request);
  /*  Поулчение данных из api  */
  let valueCount = await Promise.race([dateAPI374.valueCount()]).then(res => res);
  debugger;
  console.log(valueCount);
  // valueCount = 3;
  let res = [];
  let chunk = 25000;
  let resIter;
  for (let i = 0; i < valueCount; i = i + chunk) {
    console.log(i, i + chunk, valueCount);
    // ожидание ответа
    resIter = await dateAPI374.value(i, chunk).then(res => res);
    /* Формирование строки для квери запроса для загрузки в базу данных */
    res = Object.values(resIter)
      .map(item => '(' + head.map(h => `${item[h] == undefined ? "null" : `'${item[h]}'`}`) + ')').toString();
    try {
      debugger;
      await pg_cl.query(`INSERT INTO public.hr_funnel_374 VALUES ${res}`);
    } catch (error) {
      console.log(res);
    }
  }
}
pg_cl.end();