export interface GooglePayload {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  hd?: string | null | undefined;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture?: string | null | undefined;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface RefreshTokenPayload {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface AccessTokenPayload extends RefreshTokenPayload {
  iss: string;
  aud: string;
  picture?: string | null | undefined;
  first_name: string;
  last_name: string;
}
