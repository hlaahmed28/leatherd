import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Resend lazily
  let resendClient: Resend | null = null;
  const getResend = () => {
    if (!resendClient) {
      const key = process.env.RESEND_API_KEY;
      if (!key) {
        throw new Error('RESEND_API_KEY environment variable is required');
      }
      resendClient = new Resend(key);
    }
    return resendClient;
  };

  // API Routes
  app.post('/api/send-confirmation', async (req, res) => {
    const { order, items } = req.body;

    if (!order || !items) {
      return res.status(400).json({ error: 'Order and items are required' });
    }

    try {
      const resend = getResend();
      
      const itemsHtml = items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.selectedColor} / ${item.selectedSize})</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} EGP</td>
        </tr>
      `).join('');

      const { data, error } = await resend.emails.send({
        from: 'RIFFA <onboarding@resend.dev>', // Replace with your verified domain in production
        to: [order.email],
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
          <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e8ddd0; border-radius: 12px; background-color: #faf8f5;">
            <h1 style="color: #2d2535; text-align: center; font-size: 28px; margin-bottom: 20px;">Thank you for your order!</h1>
            <p style="color: #2d2535; font-size: 16px;">Hello ${order.customerName},</p>
            <p style="color: #2d2535; font-size: 16px;">We've received your order <strong>${order.orderNumber}</strong> and are getting it ready for you.</p>
            
            <div style="margin: 30px 0; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e8ddd0;">
              <h2 style="color: #c9a96e; font-size: 18px; margin-top: 0;">Order Summary</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="text-align: left; font-size: 12px; color: #999; text-transform: uppercase;">
                    <th style="padding: 10px; border-bottom: 2px solid #e8ddd0;">Item</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e8ddd0; text-align: center;">Qty</th>
                    <th style="padding: 10px; border-bottom: 2px solid #e8ddd0; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                    <td style="padding: 10px; text-align: right;">${order.subtotal.toLocaleString()} EGP</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
                    <td style="padding: 10px; text-align: right;">${order.shipping.toLocaleString()} EGP</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #c9a96e;">Total:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #c9a96e;">${order.total.toLocaleString()} EGP</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="margin-top: 30px;">
              <h2 style="color: #c9a96e; font-size: 18px;">Shipping Address</h2>
              <p style="color: #2d2535; font-size: 14px; line-height: 1.6;">
                ${order.customerName}<br>
                ${order.address}<br>
                ${order.governorate}, Egypt<br>
                Phone: ${order.phone}
              </p>
            </div>

            <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e8ddd0; padding-top: 20px;">
              <p style="color: #999; font-size: 12px;">If you have any questions, please contact us at hello@riffa.eg or via WhatsApp.</p>
              <p style="color: #2d2535; font-weight: bold;">RIFFA Luxury Pashmina</p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, data });
    } catch (error: any) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
