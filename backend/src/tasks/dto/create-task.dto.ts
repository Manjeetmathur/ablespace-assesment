import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string = '';

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsArray()
  @IsOptional()
  members?: any[];

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @IsOptional()
  labels?: string[];

  @IsArray()
  @IsOptional()
  teams?: string[];

  @IsString()
  @IsOptional()
  reporter?: string;

  @IsString()
  @IsOptional()
  project?: string;
}
