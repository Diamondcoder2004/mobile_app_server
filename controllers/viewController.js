const pool = require("../db");
const queries = require("../queries");



//выборка всех записей из таблицы Coopertor
const monthly_report = (req, res) => {
    const role_id = req.cookies.role_id;
    //Если простой пользователь то нет прав
    if(role_id == 2){
        res.status(403).json({ error:  "Нет прав для получения месячного отчета"});
    };
    pool.query(queries.monthly_zone_report, (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows); // если нет ошибки, то вернется статус 200
    });
  };

  //выборка всех записей из таблицы Coopertor
const morning_report = (req, res) => {
    const role_id = req.cookies.role_id;
    //Если простой пользователь то нет прав
    if(role_id == 2){
        res.status(403).json({ error:  "Нет прав для получения утреннего отчета"});
    };
    pool.query(queries.utilization_morning, (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows); // если нет ошибки, то вернется статус 200
    });
  };

const afternoon_report = (req, res) => {
    const role_id = req.cookies.role_id;
    //Если простой пользователь то нет прав
    if(role_id == 2){
        res.status(403).json({ error:  "Нет прав для получения дневного отчета"});
    };
    pool.query(queries.utilization_afternoon, (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows); // если нет ошибки, то вернется статус 200
    });
  };
const night_report = (req, res) => {
    const role_id = req.cookies.role_id;
    //Если простой пользователь то нет прав
    if(role_id == 2){
        res.status(403).json({ error:  "Нет прав для получения ночного отчета"});
    };
    pool.query(queries.utilization_night, (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows); // если нет ошибки, то вернется статус 200
    });
  };
  
  





module.exports = {
    monthly_report,
    morning_report,
    afternoon_report,
    night_report,
};
