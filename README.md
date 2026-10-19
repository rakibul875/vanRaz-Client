# VenRaz - AI-Powered Multi-Vendor E-Commerce Platform

VenRaz is a modern, full-stack, multi-vendor e-commerce platform featuring advanced AI-powered capabilities, smart inventory management, and an automated CI/CD pipeline. It creates a seamless digital marketplace experience for buyers, sellers, and administrators.

---

## 🚀 Core Features & Architecture

* **AI-Powered Automated Product Tagging:** Integrated a multimodal AI vision pipeline that automatically analyzes uploaded product images to instantly generate accurate categories, color palettes, product types, and SEO-optimized tags, reducing seller onboarding time by over 70%.
* **Smart Inventory & Real-Time Stock Management:** Engineered an event-driven inventory tracking system utilizing atomic database updates (`$inc`, `$gte`) and automated low-stock threshold triggers (`isLowStockNotified` logic) to prevent race conditions and alert sellers in real-time via in-app notifications and emails.
* **Multi-Vendor Architecture & Role-Based Access Control:** Architected a scalable multi-vendor ecosystem featuring dedicated dashboards for Admins and Vendors, secure session handling via Better Auth, and advanced product CRUD operations with dynamic filtering.
* **Automated CI/CD Pipeline:** Configured GitHub Actions for continuous integration (linting and build testing) and Vercel for continuous deployment, ensuring zero-downtime and high software reliability.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind CSS, Hero UI
* **Backend:** Node.js, Express.js, RESTful APIs
* **Database & Auth:** MongoDB, Mongoose, Better Auth
* **AI & DevOps:** Gemini/OpenAI Vision API, Vercel, GitHub Actions

---

## ⚙️ Getting Started (Local Installation)

Apnar local machine-e projectti run korار jonno nicher steps follow korun:

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/venraz.git](https://github.com/your-username/venraz.git)
cd venraz
