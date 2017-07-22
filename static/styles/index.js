$(document).ready(function(){

	$("#contactForm").submit(function(event) {

		event.preventDefault();
	 	sendCForm();
		
		return false;
	});

});

$("#burger").on("click", function(){

	$(".head").show();
});

$("#close").on("click", function(){

	$(".head").hide();
})

$(".headerMobile > .head > a > .hItem").on("click", function(){

	$(".head").hide();
})

function sendCForm(){

	var name = $("#name").val();
	var email = $("#email").val();
	var text = $("#text").val();

	if (email != null && text != null){ 

		var data = {"text": text, "name": name, "email": email};
		data1 = JSON.stringify(data);
		$.ajax({
			url: "/sendForm",
			method: "POST",
			data: data1,
			success: function(data2){

				if (data2 == "ok"){

					$("#success").show()

					setTimeout(function(){
	    				$("#success").hide();
					}, 10000);
				}
			}
		});

		name.value = "";
		email.value = "";
		text.value = "";

	} else {

		$("#error").show();

		setTimeout(function(){
	    	$("#error").hide();
		}, 8000);
	}
}