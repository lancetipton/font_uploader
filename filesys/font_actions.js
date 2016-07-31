// Add the required libs needed:
var filepath = require('filepath');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

module.exports = function(root) { 
    var save_cb;
    var file;

    // Save the font to the server:
    this.saveFont = function(_req, cb){
        // Set our end-cd
        save_cb = cb;
        // Create a new form to upload the font:
        var form = new formidable.IncomingForm();
        form.multiples = false;
        // Set our path to save the font:
        form.uploadDir = path.join(root, '/public/fonts');

        // find the file that was uploaded:
        form.on('file', function(field, _file) {
            // Give access to our file in all functions:
            file = _file;
            // Set the name of the file, and it's path:
            var file_path = form.uploadDir + "/" + file.name

            // Check if the font already exists:
            fs.stat(file_path, function(err, stat) {
                if(err == null) {
                    // if the font exists, let the client know about it:
                    save_cb({error: true, status: "Font already uploaded"});
                    // Delete the current temp file:
                    fs.unlink(file.path, function(err){
                        save_cb({error: true, status: err});
                        console.log('Temp file deleted successfully');
                    });  
                } 
                // If the file does not exist, save it to our upload Dir:
                else if(err.code == 'ENOENT') {
                    fs.rename(file.path, path.join(form.uploadDir, file.name));
                    // After the file is saved, add it to our css file:
                    saveCss(file_path);
                } 
                else {
                    // if there was an error, return it:
                    save_cb({error: true, status: err});
                }
            });

        });

        form.on('error', function(err) {
            // if there was an error, return it:
            if(typeof save_cb === "function"){
                save_cb({error: true, status: err});
            }
        });

        // Send out font the the form, to be saved:
        form.parse(_req);

    }

    function saveCss(file_path){
        // Load the path of our css file:
        var path = filepath.create(root + "/public/fonts/fonts.css");

        // Check if the path exists:
        if(path.exists()){
            // Read in the file:
            path.read().then(function(data){
                // get the current file, and find the name and ext type:
                var font_split = file.name.split('.');
                var fontName = font_split[0];
                var ext;

                // Default saved css to false:
                var saveCss = false;
                // Check to see if the font ext type is supported:
                if(font_split[1] === "ttf"){
                    ext = 'truetype';
                    // Set out saveCss to true, so we know we can use it:
                    saveCss = true;
                }
                else if(font_split[1] === 'woff'){
                    ext = 'woff';
                    saveCss = true;
                }
                else if(font_split[1] === 'eot'){
                    ext =  'embedded-opentype'
                    saveCss = true;
                }

                if(saveCss){
                    // If we can use this font file, save the font family into our css:
                    // template to save a font family:
                    var cssTemplate = "@font-face { \n  font-family: '" + fontName + "';\n  src: url('/public/fonts/" + file.name +"') format('" + ext + "');\n}\n/* TD-FontBreak */\n"
                    // Add the new font family to the css file:
                    fs.appendFile(root + "/public/fonts/fonts.css", cssTemplate, function(err){
                        if(err){
                            // If there was an error, return it:
                            if(typeof save_cb === "function"){
                                save_cb({error: true, status: err});
                            }
                        }
                        else{
                            //  If is saved, then we save it to our list of fonts:
                            saveFontList();
                        }
                    }); 
                }
                else{
                    // If there was an error, remove the temp file, and return the error:
                    fs.unlink(file_path, function(err){
                        save_cb({error: true, status: err});
                        console.log('Temp file deleted successfully');
                    });
                    // If the font was not supported, let the client know about it: 
                    save_cb({error: true, status: "Incorrect Font Type. Supported Types: ttf / woff / eot"});
                }
            })
        }
    }

    // Works the same as the saveCSS function, only diff is it has a special split (- TD-FontBreak) to seperate the fonts:
    function saveFontList(newFont){
        // Get the fiel path:
        var path = filepath.create(root + "/public/fonts/font_list.txt");
        //  check that it exists:
        if(path.exists()){
            // read in the file:
            path.read().then(function(data){
                // Get the name of the font:
                var fontName = file.name.split('.')[0];
                // Add in the special split text: (could really be anything, as long as it's consistant)
                var saveText = fontName + "\n" + "//- TD-FontBreak\n";
                // Add the new font to our font list:
                fs.appendFile(root + "/public/fonts/font_list.txt", saveText, function(err){
                    if(typeof save_cb === "function"){
                        if(err){
                            // If there's an error, return it:
                            save_cb({error: true, status: err});
                        }
                        else{
                            // Let the fontend know the font was added:
                            save_cb(null, {status: "Font has been uploaded!"});
                        }
                    }
                }); 
            })
        }
    }

    // Get all our fonts from two lists:
    // One list is the defualt font list, the other is our added fonts:
    this.getFonts = function(cb){
        // get the default fonts:
        var font_defaults = filepath.create(root + "/public/fonts/font_defaults.txt");
        var fonts_string;
        var fonts;
        if(font_defaults.exists()){
            font_defaults.read().then(function(data){
                // Remove line breaks: \n from the file:
                if(data !== "" || data !== " "){
                    fonts_string = data.replace(/(?:\r\n|\r|\n)/g, '');
                }
            })
            // Get the added fonts:
            .then(function(){
                // Read in the font list file:
                var added_fonts = filepath.create(root + "/public/fonts/font_list.txt");
                // Make sure it exists:
                if(added_fonts.exists()){
                    added_fonts.read().then(function(data){
                        // add the fonts to our font_string:
                        new_fonts_string = "//- TD-FontBreak" + data.replace(/(?:\r\n|\r|\n)/g, '');
                        fonts_string += new_fonts_string;

                        // Break the fonts on the special split text:
                        fonts = fonts_string.split("//- TD-FontBreak");
                        new_fonts = new_fonts_string .split("//- TD-FontBreak");

                        // Filter out any empty string from our array of fonts:
                        fonts = fonts.filter(Boolean);
                        new_fonts = new_fonts.filter(Boolean);

                        if(typeof cb === "function"){
                            if(fonts.length > 0){
                                // return to the client all the loaded fonts:
                                cb(null, {fonts: fonts, new_fonts: new_fonts, status: "Fonts have been loaded!"});
                            }
                            else{
                                // If there was an error, let the client know about it:
                                cb({error: true, status: "Could not load fonts!"})
                            }
                        }
                    });
                }
            })
        }
    }

    this.removeFont = function(_req, cb){
        var rFont = _req.body.fontName;
        removeFromList(rFont, cb);
    }

    function removeFromList(rFont, cb){
        var newList = '';
        // Get the fiel path:
        var path = filepath.create(root + "/public/fonts/font_list.txt");
        //  check that it exists:
        if(path.exists()){
            // read in the file:
            path.read().then(function(data){
                var fontList = data.split("//- TD-FontBreak")
                for(var i = 0; i < fontList.length; i++){
                    fontList[i] = fontList[i].replace(/(?:\r\n|\r|\n)/g, '');
                    if(rFont  !== fontList[i] && fontList[i] !== ""){
                        newList += fontList[i] + "\n" + "//- TD-FontBreak\n";
                    }
                }

                fs.writeFile(path.toString(), newList, function(err) {
                    if(err) {
                        cb(err);
                    }
                    else{
                        removeCss(rFont, cb);
                    }
                }); 

            })
        }
    }

    function removeCss(rFont, cb){
        // Load the path of our css file:
        var path = filepath.create(root + "/public/fonts/fonts.css");
        var newList = "";
        var fileName = "";
        // Check if the path exists:
        if(path.exists()){
            path.read()
            .then(function(data){            
                var fontList = data.split("/* TD-FontBreak */")
                for(var i = 0; i < fontList.length; i++){
                    if(fontList[i].indexOf(rFont) > -1){
                        fileName = fontList[i].split("src: url('/public/fonts/")[1].split("') format")[0]
                    }
                    if(fontList[i].indexOf(rFont) === -1 && fontList[i] !== "\n"){
                        newList += fontList[i] + "\n" + "/* TD-FontBreak */\n";
                    }
                }

            })
            .then(function(){
                fs.writeFile(path.toString(), newList, function(err) {
                    if(err) {
                        cb(err);
                    }
                    else{
                        removeFile(fileName, cb);
                    }
                }); 
            })
        }
    }

    function removeFile(fileName, cb){
        var file_path = path.join(root, '/public/fonts/', fileName);
        // Check if the font already exists:
        fs.stat(file_path, function(err, stat) {
            if(err == null) {
                fs.unlink(file_path, function(err){
                    if(err) {
                        cb(err);
                    }
                    else{
                       cb(null, {status: "Font was removed!"});
                    }
                });  
            } 
            else if(err.code == 'ENOENT') {
                cb(null, {status: "Font was removed!"});
            } 
            else {
                cb({error: true, status: "Could not remove font, please try again!"})
            }
        });
    }

    return this;
}