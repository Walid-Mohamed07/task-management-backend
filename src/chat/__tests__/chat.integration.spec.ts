import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ChatModule } from '../chat.module';
import { Connection } from 'mongoose';

describe('Chat Integration (mongodb-memory)', () => {
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), ChatModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  it('boots chat module with in-memory mongo', async () => {
    expect(module).toBeDefined();
  });
});
