import { ModuleMetadata, Type } from '@nestjs/common'

export interface AuthOptionsFactory {
  createAuthOptions(): Promise<AuthModuleOptions> | AuthModuleOptions
}

export interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AuthOptionsFactory>
  useClass?: Type<AuthOptionsFactory>
  useFactory?: (...args: any[]) => Promise<AuthModuleOptions> | AuthModuleOptions
  inject?: any[]
}

export declare class AuthModuleOptions {
  audience?: string
  issuer?: string
  m2mClientId?: string
  m2mClientSecret?: string
}
