var Parser = require('binary-parser').Parser;

var booleanOpts = {
  formatter: val => val == 1 ? true : false
}

var VectorParser = new Parser()
  .endianess('little')
  .float('x')
  .float('y')
  .float('z')

var PlaceNameParser = new Parser()
  .endianess('little')
  .uint16('NameLength')
  .string('Name', { zeroTerminated: true})

var ConnectionParser = new Parser()
  .endianess('little')
  .uint32('ConnectionCount')
  .array('Connections', {
    type: 'uint32le',
    length: 'ConnectionCount'
  })

var HidingSpotParser = new Parser()
  .endianess('little')
  .uint32('HiddingSpotID')
  .nest('Location', { type: VectorParser })
  .bit8('Flags')

var EncounterPathParser = new Parser()
  .endianess('little')
  .uint32('FromAreaID')
  .uint8('FromDirection')
  .uint32('ToAreaID')
  .uint8('ToDirection')
  .uint8('SpotCount')
  .array('Spots', {
    length: 'SpotCount',
    type: new Parser()
    .endianess('little')
    .uint32('OrderID')
    .uint8('Distance')
  })

var PlaceLadderParser = new Parser()
  .endianess('little')
  .uint32('LadderConnectionCount')
  .array('Connections', {
    type: 'uint32le',
    length: 'LadderConnectionCount'
  })

var VisibleAreaParser = new Parser()
  .endianess('little')
  .uint32('VisibleAreaID')
  .bit4('Attributes')


var LadderParser = new Parser()
  .endianess('little')
  .uint32('LadderID')
  .float('Width')
  .nest('Top', { type: VectorParser })
  .nest('Bottom', { type: VectorParser })
  .uint32('Length')
  .uint8('Direction')
  .uint32('TopForwardAreaID')
  .uint32('TopLeftAreaID')
  .uint32('TopRightAreaID')
  .uint32('TopBehindAreaID')
  .uint32('BottomAreaID')

var NavParser = new Parser()
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
      .float('NorthEastZ')
      .float('SouthWestZ')
      .array('Connections', {
        length: 4,
        type: ConnectionParser,
        formatter: val => {
          const orientation = ['Nort', 'East', 'South', 'West']
          return val
            .map((v, i) => v.Connections.map(c => ({SourceArea: c, Direction: orientation[i]})))
            .reduce((a,b) => a.concat(b))
        }
      })
    .uint8('HidingSpotCount')
    .array('HidingSpots', { length: 'HidingSpotCount', type: HidingSpotParser })
    .uint32('EncounterPathCount')
    .array('EncounterPaths', { length: 'EncounterPathCount', type: EncounterPathParser })
    .uint16('PlaceID')
    .array('Ladders', {
      length: 2,
      type: PlaceLadderParser,
      formatter: val => {
        const orientation = ['Up', 'Down']
        return val
          .map((v, i) => v.Connections.map(c => ({SourceArea: c, Direction: orientation[i]})))
          .reduce((a,b) => a.concat(b))
      },
    })
    .float('EarliestOccupyTimeFirstTeam')
    .float('EarliestOccupyTimeSecondTeam')
    .float('NorthWestLightIntensity')
    .float('NorthEastLightIntensity')
    .float('SouthEastLightIntensity')
    .float('SouthWestLightIntensity')
    .uint32('VisibleAreaCount')
    .array('VisibleAreas', { length: 'VisibleAreaCount', type: VisibleAreaParser })
    .uint32('InheritVisibilityFromAreaID')
    .bit8('GarbageCount')
    .buffer('Garbage', {
      length: function () {
        return parseInt(this.GarbageCount) * 14
      },
      formatter: val => undefined
    })
  })
  .uint32('LadderCount')
  .array('Ladders', { length: 'LadderCount', type: LadderParser })


module.exports = NavParser
