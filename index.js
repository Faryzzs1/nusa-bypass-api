export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Link kosong bos!" });
  }

  try {
    const response = await fetch(url, { 
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    if (response.status >= 300 && response.status < 400) {
      const linkAsli = response.headers.get('location');
      return res.status(200).json({
        status: "sukses",
        destination: linkAsli
      });
    } else {
      const htmlText = await response.text();
      return res.status(200).json({
        status: "pending",
        pesan: "Butuh penanganan khusus untuk halaman ini",
        html_length: htmlText.length
      });
    }

  } catch (error) {
    return res.status(500).json({ error: "Server Error: " + error.message });
  }
}
