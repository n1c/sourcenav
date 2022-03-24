import { Parser } from 'binary-parser';

// type ConnectionDirection = 'Nort' | 'East' | 'South' | 'West';
// type LadderDirection = 'Up' | 'Down';

interface IParsedConnection {
  ConnectionCount: number,
  Connections: number[],
}

interface IParsedLadder {
  LadderConnectionCount: number,
  Connections: [],
}

const booleanOpts = {
  formatter: (val: any) => val === 1,
};

const VectorParser = new Parser()
  .endianess('little')
  .floatle('x')
  .floatle('y')
  .floatle('z');

const PlaceNameParser = new Parser()
  .endianess('little')
  .uint16('NameLength')
  .string('Name', { zeroTerminated: true });

const ConnectionParser = new Parser()
  .endianess('little')
  .uint32('ConnectionCount')
  .array('Connections', {
    type: 'uint32le',
    length: 'ConnectionCount',
  });

const HidingSpotParser = new Parser()
  .endianess('little')
  .uint32('HiddingSpotID')
  .nest('Location', { type: VectorParser })
  .bit8('Flags');

const EncounterPathParser = new Parser()
  .endianess('little')
  .uint32('FromAreaID')
  .uint8('FromDirection')
  .uint32('ToAreaID')
  .uint8('ToDirection')
  .uint8('SpotCount')
  .array('Spots', {
    length: 'SpotCount',
    type: new Parser().endianess('little').uint32('OrderID').uint8('Distance'),
  });

const PlaceLadderParser = new Parser()
  .endianess('little')
  .uint32('LadderConnectionCount')
  .array('Connections', {
    type: 'uint32le',
    length: 'LadderConnectionCount',
  });

const VisibleAreaParser = new Parser()
  .endianess('little')
  .uint32('VisibleAreaID')
  .bit4('Attributes');

const LadderParser = new Parser()
  .endianess('little')
  .uint32('LadderID')
  .floatle('Width')
  .nest('Top', { type: VectorParser })
  .nest('Bottom', { type: VectorParser })
  .floatle('Length')
  .uint32('Direction')
  .uint32('TopForwardAreaID')
  .uint32('TopLeftAreaID')
  .uint32('TopRightAreaID')
  .uint32('TopBehindAreaID')
  .uint32('BottomAreaID');

const NavParser = new Parser()
  .endianess('little')
  .uint32('Magic', { assert: 0xFEEDFACE })
  .uint32('MajorVersion')
  .uint32('MinorVersion')
  .uint32('BSPSize')
  .bit1('IsMeshAnalyzed', booleanOpts)
  .uint16('PlacesCount')
  .array('Places', { length: 'PlacesCount', type: PlaceNameParser })
  .bit1('HasUnnamedAreas', booleanOpts)
  .uint32('AreasCount')
  .array('Areas', {
    length: 'AreasCount',
    type: new Parser()
      .endianess('little')
      .uint32('AreaID')
      .uint32('Flags')
      .nest('NorthWest', { type: VectorParser })
      .nest('SouthEast', { type: VectorParser })
      .floatle('NorthEastZ')
      .floatle('SouthWestZ')
      .array('Connections', {
        length: 4,
        type: ConnectionParser,
        formatter: (val: IParsedConnection[]) => {
          const orientation = ['Nort', 'East', 'South', 'West'];
          return val
            .map((v, i) => v.Connections.map((c) => ({ SourceArea: c, Direction: orientation[i] })))
            .reduce((a, b) => a.concat(b));
        },
      })
      .uint8('HidingSpotCount')
      .array('HidingSpots', { length: 'HidingSpotCount', type: HidingSpotParser })
      .uint32('EncounterPathCount')
      .array('EncounterPaths', { length: 'EncounterPathCount', type: EncounterPathParser })
      .uint16('PlaceID')
      .array('Ladders', {
        length: 2,
        type: PlaceLadderParser,
        formatter: (val: IParsedLadder[]) => {
          const orientation = ['Up', 'Down'];
          return val
            .map((v, i) => v.Connections.map((c: any) => ({ SourceArea: c, Direction: orientation[i] })))
            .reduce((a, b) => a.concat(b));
        },
      })
      .floatle('EarliestOccupyTimeFirstTeam')
      .floatle('EarliestOccupyTimeSecondTeam')
      .floatle('NorthWestLightIntensity')
      .floatle('NorthEastLightIntensity')
      .floatle('SouthEastLightIntensity')
      .floatle('SouthWestLightIntensity')
      .uint32('VisibleAreaCount')
      .array('VisibleAreas', { length: 'VisibleAreaCount', type: VisibleAreaParser })
      .uint32('InheritVisibilityFromAreaID')
      .bit8('GarbageCount')
      .buffer('Garbage', {
        length() {
          const params: any = this; // @TODO: Hacky?
          return parseInt(params.GarbageCount, 10) * 14;
        },
      }),
  })
  .uint32('LadderCount')
  .array('Ladders', { length: 'LadderCount', type: LadderParser });

export default NavParser;
