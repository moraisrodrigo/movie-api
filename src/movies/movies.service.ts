import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Genre } from './../genres/genre.entity';
import { GenresService } from './../genres/genres.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @Inject(forwardRef(() => GenresService))
    private readonly genresService: GenresService,
  ) {}

  // async seed(): Promise<Movie[]> {

  //   const dummyMovies = [
  //     {
  //       title: 'The Dark Knight',
  //       description: 'Batman fights crime in Gotham City.',
  //       releaseDate: new Date('2008-07-18'),
  //     },
  //     {
  //       title: 'Inception',
  //       description: 'A thief who enters the dreams of others to steal their secrets.',
  //       releaseDate: new Date('2010-07-16'),
  //     },
  //     {
  //       title: 'The Shawshank Redemption',
  //       description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  //       releaseDate: new Date('1994-10-14'),
  //     },
  //     {
  //       title: 'Pulp Fiction',
  //       description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
  //       releaseDate: new Date('1994-10-14'),
  //     },
  //     {
  //       title: 'The Godfather',
  //       description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
  //       releaseDate: new Date('1972-03-24'),
  //     },
  //     {
  //       title: 'The Dark Knight Rises',
  //       description: 'Batman returns to Gotham City to fight crime and faces a new enemy, Bane.',
  //       releaseDate: new Date('2012-07-20'),
  //     },
  //     {
  //       title: 'Interstellar',
  //       description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
  //       releaseDate: new Date('2014-11-07'),
  //     },
  //     {
  //       title: 'The Matrix',
  //       description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
  //       releaseDate: new Date('1999-03-31'),
  //     },
  //     {
  //       title: 'Forrest Gump',
  //       description: 'The story of Forrest Gump, a man with a low IQ, who rose to prominence despite his challenges and unwittingly influenced several historical events.',
  //       releaseDate: new Date('1994-07-06'),
  //     },
  //     {
  //       title: 'The Lord of the Rings: The Fellowship of the Ring',
  //       description: 'A young hobbit, Frodo, embarks on a perilous journey to destroy a powerful ring and save Middle-earth from the dark lord Sauron.',
  //       releaseDate: new Date('2001-12-19'),
  //     },
  //     {
  //       title: 'Avatar',
  //       description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
  //       releaseDate: new Date('2009-12-18'),
  //     },
  //     {
  //       title: 'The Lion King',
  //       description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
  //       releaseDate: new Date('1994-06-24'),
  //     },
  //     {
  //       title: 'Jurassic Park',
  //       description: 'During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok.',
  //       releaseDate: new Date('1993-06-11'),
  //     },
  //     {
  //       title: 'Titanic',
  //       description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
  //       releaseDate: new Date('1997-12-19'),
  //     },
  //     {
  //       title: 'Inglourious Basterds',
  //       description: 'In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner\'s vengeful plans for the same.',
  //       releaseDate: new Date('2009-08-21'),
  //     },
  //   ];

  //   const movieEntities = dummyMovies.map(movie => this.movieRepository.create(movie));

  //   await this.movieRepository.insert(movieEntities);

  //   return movieEntities;
  // }

  async findAll(page = 1, limit = 10): Promise<{ movies: Movie[]; total: number }> {
    const [movies, total] = await this.movieRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { movies, total };
  }

  async search(criteria: { title?: string; genre?: string }): Promise<Movie[]> {
    const { title, genre } = criteria;

    let queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');

    if (genre)
      queryBuilder = queryBuilder.andWhere('genre.name LIKE :genre', {
        genre: `%${genre}%`,
      });

    if (title)
      queryBuilder = queryBuilder.andWhere('movie.title LIKE :title', {
        title: `%${title}%`,
      });

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { title, description, releaseDate, genres } = createMovieDto;

    // Create a new Movie entity with provided data
    const movie = this.movieRepository.create({
      title,
      description,
      releaseDate,
      genres: [],
    });

    movie.genres = await this.genresService.createMultiple(genres);

    return await this.movieRepository.save(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);
    return await this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  async removeGenreFromMovies(genre: Genre): Promise<void> {
    await this.movieRepository
      .createQueryBuilder()
      .relation(Movie, 'genres')
      .of(genre)
      .remove(genre);
  }
}
