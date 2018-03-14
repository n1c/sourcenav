#!/usr/bin/env node

var fs = require('fs')
var program = require('commander')
var NavParser = require('../index')

program
  .command('parse <navFile>')
  .description('Returns JSON representation of the Valve navigation mesh file (.nav)')
  .action(navFile => {
    const buffer = fs.readFileSync(navFile)
    console.log(JSON.stringify(NavParser.parse(buffer), null, 2))
  })

program.parse(process.argv)
