let name = '1';
let age = '12';
if (Math.random() > 0.1) {
    name = '2'
    age = 'age'
}
const a = `${name}-${age}`;
const demo = () => {
    // 副作用标记？
    window.demo = 'demo';
    return a;
}
console.log(a)

class Demo {
    age = 10
    constructor() {
        this.age = 18
    }
    md() {
        return 'md'
    }
}

const x = new Proxy({}, {
    get(target, key, rev) {

    }
})
console.log(x)