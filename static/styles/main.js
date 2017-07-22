var markers = [];
var eventsData;

$(document).ready(function(){

	setTodaysDate();

	/*$(".event").on("click", function(){

		var id = $(this).attr('id');
		var marker;

		for (var i=0; i < markers.length; i++) {

        	if (markers[i].id === id) {
            	marker = markers[i].marker;
            	break;
        	}
    	}

		google.maps.event.trigger(marker, 'click');
		console.log(id, marker);
	});*/
	
	getEvents($("#place").val());

	var windowHeight = $(window).height()

	if (windowHeight < 950){
		$(".mapCont").css("height", (windowHeight - 145).toString() + "px" );
		$("#eventsList").css("height", (windowHeight - 190).toString() + "px" );
		$("#events").css("height", "calc(100% - 61px)");
	}

});

$("#hideSearch").on("click", function(){

	var windowHeight = $(window).height();

	$("#mobileInput").hide();
	$("#showSearch").show();
	$(".mapCont").css("height", (windowHeight - 40).toString() + "px");
});

$("#showSearch").on("click", function(){

	$("#mobileInput").show();
	$("#showSearch").hide();
	$(".mapCont").css("height", (windowHeight - 145).toString() + "px");
})

$(document).ajaxStart(function(){
	console.log("ajax Started");
	$("#loading").show();
});

$(document).ajaxStop(function(){
	console.log("ajax Stopped");
	$("#loading").hide();
});

$("body").on("click", ".event",function(){

		var id = $(this).attr('id');
		var marker;

		for (var i=0; i < markers.length; i++) {

        	if (markers[i]["id"] == id) {
            	marker = markers[i]["marker"];
            	break;
        	}
    	}
		console.log(id, marker);
		google.maps.event.trigger(marker, 'click');
		//console.log(id, marker);
});

$("#searchHere").on("click", function(){

	var latlong = map.getCenter();
	var coords = latlong.lat() + "," + latlong.lng();
	console.log(coords);
	console.log(latlong);
	getEvents(coords)
});

$(document).on('change', '#sortBy', function() {

	var sort = $("#sortBy").val();
	sortBy(sort);
});

$(document).on("click", ".ctrlBtn", function(){

	var id = $(this).parent().prev().prev().attr("id");

	var evnt;

	//console.log(eventsData);

	var eData = eventsData["events"];

	for (var i = 0; i < eData.length; i++){

		if (eData[i]["id"] == id){

			evnt = eData[i];
			break;
		}
	}


	saveEventToDB(evnt);
	$("#loading").hide();
	
	console.log(evnt);

});

$("#search").on("click", function(){

	getEvents($("#place").val());
})

function searchFor(search) {

    if(event.keyCode == 13) {

        getEvents(search.value);
        //alert(search.value);        
    }

}

function getEvents(place){

	var within = $("#within").val();
	var category = $("#category").val();
	var sdate = $("#sdate").val();
	var edate = $("#edate").val();

	console.log(within, category, sdate, place);
	if (sdate > edate){

		$("#error").show();
		setTimeout(function(){
			$("#error").hide();
		}, 5000);
	} else {

	
		$.ajax({
			url: "/getEvents?place=" + place + "&within=" + within + "&category=" + category + "&startdate=" + sdate + "&enddate=" + edate,
			method: "GET",
			success: function(data){

				data = JSON.parse(data);
				console.log(data["events"][0]);
				console.log(data["events"].length)
				locateOnMap(data);
				$("#loading").hide();
			}
		})
	}
}

var map;

function locateOnMap(data){
	
	eventsData = data;

	$("#eventsList").empty();
	//$("#eventsList").append("<div id='events'></div>");

	var infowindow =  new google.maps.InfoWindow({
		content: ''
	});
	//var geocoder = new google.maps.Geocoder;

	markers = [];

	if (data["events"].length != 0){

		var uluru = {lat: parseFloat(data["events"][0]["lat"]), lng: parseFloat(data["events"][0]["long"])};
		$("#eventsList").append("<div id='eventsTopBar'><p id='eventsFound'>" + data["events"].length + " Events Found</p><p id='span'>Sort by</p><select id='sortBy'><option name='sort'>Size</option><option name='sort'>Date</option><option name='sort'>Category</option></select></div>")
		zoom = 11;
	} else {

		var uluru = {lat: 39.127924, lng: -100.118210};
		zoom = 5;
		$("#eventsList").append("<div id='eventsTopBar'><p id='eventsFound'>0 Events Found</p></div>")
	}


    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: uluru,
        mapTypeControlOptions: {
            mapTypeIds: ["Apple", "roadmap", "Simple"]
          }
    });

    $("#eventsList").append("<div id='events'></div>");

    styledMapType = new google.maps.StyledMapType([ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative", "stylers": [ { "color": "#efebe2" }, { "visibility": "off" } ] }, { "featureType": "administrative", "elementType": "labels.text", "stylers": [ { "color": "#5b5b5b" }, { "visibility": "on" } ] }, { "featureType": "administrative", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "landscape", "stylers": [ { "color": "#efebe2" } ] }, { "featureType": "poi", "stylers": [ { "color": "#efebe2" } ] }, { "featureType": "poi.attraction", "stylers": [ { "color": "#efebe2" } ] }, { "featureType": "poi.business", "stylers": [ { "color": "#efebe2" } ] }, { "featureType": "poi.government", "stylers": [ { "color": "#dfdcd5" } ] }, { "featureType": "poi.medical", "stylers": [ { "color": "#dfdcd5" } ] }, { "featureType": "poi.park", "stylers": [ { "color": "#bad294" } ] }, { "featureType": "poi.place_of_worship", "stylers": [ { "color": "#efebe2" } ] }, { "featureType": "poi.school", "stylers": [ { "color": "#efebe2" } ] }, { "featureType": "poi.sports_complex", "stylers": [ { "color": "#efebe2" } ] }, { "featureType": "road", "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" } ] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [ { "color": "#fbfbfb" } ] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "stylers": [ { "visibility": "off" } ] }, { "featureType": "water", "stylers": [ { "color": "#a5d7e0" } ] } ], {"name": "Simple"});
    map.mapTypes.set("Simple", styledMapType);
    //map.setMapTypeId("Simple");

    var styledMapType = new google.maps.StyledMapType([{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.medical","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"poi.sports_complex","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"color":"#8f8f8f"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"color":"#8f8f8f"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#93d5f0"}]}], {name: 'Styled Map'});
    map.mapTypes.set("Apple", styledMapType);
    map.setMapTypeId("Apple");

    for(var i = 0; i < data["events"].length; i++){

    	console.log(data["events"][i]["capacity"]);
	    var marker = new google.maps.Marker({
	        position: {lat: parseFloat(data["events"][i]["lat"]),lng: parseFloat(data["events"][i]["long"])},
	        map: map,
	        icon: {
      			path: google.maps.SymbolPath.CIRCLE,
      			scale: 8 + ((data["events"][i]["rank"]) / 20),
      			fillColor: "red",
      			fillOpacity: 0.7,
      			strokeColor: "white",
      			strokeOpacity: 0.9,
      			strokeWeight: 1
    		}
		});

	    var e = data["events"][i];

	    var date = e["start"].split(" GMT")[0].replace("2017", "");

	    var parts = date.split(" ")
	    console.log(parts);
	    var time = parts[4].split(":");
	    var hours = time[0];
	    var minutes = time[1];
	    var timeString;

	    if (parseInt(hours) >= 12){
	    	hours = (parseInt(hours) - 12).toString()
	    	timeString = hours + "." + minutes + " PM"; 
	    } else {
	    	timeString = hours + "." + minutes + " AM";
	    }

	    console.log(time);
	    console.log(time[0], time[1], time[2]);

	    address = e["address"];

	    /*if (address == "address not available"){
	    	geocoder.geocode({"location": {lat: parseFloat(e["lat"]), lng: parseFloat(e["long"])}}, function(results, status){
	    		console.log(status, results);
	    		if (status === "OK"){
	    			address = results[0].formatted_address;
	    		}
	    	})
	    }*/

	    if (e["description"] == null || e["description"] == ""){
	    	e["description"] = "No description available";
	    }

	    /*if (e["name"].length < 19){

	    	e["name"] += "&emsp;&emsp;&emsp;&emsp;<br>";
	    }*/

	    //$("#events").append("<div class='event' id='" + i +"'><p class='eventTitle'>" + e["name"] + "</p><p class='eventRank'>" + e["rank"] + "</p><p class='eventLocation'>" + e["address"] + "</p><p class='eventTime'>" + timeString + "</p></div>");

	    //bindInfoWindow(marker, map, infowindow, "<h4 class='markerTitle' id='" + i + "'>" + e["name"] + "</h4><p class='markerDesc'>" + e["description"].substring(0,200) + "...</p>");
		var html = "<div class='markerContainer'><div class='markerTitle' id='" + e["id"] + "'>" + e["name"] + "</div><p class='markerDesc'>" + e["description"].substring(0,200) + "</p><div class='controls'><button class='ctrlBtn'>Save</button></div></div>"
	    
	    google.maps.event.addListener(marker, 'click', (function(marker,html) {
	    	return function(){ 
				infowindow.setContent(html); 
				infowindow.open(map, marker);
			} 
		})(marker,html));

		/*google.maps.event.addListener(infowindow, 'domready', function() {

		   var iwOuter = $('.gm-style-iw');
		   var iwBackground = iwOuter.prev();
		   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		   iwBackground.children(':nth-child(4)').css({'display' : 'none'});

		}); */

		markers.push({"id":e["id"], "marker": marker});
	}

	google.maps.event.addListener(infowindow, 'domready', function() {

		   var iwOuter = $('.gm-style-iw');
		   var iwBackground = iwOuter.prev();
		   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		   iwBackground.children(':nth-child(4)').css({'display' : 'none'});
		   iwOuter.parent().parent().css({left: '115px'});

		   iwOuter.parent().css({width: "350px"});

		   iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
		   iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
		   iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

		   var iwCloseBtn = iwOuter.next();

		   console.log(iwCloseBtn);

		   iwCloseBtn.css({opacity: '1', right: '5px !important', top: '18px !important', 'border-radius': '2px', 'box-shadow': '0 0 5px #3990B9'});

		   if($('.iw-content').height() < 140){
		      $('.iw-bottom-gradient').css({display: 'none'});
		   }

		   iwCloseBtn.mouseout(function(){
		      $(this).css({opacity: '1', right: '5px !important', top: '18px !important', 'border-radius': '2px', 'box-shadow': '0 0 5px #3990B9'});
		   });

		});
	
	/*google.maps.event.addListener(map, 'zoom_changed', function() {

		console.log("zoom changed");
		var iwOuter = $('.gm-style-iw');
		var iwBackground = iwOuter.prev();
		iwBackground.children(':nth-child(1)').css("left", "76px");
		iwBackground.children(':nth-child(3)').css("left", "76px");
		iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
		iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
	});*/

	google.maps.event.addListener(map, 'mousemove', function() {

		var iwOuter = $('.gm-style-iw');
	   var iwBackground = iwOuter.prev();
	   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
	   iwBackground.children(':nth-child(4)').css({'display' : 'none'});
	   iwOuter.parent().parent().css({left: '115px'});

	   iwOuter.parent().css({width: "350px"});

	   iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
	   iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
	   iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

	   var iwCloseBtn = iwOuter.next();

	   //console.log(iwCloseBtn);

	   iwCloseBtn.css({opacity: '1', right: '5px !important', top: '18px !important', 'border-radius': '2px', 'box-shadow': '0 0 5px #3990B9'});

	   if($('.iw-content').height() < 140){
	      $('.iw-bottom-gradient').css({display: 'none'});
	   }

	   iwCloseBtn.mouseout(function(){
	      $(this).css({opacity: '1', right: '5px !important', top: '18px !important', 'border-radius': '2px', 'box-shadow': '0 0 5px #3990B9'});
	   });
	});

	google.maps.event.addListener(map, "click", function(event) {
    	infowindow.close();
	});

	console.log(markers);
	sortBy("Size");
	$("#sortBy").value = "Size";
	//pushToEventList(data);
}

function pushToEventList(data){

	//markers = [];

	$("#events").empty();

	//$("#eventsList").append("<p id='eventsFound'>" + data["events"].length + " Events Found</p><p id='span'>Sort by</p><select id='sortBy'><option name='sort'>Date</option><option name='sort'>Size</option></select>")
	//$("#eventsList").append("<div id='events'></div>");

	/*var infowindow =  new google.maps.InfoWindow({
		content: ''
	});*/

	for (var i = 0; i < data["events"].length; i++){

		var e = data["events"][i];

		var date = e["start"].split(" GMT")[0].replace("2017", "");

	    var parts = date.split(" ")
	    console.log(parts);
	    var time = parts[4].split(":");
	    var hours = time[0];
	    var minutes = time[1];
	    var timeString;

	    if (parseInt(hours) >= 12){
	    	hours = (parseInt(hours) - 12).toString()
	    	timeString = hours + "." + minutes + " PM"; 
	    } else {
	    	timeString = hours + "." + minutes + " AM";
	    }

	    //timeString = e["start"];

	    var labels = "<div class='labels'><p class='eventRank'>" + e["rank"] + "</p>";

	    for (var l = 0; l < e["labels"].length; l++){

	    	console.log(e["labels"]);
	    	labels = labels + "<div class='label'>" + e["labels"][l] + "</div>";
	    }

	    labels += "</div>";

		$("#events").append("<div class='event' id='" + e["id"] +"'><p class='eventTitle'>" + e["name"] + "</p><p class='eventLocation'>" + e["address"] + "</p><p class='eventTime'>" + timeString + "</p>" + labels + "</div>");
	
		/*var html = "<div class='markerContainer'><div class='markerTitle' id='" + i + "'>" + e["name"] + "</div><p class='markerDesc'>" + e["description"].substring(0,200) + "...</p></div>"
	    
	    google.maps.event.addListener(marker, 'click', (function(marker,html) {
	    	return function(){ 
				infowindow.setContent(html); 
				infowindow.open(map, marker);
			} 
		})(marker,html));

		markers.push({"id":i, "marker": marker});*/
	}

	getAddresses();
}

function getAddresses(){

	console.log("adds");

	for (var i = 0; i < eventsData["events"]; i++){
		console.log(i);
		$.ajax({
			url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + parseFloat(eventsData["events"][i]["lat"]) + "," + parseFloat(eventsData["events"][i]["long"]),
			method: "GET",
			success: function(data){
				console.log(data);
				setAddress(eventsData["events"][i]["id"], data["results"][0]["formatted_address"]);
			}
		});
	}
}

function setAddress(id, address){

	console.log(address);
	$("#" + id).find(".eventLocation").text(address);
}

function bindInfoWindow(marker, map, infowindow, html) { 
	google.maps.event.addListener(marker, 'click', function() { 
		infowindow.setContent(html); 
		infowindow.open(map, marker);

	}); 
}

function setTodaysDate(){

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = yyyy+"-"+mm+'-'+dd;

	$('#sdate').attr('value', today);
	$('#edate').attr('value', today);
}
//locateOnMap();

/*google.maps.event.addListener(infowindow, 'domready', function() {

   var iwOuter = $('.gm-style-iw');
   var iwBackground = iwOuter.prev();
   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
   iwBackground.children(':nth-child(4)').css({'display' : 'none'});

});*/

function sortBy(sortType){

	console.log("sorted");

	if (sortType == "Date"){

		console.log(sortType);
		eventsData["events"].sort(function(a,b){

			return new Date(a["start"]) - new Date(b["start"]);
		});

		$("#sortBy").value = "Date";
	}

	if (sortType == "Size"){

		console.log(sortType);
		eventsData["events"].sort(function(a,b){

			return b["rank"] - a["rank"];
		});

		$("#sortBy").value = "Size";
	}

	if (sortType == "Category"){

		eventsData["events"].sort(function(a,b){

			if (a["labels"][0] < b["labels"][0]) return -1;
			if (a["labels"][0] > b["labels"][0]) return 1;
			return 0;
		});

		$("#sortBy").value = "Category";
	}

	pushToEventList(eventsData);
}

function saveEventToDB(e){
	
	var ev = JSON.stringify(e);
	console.log(ev);

	$.ajax({
		url: "/saveevent",
		method: "POST",
		data: ev,
		success: function(resp){

		}
	})
}