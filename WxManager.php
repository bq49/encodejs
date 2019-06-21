<?php

class WxManager
{
    public function __construct(){

    }

    public function requestUserInfo($openid)
    {
        $u = [];

        if( strTools::isSameString($openid,"123456") )
        {
            $u['nickname'] = 'sean';
            $u['sex'] = 1;
            $u['openid'] = '123456';
            $u['phone'] = '+60176621686';

            $addr = [];
            $addr['lv1'] = '四川';
            $addr['lv2'] = '成都';
            $addr['lv3'] = '高新';
            $u['address'] = json_encode($addr,JSON_UNESCAPED_UNICODE);

            return $u;
        }else{
            $u['nickname'] = 'nickname_'.rand(0,99).'_'.$openid;
            $u['sex'] = rand(0,1);
            $u['openid'] = $openid;
            $u['phone'] = 'phone_'.$openid;

            $addr = [];
            $addr['lv1'] = 'addr0'.$openid;
            $addr['lv2'] = 'addr1'.$openid;
            $addr['lv3'] = 'addr2'.$openid;
            $u['address'] = json_encode($addr,JSON_UNESCAPED_UNICODE);

            return $u;
        }

        return null;
    }
}

?>