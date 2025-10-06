import {Router} from "express";
import {addContact, deleteContact, getContacts, updateContact} from "../controllers/contact.controller.js";
import {requireAuth} from "../middleware/requireAuth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/getContacts", getContacts)
router.post("/addContact", addContact)
router.patch("/updateContact/:id", updateContact)
router.delete("/deleteContact/:id", deleteContact)

export default router;
