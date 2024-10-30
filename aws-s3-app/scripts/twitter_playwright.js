const { chromium } = require('playwright');
const axios = require('axios');
require('dotenv').config();




const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForResponsePredicate(response) {
  return response.url().includes("TweetResultByRestId") && response.status() === 200;
}

const twitterList = [
  "https://twitter.com/duborges/status/1758196706733068326",
  // Add other Twitter URLs as needed
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  await page.goto("https://baidu.com"); // Initial load to avoid issues
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
      const apiUrl = process.env.REACT_APP_TWITTER_PLAYWRIGHT_API;
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
