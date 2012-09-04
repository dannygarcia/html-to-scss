# HTML to SCSS

Node.js script that parses HTML to a Sass SCSS structure format.

## Requirements

- [node.js](nodejs.org) (0.8.8+)
- [jsdom](https://github.com/tmpvar/jsdom)
- [optimist](https://github.com/substack/node-optimist)

## Getting Started

Working on an npm port.

	git clone git://github.com/dannyx0/html-to-scss.git
	cd html-to-scss
	node h2s.js -i http://news.ycombinator.com -o output.scss

## Options

	-h, --help		this help message
	-i, --input		input file or URL
	-o, --output	[optional] output file

## Example

### Command

	$ node h2s.js -i input.html -o output.scss

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