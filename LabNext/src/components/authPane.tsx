import { useState } from "react"

interface AuthPaneProps {
    username?: string;
    password?: string;
    onAuth?: (name: string) => void;
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
                //TODO: auth user
                if (props.onAuth) props.onAuth(username);
            }}>
                <label htmlFor="auth-name">Username: </label>
                <input autoComplete="username" id="auth-name" type="text" placeholder="username" value={username} />
                <label htmlFor="auth-pass">Password: </label>
                <input autoComplete="current-password" id="auth-pass" type="password" placeholder="password" value={password} />
                <button type="submit">Log in</button>
            </form>
        </div>
    </>
}