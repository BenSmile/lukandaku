import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId } = req.params;

        const tenant = await prisma.tenant.findUnique({
            where: { cognitoId },
            include: {
                favorites: true
            }
        });

        if (tenant) {
            res.json(tenant)
        } else {
            res.status(404).json({ "message": "Tenant not found" });
        }
    } catch (error: any) {
        console.log("Error when fetching tenant", error.message)
        res.status(500).json({ "message": `Error when fetching tenant ${error.message}` })
    }
}

export const createTenant = async (req: Request, res: Response): Promise<void> => {
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

