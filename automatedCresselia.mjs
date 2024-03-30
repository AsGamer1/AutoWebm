import { compose } from './compose.mjs';
import { getPokemonName } from './getName.mjs'
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { Magick } from 'node-magickwand';

async function automated() {

  // Read directories in images
  const folders = fs.readdirSync("./images/");

  for (let folder in folders) {

    // Declare variables
    const inFold = `./images/${folders[folder]}`; // Input Folder
    const outFold = `./imagesOutput/${folders[folder]}`;  // Output Folder
    const images = fs.readdirSync(inFold);  // Files in Input Folder
    const index = images[0].match(new RegExp(/([0-9]{4}[A-Za-z]{0,}) (\(\d{1,3}\))(.png)/))[1]; // Code of Pokemon
    const pokemon = getPokemonName(folders[folder]) // Wikidex export Pokemon name

    // Create output folder if not exists
    if (!fs.existsSync(outFold)) {
      fs.mkdirSync(outFold);
    }

    // For each image: crop and remove background
    for (let image in images) {
      let pathImg = `${inFold}/${index} (${parseInt(image) + parseInt(1)}).png`
      let pathOut = `${outFold}/${('0000' + (parseInt(image) + parseInt(1)).toString()).slice(-4)}.png`
      let im = new Magick.Image(path.resolve(pathImg))
      if (`${im.size()}` != "4100x3000") { im.crop("4100x3000+850+1200"); im.repage() }
      if (!im.alpha()) { im.colorFuzz(1000); im.transparent("#cebee0"); im.colorFuzz(2000); im.transparent("#c2b4d5"); im.transparent("#b2a6c4"); im.colorFuzz(0) }
      im.backgroundColor("White")
      const blob = new Magick.Blob;
      await im.writeAsync(blob);
      const b64 = await blob.base64Async();
      fs.writeFile(pathOut, Buffer.from(b64, 'base64'), ()=>{});
    }

    // Create combined images
    await compose(outFold, index, outFold)
    await new Promise(r => setTimeout(r, 1500));

    // For each image: Crop to the combined-image dimensions
    let im = new Magick.Image(new Magick.Blob(await sharp(path.resolve(`${outFold}/${index}-compose.png`)).extractChannel("alpha").toBuffer()))
    im.threshold(65534)
    const stdout = im.formatExpression("%@")
    const imagesOut = fs.readdirSync(outFold);
    for (let image in imagesOut) {
      let im = new Magick.Image(path.resolve(`${outFold}/${imagesOut[image]}`))
      im.crop(stdout)
      im.repage()
      const blob = new Magick.Blob;
      await im.writeAsync(blob);
      const b64 = await blob.base64Async();
      fs.writeFile(`${outFold}/${imagesOut[image]}`, Buffer.from(b64, 'base64'), ()=>{});
      await new Promise(r => setTimeout(r, 500));
    }

    // Delete the composed image
    fs.unlink(`${outFold}/${index}-compose.png`, () => { })
    await new Promise(r => setTimeout(r, 2000));

    // Set alpha to Background
    spawnSync(`for /f %f in ('dir /b "${outFold}"') do magick.exe convert "${outFold}/%f" -alpha Background "${outFold}/%f"`,{shell:true})

    // Create the Webm
    spawnSync(`ffmpeg -framerate 30 -f image2 -i "${outFold}/%04d.png" -c:v libvpx-vp9 -crf 31 -b:v 0 -pix_fmt yuva420p "webmOutput/${pokemon}.webm"`,{shell:true})
  }
}

automated()