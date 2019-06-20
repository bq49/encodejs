<?php

// require_once "./DB.php";
require_once "./curlRequest.php";
require_once "./strTools.php";

//先去请求新数据

//如果请求失败，提取本地数据库
//读取数据库，当前最近的一条记录

//请求成功，存入数据库，并返回输出
class QueryData{

    public $url_single = "https://data-asg.goldprice.org/GetData/USD-XAU/1";    //单独美元价格
    public $url_change = "https://data-asg.goldprice.org/dbXRates/USD";         //美元价格变化
    public $url_change_cny = "https://data-asg.goldprice.org/dbXRates/USD,CNY"; //美元、人民币价格变化
    public $url_cacul_data = "https://data-asg.goldprice.org/GetCalcData/";     //各种货币换算数据

    public $single_data;    //单独美元价格/盎司
    public $change_data_cny;        //人民币和美元价格/盎司
    public $cacul_data;     //全量各种货币价格
    public $rate_cny2usd;   //人民币兑换美元

    public $oz2g = 28.3495231;  //1盎司换算克
    public $oz2kg = 0.0283495231;   //1盎司换千克

    public function __construct() 
    {
    }

    public function requestSingleData()
    {
        $rs = curlRequest::curl_get($this->url_single);
        /*
        ["USD-XAU,1343.7100"]
        */
        $json = json_decode($rs,true);
        $usd_xau_str = $json[0];

        $this->single_data = strTools::getStringValueKey($usd_xau_str);
        // var_dump($this->single_data);
        return $this->single_data;
    }

    public function setSingleData($data)
    {
        $this->single_data = $data;

        return $this->single_data;
    }

    public function requestChangeDataCNY()
    {
        $rs = curlRequest::curl_get($this->url_change_cny);
        /*
        {
            date: "Jun 18th 2019, 10:52:16 pm NY"
            items: [
                {
                    chgXag: -0.2716     银价改变
                    chgXau: -14.0103    金价改变
                    curr: "CNY"         货币
                    pcXag: -0.262       银价涨跌幅度
                    pcXau: -0.1507      金价涨跌幅度
                    xagClose: 103.66513     最近的银价
                    xagPrice: 103.3935      当前银价
                    xauClose: 9295.82846    最近的金价
                    xauPrice: 9281.8182     当前金价
                }
                {
                    chgXag: -0.0065
                    chgXau: -2.4025
                    curr: "USD"
                    pcXag: -0.0434
                    pcXau: -0.1784
                    xagClose: 14.98
                    xagPrice: 14.9735
                    xauClose: 1346.6
                    xauPrice: 1344.1975
                }
            ]
            ts: 1560912742284
            tsj: 1560912736249
        }
        */
        $this->change_data_cny = json_decode($rs,true);
        
        // var_dump($this->change_data_cny);
        return $this->change_data_cny;
    }

    public function setChangeDataCNY($data)
    {
        $this->change_data_cny = $data;

        return $this->change_data_cny;
    }

    public function requestCaculData()
    {
        $rs = curlRequest::curl_get($this->url_cacul_data);
        /*
        {
            "Jun 18th, 2019 at 10:31 NY Time!
            XAU_AED,4935.8533;XAU_ARS,58384.4851;XAU_AUD,1954.0302;XAU_BHD,506.6466;XAU_BRL,5188.4778;XAU_CAD,1797.6419;XAU_CHF,1345.3466;
            XAU_CNY,9280.7937;
            XAU_COP,4417368.3441;XAU_DKK,8962.4263;XAU_EGP,22533.8393;XAU_EUR,1200.1681;XAU_GBP,1069.3744;
            XAU_HKD,10517.2161;XAU_HRK,8888.4866;XAU_HUF,387886.1534;XAU_IDR,19161570.6005;XAU_ILS,4851.7347;
            XAU_INR,93450.9199;XAU_JOD,952.717;XAU_JPY,145792.5725;XAU_KRW,1583142.8359;XAU_KWD,408.8889;XAU_LBP,2032552.4685;
            XAU_LYD,1881.3809;XAU_MKD,73900.7375;XAU_MMK,2056807.1109;XAU_MOP,10847.2673;XAU_MXN,25708.6444;XAU_MYR,5612.1614;
            XAU_NOK,11754.3574;XAU_NPR,149995.8147;XAU_NZD,2058.4062;XAU_PHP,69694.136;XAU_PKR,211384.9192;XAU_QAR,4892.5846;
            XAU_RSD,141496.6117;XAU_RUB,86035.3149;XAU_SAR,5039.7922;XAU_SEK,12815.4644;XAU_SGD,1837.7595;XAU_THB,41978.6719;XAU_TRY,7843.7229;XAU_TWD,42195.3512;
            XAU_USD,1343.7475;
            XAU_VND,31365955.7071;XAU_XAG,20110.861;XAU_XAU,1805657.3438;
            XAU_ZAR,19534.2254;@Jun 18th, 2019 at 10:31 NY Time!XAG_AED,54.974;XAG_ARS,650.2686;XAG_AUD,21.7634;XAG_BHD,5.6429;
            XAG_BRL,57.7877;XAG_CAD,20.0216;XAG_CHF,14.9841;
            XAG_CNY,103.3667;
            XAG_COP,49199.3019;XAG_DKK,99.8208;XAG_EGP,250.975;
            XAG_EUR,13.3671;XAG_GBP,11.9104;XAG_HKD,117.1375;XAG_HRK,98.9973;XAG_HUF,4320.1577;XAG_IDR,213415.7318;XAG_ILS,54.0371;
            XAG_INR,1040.8279;XAG_JOD,10.6111;XAG_JPY,1623.7932;XAG_KRW,17632.5623;XAG_KWD,4.5541;XAG_LBP,22637.9497;XAG_LYD,20.9542;
            XAG_MKD,823.0839;XAG_MMK,22908.0906;XAG_MOP,120.8136;XAG_MXN,286.335;XAG_MYR,62.5065;XAG_NOK,130.9164;XAG_NPR,1670.6077;
            XAG_NZD,22.9259;XAG_PHP,776.232;XAG_PKR,2354.3408;XAG_QAR,54.4921;XAG_RSD,1575.9461;XAG_RUB,958.2351;XAG_SAR,56.1317;
            XAG_SEK,142.7347;XAG_SGD,20.4684;XAG_THB,467.5456;XAG_TRY,87.361;XAG_TWD,469.959;
            XAG_USD,14.9663;
            XAG_VND,349344.4524;XAG_XAG,223.9886;XAG_XAU,20110.861;XAG_ZAR,217.5662;"

            XAU_CNY,9280.7937;
            XAU_USD,1343.7475;
        }
        */
        // echo 'rs:'.$rs.'<br>';
        $this->cacul_data = strTools::getCaculDataFromString($rs);
        // var_dump($this->cacul_data);
        return $this->cacul_data;
    }

    public function setCaculData($data)
    {
        $this->cacul_data = $data;

        return $this->cacul_data;
    }

    public function getPriceFromCaculData($mtype)
    {
        //先检查是否存在数据
        if( !$this->cacul_data )
        {
            return 0;
        }
        //遍历计算数据，取出key与mtype相同的一个的value值
        $gold = $this->cacul_data['gold']['data'];
        foreach($gold as $one)
        {
            $key = $one['key'];
            if( MoneyType::isSameMoneyType( $key, $mtype ) )
            {
                return $one['value'];
            }
        }

        return 0;
    }

    //从交换数据中提取出指定币种的价格
    public function getPriceFromChangeData($mtype)
    {
        //先检查是否存在数据
        if( !$this->change_data_cny )
        {
            return 0;
        }
        
        $items = $this->change_data_cny['items'];
        foreach($items as $one)
        {
            $curr = $one['curr'];
            if( $curr == $mtype )
            {
                return $one['xauPrice'];
            }
        }

        return 0;
    }

    //计算出人民币和美元的汇率
    public function getMoneyRateCNY2USD()
    {
        if( $this->rate_cny2usd )
        {
            return $this->rate_cny2usd;
        }

        //从计算数据中取出两个货币的价格
        $pa = $this->getPriceFromChangeData("CNY");
        $pb = $this->getPriceFromChangeData("USD");
        
        //如果没有数据，则返回0
        if( !$pa || !$pb )
        {
            return 0;
        }

        //有数据的时候，计算比例
        $this->rate_cny2usd = $pa/$pb;
        return $this->rate_cny2usd;
    }

    //计算出钱币的兑换汇率A兑换B
    public function getMoneyRateWith($ma,$mb)
    {
        //从计算数据中取出两个货币的价格
        $pa = $this->getPriceFromCaculData($ma);
        $pb = $this->getPriceFromCaculData($mb);
        
        //如果没有数据，则返回0
        if( !$pa || !$pb )
        {
            return 0;
        }

        //有数据的时候，计算比例
        $r = $pa/$pb;
        return $r;
    }


}


?>