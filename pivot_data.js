import googleSh from "./Class/googleSh.js";
import pg from 'pg'; const Client = pg.Client;
import fs from 'fs';

const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});

const session = new googleSh();

pg_cl.connect();

let slice_374 = await pg_cl.query(`
SELECT
public.slice_374.prefix,
public.cities_catalog.category_f,
public.cities_catalog.country,
public.cities_catalog.category_size,
public.slice_374.city,
public.slice_374.hr_manager_id,
public.slice_374.hr_manager_name,
public.slice_374.sale_director_id,
public.slice_374.sale_director_name,
public.slice_374.employee_id,
public.slice_374.post_type,
public.slice_374.status,
public.slice_374.group_0,
public.slice_374.priority_status,
public.slice_374.employment_date,
public.slice_374.dismissal_date,
public.slice_374.additional_staff,
public.slice_374.position_type,
public.slice_374.department,
public.slice_374.attraction_form,
public.slice_374.attraction_sourse
FROM public.slice_374
LEFT JOIN public.cities_catalog on public.slice_374.city = public.cities_catalog.city
`);

fs.writeFileSync('./d.json', JSON.stringify(slice_374.rows));

debugger;
console.log(slice_374.rowCount);

let uniqDate = {};
let addEmptyObj = {};

slice_374.rows.forEach(item => { /* Перевод функциональный / номинальных специалистов */

  let month = item.prefix;

  if (!uniqDate[month]) {
    uniqDate[month] = {
      activeSaleManager: new Map(),
      activeRecruit: new Map()
    };
  }

  if (!addEmptyObj[month]) {
    addEmptyObj[month] = {
      saleManager: [],
      hrManager: []
    };
  }

  // debugger;

  /* Поиск рекрутеров */

  uniqDate[month].activeRecruit.set(item.hr_manager_id, "real"); /* по факту функционала */

  if (item.position_type === 'Рекрутер (СПН)' && item.status === 'Активен') {
    if (!uniqDate[month].activeRecruit.has(item.employee_id)) {
      uniqDate[month].activeRecruit.set(item.employee_id, "nominal");  /* по типу должности */
      addEmptyObj[month]['hrManager'] = [...addEmptyObj[month]['hrManager'], item];
    }
  }

  // /* Поиск МОП */

  uniqDate[month].activeRecruit.set(item.sale_manager_id, "real"); /* по факту функционала */

  if (item.post_type === 'Менеджер отдела продаж' && item.status === 'Активен') {
    if (!uniqDate[month].activeSaleManager.has(item.employee_id)) {
      uniqDate[month].activeSaleManager.set(item.employee_id, "nominal"); /* по типу должности */
      addEmptyObj[month]['saleManager'] = [...addEmptyObj[month]['saleManager'], item];
    }
  }

});

for (let date in addEmptyObj) {
  for (let saleM of addEmptyObj[date]["saleManager"]) {


    debugger;

  }
}


pg_cl.end();