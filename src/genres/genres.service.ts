import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { MoviesService } from './../movies/movies.service';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService,
  ) {}

  async findAll(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

  async deleteGenre(id: number): Promise<void> {
    // Find the genre by id
    const genre = await this.genreRepository.findOne({ where: { id } });

    if (!genre) throw new NotFoundException('Genre not found');

    // Remove the genre from all movies
    await this.moviesService.removeGenreFromMovies(genre);

    // Delete the genre
    await this.genreRepository.delete(id);
  }

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const { name } = createGenreDto;

    // Create a new Genre entity with provided dto
    const genre = this.genreRepository.create({ name: name });

    // Save the new Genre entity to the database
    return await this.genreRepository.save(genre);
  }

  async createMultiple(genreNames: string[]): Promise<Genre[]> {
    const genrePromises: Promise<Genre>[] = genreNames.map(async (name) => {
      let genre = await this.genreRepository.findOne({ where: { name } });

      // If genre doesn't exist, create it
      if (!genre) {
        genre = this.genreRepository.create({ name });
        await this.genreRepository.save(genre);
      }

      return genre;
    });

    const genres: Genre[] = await Promise.all(genrePromises);

    return genres;
  }
}
