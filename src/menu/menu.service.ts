import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem } from './menu-item.schema';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class MenuService {
  private genAI = new GoogleGenerativeAI(
    'AIzaSyCPPVjVmZn19wsRhpRlVNb09q832oaKrEM',
  );
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
  ) {}

  async getAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }
  private async generateQueryVector(query: string): Promise<number[]> {
    try {
      // Get the embedding model
      const model = this.genAI.getGenerativeModel({
        model: 'text-embedding-004',
      });

      // Generate the embedding
      const result = await model.embedContent(query);

      // Extract and return the embedding values
      if (result && result.embedding && result.embedding.values) {
        return result.embedding.values;
      } else {
        throw new Error('Embedding not found in the result.');
      }
    } catch (error) {
      console.error('Error generating vector:', error);
      throw new Error('Failed to generate vector.');
    }
  }
  async searchMenuItemsByText(query: string, k = 5): Promise<MenuItem[]> {
    // Step 1: Generate query vector from the search text
    const queryVector = await this.generateQueryVector(query);
    console.log('Generated Query Vector:', queryVector);

    // Step 2: Perform vector search using $vectorSearch
    const results = await this.menuItemModel
      .aggregate([
        {
          $vectorSearch: {
            numCandidates: 10, // Adjust candidates to refine search results
            limit: k, // Return top k results
            index: 'vector_index', // Name of the vector index
            path: 'vector', // Field in the database containing vectors
            queryVector: queryVector, // Query vector generated from user input
          },
        },
      ])
      .exec();

    console.log('Search Results:', results);
    return results;
  }
}
