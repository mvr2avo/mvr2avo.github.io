const statsBase = 'https://stats.mvr2avo.com';
const visitCount = document.querySelector('#visit-count');
const downloadCount = document.querySelector('#download-count');
const downloadButton = document.querySelector('#download-button');
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
  } catch {
    // Keep the last known version label if GitHub's API is unavailable.
  }
}

function showCounts(stats) {
  const format = new Intl.NumberFormat('en-US');
  if (Number.isSafeInteger(stats.visits)) visitCount.textContent = format.format(stats.visits);
  if (Number.isSafeInteger(stats.downloads)) downloadCount.textContent = format.format(stats.downloads);
}

async function recordVisit() {
  try {
    const response = await fetch(`${statsBase}/api/visit`, { method: 'POST', cache: 'no-store' });
    if (!response.ok) throw new Error('visit count unavailable');
    showCounts(await response.json());
  } catch {
    // The page and downloads remain usable before statistics are deployed.
  }
}

downloadButton.addEventListener('click', async (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const destination = downloadButton.href;
  try {
    const response = await fetch(`${statsBase}/api/download`, {
      method: 'POST',
      cache: 'no-store',
      signal: AbortSignal.timeout(900),
    });
    if (response.ok) showCounts(await response.json());
  } catch {
    // A temporary stats outage must never block the installer.
  } finally {
    window.location.assign(destination);
  }
});

loadProjectLogo();
recordVisit();
showLatestVersion();
