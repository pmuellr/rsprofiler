// Licensed under the Tumbolia Public License. See footer for details.

fs   = require("fs")
path = require("path")

rsprofiler = require("./rsprofiler")

profiles = exports

var Dir 
var Counter = 0

//------------------------------------------------------------------------------
profiles.setDir = function(dir) {
    Dir = dir
}

//------------------------------------------------------------------------------
profiles.handleProfiles = function(req, res) {
    setCacheHeaders(res)
    var fn = handleProfiles[req.method] || invalid
    fn(req, res)
}

handleProfiles = {}

//------------------------------------------------------------------------------
handleProfiles.GET = function(req, res) {
    var entries = fs.readdirSync(Dir)

    entries = entries.map(function(entry){
        return {
            url:  entry,
            name: nameFromProfile(entry)
        }
    })

    res.type("json")
    res.end(JSON.stringify(entries,null,1))
}

//------------------------------------------------------------------------------
function nameFromProfile(entry) {
    var p = entry.split("-")
    return p[0] + "-" + p[1] + "-" + p[2] + " " +
           p[3] + ":" + p[4] + ":" + p[5]
}

//------------------------------------------------------------------------------
handleProfiles.POST = function(req, res) {
    var name = getNextName()
    var data = JSON.stringify(req.body, null, 2)

    fs.writeFileSync(name, data, "utf-8")
    rsprofiler.log("wrote file: " + name)

    res.end("")
}

//------------------------------------------------------------------------------
profiles.handleProfile = function(req, res) {
    setCacheHeaders(res)
    var fn = handleProfile[req.method] || invalid
    fn(req, res)
}

handleProfile = {}

//------------------------------------------------------------------------------
handleProfile.GET = function(req, res) {
    var name = req.params.id
    name = path.join(Dir, name)

    if (!fs.existsSync(name)) {
        res.status(404)
        return res.end()
    }

    res.sendfile(name)
}

//------------------------------------------------------------------------------
handleProfile.DELETE = function(req, res) {
    var name = req.params.id
    name = path.join(Dir, name)

    if (!fs.existsSync(name)) return res.end()

    fs.unlinkSync(name)        
    rsprofiler.log("deleted file: " + name)

    res.end("")
}

//------------------------------------------------------------------------------
function setCacheHeaders(res) {
    res.header("Pragma",        "no-cache")
    res.header("Expires",       "0")
    res.header("Cache-Control", "no-cache")
    res.header("Cache-Control", "no-store")
}

//------------------------------------------------------------------------------
function invalid(req, res) {
    res.type("text")
    res.end("invalid request: " + req.method + " " + req.url)
}

//------------------------------------------------------------------------------
function getNextName() {
    var date  = new Date()
    var dates = []

    dates.push(right0(date.getFullYear(), 4))
    dates.push(right0(date.getMonth()+1,  2))
    dates.push(right0(date.getDate(),     2))
    dates.push(right0(date.getHours(),    2))
    dates.push(right0(date.getMinutes(),  2))
    dates.push(right0(date.getSeconds(),  2))
    dates = dates.join("-")

    var name = dates + "-" + (Counter++) + ".json"

    return path.join(Dir, name)
}

//------------------------------------------------------------------------------
function right0(object, width) {
    object += ""
    while (object.length < width) {
        object = "0" + object
    }
    return object
}

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
