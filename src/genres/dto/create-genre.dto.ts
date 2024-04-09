import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
