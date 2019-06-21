<?php

require_once('./dbmanager.php');
require_once('./Missions.php');
require_once('./Users.php');

$act = isset($_REQUEST['act']) ? $_REQUEST['act'] : null;

$mis = new Missions($db);
$user = new Users($db);

if( $act == 'add' )
{
    $openid = isset($_REQUEST['openid']) ? $_REQUEST['openid'] : null;

    $opmark = isset($_REQUEST['opmark']) ? $_REQUEST['opmark'] : 0;
    $price_curr = isset($_REQUEST['price_curr']) ? $_REQUEST['price_curr'] : null;
    $price_unitname = isset($_REQUEST['price_unitname']) ? $_REQUEST['price_unitname'] : null;
    $price_amount = isset($_REQUEST['price_amount']) ? $_REQUEST['price_amount'] : null;
    $price_now = isset($_REQUEST['price_now']) ? $_REQUEST['price_now'] : null;
    $dowhat = isset($_REQUEST['dowhat']) ? $_REQUEST['dowhat'] : 0;

    if( !$openid || !$price_curr || !$price_unitname || !$price_amount || !$price_now )
    {
        $r['error'] = 1;
        $r['msg'] = "参数不正确";
        die(json_encode($r,JSON_UNESCAPED_UNICODE));
    }

    $userInfo = $user->getUserByOpenid($openid);
    if( $userInfo )
    {
        $uid = $userInfo['id'];

        $r = $mis->addMission($uid,$opmark,$price_curr,$price_unitname,$price_amount,$price_now,$dowhat,time());

        die(json_encode($r,JSON_UNESCAPED_UNICODE));
    }else{
        $r['error'] = 1;
        $r['msg'] = "未找到用户";
        die(json_encode($r,JSON_UNESCAPED_UNICODE));
    }
    
}else if( $act == 'delete' )
{
    $mid = isset($_REQUEST['mid']) ? $_REQUEST['mid'] : null;

    if( !$mid )
    {
        $r['error'] = 1;
        $r['msg'] = "参数不正确";
        die(json_encode($r,JSON_UNESCAPED_UNICODE));
    }

    $r = $mis->deleteMission($mid);

    die(json_encode($r,JSON_UNESCAPED_UNICODE));

}else if( $act == 'update' )
{
    $mid = isset($_REQUEST['mid']) ? $_REQUEST['mid'] : null;
    $opmark = isset($_REQUEST['opmark']) ? $_REQUEST['opmark'] : 0;
    $price_curr = isset($_REQUEST['price_curr']) ? $_REQUEST['price_curr'] : null;
    $price_unitname = isset($_REQUEST['price_unitname']) ? $_REQUEST['price_unitname'] : null;
    $price_amount = isset($_REQUEST['price_amount']) ? $_REQUEST['price_amount'] : null;
    $price_now = isset($_REQUEST['price_now']) ? $_REQUEST['price_now'] : null;
    $dowhat = isset($_REQUEST['dowhat']) ? $_REQUEST['dowhat'] : 0;

    if( !$mid || !$price_curr || !$price_unitname || !$price_amount || !$price_now )
    {
        $r['error'] = 1;
        $r['msg'] = "参数不正确";
        die(json_encode($r,JSON_UNESCAPED_UNICODE));
    }
    $r = $mis->updateMission($mid,$opmark,$price_curr,$price_unitname,$price_amount,$price_now,$dowhat);
    // var_dump($r);
    die(json_encode($r,JSON_UNESCAPED_UNICODE));

}else if( $act == 'list' )
{
    $openid = isset($_REQUEST['openid']) ? $_REQUEST['openid'] : null;

    $userInfo = $user->getUserByOpenid($openid);
    if( $userInfo )
    {
        $uid = $userInfo['id'];

        $r = $mis->listMission($uid);
        // var_dump($r);
        die(json_encode($r,JSON_UNESCAPED_UNICODE));
    }else{
        $r['error'] = 1;
        $r['msg'] = "未找到用户";
        die(json_encode($r,JSON_UNESCAPED_UNICODE));
    }

}

?>