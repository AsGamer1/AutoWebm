import { exec, execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Magick, MagickCore } from 'node-magickwand';
import sharp from 'sharp';

// Read directory images

// First image as base


const wizard = path.resolve("./0031.png");

// Read a new image (synchronously)
let im = new Magick.Image(wizard);
console.log(`${wizard}: ${im.alpha()}`);


/*
exec(`ffmpeg -framerate 30 -f image2 -i "./imagesOutput/0151 Mew/%04d.png" -c:v libvpx-vp9 -crf 31 -b:v 0 -pix_fmt yuva420p "0151.webm"`,()=>{})


exec(`magick.exe convert test.png -alpha extract png:- | magick.exe convert - -threshold 65534 -format %@ -write info:`,(err,stdout,stderr) => {
    
    const extraction = stdout.match(new RegExp(/(\d{1,})x(\d{1,})\+(\d{1,})\+(\d{1,})/))
    
    exec(`magick.exe convert test.png -stroke red -fill none -draw "rectangle ${extraction[3]},${extraction[4]} ${parseInt(extraction[3])+parseInt(extraction[1])},${parseInt(extraction[4])+parseInt(extraction[2])}"  fyi.png`,(err,stdout,stderr) => {
        console.log(stdout)
        console.log(stderr)
    })
    
    exec(`magick.exe convert test.png -crop ${stdout} +repage out.png`,() => {})

});

*/