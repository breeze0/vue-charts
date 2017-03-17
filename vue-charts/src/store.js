var STORAGE_KEY = 'todos-vuejs-2.0'
export default {
  fetch: function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

  },
  save: function (items) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}
