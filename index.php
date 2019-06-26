<?php

require_once('./dbmanager.php');
require_once('./MoneyType.php');
require_once('./strTools.php');
require_once('./Missions.php');
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
$sql = "select * from `tb_datas` where `uptime`>=".$cur_minute_stamp;
$rs = $db->rawQuery($sql);
var_dump($rs);

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
    $singleData = $qd->setSingleData(json_decode($rs[0]['single_data'],true));
    $changeData = $qd->setChangeDataCNY(json_decode($rs[0]['change_data'],true));
    $caculData = $qd->setCaculData(json_decode($rs[0]['cacul_data'],true));
}



$result = [];

//根据参数返回不同的值
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : null;
// echo "action:".$action."<br>";
if( strlen($action) > 0 )
{
    $acts = explode(",",$action);
    // var_dump($acts);
}

if( isset($acts) && count($acts) > 0 )
{
    foreach($acts as $act)
    {
        if( strTools::isSameString($act,'singleData') )
        {
            $result['singleData'] = $singleData;
        }else if( strTools::isSameString($act,'changeData') )
        {
            $result['changeData'] = $changeData;
        }else if( strTools::isSameString($act,'caculData') )
        {
            $result['caculData'] = $caculData;
        }else if( strTools::isSameString($act,'currency') )
        {
            $result['currency'] = MoneyType::$mType;
        }
    }
    // echo "any:<br>";
}else{
    $result['singleData'] = $singleData;
    $result['changeData'] = $changeData;
    $result['caculData'] = $caculData;
    $result['currency'] = MoneyType::$mType;

    // echo "all:<br>";
}

// $misact = isset($_REQUEST['misact']) ? $_REQUEST['misact'] : null;
//检查是否有任务实现？有的话，需要进行提醒处理
$mis = new Missions($db);
$mis->check(
    array(
        'singleData'=>$singleData,
        'changeData'=>$changeData,
        'caculData'=>$caculData)
    );


die(json_encode($result));


?>