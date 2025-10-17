import { Module, Global } from '@nestjs/common';
import { MockDatabaseService } from './mock-database.service';
import { JsonFileStorage } from './json-file.storage';

@Global()
@Module({
  providers: [MockDatabaseService, JsonFileStorage],
  exports: [MockDatabaseService, JsonFileStorage],
})
export class DatabaseModule {}