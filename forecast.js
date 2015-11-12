var autoscale_elem = function(){
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
	var time = new Date(ori_time*1000);
	h = time.getHours(), // 0-24 format
	m = time.getMinutes();
	if (h >= 12){
		str = ('00' + (h - 12)).substr(-2) + ':' + ('00' + m).substr(-2) + ' PM';
	} else if (h == 0){
		str = '12:' + ('00' + m).substr(-2) + ' AM';
	} else{
		str = ('00' + h).substr(-2) + ':' + ('00' + m).substr(-2) + ' AM';
	}

	return str;
}

function time_day_week(ori_time){
	var time = new Date(ori_time*1000);
	var day = time.getDay();
	var day_name = '';
	switch (day){
		case 0: day_name = 'Sunday'; break;
		case 1: day_name = 'Monday'; break;
		case 2: day_name = 'Tuesday'; break;
		case 3: day_name = 'Wednesday'; break;
		case 4: day_name = 'Thursday'; break;
		case 5: day_name = 'Friday'; break;
		case 6: day_name = 'Saturday'; break;
	}
	return day_name;
}

function time_day_month(ori_time){
	var time = new Date(ori_time*1000);
	var day = time.getDate();
	var month = time.getMonth();
	var result = "";
	switch (month){
		case 0: result = 'Jan'; break;
		case 1: result = 'Feb'; break;
		case 2: result = 'Mar'; break;
		case 3: result = 'Apr'; break;
		case 4: result = 'May'; break;
		case 5: result = 'Jun'; break;
		case 6: result = 'Jul'; break;
		case 7: result = 'Aug'; break;
		case 8: result = 'Sep'; break;
		case 9: result = 'Oct'; break;
		case 10: result = 'Nov'; break;
		case 11: result = 'Dec'; break;
	}
	return result + " " + day;
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

	$('#current #icon').attr('src', icon_transfer(cur.icon));
	$('#current #summary').text('Mostly '+cur.summary+' in '+city+', '+state);
	$('#current #temperature').text(parseInt(cur.temperature));
	$('#current #temperatureMinMax').html('<font style="color:blue">' + parseInt(data.daily.data[0].temperatureMax)+'°</font> | <font style="color:green">'+parseInt(data.daily.data[0].temperatureMin)+'°</font>');

	// This is precipIntensity
	if (cur.precipIntensity < 0.002){
		$('#current #precipIntensity').text('None');
	} else if (cur.precipIntensity < 0.017){
		$('#current #precipIntensity').text('Very Light');
	} else if (cur.precipIntensity < 0.1){
		$('#current #precipIntensity').text('Light');
	} else if (cur.precipIntensity < 0.4){
		$('#current #precipIntensity').text('Moderate');
	} else {
		$('#current #precipIntensity').text('Heavy');
	}

	$('#current #precipProbability').text((cur.precipProbability * 100) + '%');
	$('#current #windSpeed').text(cur.windSpeed.toFixed(2));
	$('#current #dewPoint').text(cur.dewPoint.toFixed(2));
	$('#current #humidity').text(cur.humidity.toFixed(2) * 100 + '%');
	$('#current #visibility').text(cur.visibility.toFixed(2));
	$('#current #sunriseTime').text(time_transfer(data.daily.data[0].sunriseTime));
	$('#current #sunsetTime').text(time_transfer(data.daily.data[0].sunsetTime));

	if (celsius){
		$('#current #temperature').append('<sup style="font-size:20px">℃</sup>');
		$('#current #windSpeed').append('m/s');
		$('#current #dewPoint').append('℃');
		$('#current #visibility').append('km');
	} else {
		$('#current #temperature').append('<sup style="font-size:20px">℉</sup>');
		$('#current #windSpeed').append('mph');
		$('#current #dewPoint').append('℉');
		$('#current #visibility').append('mi');
	}
	$('#facebook').attr("href","https://www.facebook.com/dialog/feed?app_id=1674194266127138&display=page&caption=Weather%20information%20from%20forecast.io&picture="+icon_transfer(cur.icon)+"&name=Current Weather in "+city+", "+state+"&description="+cur.summary+" "+$('#current-weather-sum #current-weather-temp').text()+"&link=http://thecasery.com/phptest&redirect_uri="+window.location.href+"");
	GetMap(data.latitude, data.longitude);

	/* part 2: display 24hour weather */
	$('#oneday table').remove();
	$('#oneday .collapse').remove();
	var hour = data.hourly;

	// This is head
	$('#oneday').append("<table class='table' id='oneday-table'><thead><tr><th class='col-xs-2 col-sm-2 text-center'>Time</th><th class='col-xs-3 col-sm-3 text-center'>Summary</th><th class='col-xs-3 col-sm-3 text-center'>Cloud Cover</th><th id='th-temp' class='col-xs-2 col-sm-2 text-center'>Temp</th><th class='col-xs-2 col-sm-2 text-center'>View Details</th></tr></thead></table>");
	if (celsius){
		$('#th-temp').append('(℃)');
	} else {
		$('#th-temp').append('(℉)');
	}

	for (var i = 0; i < 24; i++){
		var time_str = time_transfer(hour.data[i].time);
		var icon_url = icon_transfer(hour.data[i].icon);
		var cloud_cover = parseInt(hour.data[i].cloudCover * 100) + '%';
		var temp = hour.data[i].temperature;
		var wind = hour.data[i].windSpeed;
		var humidity = parseInt(hour.data[i].humidity * 100) + '%';
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

		var sub_table = "<div class='collapse' id='tab"+i+"'><div class='well'><table class='table text-center'><tbody><tr style='font-size:16px;background-color:white;'><th class='text-center col-xs-3 col-sm-3'>Wind</th><th class='text-center col-xs-3 col-sm-3'>Humidity</th><th class='text-center col-xs-3 col-sm-3'>Visibility</th><th class='text-center col-xs-3 col-sm-3'>Pressure</th></tr><tr><td>"+wind+"</td><td>"+humidity+"</td><td>"+visibility+"</td><td>"+pressure+"</td></tr></tbody></table></div></div>";

		$('#oneday').append("<table class='table'><tr class='oneday-tr'><td class='col-xs-2 col-sm-2 text-center'>"+time_str+"</td><td class='col-xs-3 col-sm-3 text-center'><img style='max-height:50px;' src='"+icon_url+"'></td><td class='col-xs-3 col-sm-3 text-center'>"+cloud_cover+"</td><td class='col-xs-2 col-sm-2 text-center'>"+temp+"</td><td class='col-xs-2 col-sm-2 text-center'><a data-toggle='collapse' aria-expanded='false' aria-controls='tab"+i+"' href='#tab"+i+"'><span class='glyphicon glyphicon-plus'></span></a></td></tr></table>"+sub_table);
	}

	/* Part 3: 7 days forecast*/
	var day = data.daily;

	for (var i = 1; i < 8; i++){
		$('#day'+i).find('#day').text(time_day_week(day.data[i].time));
		$('#day'+i).find('#month-day').text(time_day_month(day.data[i].time));
		$('#day'+i).find('#icon').attr('src',icon_transfer(day.data[i].icon)).css('max-width','100px');
		$('#day'+i).find('#min-temp').text(parseInt(day.data[i].temperatureMin)+'°');
		$('#day'+i).find('#max-temp').text(parseInt(day.data[i].temperatureMax)+'°');
	}
	$('.day-week').off('click').on('click',function(){
		var t = $('.day-week');
		var j = 0;
		for (var k = 1; k < 8; k++){
			if (t.eq(k-1).find('#day').text() == $(this).find('#day').text()){
				j = k;
				break;
			}
		}
		$('#tempModal p').text('');
		$('#tempModal #tempModalLabel').text('Weather in '+city+' on '+time_day_month(day.data[j].time));
		$('#tempModal #icon').attr('src',icon_transfer(day.data[j].icon));
		$('#tempModal #summary').append(time_day_week(day.data[j].time)+':'+"<b style='color:orange'>"+day.data[j].summary+"</b>");
		$('#tempModal #sunrise').text(time_transfer(day.data[j].sunriseTime));
		$('#tempModal #sunset').text(time_transfer(day.data[j].sunsetTime));
		$('#tempModal #humidity').text(day.data[j].humidity.toFixed(2) * 100+'%');
		$('#tempModal #wind-speed').text(day.data[j].windSpeed);
		$('#tempModal #visibility').text(day.data[j].visibility);
		$('#tempModal #pressure').text(day.data[j].pressure);

		if (celsius){
			$('#tempModal #wind-speed').append('m/s');
			$('#tempModal #visibility').append('km');
			$('#tempModal #pressure').append('kPa');
		} else {
			$('#tempModal #wind-speed').append('mph');
			$('#tempModal #visibility').append('mi');
			$('#tempModal #pressure').append('mb');
		}

		$('#tempModal').modal('show');
	});
}

// valid input form
function validation(){
	var valid = true;
	if ($.trim($('#search-form #street').val()).length <= 0) {
		$('#search-form #invalid-street').text('Please enter the street address').removeClass('hidden');
    valid = false;
	}
	if ($.trim($('#search-form #city').val()).length <= 0) {
		$('#search-form #invalid-city').text('Please enter the city').removeClass('hidden');
    valid = false;
	}
	if ($('#search-form #state').get(0).selectedIndex == 0) {
		$('#search-form #invalid-state').text('Please select a state').removeClass('hidden');
    valid = false;
	}

	return valid;
}

// click the submit button
function search_submit(){
	$('.invalid-form-input').text('');
	if (validation()){
		var street = $('#search-form #street').val();
		var city = $('#search-form #city').val();
		var state = $('#search-form #state option:selected').val();
		var celsius = false;
		if ($('#search-form #degree input').last().is(':checked')){
      celsius = true;
    }

		// Use Google Maps Geocoding API, edit an url
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+street+", "+city+", "+state+"&key=AIzaSyDko4GoAGeivRVj0rl2A_xa5s_Gjo6F0Jg";

		// Get the geo-location of the addr
		$.getJSON(url, function (data, textStatus) {
      var northeast_lat = data.results[0].geometry.viewport.northeast.lat;
      var northeast_lng = data.results[0].geometry.viewport.northeast.lng;
      var southwest_lat = data.results[0].geometry.viewport.southwest.lat;
      var southwest_lng = data.results[0].geometry.viewport.southwest.lng;

      // if the first request succeed, we try to get the forecast info
      var url2 = "https://api.forecast.io/forecast/48ba3483c1b320fd8c8a4deb4754f897/"+(northeast_lat+southwest_lat)/2+","+(northeast_lng+southwest_lng)/2;
      // check if we selected celsius, if we did, add &units=si
      if (celsius){
      	url2 = url2 + '?units=si';
      }
      
      // url2 is the request url
      // Test URL http://amber-env.elasticbeanstalk.com/?url=https://api.forecast.io/forecast/48ba3483c1b320fd8c8a4deb4754f897/34.027698,-118.2927895
      $.get("http://amber-env.elasticbeanstalk.com/", 
      	{url: url2},
      	function(data){
      		$('#div-results').removeClass('hidden');
         	data_deploy(data, city, state, celsius);
       	},
       	"json"
      );
    });
  }
}

// clear data
function search_clear(){
	$('#search-form #street').val('');
	$('#search-form #city').val('');
	$('#search-form #state').get(0).selectedIndex = 0;
	$('#search-form #degree input').first().prop('checked',true);
	$('.invalid-form-input').text('').addClass('hidden');
	if (!$('#div-results').hasClass('hidden')){
		$('#div-results').addClass('hidden');
	}
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
	window.resize = autoscale_elem;
}

$(document).ready(init);