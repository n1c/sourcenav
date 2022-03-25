import { readFileSync, writeFile } from 'fs';
import NavParser from './navParser';

if (process.argv.length < 3) {
  console.log('Specify the map name');
  console.log('e.g.: ./cli.js de_nuke');

  process.exit(1);
}

const path = `${__dirname}/../navfiles/${process.argv[2]}.nav`;
const outputPath = path.replace('.nav', '.json');

const buffer = readFileSync(path);
const json = JSON.stringify(NavParser.parse(buffer));

writeFile(outputPath, json, (err) => {
  if (err) {
    throw err;
  }

  console.log('Output saved: ', outputPath);
});
