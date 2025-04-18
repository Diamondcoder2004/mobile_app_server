//ФУНКЦИИ
//Получить промежутки бездействия компов
const get_free_time_slots = "SELECT * FROM get_free_time_slots($1,$2,$3)";
//Получить всех пользователей в теории только для админов
const get_all_users = "SELECT get_all_users($1)";
//Получить отчет по продажам
const get_sales_report = "SELECT * FROM get_sales_report($1,$2,$3)";
const getBalance = "SELECT * FROM get_balance($1)";
const available_zones = "SELECT * FROM available_zones()";
const available_pc = "SELECT * FROM available_computer($1,$2,$3)";





//ПРОЦЕДУРЫ 
//Регистрация пользователя 
const register_user = "CALL register_user($1,$2,$3,$4,$5,$6)";
//Забронировать компьютер 
const book_computer = "CALL book_computer($1,$2,$3,$4);";
//Купить продукт
const purchase_product = "CALL purchase_product($1,$2,$3)"
//Обновить статус. Например в ремонт кинуть
const update_computer_status = "CALL update_computer_status($1,$2,$3)";
//Эта процедура позволяет пополнить баланс пользователя на указанную сумму.
const top_up_balance = "CALL top_up_balance($1,$2,$3)";
//Крафтим компьютер!!!
const create_computer = "CALL create_computer($1,$2,$3,$4,$5,$6)";



//ПРЕДСТАВЛЕНИЯ
const monthly_zone_report =  "SELECT * FROM monthly_zone_report";
const utilization_morning = "SELECT * FROM utilization_morning;";
const utilization_afternoon = "SELECT * FROM utilization_afternoon;";
const utilization_night = "SELECT * FROM utilization_night;";

module.exports = {

  get_all_users,
  get_free_time_slots,
  get_sales_report,
  getBalance,
  available_zones,
  available_pc,

  register_user,
  book_computer,
  purchase_product, 
  update_computer_status, 
  top_up_balance,
  create_computer,

  monthly_zone_report ,
  utilization_morning,
  utilization_afternoon,
  utilization_night,
  };