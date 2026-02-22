import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganogramService } from './organogram.service';
import { CreateOrganogramNodeDto } from './dto/create-organogram.dto';
import { UpdateOrganogramNodeDto } from './dto/update-organogram.dto';

@ApiTags('organogram')
@Controller('organogram')
export class OrganogramController {
  constructor(private readonly organogramService: OrganogramService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organogram node' })
  create(@Body() createOrganogramNodeDto: CreateOrganogramNodeDto) {
    return this.organogramService.create(createOrganogramNodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organogram nodes' })
  findAll() {
    return this.organogramService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organogram node by ID' })
  findOne(@Param('id') id: string) {
    return this.organogramService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organogram node by ID' })
  update(@Param('id') id: string, @Body() updateOrganogramNodeDto: UpdateOrganogramNodeDto) {
    return this.organogramService.update(id, updateOrganogramNodeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organogram node by ID' })
  remove(@Param('id') id: string) {
    return this.organogramService.remove(id);
  }
}
