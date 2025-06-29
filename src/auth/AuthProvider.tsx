import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState();

  const contextValue = useMemo(() => ({
      token,
      setToken,
    }), [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
