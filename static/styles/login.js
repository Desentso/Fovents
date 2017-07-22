$(document).ready(function(){
	
	$("#login").submit(function(){

		var name = document.getElementById("name").value;
		var pword = document.getElementById("password").value;

		//console.log(name,pword)

		$.ajax({
		url: "/logincheck",
		method: "POST",
		data: $("#login").serialize(),
		success: function(data) {

            //console.log(response);

            if (data === "Login denied"){

            	$("#name").val("");
            	$("#password").val("");

            	$(".error").show();

            	setTimeout(function(){
    				$(".error").hide();
				}, 4000);
            } else if (data.length > 0) {       	
            //data contains the string URL to redirect to
            	window.location.href = "/app";
        	}

        	
        },
        error: function(error) {
            //console.log(error);
        }
		});

		return false;
	})

})

function login(){

	var name = document.getElementById("name");
	var password = document.getElementById("password");

	return false;
}