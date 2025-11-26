import { WebSocketServer } from "ws";

const users = []; // in-memory users
const conversations = []; // in-memory conversations

let userIdCounter = 1;
let convIdCounter = 1;
let messageIdCounter = 1;

const wss = new WebSocketServer({ port: 3000 });
console.log("WebSocket server running on ws://localhost:3000");

wss.on("connection", ws => {
    console.log("Client connected");

    ws.on("message", data => {
        const packet = JSON.parse(data);

        switch (packet.type) {
            case "register":
                if (users.find(u => u.email === packet.email)) {
                    ws.send(JSON.stringify({ type: "error", message: "Email already registered" }));
                    break;
                }

                const newUser = {
                    id: (userIdCounter++).toString(),
                    displayName: packet.displayName,
                    tag: packet.email,
                    email: packet.email,
                    password: packet.password,
                    lastSeen: new Date().toISOString()
                };
                users.push(newUser);

                // FIX HERE
                ws.user = newUser;  //  ← IMPORTANT

                ws.send(JSON.stringify({
                    type: "login",
                    query: newUser.email,
                    token: "dummy-token",
                    inbox: { user: newUser, contacts: [], conversations: [] }
                }));
                break;


            case "login": {
                const user = users.find(u => u.email === packet.email && u.password === packet.password);
                if (!user) {
                    ws.send(JSON.stringify({ type: "error", message: "Invalid login" }));
                    break;
                }

                ws.user = user;

                // personalize conversation names for this user
                const personalizedConvos = conversations.map(conv => {
                    if (conv.memberIds.length === 2) {
                        const otherId = conv.memberIds.find(id => id !== user.id);
                        const otherUser = users.find(u => u.id === otherId);
                        return { ...conv, name: otherUser?.displayName ?? "Unknown" };
                    }
                    return conv; // group chat name stays as-is
                });

                ws.send(JSON.stringify({
                    type: "login",
                    query: user.email,
                    token: "dummy-token",
                    inbox: {
                        user,
                        contacts: users.filter(u => u.id !== user.id),
                        conversations: personalizedConvos
                    }
                }));
                break;
            }



            case "contactRequest": {
                const contactUser = users.find(u => u.email === packet.email);
                if (!contactUser) {
                    ws.send(JSON.stringify({ type: "error", message: "Contact not found" }));
                    break;
                }

                const helloMessage = {
                    id: messageIdCounter++,
                    timeStamp: new Date().toISOString(),
                    referenceTo: 0,
                    senderId: ws.user.id,
                    contentType: 0,
                    content: packet.firstMessage
                };

                const newConv = {
                    channelId: (convIdCounter++).toString(),
                    parentChannelId: "",
                    description: "",
                    data: "",
                    state: 0,
                    access: 2,
                    notificationLevel: 1,
                    unreadCount: 0,
                    memberIds: [contactUser.id, ws.user.id],
                    lastMessages: [helloMessage] // include Hello here
                };

                conversations.push(newConv);

                // Send to sender
                ws.send(JSON.stringify({
                    type: "conversationAdded",
                    conversation: {
                        ...newConv,
                        name: contactUser.displayName
                    }
                }));

                // Send to receiver if connected
                wss.clients.forEach(client => {
                    if (client.readyState === 1 && client.user?.id === contactUser.id) {
                        client.send(JSON.stringify({
                            type: "conversationAdded",
                            conversation: {
                                ...newConv,
                                name: ws.user.displayName
                            }
                        }));
                    }
                });

                break;
            }




            case "message": {
                const conv = conversations.find(c => c.channelId === packet.channelId);
                if (!conv) break;

                const msg = {
                    id: messageIdCounter++,
                    timeStamp: new Date().toISOString(),
                    referenceTo: packet.referenceTo,
                    senderId: packet.senderId,
                    contentType: packet.contentType,
                    content: packet.content
                };

                // immutably update lastMessages
                conv.lastMessages = [...conv.lastMessages, msg];

                // send a copy of the conversation or at least a new lastMessages array
                wss.clients.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({
                            type: "message",
                            channelId: conv.channelId,
                            message: msg,                // existing message
                            lastMessages: conv.lastMessages // <<< send full array
                        }));
                    }
                });
                break;
            }

        }
    });
});
