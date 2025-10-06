import { Router } from "express";
import { users } from "../controllers/user.controller.js";

const router = Router();

router.get("/getUsers", users);

export default router;