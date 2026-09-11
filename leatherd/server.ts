import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
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
  // --- Products ---
  app.get('/api/products', async (req, res) => {
    try {
      const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
      res.json(products);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const product = await prisma.product.upsert({
        where: { id },
        update: data,
        create: { ...data, id },
      });
      res.json(product);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/products/:id', async (req, res) => {
    try {
      await prisma.product.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // --- Orders ---
  app.get('/api/orders', async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { date: 'desc' },
        include: { items: true }
      });
      res.json(orders);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.post('/api/orders', async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      const order = await prisma.order.create({
        data: {
          ...orderData,
          items: { create: items }
        },
        include: { items: true }
      });
      res.json(order);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.patch('/api/orders/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      await prisma.order.update({ where: { id: req.params.id }, data: { status } });
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // --- Settings ---
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await prisma.appSettings.findUnique({ where: { id: 'global' } });
      res.json(settings || null);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/settings', async (req, res) => {
    try {
      const data = req.body;
      const settings = await prisma.appSettings.upsert({
        where: { id: 'global' },
        update: data,
        create: { ...data, id: 'global' },
      });
      res.json(settings);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // --- Reviews ---
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await prisma.review.findMany({ orderBy: { date: 'desc' } });
      res.json(reviews);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/reviews/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const review = await prisma.review.upsert({
        where: { id },
        update: data,
        create: { ...data, id },
      });
      res.json(review);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/reviews/:id', async (req, res) => {
    try {
      await prisma.review.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // --- Promo Codes ---
  app.get('/api/promo-codes', async (req, res) => {
    try {
      const codes = await prisma.promoCode.findMany({ orderBy: { code: 'asc' } });
      res.json(codes);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/promo-codes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const code = await prisma.promoCode.upsert({
        where: { id },
        update: data,
        create: { ...data, id },
      });
      res.json(code);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/promo-codes/:id', async (req, res) => {
    try {
      await prisma.promoCode.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // --- Customers ---
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await prisma.customer.findMany({ orderBy: { totalSpent: 'desc' } });
      res.json(customers);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/customers/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const customer = await prisma.customer.upsert({
        where: { id },
        update: data,
        create: { ...data, id },
      });
      res.json(customer);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // --- Auth ---
  app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    // Simple admin password check
    if (password === (process.env.ADMIN_PASSWORD || 'admin')) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  });

  // Email API Route
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
        from: 'LEATHERD <onboarding@resend.dev>', // Replace with your verified domain in production
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
              <p style="color: #999; font-size: 12px;">If you have any questions, please contact us at hello@leatherd.eg or via WhatsApp.</p>
              <p style="color: #2d2535; font-weight: bold;">LEATHERD Luxury Pashmina</p>
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
