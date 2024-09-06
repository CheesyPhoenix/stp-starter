import prisma from "$lib/server/prisma";
import { hash, verify } from "argon2";
import { t } from "../t";
import { z } from "zod";
import crypto from "node:crypto";
import { authenticatedProcedure } from "../middleware";
import type { User } from "@prisma/client";

export async function newSession(user: User) {
	const key = crypto.randomBytes(64).toString("hex");
	const keyHash = crypto.createHash("sha256").update(key).digest("base64");

	const expires = new Date();
	expires.setDate(expires.getDate() + 7);

	await prisma.session.create({ data: { userId: user.id, keyHash, expires } });

	return { key, expires };
}

export const accountRouter = t.router({
	login: t.procedure
		.input(z.object({ email: z.string().email(), password: z.string() }))
		.mutation(async ({ input, ctx }) => {
			// DEMO CODE - REMOVE IN PRODUCTION
			if (input.email === "demo@stp-starter.cpnx.eu") {
				const user = await prisma.user.upsert({
					create: {
						name: "John Demo",
						email: "demo@stp-starter.cpnx.eu",
						passwordHash: "demo",
						isAdmin: true
					},
					update: { passwordHash: "demo", isAdmin: true },
					where: { email: "demo@stp-starter.cpnx.eu" }
				});

				const { key, expires } = await newSession(user);

				ctx.cookies.set("auth", JSON.stringify({ email: user.email, key }), {
					path: "/",
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					expires: expires
				});
				return { success: true } as const;
			}
			// DEMO CODE END

			const user = await prisma.user.findUnique({
				where: {
					email: input.email
				}
			});

			if (user === null)
				return {
					success: false,
					error: "Email or password is incorrect"
				} as const;

			if (!(await verify(user.passwordHash, input.password))) {
				return {
					success: false,
					error: "Email or password is incorrect"
				} as const;
			}

			const { key, expires } = await newSession(user);

			ctx.cookies.set("auth", JSON.stringify({ email: user.email, key }), {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				expires: expires
			});
			return { success: true } as const;
		}),
	register: t.procedure
		.input(z.object({ email: z.string().email(), password: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const existingUser = await prisma.user.findUnique({
				where: { email: input.email }
			});

			if (existingUser !== null) {
				return {
					success: false,
					error: "An account with this email address already exists"
				} as const;
			}

			if (input.password.length < 8)
				return {
					success: false,
					error: "Password is too short. A minimum of 8 characters are required"
				} as const;

			const passwordHash = await hash(input.password);
			const user = await prisma.user.create({
				data: {
					name: input.email,
					email: input.email,
					passwordHash
				}
			});

			const { key, expires } = await newSession(user);

			ctx.cookies.set("auth", JSON.stringify({ email: user.email, key }), {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				expires: expires
			});
			return { success: true } as const;
		}),
	logout: authenticatedProcedure.mutation(({ ctx }) => {
		ctx.cookies.delete("auth", { path: "/" });
	}),
	me: t.procedure.query(({ ctx }) => {
		if (ctx.user === null) return null;
		return {
			email: ctx.user.email,
			id: ctx.user.id,
			isAdmin: ctx.user.isAdmin,
			name: ctx.user.name
		};
	}),
	sessions: authenticatedProcedure.query(async ({ ctx }) => {
		return await prisma.session.findMany({
			where: { userId: ctx.user.id, expires: { gt: new Date() } },
			select: { id: true, expires: true, created: true }
		});
	}),
	updateProfile: authenticatedProcedure
		.input(z.object({ name: z.string(), email: z.string().email() }))
		.mutation(async ({ input, ctx }) => {
			return await prisma.user.update({
				where: { id: ctx.user.id },
				data: { email: input.email, name: input.name },
				select: { id: true, email: true, name: true, isAdmin: true }
			});
		})
});
