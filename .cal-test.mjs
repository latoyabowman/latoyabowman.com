import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:8766/consultation-booking.html', {
  waitUntil: 'networkidle',
  timeout: 90000,
});
await page.waitForSelector('#my-cal-inline-45min iframe', { timeout: 60000 });
await page.waitForTimeout(5000);

const layout = await page.evaluate(() => {
  const frame = document.querySelector('.cal-frame');
  const embeds = document.querySelector('.booking-embeds');
  const embed = document.getElementById('my-cal-inline-45min');
  const iframe = embed?.querySelector('iframe');
  const fr = frame.getBoundingClientRect();
  const er = embeds.getBoundingClientRect();
  const em = embed.getBoundingClientRect();
  const ir = iframe?.getBoundingClientRect();
  return {
    embedsWidth: er.width,
    frameWidth: fr.width,
    frameRight: fr.right,
    embedsRight: er.right,
    embedWidth: em.width,
    iframeWidth: ir?.width,
    iframeHeight: ir?.height,
    scrolling: iframe?.getAttribute('scrolling'),
    clipDelta: er.right - fr.right,
    html: embed?.innerHTML.slice(0, 200),
  };
});
console.log('LAYOUT', JSON.stringify(layout, null, 2));

const calFrame = page.frames().find((f) => f.url().includes('cal.com'));
if (calFrame) {
  const dayClicked = await calFrame.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')].filter(
      (b) => b.offsetParent && !b.disabled && /^\d{1,2}$/.test(b.textContent.trim())
    );
    if (!buttons.length) return { clicked: false, buttons: document.body.innerText.slice(0, 300) };
    buttons[0].click();
    return { clicked: true, label: buttons[0].textContent.trim() };
  });
  console.log('DAY', JSON.stringify(dayClicked, null, 2));
  await page.waitForTimeout(5000);
  const after = await calFrame.evaluate(() => {
    const timeSlots = [...document.querySelectorAll('button')].filter((b) =>
      /\d{1,2}:\d{2}/.test(b.textContent)
    );
    return {
      slotCount: timeSlots.length,
      samples: timeSlots.slice(0, 5).map((b) => b.textContent.trim()),
      text: document.body.innerText.slice(0, 500),
    };
  });
  const postLayout = await page.evaluate(() => {
    const iframe = document.querySelector('#my-cal-inline-45min iframe');
    return {
      iframeHeight: iframe?.getBoundingClientRect().height,
      scrolling: iframe?.getAttribute('scrolling'),
      hasError: !!document.querySelector('.cal-error-message'),
    };
  });
  console.log('AFTER', JSON.stringify({ after, postLayout }, null, 2));
}

await page.screenshot({ path: '.cal-test-playwright.png' });
await browser.close();
