class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  say() {
    const sayStr = `Hello, my name is ${this.name}, ${this.age} years old! I'm Person`;
    console.log(sayStr);
  }
}

class Chinese extends Person {
  constructor(name, age) {
    super(name, age);
    this.country = 'Chinese';
  }

  say() {
    const sayStr = `Hello, my name is ${this.name}, ${this.age} years old! I'm ${this.country} Person`;
    console.log(sayStr);
  }
}