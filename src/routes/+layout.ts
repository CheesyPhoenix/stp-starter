import { trpc } from "$lib/trpc/client";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
	event.depends("account:me");

	return { me: await trpc(event)((client) => client.account.me.query()) };
};
