$(document).ready(function(){
	var uploadBtn = $('[data-td-upload-btn]');
	var realUploadBtn = $("[data-td-real-upload]");
	var progressBar = $("[data-td-progress]");

	uploadBtn.on('click', function (){
	    realUploadBtn.click();
	    progressBar.text('0%');
	    progressBar.width('0%');
	});


	realUploadBtn.on('change', function(){
	  var files = $(this).get(0).files;

	  if (files.length > 0){
	    // One or more files selected, process the file upload

		// create a FormData object which will be sent as the data payload in the
	    // AJAX request
	    var formData = new FormData();

	    // loop through all the selected files
	    for (var i = 0; i < files.length; i++) {
	      var file = files[i];

	      // add the files to formData object for the data payload
	      formData.append('uploads[]', file, file.name);
	    }


	    $.ajax({
			url: '/upload',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data){
			  console.log('upload successful!\n' + data);
			},
			xhr: function() {
				// create an XMLHttpRequest
				var xhr = new XMLHttpRequest();

				// listen to the 'progress' event
				xhr.upload.addEventListener('progress', function(evt) {

				  if (evt.lengthComputable) {
				    // calculate the percentage of upload completed
				    var percentComplete = evt.loaded / evt.total;
				    percentComplete = parseInt(percentComplete * 100);

				    // update the Bootstrap progress bar with the new percentage
				    progressBar.text(percentComplete + '%');
				    progressBar.width(percentComplete + '%');

				    // once the upload reaches 100%, set the progress bar text to done
				    if (percentComplete === 100) {
				      progressBar.html('Done');
				    }

				  }

				}, false);

				return xhr;
			}
	    });

	  }

	});

})