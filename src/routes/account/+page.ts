import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
	const { me } = await event.parent();

	if (me === null) redirect(307, "/account/login");

	return { me };
};
