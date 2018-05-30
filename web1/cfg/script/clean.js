'use strict'

let _name = process.argv.slice(2)[0] || 'dist'
let rimraf = require('rimraf')
const path = require('path')

rimraf.sync((0, path.resolve)(process.cwd(), _name))
