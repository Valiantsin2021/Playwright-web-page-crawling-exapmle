import { test, expect } from '@playwright/test'
import fs from 'fs'
/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
test(`Parse and save the images from `, async ({ request, page }) => {
  test.setTimeout(3_600_000)
  await page.goto('https://altphotos.com/gallery/')
  fs.existsSync('./downloaded_images') ? console.log('folder ready') : fs.mkdirSync('./downloaded_images')
  const nextBtn = page.getByText('Show me more...')
  const images = await page
    .locator('a')
    .filter({ has: page.locator('img') })
    .all()
  let sources = []
  for (let image of images) {
    const source = await image.getAttribute('href')
    sources.push(`https://altphotos.com/download/${source?.match(/\d{4}/)[0]}`)
  }
  let length = sources.length
  async function recurse(sources) {
    for (let el of sources) {
      const imageName = `image_${Date.now()}.jpg`
      const response = await request.get(el)
      fs.writeFile(`./downloaded_images/${imageName}`, await response.body(), 'binary', error => {})
    }
    const nextBtnlength = await nextBtn.count()
    if (nextBtnlength > 0) {
      await nextBtn.click({ force: true })
      await page.waitForTimeout(5000)
      const images = await page
        .locator('a')
        .filter({ has: page.locator('img') })
        .all()
      expect((await images).length).toBeGreaterThan(length)
      let newImages = []
      for (let image of (await images).slice(length)) {
        const source = await image.getAttribute('href')
        newImages.push(`https://altphotos.com/download/${source?.match(/\d{4}/)[0]}`)
        sources.push(`https://altphotos.com/download/${source?.match(/\d{4}/)[0]}`)
      }
      length = sources.length
      await recurse(newImages)
    } else {
      console.log('no more images')
    }
  }
  await recurse(sources)
})
