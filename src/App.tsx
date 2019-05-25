import * as React from 'react'
import './css/App.css'
import logo from './logo.svg'
import { Button } from "@material-ui/core"

import MyPixel from './MyPixel'
import anime from 'animejs'

class App extends React.Component {
	public raf: any
	public canvas: HTMLCanvasElement
	public mContext: CanvasRenderingContext2D
	public snakeMyPixels = [
		new MyPixel(25, 25),
		new MyPixel(25, 26),
		new MyPixel(25, 27)
	]
	public animation : anime.AnimeInstance
	public counter:HTMLParagraphElement
	public apple: MyPixel | null = null
	public canvasPixelsSize: number = 10
	public canvasPixels: number
	public direction:string = "up" //up right down left
	constructor(props: any) {
		super(props)
		// @ts-ignore
		window.components = window.components || {}
		// @ts-ignore
		window.components.App = this
		window.onkeypress = (event: KeyboardEvent) => {
			switch (event.key) {
				case "w":
					if (this.direction !== "down") {
						this.direction = "up"
					}
					break
				case "s":
					if (this.direction !== "up") {
						this.direction = "down"
					}
					break
				case "a":
					if(this.direction!=="right"){
						this.direction = "left"
					}
					break
				case "d":
					if(this.direction!=="left"){
						this.direction = "right"
					}
					break
			}
		}
	}
	public render() {
		return (
			<div className="App" id="App">
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">TypeScript + React + Hot reload (Slow) + Debug</h1>
				</header>
				<Button id="App-button" className="App-button" variant="contained" color="primary">Message</Button>
				<p ref={(node)=>{this.counter = node as HTMLParagraphElement}} className="counter">0</p>
				<canvas ref={(node) => { this.canvas = node as HTMLCanvasElement; this.mContext = this.canvas.getContext('2d') as CanvasRenderingContext2D; this.canvasPixels = this.canvas.height / this.canvasPixelsSize || this.canvas.width / this.canvasPixelsSize }} id="App-canvas" width="500px" height="500px" />
			</div>
		);
	}
	public drawBackground() {
		this.mContext.fillStyle = "#1f5f1f"
		this.mContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}
	public drawMyPixel(p: MyPixel, color: string) {
		this.mContext.fillStyle = color
		this.mContext.fillRect(p.x * this.canvasPixelsSize, p.y * this.canvasPixelsSize, this.canvasPixelsSize, this.canvasPixelsSize)
	}
	public drawSnake() {
		this.snakeMyPixels.forEach((Mypixel) => {
			this.drawMyPixel(Mypixel, "#4f9f9f")
		});
	}
	public GAMEOVER() {
		this.mContext.fillStyle = "#f00"
		// this.mContext.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2)
	}
	public thinkApple() {
		
		if (this.apple === null) {
			while (this.apple === null || JSON.stringify(this.snakeMyPixels).includes(JSON.stringify(this.apple))) {
				this.apple = new MyPixel(Math.floor(Math.random() * this.canvasPixels), Math.floor(Math.random() * this.canvasPixels))
			}
		}
		this.drawMyPixel(this.apple as MyPixel, "#f33")
		if (JSON.stringify(this.snakeMyPixels).includes(JSON.stringify(this.apple))) {
			this.snakeMyPixels.push(JSON.parse(JSON.stringify(this.snakeMyPixels[this.snakeMyPixels.length - 1])))
			this.apple = null
			this.animation = this.animation || anime({
				targets: this.counter,
				rotate: '1turn',
				duration: 800,
			})
			this.animation.restart()
		}
	}
	public thinkSnake() {
		const oldMyPixels = JSON.parse(JSON.stringify(this.snakeMyPixels))
		loop1:
		for (let i = 0; i < this.snakeMyPixels.length; i++) {
			if (this.direction === "") { break }
			const Mypixel = this.snakeMyPixels[i]
			if (i === 0) {
				switch (this.direction) {
					case "up":
						if (Mypixel.y - 1 < 0) {
							this.GAMEOVER()
							break loop1
						} else {
							Mypixel.y -= 1
						}
						break
					case "down":
						if (Mypixel.y + 1 >= this.canvas.height / this.canvasPixelsSize) {
							this.GAMEOVER()
							break loop1
						} else {
							Mypixel.y += 1
						}
						break
					case "left":
						if (Mypixel.x - 1 < 0) {
							this.GAMEOVER()
							break loop1
						} else {
							Mypixel.x -= 1
						}
						break
					case "right":
						if (Mypixel.x + 1 >= this.canvas.width / this.canvasPixelsSize) {
							this.GAMEOVER()
							break loop1
						} else {
							Mypixel.x += 1
						}
						break
				}
			} else {
				Mypixel.x = oldMyPixels[i - 1].x
				Mypixel.y = oldMyPixels[i - 1].y
			}
		}
	}
	public update(this: App, timestamp?: number) {
		this.drawBackground()
		this.thinkApple()
		this.thinkSnake()
		this.drawSnake()
		this.counter.textContent = "Score: " + String(this.snakeMyPixels.length-3)
		setTimeout(() => {
			this.raf = requestAnimationFrame((t) => { this.update(t) })
		}, 60);
		// this.mContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
		// this.mContext.fillStyle = "#000"
		// this.mContext.fillRect(Math.random() * 100, 0, 100, 100)
		// this.mContext.fillStyle = "#ff0"
		// this.mContext.fillText("SCP", 100, 100)

	}
	public componentDidMount() {
		this.raf = requestAnimationFrame((t) => { this.update(t) })
	}
	public componentWillUnmount() {
		this.raf = cancelAnimationFrame(this.raf)
	}
}
export default App