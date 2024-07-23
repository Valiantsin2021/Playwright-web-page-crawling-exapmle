import { expect, test } from '@playwright/test'
import fs from 'fs/promises'
test(`Scrape all ISTQB terms`, async ({ page }) => {
  test.setTimeout(1_600_000)
  const terms = {}
  await page.goto('https://glossary.istqb.org/en_US/search')
  await page.getByText('I agree').click()
  await page.goto(
    'https://glossary.istqb.org/en_US/search?term=&attributes=%5B%22name%22%2C%22abbreviation%22%2C%22definition%22%2C%22synonyms%22%2C%22reference%22%5D&exact_matches_first=true&syllabus_id=23'
  )
  await page.waitForLoadState('domcontentloaded')
  await expect(page.getByText('All terms')).toBeVisible()
  await page.evaluate(async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i)
      await delay(100)
    }
  })
  const keys = await page.locator('a h3').all()
  const values = await page.locator('a p').all()

  for (let i = 0; i < keys.length; i++) {
    terms[await keys[i].innerText()] = await values[i].innerText()
  }
  await fs.writeFile('./istqb.json', JSON.stringify(terms, null, 2))
  expect.soft(Object.keys(terms).length).toBe(585)
})
