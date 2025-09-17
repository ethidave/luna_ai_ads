import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AppDataSource } from './database';
import { User } from './entities/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
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
          return {
            id: "00000000-0000-0000-0000-000000000001",
            email: "admin@lunaai.com",
            name: "Admin User",
            image: null,
            role: "admin",
            isAdmin: true,
          };
        }

        // Try database authentication
        try {
          if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
          }

          const userRepository = AppDataSource.getRepository(User);

          // Email/password login
          const user = await userRepository.findOne({ 
            where: { email: credentials.email } 
          });

          if (!user || !user.password) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.log("Database authentication failed:", error.message);
          // Database failed, but we already checked for admin user above
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

      // For database users, try to update last login
      try {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }

        const userRepository = AppDataSource.getRepository(User);

        if (account?.provider === 'credentials') {
          // Credentials login - user is already validated in the credentials provider
          const existingUser = await userRepository.findOne({
            where: { email: user.email! }
          });

          if (existingUser) {
            // Update last login
            existingUser.lastLoginAt = new Date();
            await userRepository.save(existingUser);
          }
        }
      } catch (error) {
        console.log("Database not available for signIn callback, using fallback");
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin || user.role === 'admin';
      } else if (token.id === "00000000-0000-0000-0000-000000000001") {
        // Handle fallback admin user
        token.role = "admin";
        token.isAdmin = true;
      } else if (token.id && token.id !== "00000000-0000-0000-0000-000000000001") {
        // Fetch user data from database on subsequent requests (skip admin user)
        try {
          if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
          }
          
          const userRepository = AppDataSource.getRepository(User);
          const dbUser = await userRepository.findOne({
            where: { id: token.id as string }
          });
          
          if (dbUser) {
            token.role = dbUser.role;
            token.isAdmin = dbUser.isAdmin || dbUser.role === 'admin';
          }
        } catch (error) {
          // Database not available, use fallback
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
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

