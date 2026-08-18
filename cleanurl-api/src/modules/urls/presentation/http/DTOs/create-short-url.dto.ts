import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShortUrlDto {
  @IsString({
    message: 'A URL original deve ser uma string.',
  })
  @IsNotEmpty({
    message: 'A URL original é obrigatória.',
  })
  originalUrl!: string;
}