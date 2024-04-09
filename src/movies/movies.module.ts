import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { GenresModule } from './../genres/genres.module';

@Module({
  // Importing Movie and MovieRepository from TypeOrmModule
  // Also importing GenresModule for forward reference
  imports: [
    TypeOrmModule.forFeature([Movie, MovieRepository]),
    forwardRef(() => GenresModule),
  ],
  // Registering MoviesController as a controller
  controllers: [MoviesController],
  // Registering MoviesService and MovieRepository as providers
  providers: [MoviesService, MovieRepository],
  // Exporting MoviesService and MovieRepository for dependency injection
  exports: [MoviesService, MovieRepository],
})
export class MoviesModule {}
