rsprofiler - Remote Script Profiler
===================================

Turns out you can use the following little fragment in
JavaScript in the iOS 6 to generate profiling data,
**if you connect to remote web inspector FIRST**:

    console.profile("my slow code")
    callMySlowCode()
    console.profileEnd()

After `console.profileEnd()` completes, you will have a 
chunk of data available in the `console.profiles` array.

Now, what to do with it ...

install the rsprofiler server
=============================

<!--
    sudo npm -g install rsprofiler
-->

For now, git clone.

run the rsprofiler server
=========================

    rsprofiler --help # prints some help
    rsprofiler 3000   # starts a server  


use the rsprofiler server
=========================

The rsprofiler server does a few different things.

include `rsprofiler-target.js` in your web page
-----------------------------------------------

    <script src="http://example.com:port/rsprofiler-target.js"></script>

This script exposes the `rsprofiler` global variable.  See API below.

browse profiles
---------------

Head over to <a href="http://localhost:port/">http://localhost:port/</a> to 
browse through captured profiles.


the `rsprofiler` global variable
================================

This variable has the following properties:

`supported`
---------

Contains a boolean value, indicating whether or not rsprofiler is
supported in this browser.  


`start(<name>)`
---------

Starts a new profiling session.  If a session has already been started,
but not not yet stopped, calling this function is a no-op.

`stop(<callback>)`
--------

Stops the previously started profiling session.  If no session has been started
calling this function is a no-op.

If a callback function is passed in, it will be invoked as follows:

    callback.apply(null, error)

If `error` is null, then success!


workflow
========

* start the rsprofiler server
* include the `rsprofiler-target.js` file in your web page
* run your browser page / app on iOS 6
* connect to your page / app via [remote Web Inspector][rwi]
* trigger the action(s) that will trigger `rsprofiler.start()` and `.stop()` to run
* visit your rsprofiler server in your desktop browser for views of the profiling data

[rwi]: https://developer.apple.com/library/ios/#documentation/AppleApplications/Reference/SafariWebContent/DebuggingSafarioniPhoneContent/DebuggingSafarioniPhoneContent.html "iOS Developer Library"


license
=======

Tumbolia Public License

Copying and distribution of this file, with or without modification, are
permitted in any medium without royalty provided the copyright notice and this
notice are preserved.

TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. opan saurce LOL

attributions
============

The tilted stopwatch image with green filling was adapted from 
[StopWatch][StopWatch] designed by [Irit Barzily][iritein] from The Noun Project.

[StopWatch]: http://thenounproject.com/noun/stopwatch/#icon-No938
[iritein]:   http://thenounproject.com/iritein

The garbage can image was adapted from 
[Trash Can][Trashcan] designed by [Chris Lee][sirleech] from The Noun Project.

[Trashcan]: http://thenounproject.com/noun/trash-can/#icon-No3199
[sirleech]: http://thenounproject.com/sirleech

