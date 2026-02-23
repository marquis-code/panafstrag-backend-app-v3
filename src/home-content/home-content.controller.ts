import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HomeContentService } from './home-content.service';
import { CreateHomeContentDto } from './dto/home-content.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@ApiTags('Home Content')
@Controller('home-content')
export class HomeContentController {
  constructor(private readonly homeContentService: HomeContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get landing page content' })
  async getHomeContent() {
    return this.homeContentService.getHomeContent();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update landing page content' })
  async updateHomeContent(@Body() updateDto: CreateHomeContentDto) {
    return this.homeContentService.updateHomeContent(updateDto);
  }
}
