$(window).load(function(){

	var $form = $('#payment-form');
	//console.log($form);
	//console.log("abc");
	$('#payment-form').submit(function(event) {

	    // Disable the submit button to prevent repeated clicks:
	    event.preventDefault()
	    $form.find('.submit').prop('disabled', true);

      password = $("#password").val();
      rpassword = $("#rpassword").val();

      var username = $("#username").val();
      var free = false;
      
      $.ajax({
        url: "/usernameAvailable/username=" + username,
        method: "GET",
        type: "json",
        success: function(data){

          console.log(data);

          if (data == "True"){

            free = true;
          }

          if (free && password === rpassword){

          // Request a token from Stripe:'
            Stripe.card.createToken($form, stripeResponseHandler);
          } else if (free == false){

            $("#usernameErr").css("display", "inline-block");

            setTimeout(function(){
              $("#usernameErr").css("display", "none");
            }, 5000);

            $form.find('.submit').prop('disabled', false);
          } else if (password !== rpassword){

            $("#passwordErr").css("display", "inline-block");

            setTimeout(function(){
              $("#passwordErr").css("display", "none");
            }, 5000);

            $form.find('.submit').prop('disabled', false);
          }

        }
      });

	    // Prevent the form from being submitted:
	    return false;
	 });
})

function checkEmail(){

  var email = $("#email").val();
  var free = false;
  $.ajax({
    url: "/emailAvailable/email=" + email,
    method: "GET",
    type: "json",
    success: function(data){

      console.log(data);

      if (data == "False"){

        free = true;
      }
    }
  })

  return free;
}



function stripeResponseHandler(status, response) {
  // Grab the form:
  var $form = $('#payment-form');

  if (response.error) { // Problem!

    // Show the errors on the form:
    $(".err").show();
    $form.find('.payment-errors').text(response.error.message);
    $form.find('.submit').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;
    console.log(token);	
    // Insert the token ID into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken">').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
};