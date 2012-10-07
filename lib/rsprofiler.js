// Licensed under the Tumbolia Public License. See footer for details.

fs   = require("fs")
path = require("path")

server   = require("./server")
profiles = require("./profiles")

rsprofiler = exports

rsprofiler.PROGRAM = path.basename(__filename)
rsprofiler.VERSION = require("../package.json").version 

//------------------------------------------------------------------------------
rsprofiler.run = function run(options) {
    // rsprofiler.log("rsprofiler.run(" + JSON.stringify(options) + ")")

    if (!fs.existsSync(options.profilesDir)) {
        rsprofiler.log("creating directory: " + options.profilesDir)
        fs.mkdirSync(options.profilesDir)
    }

    profiles.setDir(options.profilesDir)
    server.run(options)
}

//------------------------------------------------------------------------------
rsprofiler.log = function log(message) {
    console.log(rsprofiler.PROGRAM + ": " + message)
}

//------------------------------------------------------------------------------
rsprofiler.err = function err(message) {
    console.error(rsprofiler.PROGRAM + ": " + message)
}

//------------------------------------------------------------------------------
rsprofiler.errExit = function exit(message) {
    if (message) rsprofiler.err(message)
    process.exit(1)
}

rsprofiler.static_files = path.join(__dirname, "static-files")
rsprofiler.fav_icon     = path.join(rsprofiler.static_files, "images", "icon-32x32.png")

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
