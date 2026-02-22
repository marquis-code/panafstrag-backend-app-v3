import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ObjectiveService } from './objective.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@ApiTags('objective')
@Controller('objective')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new objective' })
  create(@Body() createObjectiveDto: CreateObjectiveDto) {
    return this.objectiveService.create(createObjectiveDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all objectives' })
  findAll() {
    return this.objectiveService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an objective by ID' })
  findOne(@Param('id') id: string) {
    return this.objectiveService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an objective' })
  update(@Param('id') id: string, @Body() updateObjectiveDto: UpdateObjectiveDto) {
    return this.objectiveService.update(id, updateObjectiveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an objective' })
  remove(@Param('id') id: string) {
    return this.objectiveService.remove(id);
  }
}
