import googleSh from "../Class/googleSh.js";
import pg from 'pg'; const Client = pg.Client;
import fs from 'fs';
import Aim from "./Aim_class.js";

const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});

const session = new googleSh();
const aim = new Aim({ year: 2024, month: 4 });

pg_cl.connect();

/* запрос в БД */
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
public.slice_374.sale_manager_id,
public.slice_374.sale_manager_name,
public.slice_374.employee_id,
public.slice_374.employee_name,
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

// slice_374.rows = slice_374.rows.map(item => item.prefix = item.prefix + ' 0:00:00');

/* заголовки в итоговую таблицу */
let head = [
  'prefix', 'category_f', 'country', 'category_size',
  'city', 'hr_manager_id', 'hr_manager_name', 'sale_director_id',
  'sale_director_name', 'sale_manager_id', 'sale_manager_name', 'employee_id',
  'employee_name', 'post_type', 'status', 'group_0',
  'priority_status', 'employment_date', 'dismissal_date', 'additional_staff',
  'position_type', 'department', 'attraction_form', 'attraction_sourse',
  'be_active', 'be_hired', 'be_fired', 'date_diff_m'];


// debugger;

console.log(slice_374.rowCount);

let uniqDate = {};
let addEmptyObj = {};

/* Перевод реальный / номинальных специалистов */
slice_374.rows.forEach(item => {
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

  /* Поиск МОП */
  uniqDate[month].activeRecruit.set(item.sale_manager_id, "real"); /* по факту функционала */
  if (item.post_type === 'Менеджер отдела продаж' && item.status === 'Активен') {
    if (!uniqDate[month].activeSaleManager.has(item.employee_id)) {
      uniqDate[month].activeSaleManager.set(item.employee_id, "nominal"); /* по типу должности */
      addEmptyObj[month]['saleManager'] = [...addEmptyObj[month]['saleManager'], item];
    }
  }
});

/* обнуление */
let zeroObj = {
  hr_manager_id: "null", hr_manager_name: "null", sale_director_id: "null", sale_director_name: "null",
  sale_manager_id: "null", sale_manager_name: "null", employee_id: "null", employee_name: "null",
  post_type: "Специалист отдела продаж", status: "Активен", group_0: "null", priority_status: "null",
  employment_date: "null", dismissal_date: "null", additional_staff: "Нет", position_type: "null",
  department: "null", attraction_form: "null", attraction_sourse: "null"
};

for (let date in addEmptyObj) {
  /* МОП */
  for (let saleM of addEmptyObj[date]["saleManager"]) {
    let obj = Object.assign({}, saleM, zeroObj, {
      sale_manager_id: saleM.employee_id,
      sale_manager_name: saleM.employee_name,
    });
    slice_374.rows.push(obj);
  }
  /* HR */
  for (let saleM of addEmptyObj[date]["hrManager"]) {
    let obj = Object.assign({}, saleM, zeroObj, {
      hr_manager_id: saleM.employee_id,
      hr_manager_name: saleM.employee_name,
    });
    slice_374.rows.push(obj);
  }
}


// item['Стаж работы в месяцах'] = dateDiffM(item['Дата выхода на работу'], item['Дата увольнения'], obj.monthEnd);
// item['Стаж работы в днях'] = dateDiffD(item['Дата выхода на работу'], item['Дата увольнения'], obj.monthEnd);
// item['Был активен'] = beActive(item['Дата выхода на работу'], item['Дата увольнения'], obj);
// item['Был принят'] = beHired(item['Дата выхода на работу'], item['Дата увольнения'], obj);
// item['Был уволен'] = beFired(item['Дата выхода на работу'], item['Дата увольнения'], obj);

/* расчет дополнительных свойств */
for (let row of slice_374.rows) {
  row.prefix = converDate(row.prefix);
  row.be_active = beActive(converDate(row.employment_date), monthPlus(row.prefix), aim);
  row.be_hired = beHired(converDate(row.employment_date), monthPlus(row.prefix), aim);
  row.be_fired = beFired(converDate(row.employment_date), monthPlus(row.prefix), aim);
  row.date_diff_m = dateDiffM(converDate(row.employment_date), converDate(row.dismissal_date), monthPlus(row.prefix));
  // debugger;
}
function converDate(date) {
  return new Date(Date.parse(date));
}
function monthPlus(date) {
  date = new Date(Date.parse(date));
  return new Date(date.setMonth(date.getMonth() + 1));
}
function beActive(start, end, aim) {
  // был активен (в том месяце)?
  if (start === '' || start === null || start >= aim.periodEnd) {
    return 'Ошибка';
  }
  if (end === null || start < aim.periodEnd) {
    return true;
  }
  return end >= aim.periodEnd;
}
function beHired(start, end, obj) {
  // был нанят (в том месяце)?
  if (start === null) {
    return 'Ошибка';
  }
  return start >= obj.periodStart && start < obj.periodEnd;
}
function beFired(start, end, obj) {
  // был уволен (в том месяце)?
  if (end === '') {
    return 'Ошибка';
  }
  if (end === null) {
    return false;
  }
  return end >= obj.periodStart && end < obj.periodEnd;
}
function dateDiffM(start, end, monthEnd) {
  if (!start || start === 'null') {
    return 'Ошибка: нет даты выхода на работу!';
  }
  if (!end || end === 'null') {
    end = new Date();
  }
  if (end.getTime() > monthEnd.getTime()) {
    end = monthEnd;
  }
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
}
// function dateDiffD(start, end, monthEnd) {
//   if (!start || start === 'null') {
//     return 'Ошибка: нет даты выхода на работу!';
//   }
//   if (!end || end === 'null') {
//     end = new Date();
//   }
//   if (end.getTime() > monthEnd.getTime()) {
//     end = monthEnd;
//   }
//   return parseInt((end.getTime() - start.getTime()) / day);
// }
// const hiredFail = (leave, workDays) => {
//   // ошибка найма?
//   return leave === true && workDays <= 14;
// };
debugger;

/* Отправка результата в таблицу */
let i = 0;
await pg_cl.query(`TRUNCATE public.pivot`);
for (let row of slice_374.rows) {
  i += 1;
  console.log(i, slice_374.rows.length);
  let res = [];

  for (let val of head) {
    res.push(row[val]);
  }
  res = session.objToSQLRow(head, session.rowToObject(head, [res]));
  await pg_cl.query(`INSERT INTO public.pivot (${head.join(',').toLowerCase()}) VALUES ${res}`);
  // debugger;
}


pg_cl.end();