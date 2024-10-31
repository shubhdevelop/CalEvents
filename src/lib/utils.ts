import { clsx, type ClassValue } from "clsx";
import { User } from "firebase/auth";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getToken(currentUser: User | null) {
  const token = await currentUser?.getIdToken();
  return token;
}
