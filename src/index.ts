import { Vec3 } from 'vec3';
import { readFileSync } from 'fs';
import NavParser from './parser';

// eslint-disable-next-line prefer-destructuring
const log = console.log;

if (process.argv.length < 3) {
  log('Specify the full path to a demo & optional output path');
  log('e.g.: ./index.js ~/test.dem ~/output.json');

  process.exit(1);
}

interface INav {
  Areas: IArea[],
  Places: IPlace[],
}

interface IArea {
  AreaID: number,
  PlaceID: number,
  NorthWest: { x: number, y: number, z: number },
  SouthEast: { x: number, y: number, z: number },
}

interface IPlace {
  Name: string,
}

const buffer = readFileSync(process.argv[2]);
const nav: INav = NavParser.parse(buffer);

const point = new Vec3(908.2178955078125, -590.444885253906, -414.96875); // Known "BombsiteA" on Nuke
let bestArea: IArea | undefined;
let bestDistance = Number.MAX_VALUE;

function distanceCenter(area: IArea, point: Vec3): number {
  const center = new Vec3(
    (area.NorthWest.x + area.SouthEast.x) / 2,
    (area.NorthWest.y + area.SouthEast.y) / 2,
    (area.NorthWest.z + area.SouthEast.z) / 2,
  );

  return point.distanceTo(center);
}

nav.Areas.forEach((e) => {
  const dist = distanceCenter(e, point);

  if (dist < bestDistance) {
    bestDistance = dist;
    bestArea = e;
  }
});

console.log('DONE', nav.Places[bestArea!.PlaceID - 1]);

/*
x: 908.2178955078125
y: -590.4448852539062
z: -414.96875
"BombsiteA"
*/
