import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      isAdmin: boolean
    }
    accessToken?: string
    refreshToken?: string
    expires: string
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: string
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    accessToken?: string
    refreshToken?: string
    iat: number
    exp: number
    jti: string
    role: string
    isAdmin: boolean
  }
}

