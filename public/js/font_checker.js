$(document).ready(function(){

	var text_input = $("[data-td-text-input]");
	var text_display = $("[data-td-text-display]");
	var font_type = $("[data-td-font-type]");
	var font_size = $("[data-td-font-size]");
	var clear_btn = $("[data-td-clear-btn]");

	//  Clears the Fonts input:
	clear_btn.on('click', function(){
		text_display.html('');
		text_input.val('');
	})

	//  Copies the text from the input and puts it into the text display:
	text_input.on("change keydown paste input", function(){
		var text = $(this).val();
		text_display.html(text);
	})

	//  Changes the font size to what is selected
	font_size.on("change keydown paste input", function() {
    	text_display.css("font-size", $(this).val() + "px");
	});

	// Changes the font family to what is slected:
	font_type.on("change keydown paste input", function() {
    	text_display.css("font-family", $(this).val());
    	text_input.css("font-family", $(this).val());
	});

	// Helper function to setup sizes, so we don't have to write it in:
	(function setSize(){
		for(i = 16; i < 50; i++){
			font_size.append($('<option value="' + i + '">' + i + '</option> '));
		}
	})();


})


