import { readFileSync } from 'fs';
import { Vec3 } from 'vec3';
import NavParser, { IArea, INav } from './navParser';

export type Map = 'de_nuke' | 'de_mirage'; // @TODO

export default class Nav {
  private nav: INav;

  constructor(mapName: Map) {
    const path = `${__dirname}/../navfiles/${mapName}.nav`;
    const buffer = readFileSync(path);
    this.nav = NavParser.parse(buffer);
  }

  public placeForPoint(point: Vec3): string {
    let bestArea: IArea | undefined;
    let bestDistance = Number.MAX_VALUE;

    this.nav.Areas.forEach((e) => {
      const dist = Nav.distanceCenter(e, point);

      if (dist < bestDistance && e.PlaceID !== 0) {
        bestDistance = dist;
        bestArea = e;
      }
    });

    return this.nav.Places[bestArea!.PlaceID - 1].Name;
  }

  private static distanceCenter(area: IArea, point: Vec3): number {
    const center = new Vec3(
      (area.NorthWest.x + area.SouthEast.x) / 2,
      (area.NorthWest.y + area.SouthEast.y) / 2,
      (area.NorthWest.z + area.SouthEast.z) / 2,
    );

    return point.distanceTo(center);
  }
}
