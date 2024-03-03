import { By, Builder, until } from 'selenium-webdriver';
import * as firefox from 'selenium-webdriver/firefox.js'
import * as path from 'path'
import * as fs from 'fs'

const screen = {width: 640,height: 480};

var getMostRecent = function (dir, cb) {
  var dir = path.resolve(dir);
  var files = fs.readdir(dir, function (err, files) {
    var sorted = files.map(function (v) {
      var filepath = path.resolve(dir, v);
      return {
        name: v,
        time: fs.statSync(filepath).mtime.getTime()
      };
    })
      .sort(function (a, b) { return b.time - a.time; })
      .map(function (v) { return v.name; });

    if (sorted.length > 0) {
      cb(null, sorted[0]);
    } else {
      cb('Y U NO have files in this dir?');
    }
  })
}

export async function ezgif() {
  const images = fs.readdirSync("./gifs/");
  for (let gif of images) {
    let image = `./gifs/${gif}`;
    try {
      let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless().windowSize(screen)).build();
      await driver.get('https://ezgif.com/crop');
      try {
        await driver.findElement(By.className("stpd_cta_btn")).click();
      } finally {
        await driver.findElement(By.id("new-image")).sendKeys(path.resolve(image))
        await driver.findElement(By.name("upload")).submit()

        await driver.wait(until.urlContains('.gif')).then(console.log("GIF Uploaded"))
        await driver.wait(until.elementLocated(By.name("autocrop")))

        await driver.findElement(By.name("autocrop")).click()
        await driver.findElement(By.name('crop')).submit()

        await driver.wait(until.elementLocated(By.xpath(".//div[@id='output']//span[@class='convert-wrap']"))).then(console.log("GIF Cropped"))

        await driver.findElement(By.xpath(".//div[@id='output']//span[@class='convert-wrap']")).click()
        await driver.findElement(By.xpath(".//div[@id='output']//span[@class='convert-wrap']//a[contains(@href, 'gif-to-webm')]")).click()

        await driver.wait(until.urlContains("gif-to-webm"))
        await driver.findElement(By.name("convert")).click()

        await driver.wait(until.elementLocated(By.xpath(".//div[@id='output']//a[@download and contains(@href,'.webm')]"))).then(console.log("GIF Converted to WebM"))
        await driver.findElement(By.xpath(".//div[@id='output']//a[@download and contains(@href,'.webm')]")).click()

        await new Promise(r => setTimeout(r, 2000));

        getMostRecent('C:/Users/Usuario/Downloads', function (err, recent) {
          if (err) console.error(err);
          if (recent.match('ezgif.com-gif-to-webm-converter.webm')) {
            let renamed = image.match(new RegExp('gifs/(.*)\.gif'))
            fs.rename(`C:/Users/Usuario/Downloads/${recent}`, `./gifsOutput/${renamed[1]}.webm`, () => { })
            console.log("File downloaded")
          } else {
            console.error(recent)
            process.exit(1)
          }
        });
      }
    } catch (e) {
      console.error(e)
      console.error(gif)
      process.exit(1)
    } finally {
      process.removeAllListeners()
    }
  }
}