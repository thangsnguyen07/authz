import { Reflector } from '@nestjs/core'

export const M2MClientId = Reflector.createDecorator<string>()
