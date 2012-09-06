#!/usr/bin/env node

var jsdom = require('jsdom'),
	colors = require('colors'),
	argv = require('optimist').argv,
	fs = require('fs'),
	tab = '\t',
	prevName = '',
	jquery = fs.readFileSync('./jquery-1.8.0.min.js').toString(),
	$ = null,
	output = '',
	options = {
		help : {
			help : "  -h, --help		this help message"
		},
		html : {
			val : argv.i || argv.input,
			help : "  -i, --input		input file or URL"
		},
		toFile : {
			val : argv.o || argv.output,
			help : "  -o, --output		[optional] output file"
		},
		classNames : {
			val : argv.C || argv.Classes,
			help : "  -C, --Classes		[optional] parse element class names"
		},
		IDs : {
			val : argv.I || argv.IDs,
			help : "  -I, --IDs			[optional] parse element IDs"
		}
	};

// Set options that are "true" or "false" to true booleans
for (var op in options) {
	if (typeof options[op].val === 'undefined') {
		options[op].val = "false";
	}

	if (options[op].val === "true") {
		options[op].val = true;
	} else if (options[op].val === "false") {
		options[op].val = false;
	}
}

var Parser = function (options) {

	return {

		showHelp : function () {

			this.log();
			this.log("   __   ___          _   ".red);
			this.log("  / /  /_  |___     (_)__".red);
			this.log(" / _ \// __/(_-<_   / (_-<".red);
			this.log("/_//_/____/___(_)_/ /___/".red);
			this.log("HTML to SCSS   /___/     ".red);
			this.log("https://github.com/dannyx0/html-to-scss".white);
			this.log();

			this.log("Usage: html2scss [options]");
			this.log();

			this.log("Options:");
			this.log();

			for (var op in options) {
				this.log(options[op].help.yellow);
			}

			this.log();

			this.log("Examples:");
			this.log();

			this.log("$ html2scss -i index.html -C".white);
			this.log("$ html2scss -i http://news.ycombinator.com -o output.scss -I".white);

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

		output : function (line) {
			line = line || "";
			console.log(line);
			output += line + "\n";
		},

		init : function () {

			var self = this;

			jsdom.env({
				html: options.html.val,
				src: [ jquery ],
				done: function(errors, window) {

					if (errors) {
						self.log(errors.red);
					}

					$ = window.$;
					$(function () {

						self.log();
						self.log('Parsing DOM'.green);
						self.log();

						self.log("Output:".cyan);
						self.log();

						self.adjust($('html'));
						self.log();

						self.log("Done Parsing DOM".green);
						self.log();

						if (options.toFile.val) {

							self.log("Saving to file...".yellow);

							fs.writeFile(options.toFile.val, output, function(err) {
								if (err) throw err;
								self.log("Output saved to ".green + options.toFile.val);
							});

						}

					});
				}
			});

		},

		repeat : function (pattern, count) {
			if (count < 1) return '';
			var result = '';
			while (count > 0) {
				if (count & 1) result += pattern;
				count >>= 1, pattern += pattern;
			}
			return result;
		},

		// Crawls the DOM
		crawl : function ($el, before, after) {

			var level = 0;

			if (typeof before !== 'undefined') {
				level = before($el);
			}

			// Parse Children
			var $children = $el.children();
			if ($children.length) {

				$children.each($.proxy(function (i, el) {
					this.crawl($(el), before, after);
				}, this));

			}

			if (typeof after !== 'undefined') {
				after(level);
			}

		},

		adjust : function ($start) {

			this.crawl($start, $.proxy(function ($el) {

				var attr = {
						tagName : $el[0].nodeName.toLowerCase(),
						classes : $el.attr('class').length ? $el.attr('class').split(' ') : false,
						id : $el.attr('id').length ? $el.attr('id') : false
					},
					$siblings = $el.siblings(attr.tagName);

				if ($siblings.length) {


					$el.addClass($siblings.attr('class'));

					// Collect all IDs.
					var IDs = "";
					$siblings.each(function (i, el) {

						if ($(el).attr('id')) {
							IDs += $(el).attr('id') + ",";
						}

					});

					if ($el.attr('id')) {
						IDs += $el.attr('id');
					}

					// If there are any IDs, add them to this $el
					if (IDs.length) {
						$el.attr('data-ids', IDs.split(','));
					}

					$el.append($siblings.html());
					$siblings.remove();
				}

			}, this));

			this.render($('html'));

		},

		render : function ($start) {

			this.crawl($start, $.proxy(function ($el) {

				var level = $el.parents().length,
					tabs = this.repeat(tab, level),
					tag = $el[0].nodeName.toLowerCase(),
					classes = $el.attr('class').length ? $el.attr('class').split(' ') : '',
					ids = $el.attr('data-ids').length ? $el.attr('data-ids').split(',') : '',
					line = "";

				line += tag;

				this.output();
				this.output(tabs + line + " {");

				if (ids.length && options.IDs.val) {

					for (var i = ids.length - 1; i >= 0; i--) {
						this.output();
						this.output(tabs + tab + "&#" + ids[i] + " {");
						this.output();
						this.output(tabs + tab + "}");
					}

				}

				if (classes.length && options.classNames.val) {

					for (var j = 0; j < classes.length; j++) {
						this.output();
						this.output(tabs + tab + "&." + classes[j] + " {");
						this.output();
						this.output(tabs + tab + "}");
					}

				}

				return level;

			}, this), $.proxy(function (level) {

				var tabs = this.repeat(tab, level);

				this.output();
				this.output(tabs + "}");

			}, this));

		}

	};

};


var h2s = new Parser(options);

if (!options.html.val || argv.help || argv.h) {

	h2s.showHelp();
	return;

} else {

	h2s.init();

}