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

  /**
   * Retrieves a list of all movies with pagination
   * @param page The page number
   * @param limit The maximum number of movies per page
   * @returns An object containing the list of movies and the total count
   */
  async findAll(page = 1, limit = 10): Promise<{ movies: Movie[]; total: number }> {
    const [movies, total] = await this.movieRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { movies, total };
  }

  /**
   * Searches movies based on title and/or genre
   * @param criteria An object containing search criteria (title and/or genre)
   * @returns A list of movies matching the search criteria
   */
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

  /**
   * Retrieves a single movie by ID
   * @param id The ID of the movie to retrieve
   * @returns The movie object
   * @throws NotFoundException if the movie with the specified ID is not found
   */
  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  /**
   * Creates a new movie
   * @param createMovieDto The DTO containing the data for creating a movie
   * @returns The newly created movie object
   */
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

  /**
   * Updates a movie
   * @param id The ID of the movie to update
   * @param updateMovieDto The DTO containing the data for updating the movie
   * @returns The updated movie object
   * @throws NotFoundException if the movie with the specified ID is not found
   */
  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    Object.assign(movie, updateMovieDto);
    return await this.movieRepository.save(movie);
  }

  /**
   * Removes a movie
   * @param id The ID of the movie to remove
   * @throws NotFoundException if the movie with the specified ID is not found
   */
  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  /**
   * Removes a genre from all movies
   * @param genre The genre to remove from all movies
   */
  async removeGenreFromMovies(genre: Genre): Promise<void> {
    await this.movieRepository
      .createQueryBuilder()
      .relation(Movie, 'genres')
      .of(genre)
      .remove(genre);
  }
}
