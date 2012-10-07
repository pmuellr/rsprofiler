// Licensed under the Tumbolia Public License. See footer for details.

;(function() {

//-----------------------------------------------------------------------------
if (window.rsprofiler) return

var rsprofiler = window.rsprofiler = {}

//-----------------------------------------------------------------------------
rsprofiler.getProfiles = function getProfiles() {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = getProfilesCB
    xhr.open("GET", "/profiles")
    xhr.send()
}

//-----------------------------------------------------------------------------
function getProfilesCB() {
    var xhr = this
    if (xhr.readyState != xhr.DONE) return

    if (xhr.status == 200) {
        var profiles = JSON.parse(xhr.responseText)
        profiles.sort()
        profiles.reverse()
        return updateProfiles(profiles)
    }
}

//-----------------------------------------------------------------------------
function updateProfiles(profiles) {
    var html = profiles.map(function(profile) {
        return "<li><a href='/profiles/" + profile + "'>" + profile + "</a>"
    })

    var elem = document.getElementById("profiles-list")

    elem.innerHTML = html.join("\n")
}

//-----------------------------------------------------------------------------
rsprofiler.getProfiles()

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
