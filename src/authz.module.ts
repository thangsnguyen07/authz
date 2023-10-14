import { DynamicModule, Module, Provider } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AUTH_MODULE_OPTIONS } from './constants'
import {
  AuthModuleAsyncOptions,
  AuthOptionsFactory,
} from './interfaces/auth-module-options.interface'
import { JwtStrategy } from './jwt.strategy'

@Module({})
export class AuthzModule {
  public static forRootAsync(options?: AuthModuleAsyncOptions): DynamicModule {
    return {
      module: AuthzModule,
      imports: [...options.imports, PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: options,
        },
        JwtStrategy,

        this.createConnectAsyncProviders(options),
      ],
      exports: [PassportModule, JwtStrategy],
    }
  }

  private static createConnectAsyncProviders(options: AuthModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: AUTH_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    // For useClass and useExisting...
    return {
      provide: AUTH_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AuthOptionsFactory) =>
        await optionsFactory.createAuthOptions(),
      inject: [options.useExisting || options.useClass],
    }
  }
}
