#!/usr/bin/env node

var jsdom = require('jsdom'),
	argv = require('optimist').argv,
	fs = require('fs'),
	tab = '\t',
	prevName = '',
	// html = argv.i,
	// toFile = argv.o,
	$ = null,
	output = '',
	options = {
		help : {
			help : "  -h, --help	this help message"
		},
		html : {
			val : argv.i || argv.input,
			help : "  -i, --input	input file or URL"
		},
		toFile : {
			val : argv.o || argv.output,
			help : "  -o, --output	[optional] output file"
		}
	};

var Parser = function (options) {

	return {

		showHelp : function () {

			this.log();
			this.log("   __   ___          _   ");
			this.log("  / /  /_  |___     (_)__");
			this.log(" / _ \// __/(_-<_   / (_-<");
			this.log("/_//_/____/___(_)_/ /___/");
			this.log("HTML to SCSS   /___/     ");
			this.log("https://github.com/dannyx0/html-to-scss");
			this.log();

			this.log("Usage: node h2s.js [options]");
			this.log();

			this.log("Options:");
			this.log();

			for (var op in options) {
				this.log(options[op].help);
			}

			this.log();

			this.log("Examples:");
			this.log();

			this.log("$ node h2s.js -i index.html");
			this.log("$ node h2s.js -i http://news.ycombinator.com -o output.scss");

			this.log();

		},

		log : function (log) {

			if (typeof log === 'undefined') {
				log = "";
			} else {
				log = tab + log;
			}

			return console.log(log);

		},

		init : function () {

			var self = this;

			jsdom.env({
				html: options.html.val,
				scripts: [
					'http://code.jquery.com/jquery-1.8.0.min.js'
				],
				done: function(errors, window) {
					console.log(errors);
					$ = window.$;
					console.log('Parsing DOM');
					self.crawl($('html'));
					console.log("Done Parsing DOM");
					if (typeof options.toFile.val !== 'undefined') {

						console.log("Saving to file...");

						fs.writeFile(options.toFile.val, output, function(err) {
							if(err) {
								console.log(err);
							} else {
								console.log("Output saved to " + options.toFile.val);
							}
						});

					}
				}
			});

		},

		crawl : function ($el) {

			var i = 0,
				j = 0,
				tabs = '',
				level = $el.parents().length,
				$children = $el.children(),
				className = $el.attr('class'),
				classes = className.length ? className.split(' ') : 0,
				name = $el[0].nodeName.toLowerCase(),
				self = this;

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
						self.crawl($(this));
					});

				}

				output += tabs + '}\n';
				console.log(tabs + '}');
			}

			prevName = name;

		}

	};

};


var h2s = new Parser(options);

if (typeof options.html.val === 'undefined' || argv.help || argv.h) {
	h2s.showHelp();
	return;
}

h2s.init();

/*

var showHelp = function () {
	console.log("F");
};

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
		console.log(errors);
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

*/