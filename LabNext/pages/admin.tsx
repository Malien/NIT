import { NextPage } from "next";
import { AuthPane, useAuth, Authed, AuthContext } from "../src/components/auth";

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
                Congrats
                <button onClick={auth.logout}>logout</button>
            </Authed>
        </AuthContext.Provider>
    </>
}

export default AdminPagePage