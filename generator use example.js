// @ts-ignore
import data from './kinozal.json'
function* infiniteNumbers(data, chunk) {
  let length = data.length
  let index = 0
  while (index < length) {
    const nextSet = data.slice(index, index + chunk)
    index += chunk
    yield nextSet
  }
}
const numbers = infiniteNumbers(data, 1000)

// User clicks "Next Page" on the blog
console.log(numbers.next()) // This will show the next 10 blog titles
console.log(numbers.next()) // This will show the next 10 blog titles
