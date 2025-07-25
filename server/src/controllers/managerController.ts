import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const getManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId } = req.params;

        const manager = await prisma.manager.findUnique({
            where: { cognitoId },
        });

        if (manager) {
            res.json(manager)
        } else {
            res.status(404).json({ "message": "Manager not found" });
        }
    } catch (error: any) {
        console.log("Error when fetching manager", error.message)
        res.status(500).json({ "message": `Error when fetching manager ${error.message}` })
    }
}

export const createManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId, name, email, phoneNumber } = req.body;

        const tenant = await prisma.tenant.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber
            }
        });

        res.status(201).json(tenant);
    } catch (error: any) {
        console.log("Error when creating tenant", error.message)
        res.status(500).json({ "message": `Error when creating tenant ${error.message}` })
    }
}

