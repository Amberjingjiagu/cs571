<?php
	header('Access-Control-Allow-Origin:*');
	$json = file_get_contents($_GET[url]);
	echo $json;
?>