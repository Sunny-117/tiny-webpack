import { flatten, concat } from 'lodash'
// ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
// import flatten from 'lodash/flatten'
console.log(flatten, concat)
const res = flatten([1, 2, [1, 2, 2]])
console.log(concat(res, [1, 1, 9, 0]))
