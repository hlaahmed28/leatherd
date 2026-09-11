// server.ts
import express from "express";

// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prismaClientSingleton = () => {
  return new PrismaClient();
};
var prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
var prisma_default = prisma;
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// server.ts
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not configured. Add it to the local .env file or the production deployment environment variables.");
    process.exit(1);
  }
  const app = express();
  const PORT = 3e3;
  app.use(express.json());
  let resendClient = null;
  const getResend = () => {
    if (!resendClient) {
      const key = process.env.RESEND_API_KEY;
      if (!key) {
        throw new Error("RESEND_API_KEY environment variable is required");
      }
      resendClient = new Resend(key);
    }
    return resendClient;
  };
  app.get("/api/products", async (req, res) => {
    try {
      const products = await prisma_default.product.findMany({ orderBy: { name: "asc" } });
      res.json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const product = await prisma_default.product.upsert({
        where: { id },
        update: data,
        create: { ...data, id }
      });
      res.json(product);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/products/:id", async (req, res) => {
    try {
      await prisma_default.product.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await prisma_default.order.findMany({
        orderBy: { date: "desc" },
        include: { items: true }
      });
      res.json(orders);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      const order = await prisma_default.order.create({
        data: {
          ...orderData,
          items: { create: items }
        },
        include: { items: true }
      });
      res.json(order);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await prisma_default.order.update({ where: { id: req.params.id }, data: { status } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await prisma_default.appSettings.findUnique({ where: { id: "global" } });
      res.json(settings || null);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put("/api/settings", async (req, res) => {
    try {
      const data = req.body;
      const settings = await prisma_default.appSettings.upsert({
        where: { id: "global" },
        update: data,
        create: { ...data, id: "global" }
      });
      res.json(settings);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await prisma_default.review.findMany({ orderBy: { date: "desc" } });
      res.json(reviews);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put("/api/reviews/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const review = await prisma_default.review.upsert({
        where: { id },
        update: data,
        create: { ...data, id }
      });
      res.json(review);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      await prisma_default.review.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/promo-codes", async (req, res) => {
    try {
      const codes = await prisma_default.promoCode.findMany({ orderBy: { code: "asc" } });
      res.json(codes);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put("/api/promo-codes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const code = await prisma_default.promoCode.upsert({
        where: { id },
        update: data,
        create: { ...data, id }
      });
      res.json(code);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/promo-codes/:id", async (req, res) => {
    try {
      await prisma_default.promoCode.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await prisma_default.customer.findMany({ orderBy: { totalSpent: "desc" } });
      res.json(customers);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put("/api/customers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const customer = await prisma_default.customer.upsert({
        where: { id },
        update: data,
        create: { ...data, id }
      });
      res.json(customer);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/login", async (req, res) => {
    const { password } = req.body;
    if (password === (process.env.ADMIN_PASSWORD || "admin")) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });
  app.post("/api/send-confirmation", async (req, res) => {
    const { order, items } = req.body;
    if (!order || !items) {
      return res.status(400).json({ error: "Order and items are required" });
    }
    try {
      const resend = getResend();
      const itemsHtml = items.map((item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.selectedColor} / ${item.selectedSize})</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} EGP</td>
        </tr>
      `).join("");
      const { data, error } = await resend.emails.send({
        from: "LEATHERD <onboarding@resend.dev>",
        // Replace with your verified domain in production
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
        `
      });
      if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json({ success: true, data });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
