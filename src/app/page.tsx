import Hero from '@/components/Hero';
import ReleaseSlider from '@/components/ReleaseSlider';
import UpComingSlider from '@/components/UpComingSlider';
import FilmsOfWeek from '@/components/FilmsOfWeek';
import SerialsSlider from '@/components/SerialsSlider';
import MovieList from '@/components/MovieList';
import { tmdbApi } from '@/services/tmdb';

export default async function Home() {
    const [
        trendingMovies,
        popularMovies,
        upcomingMovies,
        popularShows,
        trendingShow
    ] = await Promise.all([
        tmdbApi.getTrending('movie', 'week'),
        tmdbApi.getPopular('movie'),
        tmdbApi.getUpcoming(),
        tmdbApi.getBestRecentSeries(),
        tmdbApi.getTrending('tv', 'week')
    ]);

    const heroMovie = trendingMovies.results[0];
    const weekShow = trendingShow.results[0];

    return (  
        <main className='-mt-20'>
            <Hero movie={heroMovie} />
            <ReleaseSlider movies={popularMovies.results} />
            <UpComingSlider movies={upcomingMovies.results} />
            <FilmsOfWeek movie={weekShow} />
            <SerialsSlider series={popularShows} />
            <MovieList movies={trendingMovies.results.slice(1)} />
        </main>
    );
}
