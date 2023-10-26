export interface OAuthToken {
  access_token: string
  scopes: string[]
  expires_in: number
  token_type: string
}
