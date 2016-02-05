#Corpora

This project is a collection of static corpora (plural of "corpus") that are potentially useful in the creation of weird internet stuff. I've found that, as a creator, sometimes I am making something that needs access to a lot of adjectives, but not necessarily every adjective in the English language. So for the last year I've been copy/pasting an `adjs.json` file from project to project. This is kind of awful, so I'm hoping that this project will at least help me keep everything in one place.

I would like this to help with rapid prototyping of projects. For example: you might use `nouns.json` to start with, just to see if an idea you had was any good. Once you've built the project quickly around the nouns collection, you can then rip it out and replace it with a more complex or exhaustive data source.

I'm also hoping that this can be used as a teaching tool: maybe someone has three hours to teach how to make Twitter bots. That doesn't give the student much time to find/scrape/clean/parse interesting data. My hope is that students can be pointed to this project and they can pick and choose different interesting data sources to meld together for the creation of prototypes.

##License

Since Corpora is more data than code, I have chosen to CC0 license this (rather than MIT license or similar).

<a href="http://creativecommons.org/publicdomain/zero/1.0/"><img src="http://i.creativecommons.org/p/zero/1.0/88x31.png"></a>

To the extent possible under law, [Darius Kazemi](http://tinysubversions.com) has waived all copyright and related or neighboring rights to Corpora. This work is published from: United States.

##What is Corpora NOT?

This project is not meant to replace exhaustive APIs -- if you want nouns, and you want every noun in the English language, replete with metadata, consider [Wordnik](http://developer.wordnik.com/docs). If you want the title of every Wikipedia article, use [the MediaWiki API](http://www.mediawiki.org/wiki/API:Main_page).

##What is Corpora?

 * Corpora is repository of JSON files, meant to be language-neutral. If you want to create an NPM repo or whatever based on this, be my guest, but this repository will remain a collection of data files that can be interpreted by any language that can parse JSON.
 * Corpora is a collection of _small_ files. It is not meant to be an exhaustive source of anything: a list of resources should contain somewhere in the vicinity of 1000 items.
   * For example, Corpora will not contain any complete "dictionary" style files. Instead we host a sampling of 1000 common nouns, adjectives, and verbs.
   * Some lists are small enough by nature that we may contain a complete list of things in their category. For example, a list of heavily populated U.S. cities may only have 75 cities and be considered complete.

##List of Corpora-related tools

 * [corpora-project](https://www.npmjs.com/package/corpora-project), a Node.js NPM package for accessing corpora data offline.
 * [pycorpora](https://github.com/aparrish/pycorpora), a simple Python interface for corpora
 * [corpora-api](https://github.com/coleww/corpora-api), a Node.js server that offers up the corpora as a JSON API

##I have some data, how do I submit?

We accept pull requests to this repository. Some guidelines:

 * BY SUBMITTING DATA AS A PULL REQUEST, YOU AGREE TO OUR APPLYING A [CC0](http://creativecommons.org/publicdomain/zero/1.0/) FREE CULTURE LICENSE TO THE DATA, MEANING THAT ANYONE CAN USE THE DATA FOR ANY REASON WITHOUT ATTRIBUTION IN PERPETUITY.
 * Please submit all data as JSON format, and please [JSONLint](http://jsonlint.com/) your files before submitting -- also, thanks to [Matt Rothenberg](https://github.com/mroth) we have Travis-CI testing, which will jsonlint your pull request automatically. If you see a test failure notification in your PR after you submit, there's a problem with your JSON!
 * Keep individual files to about 1000 "things" maximum. Fewer than 1000 is fine, too.
 * If you'd like attribution, I'm happy to include your name in this Readme file. Just remember that nobody who uses this data is obligated to include attribution in their own projects.

Contributors:

 * Tyler Kellen ([tkellen](https://github.com/tkellen)): prefixes and suffixes
 * sui sea ([suisea](https://github.com/suisea)): curated/categorised emoji and words
 * Parker Higgins ([thisisparker](https://github.com/thisisparker)): apple cultivars from the pomological watercolor collection
