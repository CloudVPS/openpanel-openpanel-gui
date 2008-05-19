<?php
/*
$a["first"]["name"] = "first";
$a["first"]["label"] = "straat";
$a["first"]["type"] = "string";

$a["second"]["name"] = "second";
$a["second"]["label"] = "huisnummer";
$a["second"]["type"] = "string";
$a["second"]["sameline"] = true;

$a["third"]["name"] = "third";
$a["third"]["label"] = "Third Var";
$a["third"]["type"] = "string";

$a["fourth"]["name"] = "fourth";
$a["fourth"]["label"] = "Fourth Var";
$a["fourth"]["type"] = "string";


foreach($a as $paramName => $param){
	$array[] = $param;
}

$i = 0;

foreach($a as $paramName=>$param){
	$newLine = true;
	
	$label = "{$param["label"]} ";
	
	switch($param["type"]){
		case "string":
			$formItem = "<input type=\"text\" name=\"{$param["name"]}\"/>";
		break;
		default:
			
		break;
	}
	
	echo $label;
	echo $formItem;
	
	$i++;
	if($nextParam = $array[$i]){
		if($nextParam["sameline"] == true){			
			$newLine = false;
		}
	}
	
	if($newLine == true){
		echo "<br/>";
	}
}
*/
?><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>OpenPanel beta</title>
	<link rel="stylesheet" type="text/css" href="css/forms.css" />

	<script type="text/javascript" src="prototype-1.6.0.2.js"></script>
	<script type="text/javascript" src="forms.js"></script>
	<script type="text/javascript" src="OpenPanel.GUIBuilder.Widget.js"></script>
	<script type="text/javascript" src="OpenPanel.GUIBuilder.Widget.Base.js"></script>
	<script type="text/javascript" src="OpenPanel.GUIBuilder.Widget.TextField.js"></script>
	<script type="text/javascript" src="OpenPanel.GUIBuilder.Widget.Number.js"></script>
	<script type="text/javascript" src="OpenPanel.GUIBuilder.Widget.IPAddress.js"></script>
</head>
<body onload="javascript:build();">
	<div id="t">&nbsp;</div>
<div id="okButton">ok</div>
</body>
</html>


