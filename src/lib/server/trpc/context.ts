// lib/trpc/context.ts
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
import prisma from "../prisma";
import type { User } from "@prisma/client";
import crypto from "node:crypto";

const authCookieShape = z.object({
	email: z.string().email(),
	key: z.string()
});

export async function createContext(event: RequestEvent) {
	const authCookie = event.cookies.get("auth");
	let auth: null | z.infer<typeof authCookieShape> = null;
	if (authCookie !== undefined) {
		const authParse = authCookieShape.safeParse(JSON.parse(authCookie));
		if (authParse.success) {
			auth = authParse.data;
		}
	}

	let user: User | null = null;
	if (auth !== null) {
		const keyHash = crypto
			.createHash("sha256")
			.update(auth.key)
			.digest("base64");
		const session = await prisma.session.findUnique({
			where: { keyHash },
			include: { user: true }
		});
		user = session?.user ?? null;
	}

	return {
		cookies: event.cookies,
		user
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
