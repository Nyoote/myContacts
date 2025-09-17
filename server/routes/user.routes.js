import { Router } from "express";
import { users } from "../controllers/user.controller.js";

const router = Router();

router.get("/users", users);

export default router;