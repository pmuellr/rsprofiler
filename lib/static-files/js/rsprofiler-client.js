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
        return updateProfiles(profiles)
    }
}

//-----------------------------------------------------------------------------
rsprofiler.deleteProfile = function deleteProfile(url) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = deleteProfileCB
    xhr.open("DELETE", "/profiles/" + url)
    xhr.send()
}

//-----------------------------------------------------------------------------
function deleteProfileCB() {
    var xhr = this
    if (xhr.readyState != xhr.DONE) return

    if (xhr.status == 200) {
        rsprofiler.getProfiles()
    }
}

//-----------------------------------------------------------------------------
rsprofiler.showProfile = function showProfile(url) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = showProfileCB
    xhr.open("GET", "/profiles/" + url)
    xhr.send()
}

//-----------------------------------------------------------------------------
function showProfileCB() {
    var xhr = this
    if (xhr.readyState != xhr.DONE) return

    if (xhr.status == 200) {
        var json = xhr.responseText
        $("#profiles-chart").html("<pre>")
        $("#profiles-chart pre").text(json)
    }
}


//-----------------------------------------------------------------------------
function profileComparer(a,b) {
    return b.url.localeCompare(a.url)
}

//-----------------------------------------------------------------------------
function updateProfiles(profiles) {
    var table = d3.select("#profiles-table")
    var tr    = table.selectAll("tr").data(profiles, function(d) {return d.url})

    tr.exit().remove()
    tr.enter().append("tr")

    tr.sort(profileComparer)

    tr.html(function(d) {
        return "" + 
            "<td class='profile-name'>" + d.name + 
            "<td><div class='trash-can''></div>" 
    })

    tr.each(function(d) {
        d3.select(this).select(".profile-name").on("click", function(){
            rsprofiler.showProfile(d.url)
        })
        d3.select(this).select(".trash-can").on("click", function(){
            rsprofiler.deleteProfile(d.url)
        })
    })
}

//-----------------------------------------------------------------------------
rsprofiler.getProfiles()

setInterval(function(){rsprofiler.getProfiles()}, 5000)

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
