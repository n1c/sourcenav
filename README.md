A Source Engine navigation mesh file parser written in Javascript.

# sourcenav
A [Source Engine](https://en.wikipedia.org/wiki/Source_(game_engine)) bot Nav file parser written in Javascript.
This was written for CS:GO but will likely work with little or no modification for other Source titles.
The specifics of the .nav format were reverse engineered using the information on [Valve's wiki](https://developer.valvesoftware.com/wiki/NAV) as a starting point.
For more information on Source's Navigation Meshes see Valve's wiki: https://developer.valvesoftware.com/wiki/Navigation_Meshes

# Disclaimer
This project was heavily inspired by [gonav](https://github.com/mrazza/gonav) the GO language version of the same idea.
Thankz [mrazza](https://github.com/mrazza) for open sourcing it.

# Usage

* `npm install` to install dependencies
* `node bin/cli.js parse <file.nav>` parses the nav file

# Limitation
This library only works with the NAV Format version 16

# License
MIT
