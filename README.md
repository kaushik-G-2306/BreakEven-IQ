# 📈 BreakEven IQ

> An interactive, real-time Break-Even Point Analyzer & Business Decision Dashboard built for financial modeling, unit economics evaluation, and interactive scenario testing.

**Live Portfolio:** [kaushik-g-portfolio.vercel.app](https://kaushik-g-portfolio.vercel.app)  
**Author:** Kaushik G

---

## ✨ Features

- **🎛️ Real-Time Interactive Sliders:**
  - **Fixed Costs** (up to ₹10 Crore / $10M)
  - **Variable Cost per Unit** (up to ₹1 Crore / $1M)
  - **Selling Price per Unit** (up to ₹1 Crore / $1M)
  - **Units Sold** (up to 1 Crore / 10 Million units)
  
- **📊 Dynamic Auto-Scaling Chart:**
  - Built with native HTML5 Canvas 2D API (zero external dependencies, 100% offline support).
  - Smart X-axis focus range so the Break-Even intersection remains visually clear regardless of volume scale.
  - Interactive glowing **BEP Vertical Marker** and live indicator points.

- **🌍 Multi-Currency Support (9 Global Currencies):**
  - 🇮🇳 **INR (₹)** — Indian Rupee (Lakhs & Crores formatting)
  - 🇺🇸 **USD ($)** — US Dollar
  - 🇪🇺 **EUR (€)** — Euro
  - 🇬🇧 **GBP (£)** — British Pound
  - 🇫🇷 **FRF (€)** — French Euro
  - 🇨🇳 **CNY (¥)** — Chinese Yuan
  - 🇯🇵 **JPY (¥)** — Japanese Yen
  - 🇷🇺 **RUB (₽)** — Russian Ruble
  - 🇦🇺 **AUD (A$)** — Australian Dollar

- **🌗 Dual Aesthetic Themes:**
  - **Light Mode** (Clean, high-visibility corporate aesthetic — Default)
  - **Dark Theme** (High-contrast neon dark mode)

- **📈 KPI & Insight Analytics:**
  - Instant Break-Even Units calculation
  - Total Break-Even Revenue
  - Current Profit / Loss status indicator (📈 Profit / 📉 Loss / 🎯 Exact BEP)
  - Contribution Margin & Margin of Safety calculation

---

## 🧮 Mathematical Formulas Used

$$\text{Contribution Margin (CM)} = \text{Selling Price per Unit} - \text{Variable Cost per Unit}$$

$$\text{Break-Even Units (BEP)} = \frac{\text{Fixed Costs}}{\text{Contribution Margin (CM)}}$$

$$\text{Break-Even Revenue} = \text{Break-Even Units} \times \text{Selling Price per Unit}$$

$$\text{Margin of Safety} = \text{Current Units Sold} - \text{Break-Even Units}$$

---

## 🚀 Quick Start

Since **BreakEven IQ** is a 100% self-contained application:

1. Clone this repository:
   ```bash
   git clone https://github.com/kaushik-G-2306/BreakEven-IQ.git
   ```
2. Open `index.html` in any modern web browser — no server or node installation required!

---

## 🛠️ Built With

- **HTML5** (Semantic structure & canvas drawing)
- **Vanilla CSS3** (CSS custom properties, glassmorphism, responsive grid)
- **Vanilla JavaScript (ES6+)** (Canvas 2D rendering, number formatting, dynamic scaling)

---

## 👤 Author

**Kaushik G**  
- Portfolio: [kaushik-g-portfolio.vercel.app](https://kaushik-g-portfolio.vercel.app)
