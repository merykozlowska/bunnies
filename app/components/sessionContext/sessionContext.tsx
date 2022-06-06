import { createContext, useContext } from "react";

import type { Session } from "~/model/session";

export const SessionContext = createContext<Session>({});

export const useSession = () => useContext(SessionContext);
