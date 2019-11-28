import { useState, useEffect, createContext, useContext } from "react"
import { deploymentPrefix, TokenInfo } from "../shared/components"
import decode from "jwt-decode";

interface AuthPaneProps {
    username?: string;
    password?: string;
    onAuth?: (name: string, password: string) => void;
}
export const AuthPane: React.FC<AuthPaneProps> = props => {
    let [username, setUsername] = useState(props.username || "")
    let [password, setPassword] = useState(props.password || "")

    return <>
        <style jsx>{`
            
        `}</style>
        <div className="container">
            <form autoComplete="on" onSubmit={(e) => {
                e.preventDefault()
                if (props.onAuth) props.onAuth(username, password);
            }}>
                <label htmlFor="auth-name">Username: </label>
                <input
                    autoComplete="username"
                    id="auth-name"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
                <label htmlFor="auth-pass">Password: </label>
                <input
                    autoComplete="current-password"
                    id="auth-pass"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <button type="submit">Log in</button>
            </form>
        </div>
    </>
}

export const AuthContext = createContext<AuthInfo | null>(null)

export interface AuthState {
    needsLogin: boolean;
    accessToken?: string;
    tokenInfo?: TokenInfo;
    invalid?: boolean;
}
export interface AuthInfo {
    token: AuthState;
    login: (username: string, password: string) => void;
    logout: () => Promise<any>;
}
export function useAuth(): AuthInfo {
    let [token, setToken] = useState<AuthState>({ needsLogin: false })
    let timeoutID: any | undefined

    function resolveToken(v: any) {
        if (v.errror || !v.accessToken) {
            setToken({ needsLogin: true })
        } else {
            let { exp, iat, ...tokenInfo } = decode<TokenInfo>(v.accessToken)
            exp *= 1000
            if (Date.now() >= exp) {
                setToken({ needsLogin: true })
                throw new Error("Recieved already expired token")
            }
            setToken({ needsLogin: false, accessToken: v.accessToken, tokenInfo })
            timeoutID = setTimeout(refreshAfterInvalid, exp - Date.now())
        }
    }

    function refreshAfterInvalid() {
        fetch(`${deploymentPrefix}/api/refresh`, {
            method: "POST",
            credentials: "same-origin"
        })
            .then(v => v.json())
            .then(resolveToken).catch(console.error)
    }

    function login(username: string, password: string) {
        fetch("/api/auth", {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify({ username, password })
        })
            .then(r => r.json())
            .then(resolveToken)
            .catch(console.error)
    }

    function logout() {
        clearTimeout(timeoutID)
        setToken({ needsLogin: true })
        return fetch("/api/invalidate", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        })
    }

    useEffect(() => {
        refreshAfterInvalid()
        return (() => clearTimeout(timeoutID))
    }, [])

    return { token, login, logout }
}

interface AuthedProps {
    admin?: boolean;
    fallback?: React.ReactNode;
    plebFallback?: React.ReactNode;
    reloginFallback?: React.ReactNode;
}
export const Authed: React.FC<AuthedProps> = props => {
    let auth = useContext(AuthContext)
    if (!auth) {
        console.warn("Authed component used where AuthContext is not available")
        return <>{props.fallback}</>
    }
    let { token } = auth
    if (!token) return <>{props.fallback}</>
    if (token.needsLogin) return <>{props.reloginFallback ? props.reloginFallback : props.fallback}</>
    if (!token.tokenInfo || !token.accessToken) return <>{props.fallback}</>
    if (props.admin && !token.tokenInfo) return <>{props.plebFallback ? props.plebFallback : props.fallback}</>
    return <>{props.children}</>
}