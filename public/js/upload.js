$(document).ready(function(){
	var uploadBtn = $('[data-td-upload-btn]');
	var realUploadBtn = $("[data-td-real-upload]");
	var font_type = $("[data-td-font-type]");
	var font_css = $("[data-td-font-css]");
	var good_status = $("[data-td-status-good]");
	var bad_status = $("[data-td-status-bad]");
	var status_wrapper = $("[data-sv-status-wrapper]");
	status_wrapper.hide();

	uploadBtn.on('click', function (){
	    realUploadBtn.click();
	    // $(this).prop("disabled", true);
	});

	realUploadBtn.on('change', function(){
	  var files = $(this).get(0).files;

	  if (files.length > 0){
	    var formData = new FormData();
	    for (var i = 0; i < files.length; i++) {
	      var file = files[i];
	      formData.append('uploads[]', file, file.name);
	    }
	    console.log(formData);

	    $.ajax({
			url: '/upload',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data){
				uploadBtn.prop("disabled", false);
				console.log(data);
				if(data.error){
					setStatus('bad', data.status)
				}
				else{
			  		getFonts();
				}
			},
			error: function(err){
				console.log(err);
			}
	    });

	  }

	});

	function getFonts(){
	    $.ajax({
			url: '/fonts',
			type: 'GET',
			success: function(data){
				console.log(data);
				if(data.error){
					console.log(data);
					setStatus('bad', data.status);
				}
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

    function setFonts(fonts){
    	$("[data-td-font-type]").html("");
    	for(var i = 0; i < fonts.length; i++){
    		$("[data-td-font-type]").append(
    			$("<option value='" + fonts[i] + "'>"+ fonts[i] +"</option>")
    		)
    	}
    	var css_loc = font_css.attr('href');
    	font_css.attr('href', css_loc);
    }

	getFonts();


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

	function clearStatus(){
		status_wrapper.slideToggle();
		good_status.html("");
		bad_status.html("");
	}


})