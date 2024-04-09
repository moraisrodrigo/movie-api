import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './movie.entity';

/**
 * Controller responsible for handling movie-related HTTP requests.
 */
@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * Retrieves a paginated list of all movies.
   * @param page The page number (optional, default is 1)
   * @param limit The maximum number of movies per page (optional, default is 10)
   * @returns An object containing the list of movies, total count, current page number, and total pages.
   */
  @Get()
  @ApiOperation({ summary: 'List all movies' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ movies: Movie[]; total: number; page: number; totalPages: number }> {
    const { movies, total } = await this.moviesService.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);
    return { movies, total, page, totalPages };
  }
  
  /**
   * Searches movies by title and/or genre.
   * @param title The title to search for (optional)
   * @param genre The genre to search for (optional)
   * @returns A list of movies matching the search criteria.
   * @throws BadRequestException if neither title nor genre is provided.
   */
  @Get('search')
  @ApiOperation({ summary: 'Search movies by title and genre' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'genre', required: false })
  async searchMovies(
    @Query('title') title: string,
    @Query('genre') genre?: string,
  ) {
    if (!title && !genre)
      throw new BadRequestException('Please provide title or genre');

    return await this.moviesService.search({ title, genre });
  }

  /**
   * Retrieves a movie by its ID.
   * @param id The ID of the movie.
   * @returns The movie object.
   * @throws NotFoundException if the movie with the specified ID is not found.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get movies by Id' })
  async findOne(@Param('id') id: number): Promise<Movie> {
    const movie = await this.moviesService.findOne(id);

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  /**
   * Creates a new movie.
   * @param createMovieDto The DTO containing the data for creating a movie.
   * @returns The newly created movie object.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new Movie' })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.moviesService.create(createMovieDto);
  }

  /**
   * Updates an existing movie.
   * @param id The ID of the movie to update.
   * @param updateMovieDto The DTO containing the data for updating the movie.
   * @returns The updated movie object.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a Movie' })
  async update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return await this.moviesService.update(id, updateMovieDto);
  }

  /**
   * Deletes a movie.
   * @param id The ID of the movie to delete.
   * @throws NotFoundException if the movie with the specified ID is not found.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Movie' })
  async remove(@Param('id') id: number): Promise<void> {
    return await this.moviesService.remove(id);
  }
}
