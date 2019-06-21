<?php

class Users
{
    public $db;
    public $tbname = 'tb_users';

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getUserByOpenid($openid)
    {
        if( !$openid )
        {
            return null;
        }

        $sql = "select * from `".$this->tbname."` where `openid`='".$openid."'";
        $r = $this->db->rawQuery($sql);
        // var_dump($r);
        if( $r )
        {
            return $r[0];
        }
        
        return null;
    }

    public function addUser($userInfo)
    {
        $sql = "insert into `tb_users` (nickname,sex,openid,phone,address,jointime) values ('".
            $userInfo['nickname']."','".
            $userInfo['sex']."','".
            $userInfo['openid']."','".
            $userInfo['phone']."','".
            $userInfo['address']."',".
            time().")";
        // echo 'addUser sql:'.$sql.'<br>';
        $r = $this->db->rawQuery($sql);
        // var_dump($r);
        return $userInfo;
    }
}

?>