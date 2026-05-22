"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CourseProgramRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/schedule");
  }, [router]);

  return null;
}
