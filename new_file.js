import googleSh from "./Class/googleSh.js";
import pg from 'pg'; const Client = pg.Client;
import fs from 'fs';


const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});

const session = new googleSh();

pg_cl.connect();

let slice_374 = await pg_cl.query(`select * from public.slice_374`);
fs.writeFileSync('./d.json', JSON.stringify(slice_374.rows));
debugger;

let indicators = {};

function analiticsSlice(object, key, value = null) {
  // debugger;
  if (!object[key]) {
    object[key] = {};
  }
  if (value) {
    object[key] = { [value]: null };
  }
}

slice_374.rows
  .filter(item => item.post_type == 'Специалист отдела продаж' && item.status == 'Активен')
  .forEach(slice_item => {
    /* Проверка по типу должности */
    /* Дата */
    analiticsSlice(indicators, slice_item.prefix);
    /* Город */
    analiticsSlice(indicators[slice_item.prefix], slice_item.city);
    /* hr_manager по факту*/
    analiticsSlice(indicators[slice_item.prefix][slice_item.city], "hr_manager");
    analiticsSlice(indicators[slice_item.prefix][slice_item.city]["hr_manager"], slice_item.hr_manager_id);
    analiticsSlice(indicators[slice_item.prefix][slice_item.city]["hr_manager"], slice_item.hr_manager_id, slice_item.hr_manager_name);
    /* sale_manager по факту */
    analiticsSlice(indicators[slice_item.prefix][slice_item.city], "sale_manager");
    analiticsSlice(indicators[slice_item.prefix][slice_item.city]["sale_manager"], slice_item.sale_manager_id);
    analiticsSlice(indicators[slice_item.prefix][slice_item.city]["sale_manager"], slice_item.sale_manager_id, slice_item.sale_manager_name);
  });

slice_374.rows
  .filter(item => item.post_type == 'Менеджер отдела продаж' && item.status == 'Активен')
  .forEach(slice_item => {
    /* Проверка по типу должности */
    /* Дата */
    analiticsSlice(indicators, slice_item.prefix);
    /* Город */
    analiticsSlice(indicators[slice_item.prefix], slice_item.city);
    analiticsSlice(indicators[slice_item.prefix][slice_item.city], "sale_manager");
    analiticsSlice(indicators[slice_item.prefix][slice_item.city]["sale_manager"], slice_item.employee_id);
  });

slice_374.rows
  .filter(item => item.position_type == 'Рекрутер (СПН)' && item.status == 'Активен')
  .forEach(slice_item => {
    /* Проверка по типу должности */
    /* Дата */
    analiticsSlice(indicators, slice_item.prefix);
    /* Город */
    analiticsSlice(indicators[slice_item.prefix], slice_item.city);
    analiticsSlice(indicators[slice_item.prefix][slice_item.city], "hr_manager");
    analiticsSlice(indicators[slice_item.prefix][slice_item.city]["hr_manager"], slice_item.employee_id);
  });

// debugger;
let indicatorsUp = [];

Object.keys(indicators).map(date_item => {
  Object.keys(indicators[date_item]).map(city_item => {
    Object.keys(indicators[date_item][city_item]).map(post_item => {
      Object.keys(indicators[date_item][city_item][post_item]).map(id_item => {
        Object.keys(indicators[date_item][city_item][post_item][id_item]).map(name_item => {
          indicatorsUp.push({
            date: date_item,
            city: city_item,
            post: post_item,
            id: id_item,
            name: name_item,
          });
        });
      });
    });
  });
});

debugger;

pg_cl.end();