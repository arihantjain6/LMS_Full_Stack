import { UserRole } from "../constants/enums";
import { LoanModel } from "../modules/loans/loan.model";
import { UserModel, type UserDocument } from "../modules/users/user.model";
import type { BorrowerProfile, User } from "../modules/users/user.types";

export class UserRepository {
  public async create(data: Omit<User, "createdAt" | "updatedAt">): Promise<UserDocument> {
    return UserModel.create(data);
  }

  public async findByEmail(
    email: string,
    options: { includePassword?: boolean } = {},
  ): Promise<UserDocument | null> {
    const query = UserModel.findOne({ email: email.toLowerCase().trim() });

    if (options.includePassword) {
      query.select("+passwordHash");
    }

    return query.exec();
  }

  public async findById(userId: string): Promise<UserDocument | null> {
    return UserModel.findById(userId).exec();
  }

  public async updateBorrowerProfile(
    userId: string,
    borrowerProfile: BorrowerProfile,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $set: { borrowerProfile } },
      { new: true, runValidators: true },
    ).exec();
  }

  public async findBorrowersWithoutLoans(): Promise<UserDocument[]> {
    const borrowerIdsWithLoans = await LoanModel.distinct("borrower").exec();
    const filter = {
      _id: { $nin: borrowerIdsWithLoans },
      role: UserRole.BORROWER,
      isActive: true,
    };

    return UserModel.find(filter).sort({ createdAt: -1 }).exec();
  }
}
