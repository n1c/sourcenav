var fs = require('fs')
const { program } = require('commander');

var NavParser = require('../index')

program
  .command('parse <navFile>')
  .description('Returns JSON representation of the Valve navigation mesh file (.nav)')
  .action(navFile => {
    const outputPath = navFile.replace('.nav', '.json');
    const buffer = fs.readFileSync(navFile)
    const json = JSON.stringify(NavParser.parse(buffer));

    fs.writeFile(outputPath, json, (err) => {
      if (err) {
        throw err;
      }

      console.log('Output saved: ', outputPath);
    });
  })

program.parse(process.argv)
