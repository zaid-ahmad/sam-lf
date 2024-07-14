import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaEdgeSingleton = () => {
    new PrismaClient().$extends(withAccelerate());
};

if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = prismaEdgeSingleton();
}

const prisma = globalThis.prismaGlobal;

export default prisma;

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}
