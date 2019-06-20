<?php

require_once('./database/MysqliDb.php');
require_once "./QueryData.php";



//当前时间日期
$cur_date = date('Y-m-d H:i:s');
//该日期的时间戳
$cur_date_stamp = strtotime($cur_date);

//当前时间戳
$cur_time = time(); //单位秒
//当前时间戳对应日期
$cur_time_date = date('Y-m-d H:i:s',$cur_time);


//读取数据库，当前这一分钟，是否有数据？有就直接用，没有就拉取并插入新数据

//当前这1分钟的时间戳
$cur_minute_stamp = strtotime( date('Y-m-d H:i',time()) );

//检查数据库中是否有该1分钟内的数据
$db = new Mysqlidb (
    Array (
        'host' => 'localhost',
        'username' => 'root', 
        'password' => 'root',
        'db'=> 'db_data_gold',
        'port' => 3306,
        'prefix' => 'tb_',
        'charset' => 'utf8'));

$sql = "select * from `tb_datas` where `uptime`>=".$cur_minute_stamp;
$rs = $db->rawQuery($sql);
// var_dump($rs);

$qd = new QueryData();
if( !$rs )  //库里没有数据，实时拉取
{
    $singleData = $qd->requestSingleData();
    // var_dump($rs);
    $changeData = $qd->requestChangeDataCNY();
    // var_dump($rs);
    $caculData = $qd->requestCaculData();
    // var_dump($rs);
    // $rate_cny2usd = $qd->getMoneyRateCNY2USD();
    // var_dump($rate_cny2usd);
    //拉取到数据之后，存储到库里
    $sql = "insert into `tb_datas` (single_data,change_data,cacul_data,uptime) values ('".
        json_encode($singleData).
        "','".
        json_encode($changeData).
        "','".
        json_encode($caculData).
        "',".$cur_minute_stamp.")";
    // echo "sql:".$sql.'<br>';
    $r = $db->rawQuery($sql);
    // echo "doInsert:<br>";
    // var_dump($r);
}else{
    //库里有数据，把数据填到对象里
    $singleData = $qd->setSingleData($rs[0]['single_data']);
    $changeData = $qd->setChangeDataCNY($rs[0]['change_data']);
    $caculData = $qd->setCaculData($rs[0]['cacul_data']);
}

$result = [];

$result['singleData'] = $singleData;
$result['changeData'] = $changeData;
$result['caculData'] = $caculData;

die(json_encode($result));


?>