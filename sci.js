// IP Address Information Script by xsayfex
// Fetches comprehensive IP data and displays in hacker style

class IPScanner {
    constructor() {
        this.ipData = null;
        this.apiEndpoints = [
            'https://ipapi.co/json/',
            'https://ipwho.is/',
            'https://ip-api.com/json/'
        ];
    }

    async fetchIPData() {
        console.log('%c[+] Initiating IP reconnaissance...', 'color: #00ff88');

        for (const endpoint of this.apiEndpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    this.ipData = await response.json();
                    console.log('%c[+] IP data acquired successfully!', 'color: #00ff88');
                    return this.normalizeData(this.ipData, endpoint);
                }
            } catch (error) {
                console.log(`%c[-] Failed to fetch from ${endpoint}`, 'color: #ff3366');
            }
        }
        throw new Error('All IP API endpoints failed');
    }

    normalizeData(data, endpoint) {
        // Normalize data from different APIs to a consistent format
        let normalized = {};

        if (endpoint.includes('ipapi.co')) {
            normalized = {
                ip: data.ip,
                version: data.version || 'IPv4',
                city: data.city,
                region: data.region,
                country: data.country_name,
                country_code: data.country_code,
                continent: data.continent_code,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                utc_offset: data.utc_offset,
                isp: data.org,
                asn: data.asn,
                postal: data.postal,
                currency: data.currency,
                languages: data.languages,
                country_area: data.country_area,
                country_population: data.country_population,
                calling_code: data.country_calling_code
            };
        } else if (endpoint.includes('ipwho.is')) {
            normalized = {
                ip: data.ip,
                version: data.type,
                city: data.city,
                region: data.region,
                country: data.country,
                country_code: data.country_code,
                continent: data.continent,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone?.id,
                utc_offset: data.timezone?.utc,
                isp: data.connection?.isp,
                asn: data.connection?.asn,
                postal: data.postal,
                is_eu: data.is_eu,
                flag: data.flag?.emoji
            };
        } else if (endpoint.includes('ip-api.com')) {
            normalized = {
                ip: data.query,
                version: 'IPv4',
                city: data.city,
                region: data.regionName,
                country: data.country,
                country_code: data.countryCode,
                latitude: data.lat,
                longitude: data.lon,
                timezone: data.timezone,
                isp: data.isp,
                asn: data.as,
                postal: data.zip,
                org: data.org
            };
        }

        normalized.timestamp = new Date().toISOString();
        normalized.scan_id = this.generateScanId();

        return normalized;
    }

    generateScanId() {
        return 'SCAN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    async saveToJSON(data) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ip_scan_${data.scan_id}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('%c[+] IP data exported to JSON successfully!', 'color: #00ff88');
        return jsonString;
    }

    displayData(data) {
        const container = document.getElementById('ip-results');
        if (!container) return;

        const categories = {
            'Network Information': ['ip', 'version', 'isp', 'asn', 'org'],
            'Location Data': ['city', 'region', 'country', 'country_code', 'continent', 'postal'],
            'Coordinates': ['latitude', 'longitude'],
            'Time & Regional': ['timezone', 'utc_offset', 'currency', 'languages', 'calling_code'],
            'Metadata': ['scan_id', 'timestamp', 'is_eu', 'flag']
        };

        let html = '';

        for (const [category, fields] of Object.entries(categories)) {
            const categoryData = fields.filter(field => data[field] !== undefined && data[field] !== null);
            if (categoryData.length === 0) continue;

            html += `<div class="ip-category">
                <h3><span class="category-icon">◆</span> ${category}</h3>
                <div class="ip-fields">`;

            for (const field of categoryData) {
                const value = data[field];
                const displayValue = typeof value === 'object' ? JSON.stringify(value) : value;
                const fieldName = field.replace(/_/g, ' ').toUpperCase();

                html += `<div class="ip-field">
                    <span class="field-name">${fieldName}</span>
                    <span class="field-value">${displayValue}</span>
                </div>`;
            }

            html += `</div></div>`;
        }

        container.innerHTML = html;
        this.animateResults();
    }

    animateResults() {
        const fields = document.querySelectorAll('.ip-field');
        fields.forEach((field, index) => {
            field.style.opacity = '0';
            field.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                field.style.transition = 'all 0.3s ease';
                field.style.opacity = '1';
                field.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }

    getMapURL(lat, lon) {
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}&layer=mapnik&marker=${lat},${lon}`;
    }
}

// Initialize scanner
const ipScanner = new IPScanner();

// Auto-scan on page load
document.addEventListener('DOMContentLoaded', async () => {
    const scanBtn = document.getElementById('scan-btn');
    const exportBtn = document.getElementById('export-btn');
    const statusText = document.getElementById('scan-status');
    const loader = document.getElementById('scan-loader');

    if (scanBtn) {
        scanBtn.addEventListener('click', async () => {
            await performScan();
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            if (ipScanner.ipData) {
                await ipScanner.saveToJSON(ipScanner.ipData);
                showNotification('IP data exported to JSON file!');
            } else {
                showNotification('No IP data to export. Run a scan first.', 'error');
            }
        });
    }

    async function performScan() {
        try {
            if (loader) loader.style.display = 'block';
            if (statusText) statusText.textContent = 'Scanning target...';
            if (scanBtn) scanBtn.disabled = true;

            const data = await ipScanner.fetchIPData();
            ipScanner.ipData = data;
            ipScanner.displayData(data);

            if (statusText) statusText.textContent = 'Scan complete!';
            if (exportBtn) exportBtn.style.display = 'inline-flex';

            // Update map if coordinates available
            if (data.latitude && data.longitude) {
                const mapFrame = document.getElementById('location-map');
                if (mapFrame) {
                    mapFrame.src = ipScanner.getMapURL(data.latitude, data.longitude);
                }
            }

            showNotification('IP reconnaissance complete!');
        } catch (error) {
            console.error(error);
            if (statusText) statusText.textContent = 'Scan failed!';
            showNotification('Failed to retrieve IP information', 'error');
        } finally {
            if (loader) loader.style.display = 'none';
            if (scanBtn) scanBtn.disabled = false;
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span class="notif-icon">${type === 'success' ? '✓' : '✗'}</span> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Auto-scan on load
    setTimeout(performScan, 500);
});

// Console branding
console.log('%c[xsayfex] IP Scanner Module Loaded', 'color: #00ff88; font-weight: bold;');
