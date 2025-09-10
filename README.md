# Quality World with Thomas

A comprehensive educational website featuring quality systems across Food Safety, Pharmaceutical, and Cosmetic industries, along with a personal blog showcasing insights and experiences in quality management.

## 🌟 Features

### Landing Page
- **Four Clickable Round Navigation Options:**
  - 🍎 Food Safety and Quality
  - 💊 Pharmaceutical
  - 💄 Cosmetic
  - 📚 Quality Experience with Thomas (Blog)

### Roadmap Pages
- **Visual Journey Layout** for each industry category
- **Interactive Stops** representing different quality systems
- **Clickable Elements** leading to detailed explanations

### Quality System Details
- **Comprehensive Information** about each quality system
- **Structured Content** including purpose, requirements, implementation, and benefits
- **Resource Links** for further learning

### Blog Section
- **Article Cards** with titles, snippets, and metadata
- **Search Functionality** to find specific content
- **Category Filtering** for easy navigation
- **Responsive Design** for all devices

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python (for local development server) or any other HTTP server

### Running Locally

1. **Clone or Download** the project files to your local machine

2. **Navigate to the project directory:**
   ```bash
   cd quality-world-website
   ```

3. **Start a local server:**
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js (if you have it installed)**
   ```bash
   npx http-server
   ```
   
   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

4. **Open your web browser** and navigate to:
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
quality-world-website/
├── index.html              # Landing page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript functionality
│   └── quality-systems-data.js  # Quality system content data
├── pages/
│   ├── food-safety.html   # Food safety roadmap
│   ├── pharmaceutical.html # Pharmaceutical roadmap
│   ├── cosmetic.html      # Cosmetic roadmap
│   ├── blog.html          # Blog page
│   └── quality-system.html # Quality system details template
├── images/                 # Image assets (add your images here)
└── README.md              # This file
```

## 🎨 Design Features

- **Modern, Professional Design** with a clean aesthetic
- **Responsive Layout** that works on desktop, tablet, and mobile
- **Accessibility Features** including ARIA labels and keyboard navigation
- **Smooth Animations** and hover effects for enhanced user experience
- **Industry-Specific Color Schemes** for visual distinction

## 🔧 Customization

### Adding New Quality Systems
1. Edit `js/quality-systems-data.js`
2. Add new system data following the existing structure
3. Update the relevant roadmap page to include the new system

### Adding New Blog Articles
1. Edit `pages/blog.html`
2. Add new article cards following the existing structure
3. Include appropriate tags for filtering

### Modifying Styles
1. Edit `css/styles.css`
2. Use the existing CSS custom properties for consistent theming
3. Test responsiveness across different screen sizes

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop:** 1200px and above
- **Tablet:** 768px to 1199px
- **Mobile:** 320px to 767px

## 🌐 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📋 Quality Systems Included

### Food Safety and Quality
- HACCP (Hazard Analysis Critical Control Points)
- BRC (British Retail Consortium)
- IFS (International Featured Standards)
- SQF (Safe Quality Food)
- ISO 22000 (Food Safety Management Systems)
- FSSC 22000 (Food Safety System Certification)
- Organic Standards

### Pharmaceutical
- GMP (Good Manufacturing Practice)
- GDP (Good Distribution Practice)
- GCP (Good Clinical Practice)
- ICH Guidelines
- FDA Regulations
- EMA Guidelines
- USP Standards

### Cosmetic
- ISO 22716 (Cosmetics GMP)
- FDA Cosmetic Regulations
- EU Cosmetic Regulations
- CPNP (Cosmetic Product Notification Portal)
- Safety Assessment
- INCI Standards
- Cruelty-Free Standards

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Contact

For questions or suggestions regarding this website, please contact Thomas through the contact form on the website.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Font: Inter from Google Fonts
- Icons: Unicode emoji for universal compatibility
- Design inspiration: Modern web design principles and accessibility guidelines

---

**Made with ❤️ by Thomas - Quality Professional and Educator**
