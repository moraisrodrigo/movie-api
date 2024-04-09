import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genre.entity';
import { GenreRepository } from './genre.repository';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { MoviesModule } from './../movies/movies.module';

@Module({
  // Importing TypeOrmModule with the Genre entity and GenreRepository
  imports: [TypeOrmModule.forFeature([Genre]), forwardRef(() => MoviesModule)],
  // Declaring the GenresController as a controller for this module
  controllers: [GenresController],
  // Declaring the GenresService and GenreRepository as providers for dependency injection
  providers: [GenresService, GenreRepository],
  // Exporting GenresService and GenreRepository to use in other modules
  exports: [GenresService, GenreRepository],
})
export class GenresModule {}
