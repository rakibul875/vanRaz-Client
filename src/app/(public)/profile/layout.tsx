"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login?callbackUrl=/profile");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
