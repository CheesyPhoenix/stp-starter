// lib/trpc/client.ts
import type { Router } from "$lib/server/trpc/router";
import { redirect } from "@sveltejs/kit";
import { TRPCClientError, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

function wrapper(
	client: typeof browserClient,
	init?: TRPCClientInit & { url: { pathname: string } }
) {
	return async <T>(callback: (client: typeof browserClient) => T) => {
		try {
			return await callback(client);
		} catch (error) {
			if (
				error instanceof TRPCClientError &&
				error.data.code === "UNAUTHORIZED"
			) {
				redirect(
					307,
					`/account/login?callbackPath=${encodeURIComponent(init?.url.pathname ?? "/account")}`
				); // TODO: callback path
			}
			throw error;
		}
	};
}

export function trpc(init?: TRPCClientInit & { url: { pathname: string } }) {
	const isBrowser = typeof window !== "undefined";
	if (isBrowser && browserClient) return wrapper(browserClient, init);
	const client = createTRPCClient<Router>({
		links: [
			loggerLink({
				enabled: (opts) =>
					(process.env.NODE_ENV === "development" &&
						typeof window !== "undefined") ||
					(opts.direction === "down" && opts.result instanceof Error)
			}),
			httpBatchLink<Router>({
				url: init ? `${init.url.origin}/trpc` : `${location.origin}/trpc`,
				fetch: !isBrowser && init ? init.fetch : (init?.fetch ?? window.fetch)
			})
		]
	});
	if (isBrowser) browserClient = client;
	return wrapper(client, init);
}
