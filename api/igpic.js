export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'username required' });

  try {
    const igRes = await fetch(`https://www.instagram.com/${username}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await igRes.text();
    // Tente encontrar a foto de perfil em diferentes formatos
    let match = html.match(/"profile_pic_url_hd":"([^"]+)"/);
    if (!match) match = html.match(/"profile_pic_url":"([^"]+)"/);
    if (!match) match = html.match(/<img[^>]+profile-pic[^>]+src=\"([^\"]+)\"/);
    if (match && match[1]) {
      const url = match[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      return res.status(200).json({ url });
    }
    return res.status(404).json({ error: 'Not found' });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch' });
  }
} 