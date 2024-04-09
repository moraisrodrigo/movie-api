import { Controller, Get, Delete, Param, Post, Body } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';

/**
 * Controller responsible for handling genre-related HTTP requests.
 */
@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  /**
   * Retrieves a list of all genres.
   */
  @Get()
  @ApiOperation({ summary: 'List all genres' })
  async findAll() {
    return await this.genresService.findAll();
  }

  /**
   * Deletes a genre by ID.
   * @param id The ID of the genre to delete.
   * @throws NotFoundException if the genre with the specified ID is not found.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Genre' })
  async deleteGenre(@Param('id') id: number) {
    return await this.genresService.deleteGenre(id);
  }

  /**
   * Creates a new genre.
   * @param createGenreDto The data to create a new genre.
   * @returns The newly created genre.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new Genre' })
  async create(@Body() createMovieDto: CreateGenreDto): Promise<Genre> {
    return await this.genresService.create(createMovieDto);
  }
}
