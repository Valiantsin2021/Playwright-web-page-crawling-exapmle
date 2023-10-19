// Your JSON data (replace with your data)
const jsonData = require('./4kf.json')

const itemsPerPage = 20 // 4 rows x 5 columns = 20 items per page
let currentPage = 1

function generatePage(pageNumber) {
  const contentContainer = document.getElementById('content')
  const start = (pageNumber - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pageData = jsonData.slice(start, end)

  contentContainer.innerHTML = ''

  const pageDiv = document.createElement('div')
  pageDiv.className = 'page'

  pageData.forEach(item => {
    const itemDiv = document.createElement('div')
    itemDiv.className = 'item'
    itemDiv.innerHTML = `<h3>${item.name}</h3><a href="${item.link}"><img src="${item.image}" alt="${item.name}"></a>`
    pageDiv.appendChild(itemDiv)
  })

  contentContainer.appendChild(pageDiv)
}

function generatePaginationButtons() {
  const paginationContainer = document.getElementById('pagination')
  const totalPages = Math.ceil(jsonData.length / itemsPerPage)

  paginationContainer.innerHTML = ''

  const maxButtons = 10 // Max number of buttons to show

  // Add a "First" button that goes to the first page
  if (currentPage > 1) {
    const firstButton = document.createElement('button')
    firstButton.textContent = 'First'
    firstButton.addEventListener('click', () => {
      currentPage = 1
      generatePage(1)
      generatePaginationButtons()
    })
    paginationContainer.appendChild(firstButton)
  }

  // Calculate the first and last page in the current set of 10 pages
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
  let endPage = Math.min(totalPages, startPage + maxButtons - 1)

  // Ensure we have exactly maxButtons or fewer buttons
  if (endPage - startPage + 1 > maxButtons) {
    startPage = endPage - maxButtons + 1
  }

  // Previous button
  if (currentPage > 1) {
    const previousButton = document.createElement('button')
    previousButton.textContent = 'Previous'
    previousButton.addEventListener('click', () => {
      currentPage--
      generatePage(currentPage)
      generatePaginationButtons()
    })
    paginationContainer.appendChild(previousButton)
  }

  // Numbered page buttons
  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button')
    button.textContent = '' + i
    button.addEventListener('click', () => {
      currentPage = i
      generatePage(i)
      generatePaginationButtons()
    })
    if (i === currentPage) {
      button.classList.add('active') // Highlight the current page
    }
    paginationContainer.appendChild(button)
  }

  // Next button
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button')
    nextButton.textContent = 'Next'
    nextButton.addEventListener('click', () => {
      currentPage++
      generatePage(currentPage)
      generatePaginationButtons()
    })
    paginationContainer.appendChild(nextButton)
  }

  // Last button
  if (endPage < totalPages) {
    const lastButton = document.createElement('button')
    lastButton.textContent = 'Last'
    lastButton.addEventListener('click', () => {
      currentPage = totalPages
      generatePage(totalPages)
      generatePaginationButtons()
    })
    paginationContainer.appendChild(lastButton)
  }
}

generatePage(currentPage)
generatePaginationButtons()
