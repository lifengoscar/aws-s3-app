require('dotenv').config({ path: '.env.playwright' });
const { chromium } = require('playwright');
const axios = require('axios');




const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForResponsePredicate(response) {
  return response.url().includes("TweetResultByRestId") && response.status() === 200;
}

const twitterList = [
  "https://x.com/mamboitaliano__/status/1852073347707998317",
  "https://x.com/javilopen/status/1851361418857365974",
  "https://x.com/mamboitaliano__/status/1852155448709009571",



];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  // Initial load to avoid issues
  await page.goto("https://baidu.com"); 
  await sleep(1000);

  for (const url of twitterList) {
    await page.goto(url);
    const response = await page.waitForResponse(waitForResponsePredicate);

    try {
      const resJson = await response.json();
      const twitterId = resJson.data.tweetResult.result.rest_id;
      const avatar = resJson.data.tweetResult.result.core.user_results.result.legacy.profile_image_url_https;
      const name = resJson.data.tweetResult.result.core.user_results.result.legacy.name;
      const full_text = resJson.data.tweetResult.result.legacy.full_text;

      const variants = resJson.data.tweetResult.result.legacy.entities.media?.[0]?.video_info?.variants || [];
      const highestBitrateUrl = variants
        .filter(v => v.content_type === 'video/mp4')
        .sort((a, b) => b.bitrate - a.bitrate)[0]?.url;

      // Check if highestBitrateUrl and API URL are valid
      const apiUrl = process.env.TWITTER_PLAYWRIGHT_API;
      

      console.log("API_URL environment variable:", process.env.TWITTER_PLAYWRIGHT_API);

      if (!apiUrl) {
        console.error("API URL is undefined");
        return; 
    }
    console.log("API URL:", apiUrl);
      if (highestBitrateUrl && apiUrl) {
        console.log(`Sending metadata for tweet ID ${twitterId} to API: ${apiUrl}`);
        const metadata = {
          twitterId,
          avatar,
          name,
          full_text,
          videoUrl: highestBitrateUrl,
          originalTweet: url,
        };

        await axios.post(apiUrl, metadata);
        console.log(`Sent video metadata for tweet ID ${twitterId}`);
      } else {
        console.log(`No valid video URL found for tweet at ${url} or API URL is undefined`);
      }

    } catch (e) {
      console.error(`Error processing tweet at ${url}:`, e);
    }

    await sleep(3000);
  }

  await browser.close();
})();
