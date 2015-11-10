// submit the form
function form_submit(){

}

// valid input form
function validation(){
	var valid = true;
	if ($.trim($('#form-street').val()).length <= 0) {
		$('#invalid-street').text('Please	enter	the	street address');
    valid = false;
	}
	if ($.trim($('#form-city').val()).length <= 0) {
		$('#invalid-city').text('Please	enter the	city');
    valid = false;
	}
	if ($('#form-state').get(0).selectedIndex == 0) {
		$('#invalid-state').text('Please select a state');
    valid = false;
	}

	return valid;
}

function GetMap(latitude, longitude) {
	var map = new OpenLayers.Map("current-weather-map");
	var position = new OpenLayers.LonLat(longitude, latitude).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
	var mapnik = new OpenLayers.Layer.OSM();
	var cloud = new OpenLayers.Layer.XYZ(
		"clouds",
		"http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
		{
			isBaseLayer: false,
			opacity: 0.6,
			sphericalMercator: ture
		}
	);
	var precipitation = new OpenLayers.Layer.XYZ(
		"precipitation",
		"http://${s}.tile.openweather.org/map/precipitation/${z}/${x}/${y}.png",
		{
			isBaseLayer: false,
			opacity: 0.6,
			sphericalMercator: true
		}
	);
	map.addLayers([mapnik, cloud, precipitation]);
	map.setCenter(position, 10);
}


function data_deploy(data, city, state, celsius){
	//Part 1: display current weather 
	var cur = data.currently;
	var icon_url = '';
	switch (cur.icon){
		case 'clear-day': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/clear.png'; break;
		case 'clear-night': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/clear_night.png'; break;
		case 'rain': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/rain.png'; break;
		case 'snow': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/snow.png'; break;
		case 'sleet': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/sleet.png'; break;
		case 'wind': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/wind.png'; break;
		case 'fog': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/fog.png'; break;
		case 'cloudy': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/cloudy.png'; break;
		case 'partly-cloudy-day': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/cloud_day.png'; break;
		case 'partly-cloudy-night': icon_url = 'http://cs-server.usc.edu:45678/hw/hw8/images/cloud_night.png'; break;
	}

	$('#current-weather-sum #current-weather-icon').attr('src', icon_url);
	$('#current-weather-sum #current-weather-desciption').text('Mostly '+cur.summary+' in '+city+', '+state);
	if (celsius){
		$('#current-weather-sum #current-weather-temp').text(parseInt(cur.temperature)+'<sup>o</sup>C');
	} else {
		$('#current-weather-sum #current-weather-temp').text(parseInt(cur.temperature)+'<sup>o</sup>F');
	}
	$('#current-weather-sum #current-weather-lhtemp').text(parseInt(data.daily.data[0].temperatureMax)+' | '+parseInt(data.daily.data[0].temperatureMin));

	// This is precipIntensity
	if (cur.precipIntensity < 0.002){
		$('#current-weather-table #Precipitation').text('None');
	} else if (cur.precipIntensity < 0.017){
		$('#current-weather-table #Precipitation').text('Very Light');
	} else if (cur.precipIntensity < 0.1){
		$('#current-weather-table #Precipitation').text('Light');
	} else if (cur.precipIntensity < 0.4){
		$('#current-weather-table #Precipitation').text('Moderate');
	} else {
		$('#current-weather-table #Precipitation').text('Heavy');
	}

	$('#current-weather-table #Chance-of-Rain').text((cur.precipProbability * 100) + '%');
	$('#current-weather-table #Wind-Speed').text(cur.windSpeed.toFixed(2));
	$('#current-weather-table #Dew-Point').text(cur.dewPoint.toFixed(2));
	$('#current-weather-table #Humidity').text(cur.humidity.toFixed(2) * 100 + '%');
	$('#current-weather-table #Visibility').text(cur.visibility.toFixed(2));
	$('#current-weather-table #Sunrise').text(data.daily.data[0].sunriseTime);
	$('#current-weather-table #Sunset').text(data.daily.data[0].sunsetTime);

	GetMap(data.latitude, data.longitude);
}


// click the submit button
function search_submit(){
	$('.text-danger').text('');
	if (validation()){
		var northeast_lat, northeast_lng, southwest_lat, southwest_lng;
		var street = $('#form-street').val();
		var city = $('#form-city').val();
		var state = $('#form-state option:selected').val();
		var celsius = false;
		if ($('#form-degree input').last().is(':checked')){
      celsius = true;
    }
		// Use Google Maps Geocoding API, edit an url
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+street+", "+city+", "+state+"&key=AIzaSyDko4GoAGeivRVj0rl2A_xa5s_Gjo6F0Jg";
		// Get the geo-location of the addr
		$.getJSON(url, function (data, textStatus) {
      northeast_lat = data.results[0].geometry.viewport.northeast.lat;
      northeast_lng = data.results[0].geometry.viewport.northeast.lng;
      southwest_lat = data.results[0].geometry.viewport.southwest.lat;
      southwest_lng = data.results[0].geometry.viewport.southwest.lng;

      // if the first request succeed, we try to get the forecast info
      var url2 = "https://api.forecast.io/forecast/48ba3483c1b320fd8c8a4deb4754f897/"+(northeast_lat+southwest_lat)/2+","+(northeast_lng+southwest_lng)/2;
      $('.test').text(url2);
      // check if we selected celsius, if we did, add &units=si
      if (celsius){
      	url2 = url2 + '?units=si';
      }
      // url2 is the request url
      $.post("forecast.io.php", 
      	{url: url2},
      	function(data){
         	data_deploy(data, city, state, celsius);
       	},
       	"json"
      );
    });
  }
		//$("#search-form").submit();
}

// clear data
function search_clear(){
	$('#form-street').val('');
	$('#form-city').val('');
	$('#form-state').get(0).selectedIndex = 0;
	$('#form-dgree input').first().prop('checked',true);
}

// register all the event
function init(){
	$('#form-submit').off('click').on('click', function(e){
		e.preventDefault();
		search_submit();
	});
	$('#form-clear').off('click').on('click', function(e){
		e.preventDefault();	// This is important, to keep page not refresh!
		search_clear();
	});
}

$(document).ready(init);