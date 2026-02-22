import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponsibilityService } from './responsibility.service';
import { CreateResponsibilityDto } from './dto/create-responsibility.dto';
import { UpdateResponsibilityDto } from './dto/update-responsibility.dto';

@ApiTags('responsibility')
@Controller('responsibility')
export class ResponsibilityController {
  constructor(private readonly responsibilityService: ResponsibilityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new responsibility' })
  create(@Body() createResponsibilityDto: CreateResponsibilityDto) {
    return this.responsibilityService.create(createResponsibilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all responsibilities' })
  findAll() {
    return this.responsibilityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a responsibility by ID' })
  findOne(@Param('id') id: string) {
    return this.responsibilityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a responsibility' })
  update(@Param('id') id: string, @Body() updateResponsibilityDto: UpdateResponsibilityDto) {
    return this.responsibilityService.update(id, updateResponsibilityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a responsibility' })
  remove(@Param('id') id: string) {
    return this.responsibilityService.remove(id);
  }
}
