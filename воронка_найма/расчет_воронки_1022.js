// import { drivelabels_v2beta } from "googleapis";
// import EsoftAPI from "../Class/EsoftAPI.js";
// import requestArr from './query1022_DarBol.json' assert { type: 'json' };
import googleSh from "../Class/googleSh.js";
import pg from 'pg'; const Client = pg.Client;

const pg_cl = new Client({
  host: "192.168.179.19", user: "postgres", port: 5432,
  password: "Uwkl_C47ON4Ce_n-2pS0", database: "analytics_dep_db"
});

pg_cl.connect();

let offset = new Date().getTimezoneOffset() / 60;
offset = offset * 1000 * 60 * 60;

let formtDateEmpl = (obj) => {
  for (let key in obj) {
    if (['date_create', 'current_stage_date', 'stage_date', 'closed_date', 'date_vihoda_na_raboty'].includes(key)) {
      if (!obj[key]) { continue; }

      obj[key] = new Date(obj[key].setDate(1) - offset).toISOString();
    }
  }
  return obj;
};

// let arrBD = await pg_cl.query(`SELECT * FROM public.hr_funnel_1022`);

/* 6 */let all_calls = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
stage in ('. Звонок','. Контакт','. Новый','01. Звонок','01. Контакт','01. Новый')
and office is not null
and gruppa in ('R')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 7 */let nonTargetedCandidates = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
current_stage in ('. Звонок','. Контакт','01. Звонок','01. Контакт','01. Новый')
and office is not null
and gruppa in ('R')
and status in ('Отказ HR','Отказ кандидата')
and title in ('Нашёл другую работу','Не рассматривает переезд','Неграмотная речь','Неподходящая внешность','Неподходящее образование','Неподходящие личностно-психологические качества','Неподходящий возраст','Неподходящий опыт','Предложение о работе неактуально','Случайно откликнулся')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 8 */let noAnswer = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
current_stage in ('. Звонок','. Контакт','01. Звонок','01. Контакт','01. Новый')
and office is not null
and gruppa in ('R')
and status in ('В работе','В резерве')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 9 */let notCalled = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
current_stage in ('. Звонок','. Контакт','01. Звонок','01. Контакт','01. Новый')
and office is not null
and gruppa in ('R')
and status in ('Недозвон')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 10 */let notCalledContinuation = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
current_stage in ('. Звонок','. Контакт','. Новый','01. Звонок','01. Контакт','01. Новый')
and office is not null
and gruppa in ('R')
and status in ('Отказ HR','Отказ кандидата','Передан на другую заявку')
and title in ('Бросил трубку','Не дозвонились')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 11 */let invite = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
stage in ( '. Приглашен на собеседование','02. Приглашен на собеседование','03. Приглашен на собеседование','04. Приглашен на собеседование')
and office is not null
and gruppa in ('R')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 12 */let interview = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
stage in ( '. Собеседование с HR','02. Собеседование с HR','03. Собеседование с HR','04. Собеседование с HR','05. Собеседование с HR','06. Собеседование с HR')
and office is not null
and gruppa in ('R')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 13 */let interviewSkip = pg_cl.query(`
SELECT id,city_name,office,stage,stage_date FROM public.hr_funnel_1022
where
status not in ('Недозвон')
and current_stage in ('. Собеседование с HR','02. Собеседование с HR','03. Собеседование с HR','04. Собеседование с HR','05. Собеседование с HR','06. Собеседование с HR')
and office is not null
and gruppa in ('R')
and title in ('Бросил трубку','Не выходит на связь' ,'Не вышел на стажировку','Не дозвонились','Не пришёл на брифинг','Не пришёл на собеседование','Перенес встречу более 2 раз')
and responsible not in ('Болдырева Дарья Михайловна','Бурковская Анастасия Николаевна','Бурковская Анна Николаевна','Толстикова Вероника Федоровна','Шкурина Анастасия Дмитриевна','Майер Ольга Владимировна')
`);

/* 14 */let work = pg_cl.query(`
SELECT city,type_position,source_attraction,date_vihoda_na_raboty FROM public.hr_funnel_374
where type_position in ('Специалист отдела продаж'/* ,'Менеджер отдела продаж' */)
`);

await Promise
  .all([all_calls, nonTargetedCandidates, noAnswer, notCalled, notCalledContinuation, interview, invite, interviewSkip, work])
  .then(([all_calls_, nonTargetedCandidates_, noAnswer_, notCalled_, notCalledContinuation_, interview_, invite_, interviewSkip_, work_]) => {
    all_calls = all_calls_;
    nonTargetedCandidates = nonTargetedCandidates_;
    noAnswer = noAnswer_;
    notCalled = notCalled_;
    notCalledContinuation = notCalledContinuation_;
    invite = invite_;
    interview = interview_;
    interviewSkip = interviewSkip_;
    work = work_;
  });
all_calls = all_calls.rows.map(item => formtDateEmpl(item));
nonTargetedCandidates = nonTargetedCandidates.rows.map(item => formtDateEmpl(item));
noAnswer = noAnswer.rows.map(item => formtDateEmpl(item));
notCalled = notCalled.rows.map(item => formtDateEmpl(item));
notCalledContinuation = notCalledContinuation.rows.map(item => formtDateEmpl(item));
invite = invite.rows.map(item => formtDateEmpl(item));
interview = interview.rows.map(item => formtDateEmpl(item));
interviewSkip = interviewSkip.rows.map(item => formtDateEmpl(item));
work = work.rows.map(item => formtDateEmpl(item));
work = work.filter(item => !(item.source_attraction.match(/перев/i)));
/*  */
let minDate = await pg_cl.query(`SELECT min(date_create) FROM public.hr_funnel_1022`);

minDate = new Date(Date.parse(minDate.rows[0].min) - offset);

let arrBD = all_calls;
// arrBD.map(row => formtDateEmpl(row));

let indcatorsCalc = {};

// формулы для запросов
let setMonht = (month) => {
  if (month.getTime() <= new Date().getTime()) { indcatorsCalc[`${month.toISOString()}`] = {}; setMonht(new Date(new Date(month.getFullYear(), month.getMonth() + 1, 1) - offset)); };
};
setMonht(minDate);
let setCity = (date, item) => {
  if (indcatorsCalc[date][item.city_name] === undefined) { indcatorsCalc[date][item.city_name] = {}; }
};
let setOffice = (date, item) => {
  if (indcatorsCalc[date][item.city_name][item.office] === undefined) {
    indcatorsCalc[date][item.city_name][[item.office]] = {};
  }
};
// формирование запросов
Object.keys(indcatorsCalc).map(date => {
  let arrDBfilter = arrBD.filter(item => item.stage_date == date);
  arrDBfilter.map(item => {
    setCity(date, item);
    // setOffice(date, item);
  });
});
// формирование списка искомых показателей
let indcatorsCalcArr = [];
Object.keys(indcatorsCalc).map(date => {
  Object.keys(indcatorsCalc[date]).map(city => {
    // Object.keys(indcatorsCalc[date][city]).map(office => {
    // Object.keys(indcatorsCalc[date][city][office]).map(indicator => {
    let retObj = {
      "Дата": date,
      "Город": city,
      // "Офис": office,
      // "Показатель": indicator,
    };
    indcatorsCalcArr.push(retObj);
    // });
    // });
  });
});

// indcatorsCalcArr = indcatorsCalcArr.filter(item => { item['Город'] == "Омск"; });
// debugger;
//
let calc = (serchObject) => {
  let { "Город": city, "Дата": date } = serchObject;
  /*  */
  serchObject["Всего маршрутов"] = [...new Set(all_calls.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length;
  /*  */
  serchObject["Целевые кандидаты"] =
    serchObject["Всего маршрутов"]
    /* serchObject["Нецелевые кандидаты"] = */
    - [...new Set(nonTargetedCandidates.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length
    /* serchObject["Нет ответа"] = */
    // - [...new Set(noAnswer.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length
    /* serchObject["Не дозвонились"] = */
    - [...new Set(notCalled.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length
    /* serchObject["Не дозвонились доп."] = */
    - [...new Set(notCalledContinuation.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length;
  /*  */
  serchObject["Приглашения на собеседования"] = [...new Set(invite.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length;
  /*  */
  serchObject["Собеседования"] = [...new Set(interview.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length;
  /*  serchObject["Не пришли на собеседование"] = */ -[...new Set(interviewSkip.filter(item => (item.stage_date == date && item.city_name == city)).map(item => item.id))].length;
  /*  */
  serchObject["Найм"] = work.filter(item => item.date_vihoda_na_raboty == date && item.city == city)
    // .filter(item => (item.source_attraction.match(/перевод/i)))
    /* добавить фильтр по переводу */
    .map(item => item.id).length;
  /*  */
  serchObject["Создано маршрутов -> Целевые звонки"] = serchObject["Целевые звонки"] / serchObject["Всего маршрутов"];
  serchObject["Целевые звонки -> Приглашения"] = serchObject["Приглашения на собеседования"] / serchObject["Целевые звонки"];
  serchObject["Приглашения -> Собеседования"] = serchObject["Собеседования"] / serchObject["Приглашения на собеседования"];
  serchObject["Собеседования -> Принятые"] = serchObject["Найм"] / serchObject["Собеседования"];
  /*  */
  // if (city == 'Омск') {
  //   debugger;
  // }
  // console.log('*');
  return serchObject;
};


let calcResult = [];

console.log('Расчет');
indcatorsCalcArr.map(item => {
  return calc(item);
}).map(item => {
  let { "Дата": date, "Город": city, ...indicators } = item;
  Object.keys(indicators).map(item => {
    calcResult = [...calcResult, {
      "Город": city,
      "Показатель": item,
      "Значеине": indicators[item],
      "Дата": date,
    }];
  });
});

console.log('Расчет окончен');
debugger;
let session = new googleSh();
await session.setData("1s8NYDvQ0oI1IwaxHwcUsBcoqo-BNmYkVghgEnMDsuXk", "Лист1", calcResult.map(item => Object.values(item)));

let res = Object.values(calcResult).map(item => "(" + Object.values(item).map(item1 => "'" + item1 + "'") + ")").toString();

await pg_cl.query(`TRUNCATE public.hr_funnel`);
await pg_cl.query(`INSERT INTO public.hr_funnel VALUES ${res}`);





// console.log(arrBD);
pg_cl.end();