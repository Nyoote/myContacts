import { Router } from "express";
import {helloWorld} from "../controllers/defaultApp.controller.js";

const router = Router();

router.get("/", helloWorld);

export default router;
