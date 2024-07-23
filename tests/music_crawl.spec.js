/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import cheerio from 'cheerio'
test.only(`crawl music metadata via ui`, async ({ page, request }) => {
  test.setTimeout(2_600_000)
  const writableStream = fs.createWriteStream('./music1.json', 'utf-8')
  writableStream.on('error', error => {
    console.log(`An error occured while writing to the file. Error: ${error.message}`)
  })
  writableStream.write('[')
  await page.goto('https://spaces.im/sz/muzyka/zarubezhnyj-rock')
  expect(await page.locator('[itemprop="audio"] div.player_item').count()).toBeGreaterThan(1)
  // let tempObjArr = []
  async function crawl() {
    const elements = await page.locator('[itemprop="audio"] div.player_item').all()
    for (let el of elements) {
      const song = {}
      song.id = Math.floor(Math.random() * 1000000000)
      song.src = await el.getAttribute('data-src')
      song.title = await el.getAttribute('data-title')
      song.artist = await el.getAttribute('data-artist')
      song.cover = await el.getAttribute('data-cover')
      song.duration = await el.getAttribute('data-duration')
      // tempObjArr.push(song)
      writableStream.write(JSON.stringify(song))
      writableStream.write(',')
    }
  }
  // const length = await page.getByRole('link', { name: ' Вперёд ' }).count()
  // if (length > 0) {
  for (let i = 0; i < 300; i++) {
    await crawl()
    await page.getByRole('link', { name: ' Вперёд ' }).click()
    expect(await page.locator('[itemprop="audio"] div.player_item').count()).toBeGreaterThan(1)
  }
  // } else {
  //   console.log('Last page clicked')
  // }

  await crawl()
  // writableStream.write(JSON.stringify(tempObjArr))
  writableStream.write(']')
  writableStream.end()
  writableStream.close()
})
test.skip(`parse music metadata via request`, async ({ request }) => {
  const urls = []
  const concurrencyLimit = 2 // Limiting to 2 concurrent requests
  const results = []
  for (let i = 0; i < 1; i++) {
    urls.push(`https://spaces.im/sz/muzyka/zarubezhnyj-rock/p${i}`)
  }
  async function fetchDataWithConcurrencyLimit() {
    let concurrentRequests = 0
    for (const url of urls) {
      if (concurrentRequests >= concurrencyLimit) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for 1 second before making the next request
      }
      concurrentRequests++
      try {
        const response = await request.get(url)
        const $ = cheerio.load(await response.text())
        const el = $('#ffbd4ba6e052692467143')
        console.log(el._parse)
      } catch (error) {
        console.error('An error occurred:', error)
      } finally {
        concurrentRequests--
      }
    }
  }
  await fetchDataWithConcurrencyLimit()
})
