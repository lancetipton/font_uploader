$(document).ready(function(){
	var uploadBtn = $('[data-td-upload-btn]');
	var realUploadBtn = $("[data-td-real-upload]");
	var font_type = $("[data-td-font-type]");
	var font_css = $("[data-td-font-css]");
	var good_status = $("[data-td-status-good]");
	var bad_status = $("[data-td-status-bad]");
	var status_wrapper = $("[data-sv-status-wrapper]");

	// Hide the status on load:
	status_wrapper.hide();

	// Calls the real upload button, do this so we can style the button look:
	//  Disables the button, so you can't keep clicking it, until server response:
	uploadBtn.on('click', function (){
	    realUploadBtn.click();
	    $(this).prop("disabled", true);
	});

	// Gets the file that was uploaded, and sends it to the server:
	realUploadBtn.on('change', function(){
		//  gets the files:
		var files = $(this).get(0).files;

	  // Checks to make sure a file was uploaded
	  if (files.length > 0){
	  	// Creates a new form to send to the server:
	    var formData = new FormData();
	    var file = files[0];
	    //  Adds the file to the new form:
	    formData.append('uploads[]', file, file.name);
	    
	    //  Calls the server to upload the file:
	    $.ajax({
			url: '/upload',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data){
				// re-enable the button to upload another file:
				uploadBtn.prop("disabled", false);
				console.log(data);
				// Check if there was an error with the upload:
				if(data.error){
					setStatus('bad', data.status)
				}
				else{
					// If no error, recalls teh getFonts method to load the new font:
					// This could also be done locally since we have the file, but this is a quick-work around
			  		getFonts();
				}
			},
			error: function(err){
				uploadBtn.prop("disabled", false);
				console.log(err);
			}
	    });

	  }

	});
	
	//  Gets the fonts from the server:
	function getFonts(){
	    $.ajax({
			url: '/fonts',
			type: 'GET',
			success: function(data){
				console.log(data);
				//  Check for an error:
				if(data.error){
					console.log(data);
					setStatus('bad', data.status);
				}
				// If no error, then load the fonts:
				else{
					setFonts(data.fonts);
					setStatus('good', data.status);
				}
			},
			error: function(err){
				console.log(err);
				setStatus('bad', err);
			}
	    });
	}

	//  Helper function to load the fonts into the dropdown:
    function setFonts(fonts){
    	$("[data-td-font-type]").html("");
    	for(var i = 0; i < fonts.length; i++){
    		$("[data-td-font-type]").append(
    			$("<option value='" + fonts[i] + "'>"+ fonts[i] +"</option>")
    		)
    	}
    	// refreshes our css file with the new font families, so we don't have to page reload:
    	var css_loc = font_css.attr('href');
    	font_css.attr('href', css_loc);
    }

    // Called on page load, to load all current fonts:
	getFonts();

	// Helper function to give us updates about what is happening:
	function setStatus(type, message){
		clearStatus();

		if(type === 'good'){
			good_status.html(message);
		}
		else{
			bad_status.html(message);
		}
		setTimeout(clearStatus, 5000);
	}

	// Helper function to clear the current status:
	function clearStatus(){
		status_wrapper.slideToggle();
		good_status.html("");
		bad_status.html("");
	}


})