import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
	return {
		users: await trpc(event)((client) => client.admin.users.query())
	};
};
