<?php

class strTools{

    //"xxx,123"
    public static function getStringValueKey($str)
    {
        // if( strlen($str) <= 0 )
        // {
        //     return null;
        // }

        $arr = explode(",",$str);
        if( count($arr) < 2 )
        {
            return null;
        }

        $rs = [];
        $rs['key'] = $arr[0];
        $rs['value'] = $arr[1];

        return $rs;
    }

    public static function getDatasByType($data_str)
    {
        //需要解析整个字符串，解成数组，便于后期使用
        $arr_tanhao = explode("!",$data_str);
        // echo "tanhao:<br>";
        // var_dump($arr_tanhao);
        // echo "tanhao----------<br>";
        $time_data = $arr_tanhao[0];
        $data_str = $arr_tanhao[1];
        // echo 'time:'.$time_data.'<br>';
        // echo 'data:'.$data_str.'<br>';

        //以分号分开
        $arr_fenhao = explode(";",$data_str);
        // echo 'fenhao:<br>';
        // var_dump($arr_fenhao);
        // echo 'fenhao----------------<br>';
        $datas = [];
        $datas['time'] = $time_data;

        $dd = [];
        //遍历，每个都要再次转成key=》value
        foreach( $arr_fenhao as $one )
        {
            $vk = strTools::getStringValueKey($one);
            if( $vk != null )
            {
                array_push($dd,$vk);
            }
        }

        // echo 'dd:<br>';
        // var_dump($dd);
        // echo 'dd----------------<br>';

        $datas['data'] = $dd;
        
        return $datas;
    }

    public static function getCaculDataFromString($rs)
    {
        //先分开金银
        $arr_gold_silver = explode("@",$rs);
        //分别取出金银字串
        $gold_str = $arr_gold_silver[0];
        // echo "gold_str:".$gold_str."<br>";
        $silver_str = $arr_gold_silver[1];

        //提取黄金数据
        $golds = strTools::getDatasByType($gold_str);
        //提取白银数据
        $silvers = strTools::getDatasByType($silver_str);

        
        $arr_vk = [];
        $arr_vk['gold'] = $golds;
        $arr_vk['silver'] = $silvers;

        return $arr_vk;
    }
}

?>