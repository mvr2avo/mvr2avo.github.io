# MVR2AVO

MVR2AVO is a Windows desktop application that reads fixture patch data from MVR files, matches GDTF fixtures to Avolites personalities, and prepares a reviewed patch for Avolites Titan.

## Download

[Latest Windows release](https://github.com/mvr2avo/mvr2avo.github.io/releases/latest)

Each published release contains:

- [`MVR2AVO-Setup-Windows.exe`](https://github.com/mvr2avo/mvr2avo.github.io/releases/latest/download/MVR2AVO-Setup-Windows.exe) — Windows installer
- [`MVR2AVO-Portable-Windows.exe`](https://github.com/mvr2avo/mvr2avo.github.io/releases/latest/download/MVR2AVO-Portable-Windows.exe) — portable application
- [`SHA256SUMS.txt`](https://github.com/mvr2avo/mvr2avo.github.io/releases/latest/download/SHA256SUMS.txt) — SHA-256 checksums

Download links will work once the first public release is published. To verify a download on Windows, run `Get-FileHash -Algorithm SHA256 .\MVR2AVO-Setup-Windows.exe` in PowerShell and compare the result with `SHA256SUMS.txt`.

## Feedback and bug reports

[Open an issue](https://github.com/mvr2avo/mvr2avo.github.io/issues/new/choose) to report a problem or suggest an improvement. Please do not attach show files or confidential production data to public issues.

## Website

[mvr2avo.com](https://mvr2avo.com)

MVR2AVO is an independent tool and is not an official Avolites or GDTF/MVR product.
