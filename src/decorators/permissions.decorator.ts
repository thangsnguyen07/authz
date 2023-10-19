import { PERMISSIONS_DECORATOR_METADATA_KEY } from 'src/constants/constants'

import { SetMetadata } from '@nestjs/common'

export const Permissions = (permissions: string[]) =>
  SetMetadata(PERMISSIONS_DECORATOR_METADATA_KEY, permissions)
