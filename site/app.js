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
    const releases = [];
    const releasesPerPage = 100;

    for (let page = 1; ; page += 1) {
      const response = await fetch(`https://api.github.com/repos/mvr2avo/mvr2avo.github.io/releases?per_page=${releasesPerPage}&page=${page}`);
      if (!response.ok) return;
      const pageReleases = await response.json();
      releases.push(...pageReleases);
      if (pageReleases.length < releasesPerPage) break;
    }

    const latestRelease = releases.find((release) => !release.draft && !release.prerelease);
    if (/^v\d+\.\d+\.\d+$/.test(latestRelease?.tag_name)) {
      document.querySelector('#release-version').textContent = latestRelease.tag_name;
    }

    const windowsAssets = ['MVR2AVO-Setup-Windows.exe', 'MVR2AVO-Portable-Windows.exe'];
    const windowsDownloads = releases
      .flatMap((release) => release.assets || [])
      .filter((asset) => windowsAssets.includes(asset.name))
      .reduce((total, asset) => total + (Number.isSafeInteger(asset.download_count) ? asset.download_count : 0), 0);
    downloadCount.textContent = new Intl.NumberFormat('en-US').format(windowsDownloads);
  } catch {
    // Keep the last known version label if GitHub's API is unavailable.
  }
}

loadProjectLogo();
showLatestVersion();
