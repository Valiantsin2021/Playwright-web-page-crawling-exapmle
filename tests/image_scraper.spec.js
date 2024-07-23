import { test, expect } from '@playwright/test'
import fs from 'fs'
import { expect as expectChai } from 'chai'
/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
test(`Parse and save the images using request, recursion and Promise.all() `, async ({ request, page }) => {
  test.setTimeout(3_600_000)
  await page.goto('https://altphotos.com/gallery/')
  const folderPath = './downloaded_images'
  fs.existsSync(folderPath) ? console.log('Folder already exists') : fs.mkdirSync(folderPath)
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
    const downloadPromises = sources.map(async source => {
      try {
        const imageName = `image_${Date.now()}.jpg`
        const response = await request.get(source)
        fs.writeFile(`${folderPath}/${imageName}`, await response.body(), 'binary', error => {
          error ? console.error(error) : console.log(`Image ${imageName} downloaded successfully`)
        })
      } catch (error) {
        console.error(error)
      }
    })
    await Promise.all(downloadPromises)
    // for (let el of sources) {
    //   const imageName = `image_${Date.now()}.jpg`
    //   const response = await request.get(el)
    //   fs.writeFile(`${folderPath}/${imageName}`, await response.body(), 'binary', error => {
    //     error ? console.error(error) : console.log(`Image ${imageName} downloaded successfully`)
    //   })
    // }
    const nextBtnlength = await nextBtn.count()
    if (nextBtnlength > 0) {
      console.log(`Loading new page`)
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
test(`Variant with while loop`, async ({ page, request }) => {
  test.setTimeout(3_600_000)
  const folderPath = './downloaded_images'
  fs.existsSync(folderPath) ? console.log('folder ready') : fs.mkdirSync(folderPath)
  await page.goto('https://altphotos.com/gallery/')
  const nextBtn = page.getByText('Show me more...')

  async function downloadImage(source) {
    const imageName = `image_${Date.now()}.jpg`
    const response = await request.get(source)
    await fs.writeFile(`${folderPath}/${imageName}`, await response.body(), 'binary', err => err)
    console.log(`Image ${imageName} downloaded successfully`)
  }

  async function parseImages() {
    const images = await page
      .locator('a')
      .filter({ has: page.locator('img') })
      .all()
    const sources = []

    for (const image of images) {
      const source = await image.getAttribute('href')
      sources.push(`https://altphotos.com/download/${source?.match(/\d{4}/)[0]}`)
    }

    return sources
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const sources = await parseImages()

    for (const source of sources) {
      try {
        await downloadImage(source)
      } catch (error) {
        console.error(error)
      }
    }

    const nextBtnlength = await nextBtn.count()
    if (nextBtnlength > 0) {
      console.log('Loading new page')
      await nextBtn.click({ force: true })
      await page.waitForTimeout(5000)

      const newSources = await parseImages()
      expect(newSources.length).toBeGreaterThan(sources.length)

      sources.push(...newSources)
    } else {
      console.log('No more images')
      break
    }
  }
})
