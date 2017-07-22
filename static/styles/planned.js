var eventsData;
$(document).ready(function(){
	

	$("#events").css("height", "100%");

	getSavedEvents();
});

function getSavedEvents(){

	$.ajax({
		url: "/getsavedevents",
		method: "GET",
		type: "json",
		success: function(data){

			data = JSON.parse(data);
			eventsData = data;

			sortBy("Date");
			//showEvents(data);
		}
	});
};

function showEvents(data){

	for(var i = 0; i < data["events"].length; i++){

		e = data["events"][i];

		var date = new Date(e["date"]);

		$("#events").append("<div class='event'><h2 class='eventTitle'>" + e["title"] + "</h2><p class='eventAddress'>" + e["address"] +"</p><p class='eventDate'>" + date.customFormat(" #DDD# #D#/#M#/#YYYY# #h#:#mm# #AMPM#") + "</p><p class='eventRank'>" + e["rank"] + "</p><p class='eventDesc'>" + e["description"] + "</p><div>")
	}
};


function sortBy(sortType){

	if (sortType == "Date"){

		console.log(sortType);
		eventsData["events"].sort(function(a,b){

			return new Date(a["date"]) - new Date(b["date"]);
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

	showEvents(eventsData);
};


Date.prototype.customFormat = function(formatString){
  var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
  YY = ((YYYY=this.getFullYear())+"").slice(-2);
  MM = (M=this.getMonth()+1)<10?('0'+M):M;
  MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
  DD = (D=this.getDate())<10?('0'+D):D;
  DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
  th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
  formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
  h=(hhh=this.getHours());
  if (h==0) h=24;
  if (h>12) h-=12;
  hh = h<10?('0'+h):h;
  hhhh = hhh<10?('0'+hhh):hhh;
  AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
  mm=(m=this.getMinutes())<10?('0'+m):m;
  ss=(s=this.getSeconds())<10?('0'+s):s;
  return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};