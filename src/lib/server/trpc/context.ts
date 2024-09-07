// lib/trpc/context.ts
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "../prisma";
import type { User } from "@prisma/client";
import crypto from "node:crypto";

export async function createContext(event: RequestEvent) {
	const auth = event.cookies.get("auth");

	let user: User | null = null;
	if (auth !== undefined) {
		const keyHash = crypto.createHash("sha256").update(auth).digest("base64");
		const session = await prisma.session.findUnique({
			where: { keyHash, expires: { gt: new Date() } },
			include: { user: true }
		});
		user = session?.user ?? null;
	}

	return {
		cookies: event.cookies,
		user
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
