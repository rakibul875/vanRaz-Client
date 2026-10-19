import { headers } from "next/headers";

import { redirect } from "next/navigation";
import { auth } from "../auth";

export const getUseSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
};

export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth/login");
  }

  // (session);
  return session?.session?.token;
};

export const requiredRole = async (role: "user") => {
  const user = await getUseSession();

  if (!user) {
    redirect("/auth/login");
  }

  if (user?.role !== role) {
    redirect("/unauthorize");
  }

  return user;
};
