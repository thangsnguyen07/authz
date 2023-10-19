import { AuthzModule } from 'src/authz.module'
import { AuthzGuard } from 'src/guards'

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'

import { CommonModule, RequestContextMiddleware } from '@charliexndt/common'

import { AUTH_MODULE_OPTIONS } from '@constants'

import configuration from './configuration'
import { TestController } from './test.controller'
import { TestService } from './test.service'

const createAuthConfig = async (configService: ConfigService) => ({
  issuer: configService.get('auth.domain'),
  audience: configService.get('auth.audience'),
  m2mClientId: configService.get('auth.m2mClientId'),
})

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    // --- Import Authz Module ---
    AuthzModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createAuthConfig,
    }),
    // --- Import Authz Module ---

    CommonModule,
  ],
  controllers: [TestController],
  providers: [
    TestService,

    // --- Provide Auth Module Options ---
    {
      provide: AUTH_MODULE_OPTIONS,
      inject: [ConfigService],
      useFactory: createAuthConfig,
    },
    {
      provide: APP_GUARD,
      useClass: AuthzGuard,
    },
    // --- Provide Auth Module Options ---
  ],
})
export class TestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*')
  }
}
