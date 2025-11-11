import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  price: string;
}
