import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AppDataSource } from './database';
import { User } from './entities/User';
import bcrypt from 'bcryptjs';

export const adminAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'admin-credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check for hardcoded admin user first (always available as fallback)
        if (credentials.email === "admin@lunaai.com" && credentials.password === "admin123") {
          console.log("Using fallback admin user");
          return {
            id: "admin-user-id",
            email: "admin@lunaai.com",
            name: "Admin User",
            image: null,
            role: "admin",
            isAdmin: true,
          };
        }

        // Try database authentication for admin users
        try {
          if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
          }

          const userRepository = AppDataSource.getRepository(User);
          const user = await userRepository.findOne({
            where: { 
              email: credentials.email,
              isAdmin: true // Only allow admin users
            }
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          user.lastLoginAt = new Date();
          await userRepository.save(user);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("Admin auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For fallback admin user, always allow sign in
      if (user?.email === "admin@lunaai.com" && user?.id === "admin-user-id") {
        console.log("Fallback admin user sign in successful");
        return true;
      }

      // For database admin users, verify they are actually admin
      if (user?.isAdmin && user?.role === "admin") {
        return true;
      }

      // Deny access for non-admin users
      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      } else if (token.id === "admin-user-id") {
        // Handle fallback admin user
        token.role = "admin";
        token.isAdmin = true;
        console.log("JWT: Using fallback admin user");
      } else if (token.id) {
        // Fetch user data from database on subsequent requests
        try {
          if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
          }
          
          const userRepository = AppDataSource.getRepository(User);
          const dbUser = await userRepository.findOne({
            where: { id: token.id as string, isAdmin: true }
          });
          
          if (dbUser) {
            token.role = dbUser.role;
            token.isAdmin = dbUser.isAdmin;
          } else {
            // User is not admin, clear token
            return {};
          }
        } catch (error) {
          console.log("Database not available for JWT callback, using fallback");
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login?error=AccessDenied',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours for admin sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
};


