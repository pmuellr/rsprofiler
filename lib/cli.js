#!/usr/bin/env node

// Licensed under the Tumbolia Public License. See footer for details.

fs   = require("fs")
path = require("path")

nopt = require("nopt")

rsprofiler = require("./rsprofiler")

rsprofiler.PROGRAM = path.basename(process.argv[1])

//------------------------------------------------------------------------------
function main() {
    var knownOpts = { 
        "verbose": Boolean,
        "version": Boolean,
        "help":    Boolean
    }

    var shortHands = { 
        "v": "--verbose",
        "h": "--help"
    }

    var parsed = nopt(knownOpts, shortHands, process.argv, 2)

    if (parsed.help) help()

    if (parsed.version) {
        console.log(rsprofiler.VERSION)
        process.exit(0)
    }

    var opts = {}

    opts.verbose     = !!parsed.verbose
    opts.profilesDir = replaceTilde("~/.rsprofiler")

    var args = parsed.argv.remain
    if (args.length == 0) rsprofiler.errExit("port number not specified")

    opts.port = parseInt(args[0])
    if (isNaN(opts.port)) rsprofiler.errExit("port argument is not a number")
    if ((opts.port < 0) || (opts.port > 0xFFFF)) rsprofiler.errExit("port number is inappropriate")

    rsprofiler.run(opts)    
}

//------------------------------------------------------------------------------
function replaceTilde(fileName) {
    return fileName.replace('~', getTildeReplacement())
}

//------------------------------------------------------------------------------
function getTildeReplacement() {
    return process.env["HOME"] || process.env["USERPROFILE"] || '.'
}

//------------------------------------------------------------------------------
function help() {
    var fileName = path.join(path.dirname(__filename), "help.txt")
    var helpText = fs.readFileSync(fileName, "utf-8")
    console.log(helpText)
    process.exit(1)
}

//------------------------------------------------------------------------------
main()

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
