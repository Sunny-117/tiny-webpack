document.querySelector('.btn').addEventListener('click', () => {
  import(/* webpackChunkName: 'c-title' */'./aaa').then(res=>{
    console.log(res)
  })
})

document.querySelector('.btn').addEventListener('click', () => {
  import(/* webpackChunkName: 'c-title' */'./title').then(res=>{
    console.log(res)
  })
})