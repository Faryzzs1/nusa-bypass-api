// api/index.js
export default async function handler(req, res) {
  // Tambahkan header CORS biar API lu bisa ditembak dari mana aja
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Link kosong bos! Masukin parameter ?url=" });
  }

  try {
    // Mesin mencoba mengunjungi link safelink yang dikasih
    const response = await fetch(url, { 
      redirect: 'manual', // Kita tahan biar dia gak loncat otomatis
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Skenario 1: Server Safelink ngelempar link MediaFire (Redirect 301/302)
    if (response.status >= 300 && response.status < 400) {
      const linkAsli = response.headers.get('location');
      return res.status(200).json({
        status: "sukses",
        destination: linkAsli
      });
    } 
    // Skenario 2: Safelink nyembunyiin link di dalam HTML
    else {
      const htmlText = await response.text();
      
      // (Di sinilah biasanya para hacker masukin rumus Regex khusus 
      // untuk ngebongkar link rahasia di dalam sfl.gl / ouo.io dll)
      
      return res.status(200).json({
        status: "pending",
        pesan: "Butuh rumus regex khusus untuk situs ini.",
        html_length: htmlText.length
      });
    }

  } catch (error) {
    return res.status(500).json({ error: "Mesin API Error: " + error.message });
  }
}
