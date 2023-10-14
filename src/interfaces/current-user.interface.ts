export interface ICurrentUser {
  permissions: string[]
  azp: string
  iss: string
  gty?: string
  sub: string
  scope: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/email'?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/roles'?: string[]
}
