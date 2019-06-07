import * as React from 'react'
import './stylus/App.styl'
import logo from './logo.svg'
import { Button } from "@material-ui/core"

import MyPixel from './MyPixel'
import anime from 'animejs'

class App extends React.Component {
	public raf: any
	public canvas: HTMLCanvasElement
	public mContext: CanvasRenderingContext2D
	public snakeMyPixels: MyPixel[] = [
		new MyPixel(25, 25),
		new MyPixel(25, 26),
		new MyPixel(25, 27)
	]
	public animation: anime.AnimeInstance
	public counter: HTMLParagraphElement
	public apple: MyPixel | null = null
	public canvasPixelsSize: number = 10
	public canvasPixels: number
	public directionCurrent: string = "up"
	public direction: string = "up"
	public loaded: boolean = false
	public colors = {
		background: "#1f5f1f",
		snake_HEAD: "#9f0f9f",
		snake_TAIL: "#4f9f9f",
		snake_TAIL_END: "#1e4495",
		apple: "#f33"
	}
	constructor(props: any) {
		super(props)
		// @ts-ignore
		window.components = window.components || {}
		// @ts-ignore
		window.components.App = this
		window.onload = () => { this.tick_main(); this.loaded = true }
		window.onkeypress = (event: KeyboardEvent) => {
			switch (event.key) {
				case "w":
					if (this.directionCurrent != "down") {
						this.directionCurrent = "up"
					}
					break
				case "s":
					if (this.directionCurrent != "up") {
						this.directionCurrent = "down"
					}
					break
				case "a":
					if (this.directionCurrent != "right") {
						this.directionCurrent = "left"
					}
					break
				case "d":
					if (this.directionCurrent != "left") {
						this.directionCurrent = "right"
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
					<h1 className="App-title">TypeScript + React + Hot reload (Slow) + Debug asa</h1>
				</header>
				<Button id="App-button" className="App-button" variant="contained" color="primary">Message</Button>
				<p ref={(node) => { this.counter = node as HTMLParagraphElement }} className="counter">0</p>
				<canvas ref={
					(node) => {
						this.canvas = node as HTMLCanvasElement
						this.mContext = this.canvas.getContext('2d') as CanvasRenderingContext2D
						this.canvasPixels = this.canvas.height / this.canvasPixelsSize || this.canvas.width / this.canvasPixelsSize
					}}
					id="App-canvas" width="500px" height="500px" />
			</div>
		);
	}
	public drawBackground() {
		this.mContext.fillStyle = this.colors.background
		this.mContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
	}
	public drawMyPixel(p: MyPixel, color: string) {
		this.mContext.fillStyle = color
		this.mContext.fillRect(p.x * this.canvasPixelsSize, p.y * this.canvasPixelsSize, this.canvasPixelsSize, this.canvasPixelsSize)
	}
	public drawSnake_HEAD(pixel: MyPixel) {
		this.drawMyPixel(pixel, this.colors.snake_HEAD)
	}
	public drawSnake_TAIL(pixel: MyPixel) {
		this.drawMyPixel(pixel, this.colors.snake_TAIL)
	}
	public drawSnake_TAIL_END(pixel: MyPixel) {
		this.drawMyPixel(pixel, this.colors.snake_TAIL_END)
	}
	public drawSnake() {
		for (let i = 0; i < this.snakeMyPixels.length; i++) {
			const pixel: MyPixel = this.snakeMyPixels[i];
			if (i == 0) {
				this.drawSnake_HEAD(pixel)
			} else if (i == this.snakeMyPixels.length - 1) {
				this.drawSnake_TAIL_END(pixel)
			} else {
				this.drawSnake_TAIL(pixel)
			}
		}
	}
	public drawApple() {
		if (this.apple != null) {
			this.drawMyPixel(this.apple as MyPixel, this.colors.apple)
		}
	}
	public GAMEOVER() {
		this.mContext.fillStyle = "#f00"
		// this.mContext.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2)
	}
	public thinkApple(generate?: boolean) {
		if (this.apple == null || generate) {
			while (this.apple == null || JSON.stringify(this.snakeMyPixels).includes(JSON.stringify(this.apple))) {
				this.apple = new MyPixel(Math.floor(Math.random() * this.canvasPixels), Math.floor(Math.random() * this.canvasPixels))
			}
		}
		if (JSON.stringify(this.snakeMyPixels).includes(JSON.stringify(this.apple))) {
			this.snakeMyPixels.push(JSON.parse(JSON.stringify(this.snakeMyPixels[this.snakeMyPixels.length - 1])))
			this.thinkApple(true)
			this.animation = this.animation || anime({
				targets: this.counter,
				rotate: '1turn',
				duration: 800,
				autoplay: false
			})
			this.animation.restart()
		}
	}
	public thinkSnake() {
		const oldMyPixels = JSON.parse(JSON.stringify(this.snakeMyPixels))
		this.direction = this.directionCurrent
		loop1:
		for (let i = 0; i < this.snakeMyPixels.length; i++) {
			if (this.direction == "") { break }
			const Mypixel = this.snakeMyPixels[i]
			if (i == 0) {
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
	public async tick_main() {
		await null
		this.thinkApple()
		this.thinkSnake()
		setTimeout(async () => {
			await this.tick_main()
		}, 60);
	}
	public tick_renderer(this: App, timestamp?: number) {
		if (this.loaded) {
			this.drawBackground()
			this.drawApple()
			this.drawSnake()
			this.counter.textContent = "Score: " + String(this.snakeMyPixels.length - 3)
		}
		this.raf = requestAnimationFrame((t) => { this.tick_renderer(t) })
		// this.mContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
		// this.mContext.fillStyle = "#000"
		// this.mContext.fillRect(Math.random() * 100, 0, 100, 100)
		// this.mContext.fillStyle = "#ff0"
		// this.mContext.fillText("SCP", 100, 100)

	}
	public componentDidMount() {
		this.raf = requestAnimationFrame((t) => { this.tick_renderer(t) })
	}
	public componentWillUnmount() {
		this.raf = cancelAnimationFrame(this.raf)
	}
}
export default App
