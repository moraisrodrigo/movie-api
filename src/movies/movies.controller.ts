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

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

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

  //EndPoint used to generate dummy data
  // @Get('seed')
  // @ApiOperation({ summary: 'Seed database' })
  // async seed() {
  //   return await this.moviesService.seed();
  // }
  
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

  @Get(':id')
  @ApiOperation({ summary: 'Get movies by Id' })
  async findOne(@Param('id') id: number): Promise<Movie> {
    const movie = await this.moviesService.findOne(id);

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Movie' })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.moviesService.create(createMovieDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Movie' })
  async update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return await this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Movie' })
  async remove(@Param('id') id: number): Promise<void> {
    return await this.moviesService.remove(id);
  }
}
