import { NextPage } from "next";
import { AuthPane } from "../src/components/authPane";
import { useEffect } from "react";

const AdminPagePage: NextPage = () => {

    useEffect(() => {
//     fetch("/api/auth", {
//         method: "POST",
//         credentials: "include",
//         body: JSON.stringify({username: "user", password: "pass"}),
//         headers: {
//             "Content-Type":"application/json"
//         }
//     }).then(v => {
//         console.log(v.headers)
//         return v.json()
//     }).then(console.log)
//     .catch(console.error)
        fetch("/api/auth", {
            method: "POST", 
            credentials: "same-origin", 
            body: JSON.stringify({username: "admin", password:"admin"})
        })
        .then(r => r.json())
        .then(console.log)
        .catch(console.error)
    })

    return <>
        <style jsx>{`
            
        `}</style>
        <AuthPane onAuth={(username) => {
            
        }}/>
    </>
}

export default AdminPagePage