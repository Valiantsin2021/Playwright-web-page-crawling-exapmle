/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test'
import fs from 'fs'
test(`crawl 4k movies via ui 12 links per page and writable stream`, async ({ page }) => {
  test.setTimeout(1_600_000)
  const writableStream = fs.createWriteStream('./4kf.json', 'utf-8')
  writableStream.on('error', error => {
    console.log(`An error occured while writing to the file. Error: ${error.message}`)
  })
  writableStream.write('[')
  await page.goto('https://gud.4-kfilm.cyou/filmi-4k/')
  async function crawl() {
    const elements = await page.locator('a.krat123-poster.img-box.with-mask').all()
    for (let i = 0; i < elements.length; i++) {
      try {
        const link = await elements[i].getAttribute('href')
        const name = await elements[i].locator('img').getAttribute('alt')
        let img = `https://gud.4-kfilm.cyou${await elements[i].locator('img').getAttribute('src')}`
        writableStream.write(JSON.stringify({ ['name']: name, ['link']: link, ['image']: img }))
        elements.length < 12 && i === elements.length - 1 ? console.log('last link') : writableStream.write(',')
        console.log(link)
      } catch (err) {
        console.log('error in response for ' + (await elements[i].locator('img').innerText()), err.message)
      }
    }

    const length = await page.locator('.pnext a').count()
    if (length > 0) {
      await page.locator('.pnext a').click()
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
