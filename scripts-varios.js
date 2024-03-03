const path = require("path");
const fs = require("fs");

/*

//Removing numbers from GIFs

for (let gif in images) {
  const images = fs.readdirSync("./images/");
  let regex = images[gif].match(new RegExp(/([0-9]{1,} - )(.*)(\.gif)/))
  console.log(images[gif])
  fs.rename(`./images/${images[gif]}`, `./imagesOutput/${regex[2]}.gif`, () => { })
}
*/

/*

//Changing names - DO NOT EXECUTE, I'VE MANUALLY REMOVED SOME OF THEM BECAUSE CAUSED PROBLEMS. TEST BEFORE.

const images = fs.readdirSync("./images/");

for (let gif = 0; gif < images.length; gif++) {
  let regex = images[gif].match(new RegExp(/([á-ú-\w]{1,}) ?(\(\w*\))? ?(\(\w*\))?(\.gif)/))
  if (regex[2] == '(Female)') {
    fs.rename(`./images/${images[gif]}`, `./imagesOutput/${regex[1]}_EP_variocolor_hembra.gif`, () => { })
  } else if (regex[2] == '(Male)' || regex[2] == undefined) {
    fs.rename(`./images/${images[gif]}`, `./imagesOutput/${regex[1]}_EP_variocolor.gif`, () => { })
  } else if (regex[2] == '(Hisuian)') {
    fs.rename(`./images/${images[gif]}`, `./imagesOutput/${regex[1]}_de_Hisui_EP_variocolor.gif`, () => { })
  } else if (regex[2] == '(Paldea)') {
    fs.rename(`./images/${images[gif]}`, `./imagesOutput/${regex[1]}_de_Paldea_EP_variocolor.gif`, () => { })
  } else if (regex[2] == '(Galar)') {
    fs.rename(`./images/${images[gif]}`, `./imagesOutput/${regex[1]}_de_Galar_EP_variocolor.gif`, () => { })
  } else if (regex[2] == '(Alola)') {
    fs.rename(`./images/${images[gif]}`, `./imagesOutput/${regex[1]}_de_Alola_EP_variocolor.gif`, () => { })
  }
}

*/

/*

const images = fs.readdirSync("./images/");
const json = require("./list.json")
for (let gif in images) {
  for (let i in json) {
    if (images[gif] == json[i].files) {
      fs.rename(`./images/${images[gif]}`, `./images/${json[i].archivos}`, () => { })
    }
  }
}

*/

/*

// Search for Wikidex files that I don't have

const images = fs.readdirSync("./imagesOutput/");
const json = require("./list.json")


let flag = false
for (let i in json) {
  const name = json[i].archivos
  while (flag == false) {
    for (let img in images) {
      if (images[img] == name) {
        flag = true
      }
    }
    if (flag == false) {
      console.log(name)
      break
    }
  }
  flag = false
}
*/

/*

// Search for files that Wikidex does not have

const images = fs.readdirSync("./imagesOutput/");
const json = require("./list.json")


let flag = false
for (let img in images) {
  while (flag == false) {
    for (let i in json) {
      const name = json[i].archivos
      if (images[img] == name) {
        flag = true
      }
    }
    if (flag == false) {
      console.log(images[img])
      break
    }
  }
  flag = false
}
*/