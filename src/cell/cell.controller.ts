import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CellService } from './cell.service';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';

@ApiTags('cell')
@Controller('cell')
export class CellController {
  constructor(private readonly cellService: CellService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cell' })
  create(@Body() createCellDto: CreateCellDto) {
    return this.cellService.create(createCellDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cells' })
  findAll() {
    return this.cellService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cell by ID' })
  findOne(@Param('id') id: string) {
    return this.cellService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cell by ID' })
  update(@Param('id') id: string, @Body() updateCellDto: UpdateCellDto) {
    return this.cellService.update(id, updateCellDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cell by ID' })
  remove(@Param('id') id: string) {
    return this.cellService.remove(id);
  }
}
