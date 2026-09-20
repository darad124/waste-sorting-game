// Vercel serverless function. Returns the visitor's country from the header
// Vercel injects at its edge. No IP is exposed to the client or stored.
export default function handler(req, res) {
  const country =
    req.headers["x-vercel-ip-country"] ||
    req.headers["x-country"] ||
    null;
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ country });
}
