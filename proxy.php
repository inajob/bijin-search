<?php
error_log('QUERY ' . $_SERVER['QUERY_STRING']);
echo file_get_contents('http://bjin.me/api/?' . $_SERVER['QUERY_STRING']);
?>
