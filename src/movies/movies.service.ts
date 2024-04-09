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
