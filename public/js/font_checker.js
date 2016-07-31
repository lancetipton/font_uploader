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
		for(i = 16; i < 75; i++){
			if (i % 2 === 0){
				if(i === 50){
					font_size.append($('<option value="' + i + '" selected>' + i + '</option> '));
				}
				else{
					font_size.append($('<option value="' + i + '">' + i + '</option> '));
				}
			}
		}
	})();

    (function() {
        var link_element = document.createElement("link"),
            s = document.getElementsByTagName("script")[0];
        if (window.location.protocol !== "http:" && window.location.protocol !== "https:") {
            link_element.href = "http:";
        }
        link_element.href += "//fonts.googleapis.com/css?family=Titillium+Web:200italic,200,300italic,300,400italic,400,600italic,600,700italic,700,900";
        link_element.rel = "stylesheet";
        link_element.type = "text/css";
        s.parentNode.insertBefore(link_element, s);
    })();



})


