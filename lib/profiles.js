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
profiles.handleProfiles = function(req, res, next) {
    setCacheHeaders(res)
    var fn = handleProfiles[req.method] || invalid
    fn(req, res, next)
}

handleProfiles = {}

//------------------------------------------------------------------------------
handleProfiles.GET = function(req, res, next) {
    var entries = fs.readdirSync(Dir)

    res.type("json")
    res.end(JSON.stringify(entries,null,1))
}

//------------------------------------------------------------------------------
handleProfiles.POST = function(req, res, next) {
    var name = getNextName()
    var data = JSON.stringify(req.body, null, 2)

    fs.writeFileSync(name, data, "utf-8")
    rsprofiler.log("wrote file: " + name)

    res.end("")
}

//------------------------------------------------------------------------------
profiles.handleProfile = function(req, res, next) {
    setCacheHeaders(res)
    var fn = handleProfile[req.method] || invalid
    fn(req, res, next)
}

handleProfile = {}

//------------------------------------------------------------------------------
handleProfile.GET = function(req, res, next) {
    var name = req.params.id
    name = path.join(Dir, name)

    if (!fs.existsSync(name)) {
        res.status(404)
        return res.end()
    }

    res.sendfile(name)
}

//------------------------------------------------------------------------------
handleProfile.DELETE = function(req, res, next) {
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
function invalid(req, res, next) {
    next("invalid request")
}

//------------------------------------------------------------------------------
function getNextName() {
    var date = new Date().toISOString()
        .replace(":", "-")
        .replace(".", "-")
        .replace(":", "-")
    var name = date + "-" + Counter + ".json"
    Counter++

    return path.join(Dir, name)
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
