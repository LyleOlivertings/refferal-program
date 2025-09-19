import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";


// Your existing authOptions are now placed inside the NextAuth() call
export const { 
  handlers: { GET, POST }, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        await connectMongoDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        // Return user object without the password
        return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    // --- REPLACE the old redirect callback with this one ---
    redirect: async ({ url, token, baseUrl }) => {
      // url is the intended redirect URL, baseUrl is the base URL of the app
      
      // If the user is authenticated (token exists), decide where they should go
      if (token) {
        if (token.role === 'admin') {
          return `${baseUrl}/admin/dashboard`;
        }
        if (token.role === 'agent') {
          return `${baseUrl}/agent/dashboard`;
        }
      }

      // If there's no token (e.g., on sign-out) or no specific role redirect,
      // check if the user was trying to go somewhere specific.
      // Otherwise, fall back to the login page.
      return url.startsWith(baseUrl) ? url : baseUrl + '/login';
    },
  },
});