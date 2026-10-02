const cinemas = [
  {
    _id: 'c1',
    name: 'CineMax Multiplex',
    location: 'Mumbai',
    address: 'Andheri West, Link Road, Mumbai 400053',
    screens: [
      {
        _id: 'sc1',
        cinemaId: 'c1',
        name: 'Screen 1 - IMAX',
        rows: 10,
        seatsPerRow: 12,
        seatTypes: {
          premium: ['A', 'B'],
          standard: ['C', 'D', 'E', 'F', 'G', 'H'],
          economy: ['I', 'J']
        }
      },
      {
        _id: 'sc2',
        cinemaId: 'c1',
        name: 'Screen 2',
        rows: 8,
        seatsPerRow: 10,
        seatTypes: {
          premium: ['A', 'B'],
          standard: ['C', 'D', 'E', 'F'],
          economy: ['G', 'H']
        }
      },
      {
        _id: 'sc3',
        cinemaId: 'c1',
        name: 'Screen 3',
        rows: 8,
        seatsPerRow: 10,
        seatTypes: {
          premium: ['A'],
          standard: ['B', 'C', 'D', 'E', 'F'],
          economy: ['G', 'H']
        }
      }
    ],
    facilities: ['Parking', 'Food Court', 'Dolby Atmos', 'IMAX', 'Wheelchair Access']
  },
  {
    _id: 'c2',
    name: 'Galaxy Cinemas',
    location: 'Delhi',
    address: 'Connaught Place, Block A, New Delhi 110001',
    screens: [
      {
        _id: 'sc4',
        cinemaId: 'c2',
        name: 'Audi 1',
        rows: 10,
        seatsPerRow: 14,
        seatTypes: {
          premium: ['A', 'B', 'C'],
          standard: ['D', 'E', 'F', 'G', 'H'],
          economy: ['I', 'J']
        }
      },
      {
        _id: 'sc5',
        cinemaId: 'c2',
        name: 'Audi 2',
        rows: 8,
        seatsPerRow: 10,
        seatTypes: {
          premium: ['A', 'B'],
          standard: ['C', 'D', 'E', 'F'],
          economy: ['G', 'H']
        }
      }
    ],
    facilities: ['Parking', 'Food Court', 'Dolby Atmos', '4DX', 'Lounge']
  },
  {
    _id: 'c3',
    name: 'Star Cinema',
    location: 'Bangalore',
    address: 'Koramangala 5th Block, Bangalore 560095',
    screens: [
      {
        _id: 'sc6',
        cinemaId: 'c3',
        name: 'Screen 1',
        rows: 8,
        seatsPerRow: 12,
        seatTypes: {
          premium: ['A', 'B'],
          standard: ['C', 'D', 'E', 'F'],
          economy: ['G', 'H']
        }
      },
      {
        _id: 'sc7',
        cinemaId: 'c3',
        name: 'Screen 2',
        rows: 7,
        seatsPerRow: 10,
        seatTypes: {
          premium: ['A'],
          standard: ['B', 'C', 'D', 'E'],
          economy: ['F', 'G']
        }
      },
      {
        _id: 'sc8',
        cinemaId: 'c3',
        name: 'Screen 3 - Premium',
        rows: 6,
        seatsPerRow: 8,
        seatTypes: {
          premium: ['A', 'B', 'C'],
          standard: ['D', 'E'],
          economy: ['F']
        }
      }
    ],
    facilities: ['Parking', 'Cafe', 'Recliner Seats', 'Wheelchair Access']
  },
  {
    _id: 'c4',
    name: 'Metro Cineplex',
    location: 'Mumbai',
    address: 'Bandra Kurla Complex, Mumbai 400051',
    screens: [
      {
        _id: 'sc9',
        cinemaId: 'c4',
        name: 'Hall 1',
        rows: 9,
        seatsPerRow: 12,
        seatTypes: {
          premium: ['A', 'B'],
          standard: ['C', 'D', 'E', 'F', 'G'],
          economy: ['H', 'I']
        }
      },
      {
        _id: 'sc10',
        cinemaId: 'c4',
        name: 'Hall 2',
        rows: 7,
        seatsPerRow: 10,
        seatTypes: {
          premium: ['A'],
          standard: ['B', 'C', 'D', 'E'],
          economy: ['F', 'G']
        }
      }
    ],
    facilities: ['Valet Parking', 'Restaurant', 'Dolby Atmos', 'IMAX', 'VIP Lounge']
  },
  {
    _id: 'c5',
    name: 'Royal Talkies',
    location: 'Delhi',
    address: 'Saket District Centre, New Delhi 110017',
    screens: [
      {
        _id: 'sc11',
        cinemaId: 'c5',
        name: 'Main Screen',
        rows: 10,
        seatsPerRow: 12,
        seatTypes: {
          premium: ['A', 'B'],
          standard: ['C', 'D', 'E', 'F', 'G', 'H'],
          economy: ['I', 'J']
        }
      }
    ],
    facilities: ['Parking', 'Snack Bar', 'Wheelchair Access']
  }
];

export default cinemas;
