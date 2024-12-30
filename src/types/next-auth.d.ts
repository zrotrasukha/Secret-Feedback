import "next-auth";
import NextAuth, { DefaultSession } from "next-auth";

declare module NextAuth {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: Boolean;
    username?: string;
  }
  // interface session {
  //   user: {
  //     _id?: string;
  //     isVerified?: boolean;
  //     isAcceptingMessage?: Boolean;
  //     username?: string;
  //   } & DefaultSession["user"];
  // }
}
