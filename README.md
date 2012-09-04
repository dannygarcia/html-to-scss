# HTML to SCSS

Node.js script that parses HTML to Sass SCSS.

## Requirements

- [node.js](nodejs.org) (0.8.8+)
- [jsdom](https://github.com/tmpvar/jsdom)
- [optimist](https://github.com/substack/node-optimist)

## Installation

Working on an npm port.

	git clone git://github.com/dannyx0/html-to-scss.git
	cd html-to-scss

## Options

	-h, --help		this help message
	-i, --input		input file or URL
	-o, --output	[optional] output file

## Examples

	$ node h2s.js -i index.html
	$ node h2s.js -i http://news.ycombinator.com -o output.scss
