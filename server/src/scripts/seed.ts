import bcrypt from "bcryptjs";

import { connectDatabase, disconnectDatabase } from "../config/database";
import { logger } from "../config/logger";
import { UserRole } from "../constants/enums";
import { UserModel } from "../modules/users/user.model";

const seedUsers = [
  { email: "admin@test.com", role: UserRole.ADMIN },
  { email: "sales@test.com", role: UserRole.SALES },
  { email: "sanction@test.com", role: UserRole.SANCTION },
  { email: "disbursement@test.com", role: UserRole.DISBURSEMENT },
  { email: "collection@test.com", role: UserRole.COLLECTION },
  { email: "borrower@test.com", role: UserRole.BORROWER },
] as const;

async function seed(): Promise<void> {
  await connectDatabase();

  const passwordHash = await bcrypt.hash("Password@123", 12);

  for (const user of seedUsers) {
    await UserModel.updateOne(
      { email: user.email },
      {
        $set: {
          email: user.email,
          role: user.role,
          isActive: true,
          passwordHash,
        },
      },
      { upsert: true, runValidators: true },
    ).exec();
  }

  logger.info({ count: seedUsers.length }, "Seed users upserted");
}

void seed()
  .catch((error: unknown) => {
    logger.error({ error }, "Seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
