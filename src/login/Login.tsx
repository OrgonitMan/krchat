import { useState } from "preact/hooks";
import "./Login.css"
import { chatService } from "../server/ChatService";
import { TextInput } from "../elements/TextInput";
import { IconButton } from "../elements/IconButton";


export function Login() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [displayName, setDisplayName] = useState("");
    let [register, setRegister] = useState(false);
    function loginRegister() {
        if (register)
            chatService.send({ type: "register", email, password, displayName, staySignedIn: true });
        else
            chatService.send({ type: "login", email, password, staySignedIn: true })
    }
    return <div class="Login">
        <span class="logo" onClick={() => {
            document.documentElement.classList.toggle("theme-light");
        }}>🗪</span>
        <TextInput type="email" placeholder="Email(someone@example.com)"
            value={email} onChange={setEmail} autofocus={true} onEnter={loginRegister} />
        <TextInput type="password" placeholder="Password"
            value={password} onChange={setPassword} onEnter={loginRegister} />
        {register && <TextInput type="text" placeholder="Display Name (Agent Smith)"
            value={displayName} onChange={setDisplayName} onEnter={loginRegister} />}
        <IconButton iconName="login" buttonValue={register ? "Register" : "Login"}
            onClick={loginRegister} />
        <p>
            {register ? "Switch back to " : "Have no account yet? Go and "}
            <a href="" onClick={e => {
                e.preventDefault();
                setRegister(!register);
            }}>
                {register ? "Login" : "Register"}
            </a>
        </p>
    </div>
}