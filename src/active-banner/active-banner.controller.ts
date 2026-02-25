import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ActiveBannerService } from './active-banner.service';
import { CreateActiveBannerDto } from './dto/create-active-banner.dto';
import { UpdateActiveBannerDto } from './dto/update-active-banner.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@ApiTags('Active Banner')
@Controller('active-banner')
export class ActiveBannerController {
  constructor(private readonly activeBannerService: ActiveBannerService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get the currently active banner (public)' })
  findActive() {
    return this.activeBannerService.findActive();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all banners (admin)' })
  findAll() {
    return this.activeBannerService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a banner by ID' })
  findOne(@Param('id') id: string) {
    return this.activeBannerService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new active banner' })
  create(@Body() dto: CreateActiveBannerDto) {
    return this.activeBannerService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a banner' })
  update(@Param('id') id: string, @Body() dto: UpdateActiveBannerDto) {
    return this.activeBannerService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a banner' })
  remove(@Param('id') id: string) {
    return this.activeBannerService.remove(id);
  }
}
