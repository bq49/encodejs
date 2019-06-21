<?php

class MoneyType{

    public static $mType = array(
        array("key"=>"XAU_AED","name"=>"AED","desc"=>"阿拉伯联合酋长国迪拉姆"),
        array("key"=>"XAU_ARS","name"=>"ARS","desc"=>"阿根廷比索"),
        array("key"=>"XAU_AUD","name"=>"AUD","desc"=>"澳大利亚元"),
        array("key"=>"XAU_BHD","name"=>"BHD","desc"=>"巴林丁那"),
        array("key"=>"XAU_BRL","name"=>"BRL","desc"=>"巴西雷亚尔"),
        array("key"=>"XAU_CAD","name"=>"CAD","desc"=>"加拿大元"),
        array("key"=>"XAU_CHF","name"=>"CHF","desc"=>"瑞士法郎"),
        array("key"=>"XAU_CNY","name"=>"CNY","desc"=>"人民币"),
        array("key"=>"XAU_COP","name"=>"COP","desc"=>"哥伦比亚比索"),
        array("key"=>"XAU_DKK","name"=>"DKK","desc"=>"丹麦克朗"),
        array("key"=>"XAU_EGP","name"=>"EGP","desc"=>"埃及镑"),
        array("key"=>"XAU_EUR","name"=>"EUR","desc"=>"欧元"),
        array("key"=>"XAU_GBP","name"=>"GBP","desc"=>"英镑"),
        array("key"=>"XAU_HKD","name"=>"HKD","desc"=>"港元"),
        array("key"=>"XAU_HRK","name"=>"HRK","desc"=>"克罗地亚库纳"),
        array("key"=>"XAU_HUF","name"=>"HUF","desc"=>"匈牙利福林"),
        array("key"=>"XAU_IDR","name"=>"IDR","desc"=>"印度尼西亚盾"),
        array("key"=>"XAU_ILS","name"=>"ILS","desc"=>"以色列新谢克尔"),
        array("key"=>"XAU_INR","name"=>"INR","desc"=>"印度卢比"),
        array("key"=>"XAU_JOD","name"=>"JOD","desc"=>"约旦丁那"),
        array("key"=>"XAU_JPY","name"=>"JPY","desc"=>"日元"),
        array("key"=>"XAU_KRW","name"=>"KRW","desc"=>"韩元"),
        array("key"=>"XAU_KWD","name"=>"KWD","desc"=>"科威特第纳尔"),
        array("key"=>"XAU_LBP","name"=>"LBP","desc"=>"黎巴嫩镑"),
        array("key"=>"XAU_LYD","name"=>"LYD","desc"=>"利比亚第纳尔"),
        array("key"=>"XAU_MKD","name"=>"MKD","desc"=>"马其顿第纳尔"),
        array("key"=>"XAU_MMK","name"=>"MMK","desc"=>"缅甸元"),
        array("key"=>"XAU_MOP","name"=>"MOP","desc"=>"澳门币"),
        array("key"=>"XAU_MXN","name"=>"MXN","desc"=>"墨西哥比索"),
        array("key"=>"XAU_MYR","name"=>"MYR","desc"=>"马来西亚林吉特"),
        array("key"=>"XAU_NOK","name"=>"NOK","desc"=>"挪威克朗"),
        array("key"=>"XAU_NPR","name"=>"NPR","desc"=>"尼泊尔卢比"),
        array("key"=>"XAU_NZD","name"=>"NZD","desc"=>"新西兰元"),
        array("key"=>"XAU_PHP","name"=>"PHP","desc"=>"菲律宾比索"),
        array("key"=>"XAU_PKR","name"=>"PKR","desc"=>"巴基斯坦卢比"),
        array("key"=>"XAU_QAR","name"=>"QAR","desc"=>"卡塔尔里亚尔"),
        array("key"=>"XAU_RSD","name"=>"RSD","desc"=>"塞尔维亚第纳尔"),
        array("key"=>"XAU_RUB","name"=>"RUB","desc"=>"俄罗斯卢布"),
        array("key"=>"XAU_SAR","name"=>"SAR","desc"=>"沙特里亚尔"),
        array("key"=>"XAU_SEK","name"=>"SEK","desc"=>"瑞典克朗"),
        array("key"=>"XAU_SGD","name"=>"SGD","desc"=>"新加坡元"),
        array("key"=>"XAU_THB","name"=>"THB","desc"=>"泰铢"),
        array("key"=>"XAU_TRY","name"=>"TRY","desc"=>"土耳其里拉"),
        array("key"=>"XAU_TWD","name"=>"TWD","desc"=>"新台币"),
        array("key"=>"XAU_USD","name"=>"USD","desc"=>"美元"),
        array("key"=>"XAU_VND","name"=>"VND","desc"=>"越南盾"),
        array("key"=>"XAU_XAG","name"=>"XAG","desc"=>"银价盎司"),
        array("key"=>"XAU_XAU","name"=>"XAU","desc"=>"金价盎司"),
        array("key"=>"XAU_ZAR","name"=>"ZAR","desc"=>"南非兰特"),
    );

    public static function getCurrencyByKey($key)
    {
        foreach(MoneyType::$mType as $one)
        {
            if( strTools::isSameString($key,$one['key']) )
            {
                return $one;
            }
        }

        return null;
    }

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