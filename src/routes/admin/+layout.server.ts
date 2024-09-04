import { createContext } from "$lib/server/trpc/context";
import { router } from "$lib/server/trpc/router";
import { t } from "$lib/server/trpc/t";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	event.depends("account:me");
	const me = await t
		.createCallerFactory(router)(await createContext(event))
		.account.me();

	if (me === null) redirect(307, "/account/login");

	return { me };
};
