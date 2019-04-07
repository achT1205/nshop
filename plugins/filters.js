import Vue from 'vue'
Vue.filter('currency', (value) => {
  if (!value || isNaN(value)) value = 0
  const formater = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumIntegerDigits: 2
  })
  return formater.format(value)
})

Vue.filter('nl2br', (value) => {
  if (!value) return ''
  return value.replace(/\n/g, '<br>')
})
