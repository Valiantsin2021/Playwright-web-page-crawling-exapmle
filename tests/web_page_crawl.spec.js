import { test, expect } from '@playwright/test'
import fs from 'fs'
test.only(`crawl kinozal.tv 4k movies via ui 50 links per page with batch requests via Promise.all() and writable stream`, async ({
  page,
  request
}) => {
  test.setTimeout(1_600_000)
  const writableStream = fs.createWriteStream('./kinozal.json', 'ascii')
  writableStream.on('error', error => {
    console.log(`An error occured while writing to the file. Error: ${error.message}`)
  })
  writableStream.write('[')
  await page.goto('https://kinozal.tv/browse.php?s=&g=0&c=0&v=7&d=0&w=0&t=0&f=0')
  let tempObjArr = []
  async function crawl() {
    const elements = await page.locator('td.nam a').all()
    for (let el of elements) {
      const link = `https://kinozal.tv${await el.getAttribute('href')}`
      tempObjArr.push(link)
      console.log(link)
      if (tempObjArr.length % 1000 === 0) {
        const requests = tempObjArr.map(link => request.get(link))
        const responses = await Promise.all(requests)
        for (let body of responses) {
          try {
            // @ts-ignore
            const name = (await body.text()).match(/<a href=".*"?id=\d{4,}" class=".*">([^<]+)<\/a>/)[1]
            // @ts-ignore
            let img = (await body.text()).match(/<img[^>]* src="([^"]*)" class="p200"[^>]*alt="">/)[1]
            if (img[0] === '/') {
              img = `https://kinozal.tv${img}`
            }
            writableStream.write(JSON.stringify({ ['name']: name, ['link']: body.url(), ['image']: img }))
            writableStream.write(',')
          } catch (err) {
            console.log('error in response for ' + body.url(), err)
          }
        }
        tempObjArr.length = 0
      }
    }

    const length = await page.locator('[rel="next"]').count()
    if (length > 0) {
      await page.locator('[rel="next"]').click()
      await expect(page.locator('#header .menu')).toBeVisible()
      await crawl()
    } else {
      console.log('Last page clicked')
    }
  }
  await crawl()
  writableStream.write(']')
  writableStream.end()
  writableStream.close()
})
test('crawl kinozal.tv 4k movies via request', async ({ request }) => {
  test.setTimeout(1_600_000)
  let count = 1990000
  let films = []
  while (count < 1990099) {
    const link = `https://kinozal.tv/details.php?id=${count}`
    try {
      const response = await request.get(link)
      // @ts-ignore
      const name = (await response.text()).match(/<a href=".*"?id=\d{4,}" class="r0">([^<]+)<\/a>/)[1]
      // @ts-ignore
      let img = (await response.text()).match(/<img[^>]* src="([^"]*)" class="p200"[^>]*alt="">/)[1]
      if (img[0] === '/') {
        img = 'https://kinozal.tv' + img
      }
      films.push({ ['name']: name, ['link']: link, ['image']: img })
    } catch (err) {
      count++
      // push error to array
      // films.push({ ['link']: link, ['error']: 'error' })
      continue
    }
    console.log(count)
    count++
  }
  // filter array
  // const filtered = films.filter((films) => !films.error)
  fs.writeFileSync('./kinozal.json', JSON.stringify(films))
})
test('crawl kinozal.tv 4k movies via request with writable stream', async ({ request }) => {
  // const arr = Array.from({length: 100}, (_, i) => i + 1990000)
  test.setTimeout(1_600_000)
  const writableStream = fs.createWriteStream('./kinozal.json')
  writableStream.on('error', error => {
    console.log(`An error occured while writing to the file. Error: ${error.message}`)
  })
  writableStream.write('[')
  let count = 1990000
  while (count < 1990099) {
    const link = `https://kinozal.tv/details.php?id=${count}`
    try {
      const response = await request.get(link)
      // @ts-ignore
      const name = (await response.text()).match(/<a href=".*"?id=\d{4,}" class="r0">([^<]+)<\/a>/)[1]
      // @ts-ignore
      let img = (await response.text()).match(/<img[^>]* src="([^"]*)" class="p200"[^>]*alt="">/)[1]
      if (img[0] === '/') {
        img = 'https://kinozal.tv' + img
      }
      writableStream.write(JSON.stringify({ ['name']: name, ['link']: link, ['image']: img }))
      writableStream.write(',')
    } catch (err) {
      count++
      continue
    }
    console.log(count)
    count++
  }
  writableStream.write(']')
  writableStream.end()
  writableStream.close()
})
test('crawl kinozal.tv 4k movies via request with writable stream sending requests batch with Promise.all()', async ({
  request
}) => {
  // const arr = Array.from({ length: 100 }, (_, i) => i + 1990000)
  test.setTimeout(1_600_000)
  const writableStream = fs.createWriteStream('./kinozal.json', 'ascii')
  writableStream.on('error', error => {
    console.log(`An error occured while writing to the file. Error: ${error.message}`)
  })
  writableStream.write('[')
  const requests = []
  for (let i = 1990000; i <= 1991000; i++) {
    requests.push(request.get(`https://kinozal.tv/details.php?id=${i}`))
  }
  // working for up to 1000 requests, then fail with ECONNRESSET error
  const responses = await Promise.all(requests)
  for (let body of responses) {
    try {
      // @ts-ignore
      const name = (await body.text()).match(/<a href=".*"?id=\d{4,}" class="r0">([^<]+)<\/a>/)[1]
      // @ts-ignore
      let img = (await body.text()).match(/<img[^>]* src="([^"]*)" class="p200"[^>]*alt="">/)[1]
      if (img[0] === '/') {
        img = 'https://kinozal.tv' + img
      }
      writableStream.write(JSON.stringify({ ['name']: name, ['link']: body.url(), ['image']: img }))
      writableStream.write(',')
    } catch (err) {
      console.log('error in response for ' + body.url())
    }
  }
  writableStream.write(']')
  writableStream.end()
  writableStream.close()
})
