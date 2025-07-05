import { Magick, MagickCore } from 'magickwand.js';
import * as path from 'path';
import * as fs from 'fs';

export async function compose(inputDir,name,outputDir) {

    // Read directory images
    const images = fs.readdirSync(inputDir);

    // First image as base
    let im = new Magick.Image(path.resolve(`${inputDir}/${images[0]}`));

    // For every other image, compose it on top of the base
    for (let frame = 1; frame < images.length; frame++) {
        let im2 = new Magick.Image(path.resolve(`${inputDir}/${images[frame]}`));
        await im.compositeAsync(im2, MagickCore.CenterGravity, MagickCore.OverCompositeOp);
    }

    // Create a blob to export it
    const blob = new Magick.Blob;
    await im.writeAsync(blob);
    const b64 = await blob.base64Async();

    // Save the exported file
    fs.writeFileSync(`${outputDir}/${name}-compose.png`, Buffer.from(b64, 'base64'));
}