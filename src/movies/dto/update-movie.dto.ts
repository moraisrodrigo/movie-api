import { IsNotEmpty, IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title should not be empty' })
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Description should not be empty' })
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Release date should not be empty' })
  releaseDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'Genre should not be empty' })
  @ArrayUnique({ message: 'Genre should not contain duplicate values' })
  genres?: string[];
}
