$(document).ready(function(){

	var text_input = $("[data-td-text-input]");
	var text_display = $("[data-td-text-display]");
	var font_type = $("[data-td-font-type]");
	var font_size = $("[data-td-font-size]");
	var clearBtn = $("[data-td-clearBtn]");

	clearBtn.on('click', function(){
		text_display.html('');
		text_input.val('');
	})

	text_input.on("change keydown paste input", function(){
		var text = $(this).val();
		text_display.html(text);
	})

	font_size.on("change keydown paste input", function() {
    	text_display.css("font-size", $(this).val() + "px");
	});

	font_type.on("change keydown paste input", function() {
    	text_display.css("font-family", $(this).val());
	});

})