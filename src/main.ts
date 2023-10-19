import { config } from 'dotenv'

import { NestFactory } from '@nestjs/core'

import { TestModule } from './test-module/test.module'

config()

async function bootstrap() {
  const app = await NestFactory.create(TestModule)
  await app.listen(5000)
}
bootstrap()
