import { IsString, IsNotEmpty, IsDate, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  releaseDate: Date;

  @ApiProperty()
  @ArrayNotEmpty()
  genres: string[];
}
