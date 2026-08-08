import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string = '';

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  leadName?: string;

  @IsString()
  @IsOptional()
  leadAvatar?: string;

  @IsNumber()
  @IsOptional()
  tasksCount?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
