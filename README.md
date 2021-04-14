Restoration of Jared Schiffman's sewn project
=====

[Main runnable web page is here](https://dribnet.github.io/sewn/)

<p align="center">
  <img src="https://user-images.githubusercontent.com/945979/113794897-b4921980-979f-11eb-93c6-af7e8baeeed6.jpg" alt="ScreenShot"/>
</p>

A restoration port of Jared Schiffman's sewn project to OpenFrameworks and p5.js.

Sewn is an interactive sketch originally created in 1998 when Jared was a student at the Aesthetics and Computation group (ACG) at the MIT Media Lab.

This restoration project was done by Tom White and based on archived copies of the original, including executables. Sewn was one of the very early software sketches based on ACG's [acu library](https://github.com/dribnet/acu). The first port was to OpenFrameworks as OpenFrameworks was originally based on the code and coding conventions of acu, and this port required [very few code changes](https://github.com/dribnet/sewn/commit/7d4043de14e4a072448d8a861b6d14c9a06663ec) to compile and run. The followup port to p5.js was very much a rewrite / translation based on the working OpenFrameworks version and meant to allow this sketch to live on the web and reach a larger modern audience.

OpenFrameworks build
-----

Download the latest version of OpenFrameworks and then clone this repository into the "apps" subdirectory. Then the application should build form the "sewn/ofApp" subfolder.

p5.js version
-----
Should just run from index.html

Notes
-----

