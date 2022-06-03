import { createContext, useContext } from "react";

import type { Session } from "~/model/session";

export const SessionContext = createContext<Session | undefined>(undefined);

export const useSession = () => useContext(SessionContext);
