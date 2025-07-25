import { compose } from './compose.mjs';
import { getPokemonName } from './getName.mjs'
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { Magick } from 'magickwand.js';

async function automated() {

  // Read directories in images
  const basePath = import.meta.dirname
  const foldersPath = path.join(basePath, "images\\")
  const folders = fs.readdirSync(foldersPath);

  for (let folder in folders) {

    // Declare variables
    const inFold = `${foldersPath}${folders[folder]}`; // Input Folder
    const outFold = `${basePath}\\output\\images\\${folders[folder]}`;  // Output Folder
    const images = fs.readdirSync(inFold);  // Files in Input Folder
    if (images.length < 1) return // Return if folder is empty
    const index = images[0].match(new RegExp(/([0-9]{4}[A-Za-z]{0,}) (\(\d{1,3}\))(.png)/)); // Code of Pokemon
    if (!index || !index[1]) return;
    const pokemon = getPokemonName(folders[folder]) // Wikidex export Pokemon name

    // Create output folder if not exists
    if (!fs.existsSync(outFold)) {
      fs.mkdirSync(outFold);
    }

    // For each image: crop and remove background
    for (let image in images) {
      let pathImg = `${inFold}\\${index[1]} (${parseInt(image) + parseInt("1")}).png`
      let pathOut = `${outFold}\\${('0000' + (parseInt(image) + parseInt("1")).toString()).slice(-4)}.png`
      let im = new Magick.Image(path.resolve(pathImg))
      if (`${im.size()}` != "4100x3000") { im.crop("4100x3000+850+1200"); im.repage() }
      if (!im.alpha()) { im.colorFuzz(400); im.transparent("rgb(0,152,51)"); im.colorFuzz(0) }
      im.backgroundColor("White")
      const blob = new Magick.Blob;
      await im.writeAsync(blob);
      const b64 = await blob.base64Async();
      fs.writeFileSync(pathOut, Buffer.from(b64, 'base64'));
    }

    // Create combined images
    await compose(outFold, index, outFold)

    // For each image: Crop to the combined-image dimensions

    await sharp(path.resolve(`${outFold}\\${index}-compose.png`)).extractChannel("alpha").toFile(`${outFold}\\${index}-alpha.png`)
    let im = new Magick.Image(`${outFold}\\${index}-alpha.png`)
    im.threshold(65534)
    const stdout = im.formatExpression("%@")
    const imagesOut = fs.readdirSync(outFold);
    for (let image in imagesOut) {
      let im = new Magick.Image(path.resolve(`${outFold}\\${imagesOut[image]}`))
      im.crop(stdout)
      im.repage()
      const blob = new Magick.Blob;
      await im.writeAsync(blob);
      const b64 = await blob.base64Async();
      fs.writeFileSync(`${outFold}\\${imagesOut[image]}`, Buffer.from(b64, 'base64'));
    }

    // Delete the composed and alpha images
    fs.unlinkSync(`${outFold}\\${index}-compose.png`)

    fs.unlinkSync(`${outFold}\\${index}-alpha.png`)

    // Set alpha to Background
    spawnSync(`for /f %f in ('dir /b "${outFold}"') do "${basePath}\\utils\\imagemagick\\magick.exe" "${outFold}\\%f" -alpha Background "${outFold}\\%f"`, { shell: true, encoding: "utf-8" })

    // Create output folder for webm if not exists
    const webmOutput = `${basePath}\\output\\videos`
    if (!fs.existsSync(webmOutput)) {
      fs.mkdirSync(webmOutput);
    }

    // Create the Webm
    spawnSync(`"${basePath}\\utils\\ffmpeg.exe" -framerate 30 -f image2 -i "${outFold}\\%04d.png" -c:v libvpx-vp9 -crf 31 -b:v 0 -pix_fmt yuva420p "${webmOutput}\\${pokemon}.webm"`, { shell: true, encoding: "utf-8" })
  }
}

automated()