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
    const installer = release.assets?.find((asset) => asset.name === 'MVR2AVO-Setup-Windows.exe');
    if (Number.isSafeInteger(installer?.download_count)) {
      downloadCount.textContent = new Intl.NumberFormat('en-US').format(installer.download_count);
    }
  } catch {
    // Keep the last known version label if GitHub's API is unavailable.
  }
}

loadProjectLogo();
recordVisit();
showLatestVersion();
