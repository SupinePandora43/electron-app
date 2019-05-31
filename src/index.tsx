import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './stylus/index.styl';
import registerServiceWorker from './registerServiceWorker';
import anime from 'animejs'

ReactDOM.render(
	<App />,
	document.getElementById('root') as HTMLElement
)

anime({
	targets: '.App-logo',
	rotate: [0, 360],
	loop: true,
	delay: 0,
	duration: 30000,
	easing: 'linear'
})

registerServiceWorker();