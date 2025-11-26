import {render} from 'preact';
import './index.css';
import { useEffect, useState } from 'preact/hooks';
import { chatService } from './server/ChatService';
import { Login } from './login/Login';
import { Main } from './chat/Main';
import "./server/Pwa";

function App(){
	let[renderCount, setRenderCount] = useState(1);
	useEffect( () => {
		const listener = () => setRenderCount(x => x + 1);
		chatService.addListener(listener);
		return () => chatService.removeListener(listener);
	}, [])
	return chatService.inbox ? <Main/> : <Login/>
}

render(<App/>, document.getElementById('app'));