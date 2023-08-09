import { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

export const prismaMock: PrismaClient = mockDeep<PrismaClient>();