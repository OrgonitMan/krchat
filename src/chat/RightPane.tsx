import { useState } from "preact/hooks";
import "./RightPane.css"
import { TextInputAndButton } from "../elements/TextInputAndButton";
import { chatService, ConversationDto } from "../server/ChatService";
import { MessageCard } from "./MessageCard";
import { IconButton } from "../elements/IconButton";

export function RightPane({ conversation, onBack }:
     { conversation?: ConversationDto, onBack: () => void }) {
    let [message, setMessage] = useState("");
    return <div class="RightPane">
        {!!conversation && <>
            <div class="conversation-header">
                <p>{conversation.name}</p>
                <IconButton iconName="arrow_back" buttonValue="Back" onClick={onBack}/>
            </div>
            <div class="messages">
                {conversation.lastMessages.map(x =>
                    <MessageCard key={x.timeStamp} message={x}
                        own={x.senderId === chatService.inbox.user.id} />
                )}
            </div>
            <TextInputAndButton value={message} onChange={setMessage} buttonContent="Send"
                placeholder="Write a message..." onClick={() => {
                    chatService.send({
                        type: "message", channelId: conversation.channelId,
                        referenceTo: 0, contentType: 0, content: message
                    });
                    setMessage("");
                }} />
        </>}
    </div>
}