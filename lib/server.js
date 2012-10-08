// Licensed under the Tumbolia Public License. See footer for details.

http = require("http")

express  = require("express")

rsprofiler     = require("./rsprofiler")
profiles       = require("./profiles")

var App
var IsDev
var TargetScript

//-----------------------------------------------------------------------------
exports.run = function run(options) {

    App   = express()
    IsDev = (App.get("env") == "development")

    if (IsDev) {
        App.use(express.logger("dev"))
    }

    App
        .use(express.favicon(rsprofiler.fav_icon))
        .use(express.static(rsprofiler.static_files))
        .use(express.static(rsprofiler.vendor_files))
        .use(express.bodyParser())
        .use(addCORSHeaders)
        .use(App.router)
        .use(notFoundHandler)
        .use(xhrErrorHandler)
        .use(errorHandler)

    App.get("/rsprofiler-target.js", handleTargetScript)
    App.all("/profiles",             profiles.handleProfiles)
    App.all("/profiles/:id",         profiles.handleProfile)

    if (!IsDev) TargetScript = getTargetScript()

    App.listen(options.port)

    rsprofiler.log("server started on port " + options.port)
    rsprofiler.log("is development: " + IsDev)
}

//-----------------------------------------------------------------------------
function xray(name) {
    return function(req, res, next) {
        rsprofiler.log("xray " + name + ": req.method : " + req.method)
        next()
    }
}

//-----------------------------------------------------------------------------
function handleTargetScript(req, res) {
    res.type("js")
    res.end(TargetScript || getTargetScript())
}

//-----------------------------------------------------------------------------
function notFoundHandler(req, res) {
    res.status(404)
    res.end("resource not found: " + req.url)
}

//-----------------------------------------------------------------------------
function xhrErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.send(500, { error: err + "" })
        return
    }

    next(err)
}

//-----------------------------------------------------------------------------
function errorHandler(err, req, res, next) {
    res.type("html")
    res.end("in <code>errorHandler(" + err + ")</code>")
}

//-----------------------------------------------------------------------------
function addCORSHeaders(req, res, next) {
    var origin = req.header("Origin")
    if (!origin) return next()
    
    res.header("Access-Control-Allow-Origin"),  origin
    res.header("Access-Control-Max-Age"),       "600"
    res.header("Access-Control-Allow-Methods"), "GET, POST, DELETE"

    next()
}

//-----------------------------------------------------------------------------
function getTargetScript() {
    var result = ""
    var fileName = path.join(rsprofiler.static_files, "rsprofiler-target.js")
    var content  = fs.readFileSync(fileName, "utf-8")
    result += content + ";\n\n"

    if (false) {
        fileName  = __dirname
        fileName += "/../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js"
        content   = fs.readFileSync(fileName, "utf-8")
        result   += content
    }

    return result
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
