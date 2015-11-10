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
			sphericalMercator: true
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

function time_transfer(ori_time){
	var str = '';
	var time = new Date(ori_time),
	h = time.getHours(), // 0-24 format
	m = time.getMinutes();
	
	if (h > 12){
		str = ('00' + (h - 12)).substr(-2) + ':' + ('00' + m).substr(-2) + ' PM';
	} else if (h == 0){
		str = '12:' + ('00' + m).substr(-2) + ' AM';
	} else{
		str = ('00' + h).substr(-2) + ':' + ('00' + m).substr(-2) + ' AM';
	}

	return str;
}

function icon_transfer(ori_icon){
	var icon_url = '';
	switch (ori_icon){
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
	return icon_url;
}

function data_deploy(data, city, state, celsius){
	/* Part 1: display current weather */ 
	var cur = data.currently;

	$('#current-weather-sum #current-weather-icon').attr('src', icon_transfer(cur.icon));
	$('#current-weather-sum #current-weather-desciption').text('Mostly '+cur.summary+' in '+city+', '+state);
	$('#current-weather-sum #current-weather-temp').text(parseInt(cur.temperature));
	$('#current-weather-sum #current-weather-lhtemp').text(parseInt(data.daily.data[0].temperatureMax)+'° | '+parseInt(data.daily.data[0].temperatureMin)+'°');

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
	$('#current-weather-table #Sunrise').text(time_transfer(data.daily.data[0].sunriseTime));
	$('#current-weather-table #Sunset').text(time_transfer(data.daily.data[0].sunsetTime));

	if (celsius){
		$('#current-weather-sum #current-weather-temp').append('<sup>℃</sup>');
		$('#current-weather-table #Wind-Speed').append('m/s');
		$('#current-weather-table #Dew-Point').append('℃');
		$('#current-weather-table #Visibility').append('km');
	} else {
		$('#current-weather-sum #current-weather-temp').append('<sup>℉</sup>');
		$('#current-weather-table #Wind-Speed').append('mph');
		$('#current-weather-table #Dew-Point').append('℉');
		$('#current-weather-table #Visibility').append('mi');
	}

	GetMap(data.latitude, data.longitude);

	/* part 2: display 24hour weather */
	$('.oneday-tr').remove();
	var hour = data.hourly;

	for (var i = 0; i < 24; i++){
		var time_str = time_transfer(hour.data[i].time);
		var icon_url = icon_transfer(hour.data[i].icon);
		var cloud_cover = hour.data[i].cloudCover.toFixed(2) * 100 + '%';
		var temp = hour.data[i].temperature;
		var wind = hour.data[i].windSpeed;
		var humidity = hour.data[i].humidity.toFixed(2) * 100 + '%';
		var visibility = hour.data[i].visibility;
		var pressure = hour.data[i].pressure;

		if (celsius){
			wind = wind + 'm/s';
			visibility = visibility + 'km';
			pressure = pressure + 'kPa';
		} else {
			wind = wind + 'mph';
			visibility = visibility + 'mi';
			pressure = pressure + 'mb';
		}

		var sub_table = "<table class='table'><thead><tr><th class='col-xs-3 col-sm-3'>Wind</th><th class='col-xs-3 col-sm-3'>Humidity</th><th class='col-xs-3 col-sm-3'>Visibility</th><th class='col-xs-3 col-sm-3'>Pressure</th></tr></thead><tr><td>"+wind+"</td><td>"+humidity+"</td><td>"+visibility+"</td><td>"+pressure+"</td></tr></table>";

		$('#oneday-table').append("<tr class='oneday-tr'><td>"+time_str+"</td><td><img style='max-height:50px;' src='"+icon_url+"'></td><td>"+cloud_cover+"</td><td>"+temp+"</td><td><button><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></button></td></tr>");
			//<a role='button' data-toggle='collapse' href='#oneday-collapse-"+i+"' aria-expanded='false' aria-controls='oneday-collapse-"+i+"'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></a></td></tr><div class='collapse' id='oneday-collapse-"+i+"'><div class='well'>"+sub_table+"</div></div>");
	}
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