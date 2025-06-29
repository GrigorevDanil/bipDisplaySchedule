import { NextRequest } from "next/server";


type Credentials = {
  username: string;
  password: string;
};

export const getCredentials = (
  request: NextRequest
): Credentials | undefined => {
  const username = request.cookies.get("username")?.value;
  const password = request.cookies.get("password")?.value;

  if (!username || !password) return;

  return { username: username, password: password };
};
