import { ROLES_DECORATOR_METADATA_KEY } from 'src/constants/constants'

import { SetMetadata } from '@nestjs/common'

export const Roles = (roles: string[]) => SetMetadata(ROLES_DECORATOR_METADATA_KEY, roles)
