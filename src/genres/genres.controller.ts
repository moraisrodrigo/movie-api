import { Controller, Get, Delete, Param, Post, Body } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'List all genres' })
  async findAll() {
    return await this.genresService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Genre' })
  async deleteGenre(@Param('id') id: number) {
    return await this.genresService.deleteGenre(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Genre' })
  async create(@Body() createMovieDto: CreateGenreDto): Promise<Genre> {
    return await this.genresService.create(createMovieDto);
  }
}
