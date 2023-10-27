const express = require('express');
const { firefox } = require('playwright');
const app = express();

app.use(express.json());

async function scrapeDisneyData(url1, url2) {
    try {
      console.log("scrapeDisneyData start");
    const browser = await firefox.launch({ headless: true }); // Launch in normal mode
    // const browser = await chromium.launch({ headless: true }); // Launch in normal mode
      console.log("browser setup")
    const context = await browser.newContext();
    console.log("browser context setup")

    await context.clearCookies();
    console.log("browser clearCookies")
    // Create a new page and navigate to the first URL
    const page = await context.newPage();
    console.log("browser newPage")
    // await page.setUserAgent("Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36");
    const data = await page.goto(url1);
    console.log("response from first link", data)
  
    // Wait for 3 seconds and then force a redirect to the second URL
    await page.waitForTimeout(3000);
   const response = await page.goto(url2);
    console.log("response from first second link", response)
  
    // Capture and return the JSON response
    const json_response = await page.evaluate((url) => {
      console.log("url in evaluate",url)
      return fetch(url).then((response) => response.json());
    }, url2);
        console.log("json_response",json_response)
    await browser.close();
  
    return json_response;
    }
    catch(err){
      console.log("err", err)
    }
  }
  app.post("/getdisneydata", async (req, res) => {
    const {url, path} = req.body
    try { 
      console.log(url, path)
      const data = await scrapeDisneyData(url, url+path)
      return  res.status(200).json(data);
        
    } catch (error) {
      console.log("error", error)
    return  res.status(500).json(error);
    }
  });
  

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });