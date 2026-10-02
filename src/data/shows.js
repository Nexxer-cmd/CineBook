// Generate shows for each movie-cinema combination
import movies from './movies.js';
import cinemas from './cinemas.js';

function generateDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const showTimes = [
  { time: '10:30 AM', period: 'Morning' },
  { time: '01:15 PM', period: 'Afternoon' },
  { time: '04:00 PM', period: 'Afternoon' },
  { time: '06:45 PM', period: 'Evening' },
  { time: '09:30 PM', period: 'Night' }
];

const prices = {
  premium: { '2D': 350, '3D': 450, 'IMAX': 550 },
  standard: { '2D': 250, '3D': 320, 'IMAX': 420 },
  economy: { '2D': 150, '3D': 200, 'IMAX': 280 }
};

function generateShows() {
  const shows = [];
  let showId = 1;
  const dates = generateDates();
  const nowShowingMovies = movies.filter(m => m.status === 'now_showing');

  nowShowingMovies.forEach(movie => {
    // Assign 2-3 cinemas per movie
    const movieCinemas = cinemas.slice(0, Math.min(3, cinemas.length));

    movieCinemas.forEach(cinema => {
      const screen = cinema.screens[0]; // use first screen
      const movieFormats = movie.formats || ['2D'];
      const format = movieFormats[0]; // primary format

      dates.forEach(date => {
        // 3-4 shows per day per cinema
        const dayShows = showTimes.slice(0, 3 + Math.floor(Math.random() * 2));

        dayShows.forEach(st => {
          shows.push({
            _id: `sh${showId++}`,
            movieId: movie._id,
            cinemaId: cinema._id,
            screenId: screen._id,
            date: date,
            time: st.time,
            period: st.period,
            language: movie.language,
            format: format,
            prices: prices
          });
        });
      });
    });
  });

  return shows;
}

const shows = generateShows();

export { generateDates, prices };
export default shows;
