// Backend/src/controller/google.controller.ts
import type { Request, Response } from "express";
import { getGoogleAuthUrl } from "../services/google.service.js";

export const googleLogin = (_req: Request, res: Response) => {
  const url = getGoogleAuthUrl();

  return res.redirect(url);
};