var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var html2hscript = require('html2hscript');

var PLUGIN_NAME = 'gulp-html2script';

function html2HscriptStream (hscript) {
	var stream = through();
	stream.write(hscript);
	return stream;
}

function gulpHtml2Hscript () {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }

		html2hscript(file.contents, function (err, hscript) {
			if (err) { return new PluginError(PLUGIN_NAME, 'There was an error parsing the HTML: ' + err); }

			if (file.isBuffer()) {
				file.contents = new Buffer(hscript);
			}
			if (file.isStream()) {
		  	file.contents = html2HscriptStream(hscript);
			}
			cb(null, file);
		});
	});
}

exports = module.exports = gulpHtml2Hscript;