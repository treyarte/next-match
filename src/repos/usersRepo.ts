import { RegisterSchema } from "@/app/schemas/registerSchema";
import { hashPassword } from "@/libs/bcryptHelpers";
import { prisma } from "@/libs/prisma"
import { User } from "@prisma/client";

/**
 * Finds a user by their user id
 * @param id 
 * @returns 
 */
export async function getUserById(id:string):Promise<User|null> {
  return await prisma.user.findUnique({
    where:{id}
  });
}

/**
 * Finds a user by their email
 * @param email 
 * @returns 
 */
export async function getUserByEmail(email:string):Promise<User|null> {
  return await prisma.user.findUnique({
    where:{email}
  });
}

/**
 * Checks if a user with the passed in email already exists
 * @param email 
 * @returns 
 */
export async function checkEmailInUse(email:string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where:{email}
  });

  return user != null;
}

/**
 * Creates a new user in our database
 * @param data 
 * @returns 
 */
export async function createUser(data:RegisterSchema): Promise<User> {
  const {email, name, password, gender, city, country, dateOfBirth, description} = data;

  const passwordHash = await hashPassword(password);

  return await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      profileComplete: true,
      member: {
        create: {
          name,
          gender,
          description,
          city,
          country,
          dateOfBirth: new Date(dateOfBirth)
        }
      }
    }
  });
}