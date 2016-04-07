audio-input
===========

This demo shows some basic frequency analysis. The 'overall' box shows the average amplitude across the whole frequency. Try making different noises to see how high it climbs, or what the ambient noise levels are. The 'smoothed' values are temporal averages.

If we divide the entire spectrum up into little 'bins', that's what each of the lines represents. In the script, we've set it to use 256 bins. Lower bins correspond to lower (deep, bass-ier) frequencies, and higher bins correspond to higher frequencies (such as whistling)

The 'Range' boxes allows you to focus on a particular set of frequency bins. This alters what frequency ranges are used in the accompanying high/low/smoothed displays. Frequencies outside of the range will be graphed in grey.

The first time you load the page, the whole frequency range is selected, so you see `0` and `256` in the range boxes. Try setting ranges which corresponds to the sound you are interested in, through trial and error. For example, maybe the tone you are interested in falls in the middle frequencies, so you might use a range of 100-120.

Things to try:
* It's up to you to take some kind of action based on when computed averages are above or below a certain level.
* You can see there's quite a bit of jitter in the live values. The provided 'Smoother' functionality allows you to calculate an average over time. Adjust the sample size of the smoother (`smoothSamples`) to get more or less responsiveness
* How might you detect a rhythm? Eg, if a person tapped twice on their desk

Read more:
* [Getting started with WebAudio](http://creativejs.com/resources/web-audio-api-getting-started/)
* [Introduction to WebAudio](http://www.html5rocks.com/en/tutorials/webaudio/intro/)
* Google's [Web Audio Examples](http://chromium.googlecode.com/svn/trunk/samples/audio/index.html)