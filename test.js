info = { '1': { 'len': 9 }, '2': { 'len': 8 } }
keys = Object.keys(info)

console.log(keys)
keys.sort(function cmp (a, b) {
  return info[ a ].len - info[ b ].len
})
console.log(keys)

