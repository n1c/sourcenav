import { writeFile, readFileSync } from 'fs';
import { program } from 'commander';
import NavParser from './parser';

program
  .command('parse <navFile>')
  .description('Returns JSON representation of the Valve navigation mesh file (.nav)')
  .action((navFile: string) => {
    const outputPath = navFile.replace('.nav', '.json');
    const buffer = readFileSync(navFile);
    const json = JSON.stringify(NavParser.parse(buffer));

    writeFile(outputPath, json, (err) => {
      if (err) {
        throw err;
      }

      console.log('Output saved: ', outputPath);
    });
  });

program.parse(process.argv);
