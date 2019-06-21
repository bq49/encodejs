<?php

require_once('./dbmanager.php');
require_once('./WxManager.php');
require_once('./Users.php');
require_once('./strTools.php');


$openid = isset($_REQUEST['openid']) ? $_REQUEST['openid'] : null;
$result = [];
//如果没有openid，需要授权
//有了openid，提取微信公开信息
if( !$openid )
{
    //没有，直接退回
    $result['error'] = 1;
    $result['msg'] = '请先授权';
    die(json_encode($result,JSON_UNESCAPED_UNICODE));
}

$user = new Users($db);
//检查数据库中是否存在该用户
$rs = $user->getUserByOpenid($openid);
// var_dump($rs);
if( !$rs )
{
    $wx = new WxManager();
    $userInfo = $wx->requestUserInfo($openid);
    if( $userInfo )
    {
        //拿到了用户数据
        $rs = $user->addUser($userInfo);
        //成功写入数据库
        $result['error'] = 0;
        $result['msg'] = '成功';
        $result['user'] = $rs;
        die(json_encode($result,JSON_UNESCAPED_UNICODE));
    }
    //没有拿到用户数据
    $result['error'] = 1;
    $result['msg'] = '请先授权';
    die(json_encode($result,JSON_UNESCAPED_UNICODE));
}
//数据库中有用户数据
$result['error'] = 0;
$result['msg'] = '读取数据成功';
$result['user'] = $rs;
die(json_encode($result,JSON_UNESCAPED_UNICODE));


?>