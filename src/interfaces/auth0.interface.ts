export interface OAuthToken {
  access_token: string
  scopes: string[]
  expires_in: number
  token_type: string
}

export interface M2MToken {
  access_token: string
  token_type: string
  expires_in: number
}
