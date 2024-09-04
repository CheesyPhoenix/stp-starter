import prisma from "$lib/server/prisma";
import { z } from "zod";
import { adminProcedure } from "../middleware";
import { t } from "../t";

export const adminRouter = t.router({
	users: adminProcedure.query(async () => {
		return await prisma.user.findMany({
			select: { email: true, id: true, isAdmin: true }
		});
	}),
	overview: adminProcedure.query(async () => {
		return {
			userCount: await prisma.user.count()
		};
	})
});
