#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var about = require(path.join(path.dirname(require.main.filename), 'about.json'))

if (process.argv.indexOf('init') === -1) {
  console.log(JSON.stringify(about, null, 2))
} else {
  var name = process.argv[process.argv.indexOf('init') + 1] + '.js'
  var pathName = path.join(process.cwd(), name)

  if (fs.existsSync(pathName)) {
    console.log('Sorry, a folder with this name already exists!')
  } else {
    console.log('Enter your GitHub user, or leave blank if you have not:')
    process.openStdin().addListener('data', function (input) {
      var username = input.toString().trim()
      if (!username) {
        console.log('You do not have a GitHub account? So create one before and then come back here ;)')
        process.exit()
      }

      fs.mkdirSync(pathName)
      var packageJson = fs.readFileSync(path.join(path.dirname(require.main.filename), 'package.json'), 'utf8')
      packageJson = packageJson.replace(/eptaccio/g, username)
      packageJson = packageJson.replace(/marcos.js/g, name)
      packageJson = packageJson.replace(/marcos/g, name.replace('.js', ''))
      fs.writeFileSync(path.join(pathName, 'package.json'), packageJson)
      fs.writeFileSync(path.join(pathName, 'README.md'), '# ' + name + '\n\n`npm i -g ' + name.replace('.js', '') + '`')

      var LICENSE = fs.readFileSync(path.join(path.dirname(require.main.filename), 'LICENSE'))
      fs.writeFileSync(path.join(pathName, 'LICENSE'), LICENSE)

      var gitignore = fs.readFileSync(path.join(path.dirname(require.main.filename), '.gitignore'))
      fs.writeFileSync(path.join(pathName, '.gitignore'), gitignore)

      var aboutFile = fs.readFileSync(path.join(path.dirname(require.main.filename), 'about.json'))
      fs.writeFileSync(path.join(pathName, 'about.json'), aboutFile)

      fs.writeFileSync(path.join(pathName, 'bin.js'), '#!/usr/bin/env node\nvar path = require("path")\nvar about = require(path.join(path.dirname(require.main.filename), "about.json"))\nconsole.log(JSON.stringify(about, null, 2))')

      console.log('Module NPM created in ' + name)
      process.exit()
    })
  }
}
