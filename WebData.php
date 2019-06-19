<?php

require_once "./curlRequest.php";


class WebData{

    public $url = '';
    public $web = '';

    public $dom;
    public $xpath;

    public function __construct($url) 
    {
        $this->url = $url;
        
        // 发起请求
        $this->request();

        //获得XPAth对象
        $this->getXPath();
    }
    
    public function request()
    {
        //提取网页信息ok
        // $this->web = file_get_contents($this->url);
        $this->web = "<!DOCTYPE html>";
        $ct = curlRequest::curl_get($this->url);
        $this->web .= $ct;
        // echo "content:".$this->web."<br>";
    }

    public function request_curl()
    {
        //提取内容
        // $temp_contents = curlRequest::curl_get($this->url);
        // echo 'temp_content len:'.strlen($temp_contents).':'.$temp_contents."<br/>";
		// 进行字符编码转换
		// $contents = mb_convert_encoding($temp_contents, 'utf-8', 'gbk');
    }

    public function getXPath()
    {
        libxml_use_internal_errors(true);

        $this->dom = new DOMDocument();
        // echo "web:".$this->web."<br>";
        $this->dom->loadHTML($this->web);
        // echo "dom:".'<br>';
        // print_r($dom);
        // echo "dom---------<<<<".'<br>';
        $this->xpath = new DOMXPath($this->dom);
        // echo 'xpath:'.'<br>';
        // print_r($xpath);
        // echo '<br>';

        libxml_use_internal_errors(false);
    }

    public function getElementsByID($domID)
    {
        // $elements = $this->xpath->query("//*[@id='".$domID."']");
        
        $elements = $this->dom->getElementById($domID)->tagName;
        print_r($elements);

        return $elements;
    }


    public function getElementsByClass($className)
    {
        // $elements = $this->xpath->query("//*[contains(@class,'".$className."')]");
        $ql = '//*[@class="'.$className.'")]';
        echo "ql:".$ql."<br>";
        $elements = $this->xpath->query($ql);
        print_r($elements);

        return $elements;
    }

    public function getElementsByNode($nodeName)
    {
        $ql = '//'.$nodeName;
        echo "ql:".$ql."<br>";

        $elements = $this->xpath->query($ql);
        // print_r($elements);
        foreach( $elements as $node )
        {
            $cn = $node->attributes->getNamedItem('class')->nodeValue;
            echo "cn:"."<br>";
            print_r($cn);
            echo "<br>";
        }

        return $elements;
    }

    public function getValue($nodeName,$className,$domID)
    {
        // $this->getElementsByID($domID);
        // $this->getElementsByClass($className);
        // $this->getElementsByNode($nodeName);

        return "";
    }
}


?>