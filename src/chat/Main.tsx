import { useState } from "preact/hooks";
import { ConversationDto } from "../server/ChatService"
import { LeftPane } from "./LeftPane"
import "./Main.css"
import { RightPane } from "./RightPane"

export function Main(){
    let[selected, setSelected] = useState<ConversationDto>();
    return <div class={"Main" + (selected === undefined ? " lef" : " right")}>
        <LeftPane selected={selected} onSelect={setSelected}/>
        <RightPane conversation={selected} onBack={ 
            () => setSelected(undefined)
        }/>
    </div>
}