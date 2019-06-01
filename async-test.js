console.log(1);
async function test1() {
	//await {then: resolve=>resolve()} //будет выполнена перед другими функциями
	for (let i = 0; i < 100; i++) {
		//await null //выполнена в конце всех
	}
	console.log(2);
}
async function test2() {
	await { then: resolve => resolve() }
	console.log(3);
}
async function test3() {
	await { then: resolve => resolve() }
	console.log(4);
}
test1()
test2()
test3()
console.log(5);