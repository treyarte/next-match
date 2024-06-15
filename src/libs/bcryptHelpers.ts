
import bcrypt from 'bcryptjs';

/**
 * wrapper for bcrypt to hash are password so if we need to make 
 * changes we can make them in one spot. 
 * i.e: one day we may need to change the amount of rounds
 * @param password 
 * @returns 
 */
export async function hashPassword(password:string) : Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
} 