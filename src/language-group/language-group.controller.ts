import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LanguageGroupService } from './language-group.service';
import { CreateLanguageGroupDto } from './dto/create-language-group.dto';
import { UpdateLanguageGroupDto } from './dto/update-language-group.dto';

@ApiTags('language-group')
@Controller('language-group')
export class LanguageGroupController {
  constructor(private readonly languageGroupService: LanguageGroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new language group' })
  create(@Body() createLanguageGroupDto: CreateLanguageGroupDto) {
    return this.languageGroupService.create(createLanguageGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all language groups' })
  findAll() {
    return this.languageGroupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a language group by ID' })
  findOne(@Param('id') id: string) {
    return this.languageGroupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a language group by ID' })
  update(@Param('id') id: string, @Body() updateLanguageGroupDto: UpdateLanguageGroupDto) {
    return this.languageGroupService.update(id, updateLanguageGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a language group by ID' })
  remove(@Param('id') id: string) {
    return this.languageGroupService.remove(id);
  }
}
