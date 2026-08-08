import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/subtasks')
  addSubtask(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.addSubtask(id, body);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.addComment(id, body);
  }

  @Delete(':id/subtasks/:subtaskId')
  removeSubtask(@Param('id') id: string, @Param('subtaskId') subtaskId: string) {
    return this.tasksService.removeSubtask(id, subtaskId);
  }
}
