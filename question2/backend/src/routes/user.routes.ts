import express from "express";
import { getTopUsersHandler } from "../controllers/user.controller";

const router = express.Router();

router.get("/users", getTopUsersHandler);

export default router;