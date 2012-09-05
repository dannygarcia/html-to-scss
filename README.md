# HTML to SCSS

Node.js module that parses HTML to a Sass SCSS structure format.

## Requirements

- [node.js](nodejs.org) (0.8.8+)

## Getting Started

	npm html2scss install -g
	html2scss -i http://news.ycombinator.com

## Options

	-h, --help		the help message
	-i, --input		input file or URL
	-o, --output	[optional] output file

## Example

### Command

	$ html2scss -i input.html -o output.scss

### input.html

````html
<!doctype html>
<html lang="en">
	<head>
		<title>Example</title>
	</head>
	<body class="home">

		<section class="nav">
			<nav>
				<ul>
					<li><a href="#">Menu</a></li>
					<li><a href="#">Contact</a></li>
				</ul>
			</nav>
		</section>

		<section class="main">
			<article>
				<header>
					<h1>Article Title</h1>
				</header>
				<div class="content"></div>
				<footer>
					Publish Date
				</footer>
			</article>
			<article>
				<header>
					<h1>Article Title</h1>
				</header>
				<div class="content"></div>
				<footer>
					Publish Date
				</footer>
			</article>
		</section>

	</body>
</html>
````

### output.scss

````scss
html {

	head {

		title {

		}
	}
	body.home {

		section.nav {

			nav {

				ul {

					li {

						a {

						}
					}
				}
			}
		}
		section.main {

			article {

				header {

					h1 {

					}
				}
				div.content {

				}
				footer {

				}
			}
		}
	}
	script.jsdom {

	}
}
````

## MIT License

HTML to SCSS is freely distributable under the terms of the MIT license.

Copyright (c) 2012, Danny Garcia. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.