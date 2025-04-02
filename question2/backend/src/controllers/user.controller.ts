import { Request, Response } from "express";
import { getTopUsers } from "../services/user.service";

export const getTopUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await getTopUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};