import chromium from '@sparticuz/chromium';
import puppeteer from "puppeteer-core"

export async function scrapeChapters() {
  const url = process.env.NEXT_PUBLIC_SHANGRI_LA_URL;
    const CHROMIUM_PATH = "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar";
    const browser = await puppeteer.launch({
      args: chromium.args,
      // SOLUCIÓN: Definir el objeto manualmente si da error de tipo
      defaultViewport: {
        width: 1280,
        height: 720,
        isMobile: false,
      },
      executablePath: await chromium.executablePath(CHROMIUM_PATH),
      headless: true // Cast a any por discrepancias de tipos en versiones nuevas
    });
  const page = await browser.newPage()
  await page.goto(url!, { waitUntil: "networkidle2" })

  const chapters = await page.evaluate(() => {

    return Array.from(document.querySelectorAll("a"))
      .filter(a => a.href.includes("chapter"))
      .map((a, index) => ({
        name: a.textContent?.trim() || "",
        url: a.href,
        order: index + 1
      }))

  })

  const result = []

  for (const chapter of chapters.reverse()) {

    const pages = await scrapeChapterPages(page, chapter.url)

    const chapterData = {
      anime: "shangri-la",
      name: chapter.name,
      pages,
      order: chapter.order
    }

    result.push(chapterData)
  }

  await browser.close()
  console.log(result)
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function scrapeChapterPages(page:any, chapterUrl:string) {

  await page.goto(chapterUrl, { waitUntil: 'networkidle2' })

  const pages = await page.evaluate(() => {

    const images = Array.from(document.querySelectorAll('img'))

    return images.map((img, index) => ({
      order: String(index + 1),
      url: img.src
    }))

  })

  return pages
}