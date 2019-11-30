import { NextPage } from "next";
import dynamic from "next/dynamic";
import { AuthPane, useAuth, Authed, AuthContext } from "../src/components/auth";

const AdminPanel = dynamic(() => import("../src/components/adminPanel"), {loading: () => <>Loading...</>})

//TODO: Server-side render admin panel (auth user with refresh token if provided upon request)
const AdminPagePage: NextPage = () => {
    let auth = useAuth()

    return <>
        <style jsx>{`
            
        `}</style>
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
    </>
}

export default AdminPagePage