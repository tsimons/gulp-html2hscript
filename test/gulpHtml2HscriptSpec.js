var es = require('event-stream');
var File = require('vinyl');
var gulpHtml2hscript = require('../');
var html2hscript = require('html2hscript');

describe('gulp-html2hscript', function () {
	describe('as buffer', function () {
		it('converts html to hscript', function (done) {
			var contents = '<p>file contents</p>';
			var fakeFile = new File({
				contents: new Buffer(contents)
			})

			var stream = gulpHtml2hscript();

			stream.write(fakeFile);

			stream.once('data', function (file) {
				file.isBuffer().should.be.true;

				html2hscript(contents, function (err, out) {
					file.contents.toString('utf8').should.equal(out);
					done();
				});
			});
		});
	});

	describe('as stream', function () {
		it('converts html to hscript', function () {
			var contents = '<p>file contents</p>';
			var fakeFile = new File({
				contents: es.readArray([contents])
			})

			var stream = gulpHtml2hscript();

			stream.write(fakeFile);

			stream.once('data', function (file) {
				file.isStream().should.be.true;

				file.contents.pipe(es.wait(function (err, data) {
					html2hscript(contents, function (err, out) {
						data.should.equal(out);
						done();
					});
				}));
			});
		
		});
	});
});