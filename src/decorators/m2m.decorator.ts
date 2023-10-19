import { M2M_CLIENT_ACCESS_DECORATOR_METADATA_KEY } from 'src/constants/constants'

import { SetMetadata } from '@nestjs/common'

export const M2MClientAccess = (isAllowed = true) =>
  SetMetadata(M2M_CLIENT_ACCESS_DECORATOR_METADATA_KEY, isAllowed)
