import express from "express";

import {
    getManager,
    createManager
} from "../controllers/managerController"


const router = express.Router();

router.get("/:cognitoId", getManager);
router.post("/", createManager);

export default router;