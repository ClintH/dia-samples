dia-samples
===========

A collection of interactivity-oriented samples of using Javascript. There is a rough progression in terms of the amount of commenting. From simplest to most complex: square, touch, pointer, speech, audio, geo, motion, orientation.

The samples are placed within a `public/dia-samples/` directory where you ran the Kattegat generator.

The code for each sample is well-documented, and further notes are in a README.md provided with each sample. You can also [browse the README files via Github.com](https://github.com/ClintH/dia-samples).


## Kattegat Generator

If you have installed [Kattegat](https://github.com/ClintH/kattegat/), the samples will be automatically downloaded and put in the `public/dia-samples` directory. To try the samples, open up `http://localhost:3000/dia-samples/`

Warning: Do not edit the samples inside the dia-samples folder. Instead copy a sample you want to work on to `public\` and work on it there. That way your work will not be overriden when you update.

If you want to update the pre-installed samples, run the following in the directory your Kattegat project was made:

````
$ grunt samplesUpdate
`````

**Note** this will overwrite any changes you've made inside of the dia-samples folder.

## Remote debugging

When testing your sketches on a tablet or mobile, it's very usfeul to use "remote debugging" so you can see your `console.log` messsages, inspect the DOM and so on.

Remote debugging is available for iOS and Android, and is very simple to set up. Read more:

* [How to remote debug on iOS](http://moduscreate.com/enable-remote-web-inspector-in-ios-6/)
* [How to remote debug on Android](https://developers.google.com/chrome-developer-tools/docs/remote-debugging)

## Resources

* [Alphabetical list of CSS Properties](http://ref.openweb.io/CSS/)
* [$/jQuery API](http://api.jquery.com)

## Deploying to the web

Most of the samples will work if you put them on a standard web server. It's only those that use the Kattegat realtime or storage features which will not work. To deploy to a web server you'll need to copy some support files and change the reference to these files in your project.

Let's assume you are deploying to a web server via FTP, and your base web directory is `public_html`.

### 1. Copy support files

Copy `bower_components\libraries.js`, `bower_components\pure\pure-min.css` and `public\base.css` to your `public_html` directory

### 2. Update references

Edit your project's `index.html` file, and change:

````
	<!-- Base stylesheets -->
	<link rel='stylesheet' href='/bower_components/pure/pure-min.css'>
	<link rel='stylesheet' href='/base.css'>
	...
	<!-- Import libraries such as jQuery etc -->
	<script src="/bower_components/libraries.js"></script>
````

to:

````
	<!-- Base stylesheets -->
	<link rel='stylesheet' href='../pure-min.css'>
	<link rel='stylesheet' href='../base.css'>
	...
	<!-- Import libraries such as jQuery etc -->
	<script src="../libraries.js"></script>
````

### Upload

Copy your sketch to `public_html`. The file structure should look like:

````
public_html
 yoursketch\
  index.html
  script.js
  style.css
 pure_min.css
 base.css
 libraries.js
````
