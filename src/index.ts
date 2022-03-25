import { Vec3 } from 'vec3';
import Nav from './nav';

const nukeNav = new Nav('de_nuke');

const NukePoints: [Vec3, string][] = [
  [new Vec3(-1946.310669, -1080.746094, -327.755432), 'TSpawn'],
  [new Vec3(-63.313015, -1117.243652, -351.906189), 'Lobby'],
  [new Vec3(-68.239395, -1189.336792, -351.906189), 'Squeaky'],
  [new Vec3(643.469788, -1403.712891, -351.906189), 'BombsiteA'],
  [new Vec3(677.854187, -1647.915039, -351.906189), 'Mini'],
  [new Vec3(1187.769653, -379.671570, -63.906189), 'Heaven'],
  [new Vec3(1146.031250, -443.565308, -236.457581), 'Heaven'], // Half-way up hell/heaven ladder
  [new Vec3(1236.391846, -437.617157, -351.906189), 'Hell'],
];

NukePoints.forEach((e) => {
  console.assert(nukeNav.placeForPoint(e[0]) === e[1], e[1]);
  console.log('--', nukeNav.placeForPoint(e[0]));
});
