import { Controller, Get, Query } from '@nestjs/common';
import { SearchService, SearchResult } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string): Promise<SearchResult[]> {
    return this.searchService.globalSearch(q);
  }
}
