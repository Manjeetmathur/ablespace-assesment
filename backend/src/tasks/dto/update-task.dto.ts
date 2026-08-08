import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

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

  @IsArray()
  @IsOptional()
  resources?: any[];
}
