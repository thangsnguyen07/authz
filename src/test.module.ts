import { CommonModule, RequestContextMiddleware } from '@charliexndt/common'

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'

import { AuthzModule } from './authz.module'
import configuration from './configuration'
import { AuthzGuard, JwtAuthGuard } from './guards'
import { TestController } from './test.controller'
import { TestService } from './test.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    AuthzModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          issuer: configService.get('auth.domain'),
          audience: configService.get('auth.audience'),
        }
      },
    }),
    CommonModule,
  ],
  controllers: [TestController],
  providers: [
    TestService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthzGuard,
    },
  ],
})
export class TestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*')
  }
}
