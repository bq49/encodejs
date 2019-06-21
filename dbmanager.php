<?php

require_once('./db/MysqliDb.php');


$db = new Mysqlidb (
    Array (
        'host' => 'localhost',
        'username' => 'root', 
        'password' => 'root',
        'db'=> 'db_data_gold',
        'port' => 3306,
        'prefix' => 'tb_',
        'charset' => 'utf8'));
        

?>