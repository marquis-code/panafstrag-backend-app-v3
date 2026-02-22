import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FocusAreaService } from './focus-area.service';
import { CreateFocusAreaDto } from './dto/create-focus-area.dto';
import { UpdateFocusAreaDto } from './dto/update-focus-area.dto';

@ApiTags('focus-area')
@Controller('focus-area')
export class FocusAreaController {
  constructor(private readonly focusAreaService: FocusAreaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new focus area' })
  create(@Body() createFocusAreaDto: CreateFocusAreaDto) {
    return this.focusAreaService.create(createFocusAreaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all focus areas' })
  findAll() {
    return this.focusAreaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a focus area by ID' })
  findOne(@Param('id') id: string) {
    return this.focusAreaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a focus area by ID' })
  update(@Param('id') id: string, @Body() updateFocusAreaDto: UpdateFocusAreaDto) {
    return this.focusAreaService.update(id, updateFocusAreaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a focus area by ID' })
  remove(@Param('id') id: string) {
    return this.focusAreaService.remove(id);
  }
}
