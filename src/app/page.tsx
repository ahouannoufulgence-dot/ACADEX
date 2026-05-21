import { redirect } from "next/navigation";

export default function Home() {
  // In a real app, check for actual session.
  // For now, redirect to login to show the requested interface.
  redirect("/login");
}