var filepath = require('filepath');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

module.exports = function(root) { 
    var save_cb;
    var file;

    this.saveFont = function(_req, cb){
        save_cb = cb;
        var form = new formidable.IncomingForm();
        form.multiples = false;
        form.uploadDir = path.join(root, '/public/fonts');

        form.on('file', function(field, _file) {
            file = _file;
            var file_path = form.uploadDir + "/" + file.name
            fs.stat(file_path, function(err, stat) {
                if(err == null) {
                    save_cb({error: true, status: "Font already uploaded"});
                    fs.unlink(file.path, function(err){
                        save_cb({error: true, status: err});
                        console.log('Temp file deleted successfully');
                    });  
                } 
                else if(err.code == 'ENOENT') {
                    fs.rename(file.path, path.join(form.uploadDir, file.name));
                    saveCss(file_path);
                } 
                else {
                    save_cb({error: true, status: err});
                }
            });

        });

        form.on('error', function(err) {
            if(typeof save_cb === "function"){
                save_cb({error: true, status: err});
            }
        });

        form.parse(_req);

    }

    function saveCss(file_path){
        var path = filepath.create(root + "/public/fonts/fonts.css");
        if(path.exists()){
            path.read().then(function(data){
                var font_split = file.name.split('.');
                var fontName = font_split[0];
                var ext;
                var saveCss = false;
                if(font_split[1] === "ttf"){
                    ext = 'truetype';
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
                    var cssTemplate = "@font-face { \n  font-family: '" + fontName + "';\n  src: url('/public/fonts/" + file.name +"') format('" + ext + "');\n}\n"
                    fs.appendFile(root + "/public/fonts/fonts.css", cssTemplate, function(err){
                        if(err){
                            if(typeof save_cb === "function"){
                                save_cb({error: true, status: err});
                            }
                        }
                        else{
                            saveFontList();
                        }
                    }); 
                }
                else{
                    fs.unlink(file_path, function(err){
                        save_cb({error: true, status: err});
                        console.log('Temp file deleted successfully');
                    }); 
                    save_cb({error: true, status: "Incorrect Font Type. Supported Types: ttf / woff / eot"});
                }
            })
        }
    }

    function saveFontList(){
        var path = filepath.create(root + "/public/fonts/font_list.txt");
        if(path.exists()){
            path.read().then(function(data){
                var fontName = file.name.split('.')[0];
                var saveText = fontName + "\n" + "//- TD-FontBreak\n";
                fs.appendFile(root + "/public/fonts/font_list.txt", saveText, function(err){
                    if(typeof save_cb === "function"){
                        if(err){
                            save_cb({error: true, status: err});
                        }
                        else{
                            save_cb(null, {status: "Font has been uploaded!"});
                        }
                    }
                }); 
            })
        }
    }


    this.getFonts = function(cb){
        var font_defaults = filepath.create(root + "/public/fonts/font_defaults.txt");
        var fonts_string;
        var fonts;
        if(font_defaults.exists()){
            font_defaults.read().then(function(data){
                // Remove line breaks: \n
                if(data !== "" || data !== " "){
                    fonts_string = data.replace(/(?:\r\n|\r|\n)/g, '');
                }
            })
            .then(function(){
                var added_fonts = filepath.create(root + "/public/fonts/font_list.txt");
                if(added_fonts.exists()){
                    added_fonts.read().then(function(data){
                        fonts_string = fonts_string + "//- TD-FontBreak" + data.replace(/(?:\r\n|\r|\n)/g, '');
                        fonts = fonts_string.split("//- TD-FontBreak");
                        fonts = fonts.filter(Boolean);
                        if(typeof cb === "function"){
                            if(fonts.length > 0){
                                cb(null, {fonts: fonts, status: "Fonts have been loaded!"});
                            }
                            else{
                                cb({error: true, status: "Could not load fonts!"})
                            }
                        }
                    });
                }
            })
        }
    }

    return this;
}