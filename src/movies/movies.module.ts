import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { GenresModule } from './../genres/genres.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, MovieRepository]),
    forwardRef(() => GenresModule),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieRepository],
  exports: [MoviesService, MovieRepository],
})
export class MoviesModule {}
