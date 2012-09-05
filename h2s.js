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

			this.log("Usage: html2scss [options]");
			this.log();

			this.log("Options:");
			this.log();

			for (var op in options) {
				this.log(options[op].help);
			}

			this.log();

			this.log("Examples:");
			this.log();

			this.log("$ html2scss -i index.html");
			this.log("$ html2scss -i http://news.ycombinator.com -o output.scss");

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
					if (errors) {
						self.log(errors);
					}

					$ = window.$;

					self.log();
					self.log('Parsing DOM');
					self.log();

					self.log("Output:");
					self.log();

					self.crawl($('html'));
					self.log();

					self.log("Done Parsing DOM");
					self.log();

					if (typeof options.toFile.val !== 'undefined') {

						self.log("Saving to file...");

						fs.writeFile(options.toFile.val, output, function(err) {
							if(err) {
								self.log(err);
							} else {
								self.log("Output saved to " + options.toFile.val);
							}
							self.log();
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

} else {

	h2s.init();

}