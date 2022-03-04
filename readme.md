<p align="center">
  <img width="250" height="250" src="https://raw.githubusercontent.com/joshgarde/Download.cpp/main/icons/icon.png">
</p>
<h1 align="center">Download.cpp</h1>

A web extension that enables students to download videos directly from CalPoly
Pomona video players in easy as two-clicks. Powered by a ton of late night
reverse engineering work and beer - lots of it.

## How to use

Simply download the extension from Firefox Add-ons or the Chrome Web Store.
Alternatively, download the .crx file and install it manually in any
Chromium-based browser.

Now open up any CPP video player on Canvas or Streaming @ CPP. A new download
button should appear on the lower right corner. Simply select which resolution
you would like to download the video in and your download will begin.

The top-most option provides the highest quality possible. Most videos will
offer a "Source" option which provides a download of the original content
exactly as it was uploaded.

## Why was it made

As a developer and a student for years, I believe that information should be as
widely available as possible. From code to papers to lecture materials.
Information and therefore truth, should not have barriers to its access. The
video players and the video hosting providers that CPP partners with makes
retrieving and retaining this information *intentionally* difficult for
students.

Providing direct access to video files also provides additional accessibility
options especially to students who utilize third-party playback software or
services such as [Note Taking Express](https://www.cpp.edu/drc/accommodations-and-procedures/notetaking-express.shtml).

## How does it work

Download.cpp utilizes mechanisms reverse engineered from Kaltura's video players
in order to provide download functionality directly in the player itself. All
downloading is performed locally so data is transferred away from your computer.
The download itself utilizes functionality that Kaltura themselves built into
their backend. This extension simply exposes these endpoints in a simple,
user-friendly way.

As a result, we don't need to pay for servers and you get 100% control of your
privacy. No need for a privacy policy because we don't collect *any* data.

Pretty cool, right?

## License

Download.cpp is licensed under the terms of [GNU GPLV3](https://www.gnu.org/licenses/gpl-3.0.en.html).
For the full terms, see the license.md file.
