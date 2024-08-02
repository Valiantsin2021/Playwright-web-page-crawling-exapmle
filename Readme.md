# JS automation tests using Playwright <a href="https://playwright.dev/" target="blank"><img align="center" src="https://playwright.dev/img/playwright-logo.svg" alt="WebdriverIO" height="40" width="40" /></a> 

## Author

- [@Valiantsin2021](https://www.github.com/Valiantsin2021) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## This repository purpose is demonstration ow webpage crawling using ui or api [kinozal.tv](https://kinozal.tv)

## There is one test file "web_page_crawl" located in ./tests dir with 4 test cases demonstrating various approaches for web crawling using Playwright with JavaScript:

### First test case is the fastest and process crawling via UI and API processing requests by batches per 1000 and stores the results with writeable stream

### Second test process crawling via api requests with limited number (up to 1000) and store results with fs.writeFileSync

### Third test process crawling via api requests with limited number (up to 1000) and store results with fs.createWritableStream

### Fourth test process crawling via api requests by batch (up to 1000) and store results with fs.createWritableStream

## Allure report - https://valiantsin2021.github.io/webpage_crawl_example/

## Before the test run make sure to update local browsers versions to latest and have NodeJS, npm and Java (for allure report) installed

## Setup:

1. Clone this repository or unzip downloaded file
2. Install dependencies with "npm install"
3. To run tests - open terminal and navigate to the path of the cloned project and:
   
   - to run test file use command "npx playwright test web_page_crawl"
   - to create allure report - run command "npm run posttest"
   - to clean reports directory and screenshots: "npm run clean"
   - to open report run : "npm run report"
   - crawling results are saved in the root directory - kinozal.json

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://valiantsin2021.github.io/Portfolio-Valentin/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/valiantsin-lutchanka/)
