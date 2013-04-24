/*
 * h2s.js – HTML to SCSS
 * Copyright (c) 2012, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/html-to-scss
 */

(function () {


	/* ==========================
	* Main HTML Parser */

	var parser = function () {

		var jsdom = require('jsdom'),
			colors = require('colors'),
			fs = require('fs'),
			jquery = "http://code.jquery.com/jquery-1.9.1.min.js",
			_options = {},
			tab = '\t';

		return {

			outputStr : "",

			log : function (log) {

				if (!_options.log) {
					return;
				}

				if (typeof log === 'undefined') {
					log = "";
				} else {
					log = tab + log;
				}

				return console.log(log);

			},

			output : function (line) {
				line = line || "";
				if (_options.log) {
					console.log(line);
				}
				this.outputStr += line + "\n";
			},

			init : function (options, callback) {

				var self = this;
				_options = options || {};

				jsdom.env({
					html: _options.html.val,
					scripts: [ "http://code.jquery.com/jquery-1.8.1.min.js" ],
					done: function(errors, window) {

						if (errors || typeof window === 'undefined' || typeof window.$ === 'undefined') {

							self.log(errors.red);

							if (callback) {
								callback(errors.code);
							}

							return errors;
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


							if (_options.toFile.val) {

								self.log("Saving to file...".yellow);

								fs.writeFile(_options.toFile.val, self.outputStr, function(err) {
									if (err) throw err;
									self.log("Output saved to ".green + _options.toFile.val);
								});

							}

							if (callback) {
								callback(self.outputStr);
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
						if (el.nodeName !== 'SCRIPT') {
							this.crawl($(el), before, after);
						}
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
							classes : $el.attr('class') != undefined ? $el.attr('class').split(' ') : false,
							id : $el.attr('id') != undefined ? $el.attr('id') : false
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
					} else if (attr.id.length) {
						$el.attr('data-ids', attr.id);
					}

				}, this));

				this.render($('html'));

			},

			render : function ($start) {

				this.crawl($start, $.proxy(function ($el) {

					var level = $el.parents().length,
						tabs = this.repeat(tab, level),
						tag = $el[0].nodeName.toLowerCase(),
						classes = $el.attr('class') != undefined ? $el.attr('class').split(' ') : '',
						ids = $el.attr('data-ids') != undefined ? $el.attr('data-ids').split(',') : '',
						line = "";

					line += tag;

					if (tag !== "html") {
						this.output();
					}

					this.output(tabs + line + " {");

					if (ids.length && _options.IDs.val) {

						for (var i = ids.length - 1; i >= 0; i--) {
							this.output();
							this.output(tabs + tab + "&#" + ids[i] + " {");
							this.output();
							this.output(tabs + tab + "}");
						}

					}

					if (classes.length && _options.classNames.val) {

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


	/* ==========================
	* Command Line Interface */

	var cli = function () {

		var argv = require('optimist').argv,
			colors = require('colors'),
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
				},
				log : true // Log output in the console.
			};

		// Set options that are "true" or "false" or undefined as true booleans
		for (var op in options) {
			if (typeof options[op].val === 'undefined') {
				options[op].val = false;
			} else if (options[op].val === "true") {
				options[op].val = true;
			} else if (options[op].val === "false") {
				options[op].val = false;
			}
		}

		if (!options.html.val || argv.help || argv.h) {

			cli.showHelp(options);

		} else {

			parser().init(options);

		}

	};

	cli.showHelp = function (options) {

		cli.log();
		cli.log("   __   ___          _   ".red);
		cli.log("  / /  /_  |___     (_)__".red);
		cli.log(" / _ \// __/(_-<_   / (_-<".red);
		cli.log("/_//_/____/___(_)_/ /___/".red);
		cli.log("HTML to SCSS   /___/     ".red);
		cli.log("https://github.com/dannygarcia/html-to-scss".white);
		cli.log();

		cli.log("Usage: html2scss [options]");
		cli.log();

		cli.log("Options:");
		cli.log();

		for (var op in options) {
			if (typeof options[op].help !== 'undefined') {
				cli.log(options[op].help.yellow);
			}
		}

		cli.log();

		cli.log("Examples:");
		cli.log();

		cli.log("$ html2scss -i index.html -C".white);
		cli.log("$ html2scss -i http://news.ycombinator.com -o output.scss -I".white);

		cli.log();

	};

	cli.log = function (log) {

		if (typeof log === 'undefined') {
			log = "";
		} else {
			log = "\t" + log;
		}

		return console.log(log);

	};


	/* ==========================
	* Node.js Hook */

	if (typeof module !== 'undefined' && module.exports) {

		module.exports = {
			cli : cli,
			parser : parser
		};

	}


}).call(this);
