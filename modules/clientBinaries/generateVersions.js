/*
 * Copyright (C) 2017-2018 The Particl developers
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

var got = require("got");
var fs = require('fs');

var releasesURL = "https://api.github.com/repos/dtr-org/unit-e/releases";
var signaturesURL = "https://api.github.com/repos/dtr-org/gitian.sigs/contents";
var maintainer = "tecnovert";

/*
 * Filters a hash file to find this asset's hash
 */
var getHash = function (platform, name, hashes) {
  const escapedName = name.replace(/\./g, '\.');
  var filter = new RegExp(`.*${escapedName}`);

  var sha256 = hashes[platform].match(filter);

  if (sha256) {
    sha256 = sha256[0].trim().split(" ")[0];
    console.log("plaform: " + platform + " name: " + name + " hash=", sha256)
  } else {
    sha256 = undefined;
  }
  return (sha256);
}

/*
 * get assets for specific platforms
 */
var getWinAsset = function(data, asset, hashes) {
  data.platform = "win";
  data.arch = asset.name.includes("win64") ? "x64" : "ia32";
  data.type = asset.content_type === "application/zip" ? "zip" : undefined;
  data.sha256 = getHash(data.platform, asset.name, hashes);
}

var getOSXAsset = function (data, asset, hashes) {
  data.platform = "mac";
  data.arch = asset.name.includes("osx64") ? "x64" : "ia32";
  if (asset.content_type === "application/x-apple-diskimage") {
    data.type = "dmg";
  } else if (asset.content_type === "application/gzip") {
    data.type = "tar";
  }
  data.sha256 = getHash("osx", asset.name, hashes);
}

var getLinuxAsset = function (data, asset, hashes) {
  data.platform = "linux";
  if (asset.name.includes("x86_64")) {
    data.arch = "x64";
  } else if (asset.name.includes("i686")) {
    data.arch = "ia32";
  } else if (asset.name.includes("arm")) {
    data.arch = "arm";
  }
  data.type = asset.content_type === "application/gzip" ? "tar" : undefined;
  data.sha256 = getHash(data.platform, asset.name, hashes);
}

/*
 * Gets one asset's details (platform, arch, type. sha256...)
 */
var getAssetDetails = function (asset, hashes, version) {

  var data = {
    platform: undefined,
    arch: undefined,
    type: undefined,
    sha256: undefined
  };

  // windows binaries
  if (asset.name.includes("win")) {
    getWinAsset(data, asset, hashes);
  } // osx binaries
  else if (asset.name.includes("osx")) {
    getOSXAsset(data, asset, hashes);
  } // linux binaries
  else if (asset.name.includes("linux")) {
    getLinuxAsset(data, asset, hashes);
  }

  // add .exe extension for windows binaries
  var bin = `unit-e${data.platform === 'win' ? '.exe' : ''}`
  // return asset only if it is fully compliant
  return (data.platform && data.arch && data.type ? {
    platform: data.platform,
    arch: data.arch,
    name: asset.name,
    entry: {
      download: {
        url: asset.browser_download_url,
        type: data.type,
        sha256: data.sha256,
        bin: `unit-e-${version}/bin/${bin}`
      },
      bin: bin,
      commands: {
        sanity: {
          args: ["-version"],
          output: ["unit-e daemon", version]
        }
      }
    }
  } : undefined);
}

/*
 * Gets all hashes of current version for a specific platform
 */
var getHashesForPlatform = function (platform, path, hashes) {
  // this promise is resolved when both HTTP calls returned
  return new Promise((resolve, reject) => {

    got(`${signaturesURL}/${path}/${maintainer}`).then(response => {

      var files = JSON.parse(response.body);
      const f = files.find((file) => (file.path.indexOf(path) === 0) && !file.name.includes("assert.sig"));

      if(f === undefined) {
        console.error('getHashesForPlatform(): unable to retrieve hash files for ' + version + ' and ' + platform);
        reject();
      }

      got(`${f.download_url}`).then(response => {
        hashes[platform] = response.body;
        resolve(response.body);
      }).catch(error => reject(error)); /* sig file */

    }).catch(error => reject(error)); /* folder containing sig files */

  });
}

/*
 * Entry point
 * get unit-e latest release files
 */
got(`${releasesURL}`).then(response => {
  const body = JSON.parse(response.body);
  let releaseIndex = 0;
  let release;

  while (body[releaseIndex].prerelease) {
    releaseIndex++;
  }
  release = body[releaseIndex];

  var tag = release.tag_name.substring(1);
  var binaries = [];

  // get gitian repository of hashes
  got(`${signaturesURL}`).then(response => {

    var versions = JSON.parse(response.body);
    var hashes = {};
    var promises = [];

    versions.forEach(version => {
      // select folders that match the current version
      if (version.name.includes(tag+".0-")) {
        // extract matching folder's platform
        var platformIndex = version.name.indexOf("-");
        var platform = version.name.substring(platformIndex + 1);
        // wait for hashes to be added to our hashes array
        promises.push(getHashesForPlatform(platform, version.name, hashes));
      }
    })

    // once we have all hashes
    Promise.all(promises).then(function () {
      // prepare JSON object for the output file
      var json = {
        clients: {
          united: {
            version: tag,
            platforms: {}
          }
        }
      }
      // get asset details for each release entry
      var entry;
      release.assets.forEach(asset => {
        if ((entry = getAssetDetails(asset, hashes, tag))) {
          binaries.push(entry);
        }
      })

      // include entries in JSON object
      var platforms = json.clients.united.platforms;
      binaries.forEach(binary => {
        // define an empty object for current platform if not already defined
        if (!platforms[binary.platform]) {
          platforms[binary.platform] = {};
        }
        platforms[binary.platform][binary.arch] = binary.entry;
      })
      // generate JSON file
      var stringJSON = JSON.stringify(json, null, 2);
      var path = "./modules/clientBinaries/clientBinaries.json";
      fs.writeFile(path, stringJSON, function(error) {
        if (error) {
          return (console.error(err));
        }
        console.log("JSON file generated: " + path);
      });
    });
  }).catch(error => console.error(error)); /* signaturesURL */

}).catch(error => console.error(error)); /* releasesURL */
