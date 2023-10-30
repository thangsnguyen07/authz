import { PUBLIC_DECORATOR_METADATA_KEY } from 'src/constants/constants'

import { SetMetadata } from '@nestjs/common'

export const Public = (isAllowed = true) => SetMetadata(PUBLIC_DECORATOR_METADATA_KEY, isAllowed)
