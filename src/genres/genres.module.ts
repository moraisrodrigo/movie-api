import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genre.entity';
import { GenreRepository } from './genre.repository';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { MoviesModule } from './../movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), forwardRef(() => MoviesModule)],
  controllers: [GenresController],
  providers: [GenresService, GenreRepository],
  exports: [GenresService, GenreRepository],
})
export class GenresModule {}
