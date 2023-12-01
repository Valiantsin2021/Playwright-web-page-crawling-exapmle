/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test'
import fs from 'fs'
import cheerio from 'cheerio'
import { parseFile } from 'fast-csv'

test(`crawl 'Good reads website' with requests and cheerio parsing to writable stream`, async ({ request }) => {
  test.setTimeout(1_600_000)
  const writableStream = fs.createWriteStream('./good_reads.csv', 'utf-8')
  writableStream.on('error', error => {
    console.log(`An error occured while writing to the file. Error: ${error.message}`)
  })
  writableStream.write('"Title","Link","Image"\n')
  const links = []
  for (let i = 1; i < 15; i++) {
    try {
      const response = await request.get(`https://www.goodreads.com/genres/list?page=${i}`)
      const $ = cheerio.load(await response.text())
      $('.shelfStat a').each(function (_, el) {
        links.push(`https://www.goodreads.com/${$(this).attr('href')}`)
      })
    } catch (err) {
      console.log(err.message)
    }
  }
  const requests = links.map(link => request.get(link))
  const responses = await Promise.all(requests)
  for (let body of responses) {
    try {
      // const response = await request.get(links[i])
      const $ = cheerio.load(await body.text())
      $('.leftContainer .coverWrapper a img').each(function (_, el) {
        console.log(`${$(this).attr('title') || $(this).attr('alt')}`)
        writableStream.write(
          `"${$(this).attr('title') || $(this).attr('alt')}","https://www.goodreads.com${$(this)
            .parent()
            .attr('href')}","${$(this).attr('src')}"\n`
        )
      })
      const extraLinks = []
      $('.moreLink .actionLink').each(function (_, el) {
        extraLinks.push($(this).attr('href'))
      })
      for (let el of extraLinks) {
        try {
          const response = await request.get(`https://www.goodreads.com/${el}`)
          const $ = cheerio.load(await response.text())
          $('.elementList a img').each(function (_, el) {
            console.log(`${$(this).attr('title') || $(this).attr('alt')}`)
            if ($(this).attr('title') || $(this).attr('alt')) {
              writableStream.write(
                `"${$(this).attr('alt')}","https://www.goodreads.com${$(this).parent().attr('href')}","${$(this).attr(
                  'src'
                )}"\n`
              )
            }
          })
          $('.coverWrapper a img').each(function (_, el) {})
          console.log(`${$(this).attr('title') || $(this).attr('alt')}`)
          if ($(this).attr('title') || $(this).attr('alt')) {
            writableStream.write(
              `"${$(this).attr('alt')}","https://www.goodreads.com${$(this).parent().attr('href')}","${$(this).attr(
                'src'
              )}"\n`
            )
          }
        } catch (err) {
          console.log('extra links error' + err.message)
        }
      }
    } catch (err) {
      console.log('Error parsing the link ', err.message)
    }
  }
  writableStream.end()
  writableStream.close()
  // parseFile('./good_reads.csv')
  //   .on('error', error => console.error(error))
  //   .on('data', row => console.log(row))
  //   .on('end', rowCount => console.log(`Parsed ${rowCount} rows`))
})
