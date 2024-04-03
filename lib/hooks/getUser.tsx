import { currentUser } from "@clerk/nextjs";

export default async function getUser() {
  const user = await currentUser();
  return user;
}
