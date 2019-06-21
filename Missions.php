<?php

class Missions{

    public $db;
    public $tbname = 'tb_missions';

    public function __construct($db)
    {
        $this->db = $db;
    }

    //检查是否有任务达成
    public function check($datas)
    {
        //遍历所有价格
        foreach($datas['caculData']['gold']['data'] as $item)
        {
            $key = $item['key'];
            $price = $item['value'];

            //生成一个针对该货币的sql查询命令
            $curr = MoneyType::getCurrencyByKey($key);
            if( $curr )
            {
                //小于的初始值
                $sql = "select * from `".$this->tbname."` ".
                        "where `opmark`==0 and `price_curr`=='".$curr['name']."' and  and ";
            }
        }
        
        /*
        {
            "key": "USD-XAU",
            "value": "1384.5950"
        }
        */
        //到数据库中检查所有任务，看是否有达成的
    }

    public function addMission($uid,$opmark,$price_curr,$price_unitname,$price_amount,$price_now,$dowhat,$tim)
    {
        $sql = "insert into `".$this->tbname."` ( uid,opmark,price_curr,price_unitname,price_amount,price_now,dowhat,addtime ) values (".
                $uid.",".$opmark.",'".$price_curr."','".$price_unitname."',".$price_amount.",".$price_now.",".$dowhat.",".$tim.")";

        $r = $this->db->rawQuery($sql);

        $r['error'] = 0;
        $r['msg'] = "添加任务完成";
        return $r;
    }

    public function deleteMission($mid)
    {
        $sql = "delete from `".$this->tbname."` where `id`=".$mid;
        $r = $this->db->rawQuery($sql);

        $r['error'] = 0;
        $r['msg'] = "删除任务完成";
        return $r;
    }

    public function updateMission($mid,$opmark,$price_curr,$price_unitname,$price_amount,$price_now,$dowhat)
    {
        $sql = "update `".$this->tbname."` set ".
                "opmark=".$opmark.",".
                "price_curr='".$price_curr."',".
                "price_unitname='".$price_unitname."',".
                "price_amount=".$price_amount.",".
                "price_now=".$price_now.",".
                "dowhat=".$dowhat." ".
                "where id=".$mid;

        $r = $this->db->rawQuery($sql);

        $r['error'] = 0;
        $r['msg'] = "更新任务完成";
        return $r;
    }

    public function listMission($uid)
    {
        $sql = "select * from `".$this->tbname."` where `uid`=".$uid;

        $r = $this->db->rawQuery($sql);
        return $r;
    }

}

?>