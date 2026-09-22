const downloadCount = document.querySelector('#download-count');
document.querySelector('#year').textContent = new Date().getFullYear();

async function loadProjectLogo() {
  try {
    const response = await fetch('assets/logo-512.base64');
    if (!response.ok) return;
    const source = `data:image/png;base64,${(await response.text()).trim()}`;
    document.querySelectorAll('[data-logo]').forEach((image) => { image.src = source; });
    document.querySelector('#favicon').href = source;
  } catch {
    // The page remains usable if the logo asset is temporarily unavailable.
  }
}

async function showLatestVersion() {
  try {
    const response = await fetch('https://api.github.com/repos/mvr2avo/mvr2avo.github.io/releases/latest');
    if (!response.ok) return;
    const release = await response.json();
    if (/^v\d+\.\d+\.\d+$/.test(release.tag_name)) {
      document.querySelector('#release-version').textContent = release.tag_name;
    }
    const windowsDownloads = (release.assets || [])
      .filter((asset) => ['MVR2AVO-Setup-Windows.exe', 'MVR2AVO-Portable-Windows.exe'].includes(asset.name))
      .reduce((total, asset) => total + (Number.isSafeInteger(asset.download_count) ? asset.download_count : 0), 0);
    downloadCount.textContent = new Intl.NumberFormat('en-US').format(windowsDownloads);
  } catch {
    // Keep the last known version label if GitHub's API is unavailable.
  }
}

loadProjectLogo();
showLatestVersion();
