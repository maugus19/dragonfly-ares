import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export type ScrapeVideo = { server: string; url: string }
export type ScrapeResult = { title: string; image_url: string; url: ScrapeVideo[] }

export async function scrapping(code: string): Promise<ScrapeResult> {
  try {
    const base_url = process.env.NEXT_PUBLIC_SCRAPPER_BASE_URL;
    const target_url = `${base_url}${code}`;

    const videoUrls = new Set<{ server: string; url: string }>();
    let serverName = '';

    // 1. Configuración del Navegador (Compatible con Local y Vercel)
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
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    // Interceptar tráfico para capturar URLs de video
    page.on("request", (request) => {
      const reqUrl = request.url();
      if (reqUrl.match(/\.(mp4|m3u8|webm|ogg)$/i)) {
        videoUrls.add({ server: serverName, url: reqUrl });
      }
      request.continue();
    });

    try {
      await page.goto(target_url, {
        waitUntil: "networkidle2",
        timeout: 20000 // Aumentamos margen para sitios lentos
      });

      // 2. Localizar botones de servidor
      const serverButtons = await page.$$("button[onclick*='select_part'][onclick*='parent']");

      for (const serverButton of serverButtons) {
        serverName = await serverButton.evaluate(el => (el as HTMLElement).innerText.trim());

        await serverButton.click();

        // En lugar de un timeout fijo, esperamos un breve momento para el cambio de DOM
        await new Promise(resolve => setTimeout(resolve, 800));

        // 3. Localizar botones de partes (episodios/calidades)
        const partButtons = await page.$$("span.partlist button[onclick*='select_part'][onclick*='child']");

        for (const partButton of partButtons) {
          try {
            await partButton.click();
            // Tiempo mínimo para que la request de video se dispare y sea captada por el listener
            await new Promise(resolve => setTimeout(resolve, 600));
          } catch (e) {
            console.log("Error en botón de parte:", e);
          }
        }
      }

      // Extraer título e imagen del video usando meta tags y selectores de reserva
      const pageTitle = await page.evaluate(() => {
        // Prefer og:title or <title>
        let title = (
          document.querySelector("meta[property='og:title']")?.getAttribute('content') ||
          document.querySelector("meta[name='og:title']")?.getAttribute('content') ||
          document.querySelector('title')?.innerText ||
          ''
        ).trim();

        // If there are card blocks with multiple .card-title (example provided),
        // pick the longest one (usually the full descriptive title)
        try {
          const cards = Array.from(document.querySelectorAll('div.card-block h2.card-title'))
            .map(n => (n as HTMLElement).innerText.trim())
            .filter(Boolean);

          if (cards.length) {
            const longest = cards.reduce((a, b) => (a.length >= b.length ? a : b));
            if (!title || longest.length > title.length) title = longest;
          }
        } catch (e) {
          // ignore DOM errors
        }

        // other fallbacks
        const selectors = ['h1', '.entry-title', '.title'];

        if (!title) {
          for (const selector of selectors) {
            const text = document.querySelector(selector)?.textContent?.trim();
            if (text) {
              title = text;
              break;
            }
          }
        }

        return title;
      });

      const pageImage = await page.evaluate(() => {
        return (
          document.querySelector("meta[property='og:image']")?.getAttribute('content') ||
          document.querySelector("meta[name='og:image']")?.getAttribute('content') ||
          (document.querySelector('.thumb img') as HTMLImageElement | null)?.src ||
          (document.querySelector('.poster img') as HTMLImageElement | null)?.src ||
          (document.querySelector('img') as HTMLImageElement | null)?.src ||
          ''
        );
      });

      const result = Array.from(videoUrls);
      await browser.close();
      const scraped: ScrapeResult = { title: pageTitle, image_url: pageImage, url: result };
      console.log(scraped)

      return scraped;

    } catch (innerError) {
      if (browser) await browser.close();
      throw innerError;
    }

  } catch (error) {
    console.error("Scrapping Error:", error);
    throw error;
  }
}