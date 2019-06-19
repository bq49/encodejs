<?php

class MoneyType{

    public static $mType = array(
        array("key"=>XAU_AED,"name"=>"AED"),
        array("key"=>XAU_ARS,"name"=>"ARS"),
        array("key"=>XAU_AUD,"name"=>"AUD"),
        array("key"=>XAU_BHD,"name"=>"BHD"),
        array("key"=>XAU_BRL,"name"=>"BRL"),
        array("key"=>XAU_CAD,"name"=>"CAD"),
        array("key"=>XAU_CHF,"name"=>"CHF"),
        array("key"=>XAU_CNY,"name"=>"CNY"),
        array("key"=>XAU_COP,"name"=>"COP"),
        array("key"=>XAU_DKK,"name"=>"DKK"),
        array("key"=>XAU_EGP,"name"=>"EGP"),
        array("key"=>XAU_EUR,"name"=>"EUR"),
        array("key"=>XAU_GBP,"name"=>"GBP"),
        array("key"=>XAU_HKD,"name"=>"HKD"),
        array("key"=>XAU_HRK,"name"=>"HRK"),
        array("key"=>XAU_HUF,"name"=>"HUF"),
        array("key"=>XAU_IDR,"name"=>"IDR"),
        array("key"=>XAU_ILS,"name"=>"ILS"),
        array("key"=>XAU_INR,"name"=>"INR"),
        array("key"=>XAU_JOD,"name"=>"JOD"),
        array("key"=>XAU_JPY,"name"=>"JPY"),
        array("key"=>XAU_KRW,"name"=>"KRW"),
        array("key"=>XAU_KWD,"name"=>"KWD"),
        array("key"=>XAU_LBP,"name"=>"LBP"),
        array("key"=>XAU_LYD,"name"=>"LYD"),
        array("key"=>XAU_MKD,"name"=>"MKD"),
        array("key"=>XAU_MMK,"name"=>"MMK"),
        array("key"=>XAU_MOP,"name"=>"MOP"),
        array("key"=>XAU_MXN,"name"=>"MXN"),
        array("key"=>XAU_MYR,"name"=>"MYR"),
        array("key"=>XAU_NOK,"name"=>"NOK"),
        array("key"=>XAU_NPR,"name"=>"NPR"),
        array("key"=>XAU_NZD,"name"=>"NZD"),
        array("key"=>XAU_PHP,"name"=>"PHP"),
        array("key"=>XAU_PKR,"name"=>"PKR"),
        array("key"=>XAU_QAR,"name"=>"QAR"),
        array("key"=>XAU_RSD,"name"=>"RSD"),
        array("key"=>XAU_RUB,"name"=>"RUB"),
        array("key"=>XAU_SAR,"name"=>"SAR"),
        array("key"=>XAU_SEK,"name"=>"SEK"),
        array("key"=>XAU_SGD,"name"=>"SGD"),
        array("key"=>XAU_THB,"name"=>"THB"),
        array("key"=>XAU_TRY,"name"=>"TRY"),
        array("key"=>XAU_TWD,"name"=>"TWD"),
        array("key"=>XAU_USD,"name"=>"USD"),
        array("key"=>XAU_VND,"name"=>"VND"),
        array("key"=>XAU_XAG,"name"=>"XAG"),
        array("key"=>XAU_XAU,"name"=>"XAU"),
        array("key"=>XAU_ZAR,"name"=>"ZAR"),
    );


    public static function isSameMoneyType($key,$mtype)
    {
        foreach(MoneyType::$mType as $one)
        {
            if( $key == $one['key'] && $mtype == $one['name'])
            {
                return true;
            }
        }

        return false;
    }
}

?>