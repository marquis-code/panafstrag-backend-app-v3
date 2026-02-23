import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export interface SearchResult {
  title: string;
  description: string;
  type: string;
  link: string;
}

@Injectable()
export class SearchService {
  constructor(@InjectConnection() private connection: Connection) {}

  async globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const regex = new RegExp(query, 'i');
    const results: SearchResult[] = [];
    const limitPerCollection = 5;

    // We fetch raw collections to decouple from specific schema imports 
    // and make this extremely fast and resilient.
    const collectionsToSearch = [
      { name: 'programs', type: 'Program', linkPrefix: '/programs/', titleField: 'title', descField: 'description' },
      { name: 'objectives', type: 'Objective', linkPrefix: '/focus-areas', titleField: 'description', descField: 'description' },
      { name: 'responsibilities', type: 'Responsibility', linkPrefix: '/focus-areas', titleField: 'description', descField: 'description' },
      { name: 'cells', type: 'Cell', linkPrefix: '/cells', titleField: 'name', descField: 'description' },
      { name: 'focusareas', type: 'Focus Area', linkPrefix: '/focus-areas', titleField: 'title', descField: 'description' },
      { name: 'boards', type: 'Board Member', linkPrefix: '/board', titleField: 'name', descField: 'role' },
      { name: 'languagegroups', type: 'Language Group', linkPrefix: '/language-groups', titleField: 'name', descField: 'description' },
      { name: 'archives', type: 'Archive', linkPrefix: '/archives/', titleField: 'title', descField: 'description' },
    ];

    await Promise.all(
      collectionsToSearch.map(async (col) => {
        try {
          const docs = await this.connection.collection(col.name).find({
            $or: [
              { [col.titleField]: { $regex: regex } },
              { [col.descField]: { $regex: regex } },
            ],
          }).limit(limitPerCollection).toArray();

          docs.forEach(doc => {
            let link = col.linkPrefix;
            // Append ID for detail pages
            if (['Program', 'Archive'].includes(col.type)) {
               link += doc._id.toString();
            }

            results.push({
              title: doc[col.titleField] || String(doc._id),
              description: doc[col.descField] || '',
              type: col.type,
              link,
            });
          });
        } catch (error) {
           // Ignore if a collection doesn't exist or isn't populated
           console.warn(`Search scan warning: Collection ${col.name} scanning failed`, error.message);
        }
      })
    );

    return results;
  }
}
