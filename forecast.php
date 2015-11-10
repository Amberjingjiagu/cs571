<?php
include('forecast.io.php');
$api_key = '48ba3483c1b320fd8c8a4deb4754f897';
$latitude = '52.4308';
$longitude = '13.2588';
$units = 'auto';  // Can be set to 'us', 'si', 'ca', 'uk' or 'auto' (see forecast.io API); default is auto
$lang = 'en'; // Can be set to 'en', 'de', 'pl', 'es', 'fr', 'it', 'tet' or 'x-pig-latin' (see forecast.io API); default is 'en'
$forecast = new ForecastIO($api_key, $units, $lang);
// all default will be
// $forecast = new ForecastIO($api_key);
/*
 * GET CURRENT CONDITIONS
 */
$condition = $forecast->getCurrentConditions($latitude, $longitude);
echo nl2br('Current temperature: '.$condition->getTemperature(). "\n");
echo nl2br('Icon:'.$condition->getIcon(). "\n");
/*
 * GET HOURLY CONDITIONS FOR TODAY
 */
$conditions_today = $forecast->getForecastToday($latitude, $longitude);
echo nl2br("\n\nTodays temperature:\n");
foreach($conditions_today as $cond) {
    echo nl2br($cond->getTime('H:i:s') . ': ' . $cond->getTemperature(). "\n");
}
/*
 * GET DAILY CONDITIONS FOR NEXT 7 DAYS
 */
$conditions_week = $forecast->getForecastWeek($latitude, $longitude);
echo nl2br("\n\nConditions this week:\n");
foreach($conditions_week as $conditions) {
    echo nl2br($conditions->getTime('Y-m-d') . ': ' . $conditions->getMaxTemperature() . "\n");
}
/*
 * GET HISTORICAL CONDITIONS
 */
$condition = $forecast->getHistoricalConditions($latitude, $longitude, '2010-10-10T14:00:00-0700');
echo nl2br("\n\nTemperatur 2010-10-10: ". $condition->getMaxTemperature(). "\n");