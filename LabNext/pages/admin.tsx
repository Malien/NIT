import { NextPage } from "next";
import dynamic from "next/dynamic";
import { AuthPane, useAuth, Authed, AuthContext } from "../src/components/auth";
import { ThemeContext, LookContext } from "../src/components/style";
import { useTheme } from "../src/components/hooks";
import { useContext } from "react";

const AdminPanel = dynamic(() => import("../src/components/admin/index"), {loading: () => <>Loading...</>})

//TODO: Server-side render admin panel (auth user with refresh token if provided upon request)
const AdminPagePage: NextPage = () => {
    let auth = useAuth()
    let theme = useTheme()
    let look = useContext(LookContext)

    return <>
        <style global jsx>{`
            body {
                background-color: ${theme.backgroundColor};
                color: ${theme.textColor};
                font: ${look.font};
            }
        `}</style>
        <style jsx>{`
            
        `}</style>
        <ThemeContext.Provider value={theme}>
            <AuthContext.Provider value={auth}>
                <Authed admin 
                    fallback={<AuthPane onAuth={auth.login} />}
                    plebFallback={<>
                        You are not worthy
                        <AuthPane onAuth={auth.login} />
                        <button onClick={auth.logout}>logout</button>
                    </>}
                >
                    <button onClick={auth.logout}>logout</button>
                    <AdminPanel />
                </Authed>
            </AuthContext.Provider>
        </ThemeContext.Provider>
    </>
}

export default AdminPagePage