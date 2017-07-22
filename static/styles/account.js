var userData;

$(document).ready(function(){

	getUserData();
});

$("#submit").on("click", function(){

	changePassword();
})

$("#cancel").on("click", function(){

	cancelSub();
})

function getUserData(){

	$.ajax({
		url: "/getUserData",
		method: "GET",
		type: "json",
		success: function(data){

			data = JSON.parse(data);
			userData = data;
			displayData(data);
		}
	})
}

function displayData(data){

	console.log(data);
	console.log(data["username"]);

	document.getElementById("user").innerHTML = data["username"];

	document.getElementById("username").innerHTML = data["username"];
	document.getElementById("email").innerHTML = data["email"];
	document.getElementById("name").innerHTML = data["name"];
	document.getElementById("subPaid").innerHTML = data["subPaid"];
}

function changePassword(){

	var password = $("#password").val();
	var verifyPassword = $("#passwordCheck").val();

	if (password === verifyPassword && password.length > 7){

		$.ajax({
			url: "/changepassword?password=" + password,
			type: "POST",
			success: function(data){

				if(data == "success"){

					$("#success").show();

					$("#password").val("")
					$("#passwordCheck").val("")

					setTimeout(function(){
			    		$("#success").hide();
					}, 10000);
				}
			}
		});


	} else if (password.length < 8){

		$("#pLength").show();

		setTimeout(function(){
    		$("#pLength").hide();
		}, 4000);
		
	} else {

		$("#error").show();

		setTimeout(function(){
    		$("#error").hide();
		}, 4000);
	}
}

//work in progress
function cancelSub(){

	$.ajax({
		url: "/cancelsub",
		method: "POST",
		success: function(data){

			if (data == "success"){

				$("#subCancelSuccess").text("Subscription succesfully cancelled. You can still use the service till " + userData["subPaid"]);
			}
		}
	})
}