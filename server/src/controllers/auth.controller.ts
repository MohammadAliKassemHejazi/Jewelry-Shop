import {  Response } from "express";
import { userService } from "../services";
import {
  IAuthLoginBodyRequest,
  IAuthRegisterBodyRequest,
} from "../interfaces/types/controllers/auth.controller.types";
import authErrors from "../utils/errors/auth.errors";

import { IUserAttributes } from "../interfaces/types/models/user.model.types";
import { CustomRequest } from '../interfaces/types/middlewares/request.middleware.types';

export const handleLogin = async (request: IAuthLoginBodyRequest, response: Response,next:any) => {
  const { email, password } = request.body;
  try {
    const login = await userService.userLogin(email, password);
    // Set cookie
    response.cookie("accessToken", login.accessToken, {
      maxAge: 3600 * 30 * 1000,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    response.json({ success: true, user: login, message: "Login successful" });
  } catch (error: any) {
    next(error);
  }
};

export const handleRegister = async (
  request: IAuthRegisterBodyRequest,
  response: Response,
  next:any
): Promise<void> => {
  const { email, password, name, surname, address, phone } = request.body;
  try {
    await userService.createUser({
      email,
      password,
      name,
      surname,
      address,
      phone,
    });
    // Auto login after register
    const login = await userService.userLogin(email, password);
    response.cookie("accessToken", login.accessToken, {
      maxAge: 3600 * 30 * 1000,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    response.status(201).json({ success: true, user: login, message: "Registration successful" });
  } catch (error: any) {
    next(error);
  }
};

export const isAuthenticated = async (
  request: CustomRequest,
  response: Response,
  next:any,
): Promise<void> => {
  try {
    const UserId = request.UserId; // Accessible via middleware
    if (!UserId) {
      response.json({ success: false, user: null, message: "Not authenticated" });
      return;
    }
    const userSession = await userService.userSession(UserId);
    response.json({ success: true, user: userSession });
  } catch(e) {
    response.json({ success: false, user: null, message: "Session expired" });
  }
};

export const loggedOut = async (
  request: CustomRequest,
  response: Response
): Promise<void> => {
  response.clearCookie("accessToken", { path: "/" });
  response.json({ success: true, message: "Logged out successfully" });
};

export default {
  handleLogin,
  handleRegister,
  isAuthenticated,
  loggedOut,
};
