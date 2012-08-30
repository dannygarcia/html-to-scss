var jsdom = require('jsdom'),
	fs = require('fs'),
	tab = '\t',
	prevName = '',
	html = process.argv[2],
	toFile = process.argv[3],
	$ = null,
	output = '';

var crawl = function ($el) {

	var i = 0,
		j = 0,
		tabs = '',
		level = $el.parents().length,
		$children = $el.children(),
		className = $el.attr('class'),
		classes = className.length ? className.split(' ') : 0,
		name = $el[0].nodeName.toLowerCase();

	for (i = 0; i < level; i++) {
		tabs += tab;
	}

	if (classes !== 0) {
		for (j = 0; j < classes.length; j++) {
			name += '.' + classes[j];
		}
	}

	if (name !== prevName) {

		output += tabs + name + ' { \n\n';
		console.log(tabs + name + ' { ');
		console.log('');

		if ($children.length) {

			$children.each(function () {
				crawl($(this));
			});

		}

		output += tabs + '}\n';
		console.log(tabs + '}');
	}

	prevName = name;


};

jsdom.env({
	html: html,
	scripts: [
		'http://code.jquery.com/jquery-1.8.0.min.js'
	],
	done: function(errors, window) {
		$ = window.$;
		console.log('Parsing DOM');
		crawl($('html'));
		console.log("Done Parsing DOM");
		if (typeof toFile !== 'undefined') {

			console.log("Saving to file...");

			fs.writeFile(toFile, output, function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("Output saved to " + toFile);
				}
			});

		}
	}
});
