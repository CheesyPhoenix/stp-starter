import { accountRouter } from "./routes/account";
import { adminRouter } from "./routes/admin";
import { t } from "./t";

export const router = t.router({
	account: accountRouter,
	admin: adminRouter
});

export type Router = typeof router;
