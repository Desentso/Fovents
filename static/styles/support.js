function sendQuestion(){
	
	var data = {};

	var email = $("#email").val();
	var text = $("#text").val();

	data["email"] = email;
	data["text"] = text;

	data1 = JSON.stringify(data);

	$.ajax({
		url: "/supportrequest",
		method: "POST",
		data: data1,
		success: function(data2){

			if (data2 == "success"){
				$("#success").show();
				
				setTimeout(function(){
    				$("#success").hide();
				}, 10000);
			} else {

				$("#")
			}
		}
	})
}