import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { config } from "../config/env";
import { UserRole } from "../constants/enums";
import type { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import type { LoginInput, RegisterInput } from "../validators/auth.validators";
import type { UserDocument } from "../modules/users/user.model";

export interface AuthUserResponse {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  borrowerProfile: UserDocument["borrowerProfile"];
}

export interface AuthResponse {
  user: AuthUserResponse;
  token: string;
}

export class AuthService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
      role: UserRole.BORROWER,
      isActive: true,
    });

    return {
      user: this.serializeUser(user),
      token: this.signToken(user),
    };
  }

  public async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(input.email, { includePassword: true });

    if (!user || !user.isActive) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    return {
      user: this.serializeUser(user),
      token: this.signToken(user),
    };
  }

  public async getCurrentUser(userId: string): Promise<AuthUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new AppError("User not found", 404);
    }

    return this.serializeUser(user);
  }

  private signToken(user: UserDocument): string {
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(
      {
        userId: String(user._id),
        role: user.role,
      },
      config.jwt.secret,
      options,
    );
  }

  private serializeUser(user: UserDocument): AuthUserResponse {
    return {
      id: String(user._id),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      borrowerProfile: user.borrowerProfile,
    };
  }
}
