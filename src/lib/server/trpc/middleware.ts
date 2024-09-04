import { TRPCError } from "@trpc/server";
import { t } from "./t";

export const authenticatedProcedure = t.procedure.use(({ ctx, next }) => {
	if (ctx.user === null) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
	if (ctx.user === null) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	if (!ctx.user.isAdmin) {
		throw new TRPCError({ code: "FORBIDDEN" });
	}

	return next({ ctx: { ...ctx, user: ctx.user } });
});
