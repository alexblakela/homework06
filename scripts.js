/* Config */
var apiKey = "1b448be874fcfbafcc8d7018927caae9";
var todayIs = moment().format("MM/DD/YYYY");
var unixStamp = parseFloat(moment(todayIs).format('X')) + 50400;

// Initial Setup
var city = localStorage.getItem("weatherCity");
if (city) {
} else { 
	city = "Chatsworth";
	$("#pastSearches").prepend("<li>" + city + "</li>")
}
runSearch(city);

function uvIndex (lat,lon) {
	apiUV = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
	$.get(apiUV, function( uv ) {
		var uvStyle = Math.floor(uv.value);		
		$("#cardUV").text(uv.value);
		$("#cardUV").attr("class", "uv" + uvStyle);
	});
}

function runSearch (city) {
	console.log("runSearch Started");
	var apiQ = "http://api.openweathermap.org/data/2.5/forecast?q="+ city + "&appid=" + apiKey + "&units=imperial";
	/* Query */
	$.get(apiQ, function( data ) {
		var icon = data.list[0].weather[0].icon;

		$("#city").html(city + "<img src='http://openweathermap.org/img/w/" + icon + ".png'>");
		$("#today").text(todayIs);
		$("#cardTemperature").text(data.list[0].main.temp + " F°");
		$("#cardHumidity").text(data.list[0].main.humidity + "%");
		$("#cardWind").text(data.list[0].wind.speed + " MPH");
		$("#cardUV").text();

		// Set UV Index 
		uvIndex (data.city.coord.lat, data.city.coord.lon);
	});

	/* Create cards for future dates */
	$(".card-sub").empty(); // Clear old cards

	$.get(apiQ, function( data ) {
		for (var i = 0; i < 5; i++) {
			var thisDate = moment().add(i+1, 'd');

			var icon = data.list[i].weather[0].icon;

		// Create cards
		$(".card-sub").append("<div class='card col-2'><h5>"+ thisDate.format("MM/DD/YYYY") +"</h5><img src='http://openweathermap.org/img/w/" + icon + ".png'><p>Temperature: " + data.list[i+1].main.temp + " F°</p><p>Humidity: "+ data.list[i+1].main.humidity +"%</p></div>");
		}
	});
}

/* Data Input */
$(".btn").click(function(e) {
	e.preventDefault();

		var mySearch = $("#citySearch").val();
		if (mySearch !== '')
		{

			// Add to Local Storage
			localStorage.setItem("weatherCity", mySearch);

			// Add to Sidebar
			$("#pastSearches").prepend("<li>" + mySearch + "</li>")
			city = mySearch;

			runSearch(mySearch);
		}
});

/* History Clicks */
$('body').on('click','#pastSearches li', function(e){ 
	e.preventDefault();
	var mySearch = $(this).text();
	runSearch(mySearch);
});