import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JsonFileStorage implements OnModuleInit {
  private dataPath: string;
  private data: Record<string, any[]> = {};

  constructor() {
    this.dataPath = process.env.DATABASE_PATH || './data';
  }

  onModuleInit() {
    this.ensureDataDirectory();
    this.loadData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  private loadData() {
    const collections = [
      'users',
      'teams',
      'roles',
      'userTeams',
      'shiftTypes',
      'shifts',
      'timesheets',
      'notifications',
    ];

    collections.forEach(collection => {
      const filePath = path.join(this.dataPath, `${collection}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          this.data[collection] = JSON.parse(fileContent);
        } catch (error) {
          console.error(`Error loading ${collection}:`, error);
          this.data[collection] = [];
        }
      } else {
        this.data[collection] = [];
        this.saveData(collection);
      }
    });
  }

  private saveData(collection: string) {
    const filePath = path.join(this.dataPath, `${collection}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(this.data[collection], null, 2));
    } catch (error) {
      console.error(`Error saving ${collection}:`, error);
    }
  }

  findAll(collection: string): any[] {
    return this.data[collection] || [];
  }

  findById(collection: string, id: string): any {
    const items = this.data[collection] || [];
    return items.find(item => item.id === id);
  }

  findBy(collection: string, predicate: (item: any) => boolean): any[] {
    const items = this.data[collection] || [];
    return items.filter(predicate);
  }

  create(collection: string, item: any): any {
    const newItem = {
      id: uuidv4(),
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!this.data[collection]) {
      this.data[collection] = [];
    }

    this.data[collection].push(newItem);
    this.saveData(collection);
    return newItem;
  }

  update(collection: string, id: string, updates: Partial<any>): any {
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.data[collection][index] = updatedItem;
    this.saveData(collection);
    return updatedItem;
  }

  delete(collection: string, id: string): boolean {
    const items = this.data[collection] || [];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }

    this.data[collection].splice(index, 1);
    this.saveData(collection);
    return true;
  }

  count(collection: string): number {
    return this.data[collection]?.length || 0;
  }

  clear(collection: string): void {
    this.data[collection] = [];
    this.saveData(collection);
  }
}