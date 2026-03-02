import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function scrapping(code: string) {
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

      const result = Array.from(videoUrls);
      await browser.close();
      console.log(result)

      return { videos: result };

    } catch (innerError) {
      if (browser) await browser.close();
      throw innerError;
    }

  } catch (error) {
    console.error("Scrapping Error:", error);
    throw error;
  }
}