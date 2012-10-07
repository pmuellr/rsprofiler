// Licensed under the Tumbolia Public License. See footer for details.

;(function() {

//-----------------------------------------------------------------------------
if (window.rsprofiler) return

var rsprofiler = window.rsprofiler = {}
var Running    = false
var NodeQueue  = []

rsprofiler.url = getServerURLfromScript()
if (!rsprofiler.url) alert("unable to calculate server URL")

//-----------------------------------------------------------------------------
rsprofiler.start = function rsprofiler_start(name) {
    if (Running) return
    Running = true

    if (name == null) {
        name = new Date().toISOString().replace(":", "-")
    }

    console.profile(name)
}
    
//-----------------------------------------------------------------------------
rsprofiler.stop = function rsprofiler_stop(callback) {
    if (!Running) return
    Running = false

    if (!callback) callback = defaultStopCallback

    console.profileEnd()

    var profile = console.profiles[console.profiles.length-1]

    sendProfile(profile,callback)
}

//-----------------------------------------------------------------------------
function sendProfile(profile, callback) {
    var message = JSON.stringify(profile, null, 2)

    console.log("rsprofiler: profile length: " + message.length)

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {sendProfileCB(this)}
    xhr.callback = callback
    xhr.open("POST", rsprofiler.url + "profiles")
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(message)
}

//-----------------------------------------------------------------------------
function sendProfileCB(xhr) {
    if (xhr.readyState != xhr.DONE) return

    console.log("sending profile completed with status: " + xhr.status)
    xhr.callback()
}

//-----------------------------------------------------------------------------
function defaultStopCallback(err) {
    if (err) {
        console.log("rsprofiler: error sending profile: " + err)
        return
    }

    console.log("rsprofiler: done sending profile")
}

//-----------------------------------------------------------------------------
function getServerURLfromScript() {
    var element = getTargetScriptElement()
    if (!element) return

    var pattern = /(https?:\/\/(.*?)\/)/
    var match   = pattern.exec(element.src)

    if (match) return match[1]
}

//-----------------------------------------------------------------------------
function getTargetScriptElement() {
    elements = document.getElementsByTagName("script")
    for (var i=0; i<elements.length; i++) {
        var element = elements[i]
        var src     = elements[i].src
        if (-1 != src.indexOf("/rsprofiler-target.js")) {
            return element
        }
    }
}
    
})();

//-----------------------------------------------------------------------------
// Copyright (c) 2012 Patrick Mueller
// 
// Tumbolia Public License
// 
// Copying and distribution of this file, with or without modification, are
// permitted in any medium without royalty provided the copyright notice and this
// notice are preserved.
// 
// TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
// 
//   0. opan saurce LOL
//-----------------------------------------------------------------------------
