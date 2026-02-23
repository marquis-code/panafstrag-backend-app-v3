import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { UpdateArchiveDto } from './dto/update-archive.dto';

@ApiTags('archive')
@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new archive entry' })
  create(@Body() createArchiveDto: CreateArchiveDto) {
    return this.archiveService.create(createArchiveDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all archive entries with optional filtering' })
  findAll(
    @Query('type') type?: string,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.archiveService.findAll({ type, year, month });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an archive entry by ID' })
  findOne(@Param('id') id: string) {
    return this.archiveService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an archive entry by ID' })
  update(@Param('id') id: string, @Body() updateArchiveDto: UpdateArchiveDto) {
    return this.archiveService.update(id, updateArchiveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an archive entry by ID' })
  remove(@Param('id') id: string) {
    return this.archiveService.remove(id);
  }
}
