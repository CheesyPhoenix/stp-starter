import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { trpc } from "$lib/trpc/client";

export const load: PageLoad = async (event) => {
	const { me } = await event.parent();

	if (me === null) redirect(307, "/account/login");

	return {
		me,
		sessions: await trpc(event)((client) => client.account.sessions.query())
	};
};
