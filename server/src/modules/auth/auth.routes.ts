import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate-request";
import { loginSchema, registerSchema } from "../../validators/auth.validators";
import { login, me, register } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", validateRequest({ body: registerSchema }), register);
authRouter.post("/login", validateRequest({ body: loginSchema }), login);
authRouter.get("/me", authenticate, me);
