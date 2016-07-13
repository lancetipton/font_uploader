var filepath = require('filepath');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

module.exports = function(_root) { 
	var root = _root;
    var save_cb;
    var file;
    this.saveFont = function(_req, cb){
        save_cb = cb;
        var form = new formidable.IncomingForm();
            form.multiples = false;
            form.uploadDir = path.join(root, '/public/fonts');
            form.on('file', function(field, _file) {
            file = _file;
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });

        form.on('error', function(err) {
            if(typeof save_cb === "function"){
                save_cb(err);
            }
        });

        form.on('end', function() {
            saveCss();
        });

        form.parse(_req);

    }

    function saveCss(){
        var path = filepath.create(root + "/public/fonts/fonts.css");
        if(path.exists()){
            path.read().then(function(data){
                var fontName = file.name.split('.')[0];
                var cssTemplate = "\n@font-face { \nfont-family: '" + fontName + "';\n src: url('/public/fonts/" + file.name +"') format('truetype');\n }\n"

                fs.appendFile(root + "/public/fonts/fonts.css", cssTemplate, function(err){
                    if(typeof save_cb === "function"){
                        if(err){
                            save_cb(err);
                        }
                        else{
                            save_cb(null, true);
                        }
                    }
                }); 
            })
        }
    }






    return this;
}